import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const SystemIntegratorUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const systemIntegrator = await prisma.systemIntegrator.findUnique({
      where: { id: params.id },
    });

    if (!systemIntegrator) {
      return NextResponse.json(
        {
          success: false,
          error: 'System integrator not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { systemIntegrator },
    });
  } catch (error) {
    console.error('Error fetching system integrator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch system integrator',
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = SystemIntegratorUpdateSchema.parse(body);

    // Check if system integrator exists
    const existingSystemIntegrator = await prisma.systemIntegrator.findUnique({
      where: { id: params.id },
    });

    if (!existingSystemIntegrator) {
      return NextResponse.json(
        {
          success: false,
          error: 'System integrator not found',
        },
        { status: 404 },
      );
    }

    // Check if slug already exists (excluding current system integrator)
    if (validatedData.slug !== existingSystemIntegrator.slug) {
      const slugExists = await prisma.systemIntegrator.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'System integrator with this slug already exists',
          },
          { status: 400 },
        );
      }
    }

    const systemIntegrator = await prisma.systemIntegrator.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: {
        systemIntegrator,
        message: 'System integrator updated successfully',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error('Error updating system integrator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update system integrator',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    // Check if system integrator exists
    const existingSystemIntegrator = await prisma.systemIntegrator.findUnique({
      where: { id: params.id },
    });

    if (!existingSystemIntegrator) {
      return NextResponse.json(
        {
          success: false,
          error: 'System integrator not found',
        },
        { status: 404 },
      );
    }

    await prisma.systemIntegrator.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'System integrator deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting system integrator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete system integrator',
      },
      { status: 500 },
    );
  }
}

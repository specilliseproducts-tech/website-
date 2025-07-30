import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const SystemIntegratorSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  slug: z.string().min(1, 'Slug is required'),
});

type PrismaWhere = {
  OR?: {
    [key: string]: {
      contains: string;
      mode: 'insensitive';
    };
  }[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * perPage;

    // Build where clause
    const where: PrismaWhere = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get system integrators and total count
    const [systemIntegrators, totalCount] = await Promise.all([
      prisma.systemIntegrator.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemIntegrator.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      success: true,
      data: {
        systemIntegrators,
        pagination: {
          page,
          perPage,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching system integrators:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch system integrators',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const validatedData = SystemIntegratorSchema.parse(body);

    // Check if slug already exists
    const existingSystemIntegrator = await prisma.systemIntegrator.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSystemIntegrator) {
      return NextResponse.json(
        {
          success: false,
          error: 'System integrator with this slug already exists',
        },
        { status: 400 },
      );
    }

    const systemIntegrator = await prisma.systemIntegrator.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: {
        systemIntegrator,
        message: 'System integrator created successfully',
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

    console.error('Error creating system integrator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create system integrator',
      },
      { status: 500 },
    );
  }
}

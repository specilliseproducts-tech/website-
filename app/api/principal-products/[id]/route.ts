import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const principalProductUpdateSchema = z.object({
  slug: z.string().min(1, 'Slug is required').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
  link: z.string().min(1, 'Link is required').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const principalProduct = await prisma.principalProduct.findUnique({
      where: { id },
    });

    if (!principalProduct) {
      return NextResponse.json(
        { error: 'Principal product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(principalProduct);
  } catch (error) {
    console.error('Error fetching principal product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch principal product' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = principalProductUpdateSchema.parse(body);

    const principalProduct = await prisma.principalProduct.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(principalProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating principal product:', error);
    return NextResponse.json(
      { error: 'Failed to update principal product' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.principalProduct.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting principal product:', error);
    return NextResponse.json(
      { error: 'Failed to delete principal product' },
      { status: 500 },
    );
  }
}

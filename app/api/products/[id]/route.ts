import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productUpdateSchema = z.object({
  slug: z.string().min(1, 'Slug is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .optional(),
  description: z.string().min(1, 'Description is required').optional(),
  features: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  modelPath: z.string().min(1, 'Model path is required').optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  brochureUrl: z.string().min(1, 'Brochure URL is required').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
    const validatedData = productUpdateSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}

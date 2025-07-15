import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productCreateSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  modelPath: z.string().min(1, 'Model path is required'),
  imagePath: z.string().min(1, 'Image path is required'),
  color: z.string().min(1, 'Color is required'),
  category: z.string().min(1, 'Category is required'),
  brochureUrl: z.string().min(1, 'Brochure URL is required'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const skip = (page - 1) * perPage;

    // Build filter conditions
    const where: any = {};
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          category: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Build sort conditions - only allow sorting by valid fields
    const validSortFields = [
      'name',
      'category',
      'createdAt',
      'updatedAt',
    ] as const;
    type ValidSortField = (typeof validSortFields)[number];
    const validSortField = validSortFields.includes(sortBy as ValidSortField)
      ? sortBy
      : 'name';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const orderBy: any = {
      [validSortField]: validSortOrder,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      items: products,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productCreateSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}

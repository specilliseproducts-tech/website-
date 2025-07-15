import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const companyCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
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
    const where: Prisma.CompanyWhereInput = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Build sort conditions - only allow sorting by valid fields
    const validSortFields = ['name', 'id'] as const;
    type ValidSortField = (typeof validSortFields)[number];
    const validSortField = validSortFields.includes(sortBy as ValidSortField)
      ? sortBy
      : 'name';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const orderBy: Prisma.CompanyOrderByWithRelationInput = {
      [validSortField]: validSortOrder,
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: perPage,
        orderBy,
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      items: companies,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = companyCreateSchema.parse(body);

    const company = await prisma.company.create({
      data: validatedData,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 },
    );
  }
}

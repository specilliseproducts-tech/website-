import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CollaboratorSchema = z.object({
  name: z.string(),
  description: z.string(),
  longDescription: z.string(),
  logo: z.string(),
  website: z.string(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('perPage') || '10');
  const search = searchParams.get('search') || '';

  const where = search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : {};

  const [collaborators, totalCount] = await Promise.all([
    prisma.collaborator.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.collaborator.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      collaborators,
      pagination: {
        page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        hasNextPage: page * perPage < totalCount,
        hasPrevPage: page > 1,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parse = CollaboratorSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid data', issues: parse.error.issues },
      { status: 400 },
    );
  }
  const collaborator = await prisma.collaborator.create({ data: parse.data });
  return NextResponse.json({ success: true, data: collaborator });
}

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const collaborator = await prisma.collaborator.findUnique({
    where: { id: params.id },
  });
  if (!collaborator) {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: collaborator });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const parse = CollaboratorSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid data', issues: parse.error.issues },
      { status: 400 },
    );
  }
  const collaborator = await prisma.collaborator.update({
    where: { id: params.id },
    data: parse.data,
  });
  return NextResponse.json({ success: true, data: collaborator });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.collaborator.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

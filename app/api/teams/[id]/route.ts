import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/teams/[id] - Get a specific team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team member not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { team },
    });
  } catch (error) {
    console.error('Team fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch team member',
      },
      { status: 500 },
    );
  }
}

// PUT /api/teams/[id] - Update a team member (protected)
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

    const { id } = params;
    const body = await request.json();
    const { name, position, imagePath } = body;

    // Check if team member exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team member not found',
        },
        { status: 404 },
      );
    }

    // Validate required fields
    if (!name || !position || !imagePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, position, and image path are required',
        },
        { status: 400 },
      );
    }

    const team = await prisma.team.update({
      where: { id },
      data: {
        name: name.trim(),
        position: position.trim(),
        imagePath: imagePath.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { team },
      message: 'Team member updated successfully',
    });
  } catch (error) {
    console.error('Team update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update team member',
      },
      { status: 500 },
    );
  }
}

// DELETE /api/teams/[id] - Delete a team member (protected)
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

    const { id } = params;

    // Check if team member exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team member not found',
        },
        { status: 404 },
      );
    }

    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Team deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete team member',
      },
      { status: 500 },
    );
  }
}

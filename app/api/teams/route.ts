import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/teams - Get all teams with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';
    const position = searchParams.get('position') || '';

    const skip = (page - 1) * perPage;

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (position) {
      where.position = { contains: position, mode: 'insensitive' };
    }

    // Get teams and total count
    const [teams, totalCount] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      success: true,
      data: {
        teams,
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
    console.error('Teams fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch teams',
      },
      { status: 500 },
    );
  }
}

// POST /api/teams - Create a new team member (protected)
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
    const { name, position, imagePath } = body;

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

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        position: position.trim(),
        imagePath: imagePath.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { team },
      message: 'Team member created successfully',
    });
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create team member',
      },
      { status: 500 },
    );
  }
}

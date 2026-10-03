import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get('all') === 'true';

    const categories = await prisma.category.findMany({
      where: includeAll ? {} : { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: { where: { active: true } } },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { name, description, image, order } = await req.json();

    if (!name || !image) {
      return NextResponse.json({ error: 'Category name and image URL are required' }, { status: 400 });
    }

    const slug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image,
        order: parseInt(order) || 0,
        active: true,
      },
    });

    return NextResponse.json({ message: 'Category created successfully', category });
  } catch (error: any) {
    console.error('Category POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Also fetch related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      take: 4,
      include: { category: true },
    });

    const parsedRelated = relatedProducts.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      colors: JSON.parse(p.colors || '[]'),
      tags: JSON.parse(p.tags || '[]'),
    }));

    return NextResponse.json({
      product: {
        ...product,
        images: JSON.parse(product.images || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        tags: JSON.parse(product.tags || '[]'),
      },
      relatedProducts: parsedRelated,
    });
  } catch (error: any) {
    console.error('Product details GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { slug } = params;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.mrp !== undefined) {
      updateData.mrp = parseFloat(body.mrp);
      const effectivePrice = body.price !== undefined ? parseFloat(body.price) : existing.price;
      updateData.discount = updateData.mrp > effectivePrice ? Math.round(((updateData.mrp - effectivePrice) / updateData.mrp) * 100) : 0;
    }
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(body.lowStockThreshold);
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.colors !== undefined) updateData.colors = JSON.stringify(body.colors);
    if (body.material !== undefined) updateData.material = body.material;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.careInstructions !== undefined) updateData.careInstructions = body.careInstructions;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.featured !== undefined) updateData.featured = !!body.featured;
    if (body.bestSeller !== undefined) updateData.bestSeller = !!body.bestSeller;
    if (body.newArrival !== undefined) updateData.newArrival = !!body.newArrival;
    if (body.active !== undefined) updateData.active = !!body.active;

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
      include: { category: true, variants: true },
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        ...updated,
        images: JSON.parse(updated.images),
        colors: JSON.parse(updated.colors),
        tags: JSON.parse(updated.tags),
      },
    });
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { slug } = params;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Product delete error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const products = await prisma.product.findMany({
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        mrp: true,
        stock: true,
        lowStockThreshold: true,
        thumbnail: true,
        active: true,
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ inventory: products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { productId, newStock, delta } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let updatedProduct;
    if (newStock !== undefined) {
      updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stock: Math.max(0, parseInt(newStock)) },
      });
    } else if (delta !== undefined) {
      updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: parseInt(delta) } },
      });
    } else {
      return NextResponse.json({ error: 'Provide newStock or delta' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Inventory updated successfully',
      product: updatedProduct,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = getUserFromRequest(req);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: {
              select: { slug: true, name: true, thumbnail: true },
            },
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership if not admin
    if (user && user.role !== 'ADMIN' && order.userId && order.userId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized to view this order' }, { status: 403 });
    }

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress: typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = getUserFromRequest(req);
    const body = await req.json();

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If customer is cancelling
    if (body.action === 'CANCEL') {
      if (order.orderStatus !== 'PLACED' && order.orderStatus !== 'CONFIRMED') {
        return NextResponse.json(
          { error: 'Order cannot be cancelled at this stage. It has already been processed.' },
          { status: 400 }
        );
      }
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLED' },
      });
      return NextResponse.json({ message: 'Order cancelled successfully', order: updated });
    }

    // Admin updates (orderStatus, paymentStatus, trackingNumber)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const updateData: any = {};
    if (body.orderStatus) updateData.orderStatus = body.orderStatus;
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber;

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: updateData,
      include: { items: true, payments: true },
    });

    return NextResponse.json({
      message: 'Order updated successfully',
      order: {
        ...updated,
        shippingAddress: typeof updated.shippingAddress === 'string' ? JSON.parse(updated.shippingAddress) : updated.shippingAddress,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

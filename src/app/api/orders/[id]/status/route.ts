import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = getUserFromRequest(req);
    const body = await req.json();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
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
      message: 'Order status updated successfully',
      order: updated,
    });
  } catch (error: any) {
    console.error('Order status PUT error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

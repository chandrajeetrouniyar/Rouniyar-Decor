import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            orderStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedCustomers = customers.map((c) => {
      const validOrders = c.orders.filter((o) => o.orderStatus !== 'CANCELLED');
      const totalSpent = validOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        ordersCount: c.orders.length,
        totalSpent,
        lastOrderDate: c.orders[0]?.createdAt || null,
      };
    });

    return NextResponse.json({ customers: parsedCustomers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      orders,
      todayOrdersList,
      customersCount,
      productsCount,
      allProducts,
      recentOrders,
      categories,
    ] = await Promise.all([
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          orderStatus: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { total: true },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { active: true } }),
      prisma.product.findMany({
        select: { id: true, name: true, stock: true, lowStockThreshold: true, price: true, thumbnail: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          items: true,
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    // Financial calculations
    const nonCancelledOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
    const todayRevenue = todayOrdersList.reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.orderStatus === 'PLACED' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PACKED'
    ).length;
    const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const cancelledOrdersCount = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

    const lowStockProductsList = allProducts.filter((p) => p.stock <= p.lowStockThreshold);

    // Sales over last 7 days chart data
    const last7DaysMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      last7DaysMap[key] = { date: key, revenue: 0, orders: 0 };
    }

    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (last7DaysMap[key] && o.orderStatus !== 'CANCELLED') {
        last7DaysMap[key].revenue += o.total;
        last7DaysMap[key].orders += 1;
      }
    });

    const salesChart = Object.values(last7DaysMap);

    return NextResponse.json({
      metrics: {
        totalRevenue,
        todayRevenue,
        totalOrders: orders.length,
        todayOrders: todayOrdersList.length,
        totalCustomers: customersCount,
        totalProducts: productsCount,
        lowStockCount: lowStockProductsList.length,
        pendingOrders: pendingOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        cancelledOrders: cancelledOrdersCount,
      },
      salesChart,
      lowStockProducts: lowStockProductsList.slice(0, 6),
      recentOrders: recentOrders.map((ro) => ({
        ...ro,
        shippingAddress: typeof ro.shippingAddress === 'string' ? JSON.parse(ro.shippingAddress) : ro.shippingAddress,
      })),
      categories,
    });
  } catch (error: any) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const where: any = {};

    // Customer only sees their orders; Admin sees all
    if (user.role !== 'ADMIN') {
      where.userId = user.userId;
    } else {
      if (status && status !== 'ALL') {
        where.orderStatus = status;
      }
      if (search) {
        where.OR = [
          { orderNumber: { contains: search } },
          { customerName: { contains: search } },
          { customerEmail: { contains: search } },
        ];
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    const parsedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
    }));

    return NextResponse.json({ orders: parsedOrders });
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerMobile,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      items,
      couponCode,
      notes,
    } = body;

    if (!customerName || !customerEmail || !customerMobile || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // Verify products and compute subtotal securely on server
    let computedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${product.stock} available.` },
          { status: 400 }
        );
      }

      let itemPrice = product.price;
      let variantSku = product.sku;
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          itemPrice = variant.price;
          variantSku = variant.sku;
        }
      }

      computedSubtotal += itemPrice * item.quantity;
      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        name: product.name,
        sku: variantSku,
        price: itemPrice,
        quantity: item.quantity,
        image: item.image || product.thumbnail,
        color: item.color || null,
        size: item.size || null,
      });
    }

    // Handle Coupon Discount
    let discount = 0;
    let couponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.active && computedSubtotal >= coupon.minOrderValue) {
        couponId = coupon.id;
        if (coupon.discountType === 'PERCENTAGE') {
          const rawDiscount = (computedSubtotal * coupon.discountValue) / 100;
          discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const shippingFee = computedSubtotal > 999 ? 0 : 50;
    const total = Math.max(0, computedSubtotal - discount + shippingFee);

    // Generate unique order number: RD-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RD-${new Date().getFullYear()}-${randomSuffix}`;

    const isCod = paymentMethod.toLowerCase().includes('cash') || paymentMethod === 'COD';
    const initialPaymentStatus = isCod ? 'PENDING' : 'PAID';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.userId : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerMobile: customerMobile.trim(),
        shippingAddress: JSON.stringify(shippingAddress),
        deliveryMethod: deliveryMethod || 'Standard Delivery (3-5 Days)',
        paymentMethod: paymentMethod || 'Card',
        paymentStatus: initialPaymentStatus,
        orderStatus: 'PLACED',
        subtotal: computedSubtotal,
        discount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        shippingFee,
        tax: 0,
        total,
        notes: notes || null,
        items: {
          create: validatedItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Record payment entry
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        currency: 'INR',
        status: isCod ? 'PENDING' : 'SUCCESS',
        method: paymentMethod.toUpperCase(),
        transactionId: `TXN_${Date.now()}`,
      },
    });

    // Deduct stock
    for (const it of validatedItems) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
      if (it.variantId) {
        await prisma.productVariant.update({
          where: { id: it.variantId },
          data: { stock: { decrement: it.quantity } },
        });
      }
    }

    // Increment coupon used count if coupon used
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
      await prisma.couponUsage.create({
        data: {
          couponId,
          orderId: order.id,
          userId: user?.userId || null,
        },
      });
    }

    return NextResponse.json({
      message: 'Order placed successfully',
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

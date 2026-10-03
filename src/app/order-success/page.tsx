import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import OrderSuccessClient from '@/components/checkout/OrderSuccessClient';

export const metadata = {
  title: 'Order Confirmed! 🎉 | Rouniyar Decor',
  description: 'Thank you for your handcrafted decor order. We are preparing it with care.',
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderIdentifier = searchParams.orderId;

  let order = null;
  if (orderIdentifier) {
    const raw = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdentifier }, { orderNumber: orderIdentifier }],
      },
      include: {
        items: true,
      },
    });

    if (raw) {
      order = {
        ...raw,
        shippingAddress:
          typeof raw.shippingAddress === 'string'
            ? JSON.parse(raw.shippingAddress)
            : raw.shippingAddress,
      };
    }
  }

  return <OrderSuccessClient order={order} />;
}

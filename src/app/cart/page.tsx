import React from 'react';
import prisma from '@/lib/prisma';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata = {
  title: 'Shopping Cart | Rouniyar Decor',
  description: 'Review your handcrafted decor selections, apply coupons, and proceed to secure checkout.',
};

export default async function CartPage() {
  // Fetch upselling products for "You may also like"
  const upsellRaw = await prisma.product.findMany({
    where: { active: true, bestSeller: true },
    take: 4,
    include: { category: true, variants: true },
  });

  const upsellProducts = upsellRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  return <CartPageClient upsellProducts={upsellProducts} />;
}

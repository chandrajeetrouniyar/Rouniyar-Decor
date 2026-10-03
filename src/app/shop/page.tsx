import React from 'react';
import prisma from '@/lib/prisma';
import ShopClient from '@/components/shop/ShopClient';

export const metadata = {
  title: 'Shop All Handcrafted Decor | Rouniyar Decor',
  description:
    'Browse our complete collection of handmade woolen door torans, crochet thali poshs, brass bell latkans, and festive pooja accessories.',
};

export default async function ShopPage() {
  const [productsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  const products = productsRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  return (
    <ShopClient
      initialProducts={products}
      categories={categories}
      categoryName="All Handcrafted Collections"
      categoryDescription="Explore our entire handcrafted catalog created with soft wool yarn, auspicious motifs, and traditional craftsmanship."
    />
  );
}

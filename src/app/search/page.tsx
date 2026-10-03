import React from 'react';
import prisma from '@/lib/prisma';
import SearchClient from '@/components/search/SearchClient';

export const metadata = {
  title: 'Search Handcrafted Products | Rouniyar Decor',
  description: 'Search across our catalog of woolen torans, crochet thali covers, and festive decor.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() || '';

  // Fetch all active products and categories for client-side instant responsive suggestions and filtering
  const [allProductsRaw, categories] = await Promise.all([
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

  const allProducts = allProductsRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  return (
    <SearchClient
      initialQuery={query}
      allProducts={allProducts}
      categories={categories}
    />
  );
}

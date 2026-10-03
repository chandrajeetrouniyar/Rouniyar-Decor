import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ShopClient from '@/components/shop/ShopClient';

interface CategoryPageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    return { title: 'Category Not Found | Rouniyar Decor' };
  }

  return {
    title: `${category.name} | Rouniyar Decor`,
    description: category.description || `Buy handcrafted ${category.name} online at Rouniyar Decor.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;

  const [category, categories, productsRaw] = await Promise.all([
    prisma.category.findUnique({ where: { slug: categorySlug } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    prisma.product.findMany({
      where: {
        active: true,
        category: { slug: categorySlug },
      },
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!category) {
    notFound();
  }

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
      initialCategorySlug={categorySlug}
      categoryName={category.name}
      categoryDescription={category.description || ''}
    />
  );
}

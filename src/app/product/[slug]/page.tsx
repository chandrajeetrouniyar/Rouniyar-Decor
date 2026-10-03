import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) {
    return { title: 'Product Not Found | Rouniyar Decor' };
  }

  const images = JSON.parse(product.images || '[]');
  const primaryImage = product.thumbnail || images[0];

  return {
    title: `${product.name} | Rouniyar Decor`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | Rouniyar Decor`,
      description: product.shortDescription || product.description.substring(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const productRaw = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!productRaw) {
    notFound();
  }

  const relatedRaw = await prisma.product.findMany({
    where: {
      categoryId: productRaw.categoryId,
      id: { not: productRaw.id },
      active: true,
    },
    take: 4,
    include: { category: true, variants: true },
  });

  const product = {
    ...productRaw,
    images: JSON.parse(productRaw.images || '[]'),
    colors: JSON.parse(productRaw.colors || '[]'),
    tags: JSON.parse(productRaw.tags || '[]'),
  };

  const relatedProducts = relatedRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Rouniyar Decor',
    },
    offers: {
      '@type': 'Offer',
      url: `https://rouniyardecor.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || '4.8',
      reviewCount: product.reviewCount || 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient
        product={product}
        relatedProducts={relatedProducts}
        initialReviews={productRaw.reviews}
      />
    </>
  );
}

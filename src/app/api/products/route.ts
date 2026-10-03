import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const featured = searchParams.get('featured') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'featured';
    const inStock = searchParams.get('inStock') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = { active: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (featured) where.featured = true;
    if (bestSeller) where.bestSeller = true;
    if (newArrival) where.newArrival = true;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStock) {
      where.stock = { gt: 0 };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'best-seller') orderBy = { bestSeller: 'desc' };
    else if (sort === 'featured') orderBy = { featured: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: true,
        variants: true,
      },
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      colors: JSON.parse(p.colors || '[]'),
      tags: JSON.parse(p.tags || '[]'),
    }));

    return NextResponse.json({
      products: parsedProducts,
      total: parsedProducts.length,
    });
  } catch (error: any) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      categoryId,
      sku,
      price,
      mrp,
      stock,
      lowStockThreshold,
      images,
      thumbnail,
      colors,
      material,
      dimensions,
      weight,
      careInstructions,
      tags,
      featured,
      bestSeller,
      newArrival,
      variants,
    } = body;

    if (!name || !categoryId || !sku || price === undefined || mrp === undefined) {
      return NextResponse.json(
        { error: 'Name, Category, SKU, Price, and MRP are required fields.' },
        { status: 400 }
      );
    }

    let baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const parsedDiscount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const product = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description: description || '',
        shortDescription: shortDescription || '',
        categoryId,
        sku,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        discount: parsedDiscount,
        stock: parseInt(stock) || 10,
        lowStockThreshold: parseInt(lowStockThreshold) || 3,
        images: JSON.stringify(Array.isArray(images) ? images : [images || thumbnail]),
        thumbnail: thumbnail || (Array.isArray(images) && images[0]) || '',
        colors: JSON.stringify(Array.isArray(colors) ? colors : []),
        material: material || null,
        dimensions: dimensions || null,
        weight: weight || null,
        careInstructions: careInstructions || null,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        featured: !!featured,
        bestSeller: !!bestSeller,
        newArrival: !!newArrival,
        active: true,
        variants: variants && Array.isArray(variants) && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku || `${sku}-${slugify(v.name)}`,
            price: parseFloat(v.price) || parseFloat(price),
            mrp: parseFloat(v.mrp) || parseFloat(mrp),
            stock: parseInt(v.stock) || 5,
            size: v.size || null,
            color: v.color || null,
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...product,
        images: JSON.parse(product.images),
        colors: JSON.parse(product.colors),
        tags: JSON.parse(product.tags),
      },
    });
  } catch (error: any) {
    console.error('Product POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No data rows provided for import.' }, { status: 400 });
    }

    const errors: { row: number; reason: string }[] = [];
    const importedProducts = [];

    // Preload categories
    const categories = await prisma.category.findMany();
    const catMap = new Map<string, string>();
    categories.forEach((c) => {
      catMap.set(c.slug.toLowerCase(), c.id);
      catMap.set(c.name.toLowerCase(), c.id);
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      const name = row.name || row.Name;
      const price = parseFloat(row.price || row.Price);
      const mrp = parseFloat(row.mrp || row.MRP || row.price || row.Price);
      const sku = (row.sku || row.SKU || `RD-IMP-${Date.now()}-${i}`).trim();
      const catName = (row.category || row.Category || 'Toran & Bandarwal').trim();
      const stock = parseInt(row.stock || row.Stock || '10');

      if (!name) {
        errors.push({ row: rowNum, reason: 'Product name is required.' });
        continue;
      }
      if (isNaN(price) || price <= 0) {
        errors.push({ row: rowNum, reason: `Invalid price: "${row.price}". Must be positive number.` });
        continue;
      }

      // Find or create category
      let categoryId = catMap.get(catName.toLowerCase()) || catMap.get(slugify(catName));
      if (!categoryId) {
        const newCat = await prisma.category.create({
          data: {
            name: catName,
            slug: slugify(catName),
            image: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80',
          },
        });
        categoryId = newCat.id;
        catMap.set(catName.toLowerCase(), newCat.id);
      }

      // Check duplicate SKU
      const existingSku = await prisma.product.findUnique({ where: { sku } });
      const finalSku = existingSku ? `${sku}-${Math.floor(100 + Math.random() * 900)}` : sku;

      let baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const image1 = row.image1 || row.Image1 || row.thumbnail || 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80';
      const images = [image1];
      if (row.image2 || row.Image2) images.push(row.image2 || row.Image2);
      if (row.image3 || row.Image3) images.push(row.image3 || row.Image3);
      if (row.image4 || row.Image4) images.push(row.image4 || row.Image4);

      const color = row.color || row.Color;
      const colors = color ? [color] : ['Standard'];

      const tags = (row.tags || row.Tags || '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      try {
        const prod = await prisma.product.create({
          data: {
            name,
            slug,
            description: row.description || row.Description || `Authentic handmade ${name} from Rouniyar Decor.`,
            shortDescription: row.shortDescription || row.ShortDescription || null,
            categoryId,
            sku: finalSku,
            price,
            mrp: isNaN(mrp) || mrp < price ? price : mrp,
            discount: mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
            stock: isNaN(stock) ? 10 : stock,
            lowStockThreshold: 3,
            images: JSON.stringify(images),
            thumbnail: image1,
            colors: JSON.stringify(colors),
            material: row.material || row.Material || 'Premium Handcrafted Wool',
            dimensions: row.dimensions || row.Dimensions || 'Standard',
            weight: row.weight || row.Weight || '250 Grams',
            careInstructions: row.careInstructions || 'Hand wash gently in cold water; dry flat.',
            tags: JSON.stringify(tags.length > 0 ? tags : ['Handmade', 'Rouniyar Decor']),
            active: true,
          },
        });
        importedProducts.push(prod);
      } catch (err: any) {
        errors.push({ row: rowNum, reason: err.message || 'Database insert failed' });
      }
    }

    return NextResponse.json({
      message: `Imported ${importedProducts.length} products successfully.`,
      successCount: importedProducts.length,
      errors,
    });
  } catch (error: any) {
    console.error('Import CSV error:', error);
    return NextResponse.json({ error: error.message || 'Import failed' }, { status: 500 });
  }
}

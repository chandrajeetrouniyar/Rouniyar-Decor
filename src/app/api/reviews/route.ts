import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all') === 'true';

    const where: any = {};
    if (productId) where.productId = productId;
    if (!all) where.approved = true;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, slug: true, thumbnail: true } },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const { productId, rating, title, comment, customerName } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Product ID, Rating, and Review comment are required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user ? user.userId : null,
        customerName: customerName || user?.name || 'Valued Customer',
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        title: title || null,
        comment,
        approved: true, // auto-approved or moderated by admin
      },
    });

    // Update product average rating & review count
    const productReviews = await prisma.review.findMany({
      where: { productId, approved: true },
      select: { rating: true },
    });

    const totalRatings = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = productReviews.length > 0 ? Number((totalRatings / productReviews.length).toFixed(1)) : 5.0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: productReviews.length,
      },
    });

    return NextResponse.json({ message: 'Review submitted successfully', review });
  } catch (error: any) {
    console.error('Review submit error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

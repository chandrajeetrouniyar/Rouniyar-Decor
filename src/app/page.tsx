import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  Package,
  Headphones,
  CheckCircle,
  Star,
  Instagram,
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch real data from Prisma
  const [categories, featuredRaw, bestSellersRaw, reviews] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    }),
    prisma.product.findMany({
      where: { active: true, featured: true },
      take: 8,
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { active: true, bestSeller: true },
      take: 6,
      include: { category: true, variants: true },
      orderBy: { rating: 'desc' },
    }),
    prisma.review.findMany({
      where: { approved: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, slug: true, thumbnail: true } },
      },
    }),
  ]);

  const featuredProducts = featuredRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  const bestSellers = bestSellersRaw.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    colors: JSON.parse(p.colors || '[]'),
    tags: JSON.parse(p.tags || '[]'),
  }));

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 3. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-earth-950 overflow-hidden">
        {/* Background Image with warm overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=1920&auto=format&fit=crop&q=85"
            alt="Rouniyar Decor Handcrafted Toran and Home Decor"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth-950/90 via-earth-950/70 to-earth-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(#C85A32_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-50/10 backdrop-blur-md border border-cream-100/20 text-gold-accent text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-gold-accent animate-pulse" />
            <span>Traditional Craftsmanship • Timeless Indian Elegance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Beautiful Details for <br />
            <span className="text-terracotta italic font-normal">Beautiful Homes</span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-cream-100/85 max-w-2xl mx-auto leading-relaxed">
            Handcrafted décor designed to bring warmth, tradition and elegance into every corner. Explore our artisanal door torans, crochet thali posh, and auspicious festive accents.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-premium flex items-center justify-center gap-2 group"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop/toran-bandarwal"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-cream-50 border border-white/20 rounded-full font-semibold text-sm sm:text-base backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
            >
              EXPLORE COLLECTION
            </Link>
          </div>

          {/* Quick Hero Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left pt-8 border-t border-white/10 text-cream-100/90 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-gold-accent shrink-0" />
              <span>100% Wool & Crochet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-gold-accent shrink-0" />
              <span>Washable & Reusable</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-gold-accent shrink-0" />
              <span>Pan India Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-gold-accent shrink-0" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              Curated Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 mt-1">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-earth-700 hover:text-terracotta flex items-center gap-1 mt-2 md:mt-0 transition-colors group"
          >
            View All Categories <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-cream-100 border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col justify-end p-3 sm:p-4"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/20 to-transparent" />
              <div className="relative z-10 text-cream-50">
                <h3 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-gold-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-cream-200/80 font-medium">
                  {cat._count.products} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS (8 Products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Handcrafted with Devotion
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 mt-1">
            Featured Creations
          </h2>
          <p className="text-xs sm:text-sm text-earth-600 mt-2">
            Signature door bandarwals, traditional thali covers, and floral hangings carefully designed to elevate your living spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md group"
          >
            Explore Full Catalog ({featuredProducts.length}+ Designs)
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 7. HANDMADE STORY SECTION */}
      <section className="bg-cream-100 py-16 sm:py-20 border-y border-earth-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Story Image */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-premium">
              <img
                src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=1000&auto=format&fit=crop&q=80"
                alt="Rouniyar Decor Artisan Handcrafting Toran"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-soft">
                <p className="font-serif italic text-xs sm:text-sm text-earth-900 leading-snug">
                  "Every piece is created with attention to detail, color and traditional craftsmanship. Our artisans weave blessing into every single stitch."
                </p>
                <p className="text-[11px] font-bold text-terracotta mt-1.5 uppercase tracking-wider">
                  — The Rouniyar Decor Promise
                </p>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
                Our Artisanal Heritage
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 leading-tight">
                Honoring the Sacred Art of Indian Hand-Knitting
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-earth-700">
                At Rouniyar Decor, we believe that a home is more than four walls—it is a sacred sanctuary of joy, hospitality, and blessings. Traditional Indian entrances have always celebrated guests with bandarwals, brass bells, and vibrant auspicious colors.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-earth-700">
                Unlike mass-produced plastic decorations, each of our door torans and crochet thali poshs is crafted by hand using premium soft woolen yarn, sturdy wooden beads, and melodious brass bells. They are durable, washable, reusable, and crafted to stay beautiful season after season.
              </p>

              <div className="pt-2 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div className="p-3 bg-white rounded-xl border border-earth-200 shadow-sm">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-terracotta">100%</span>
                  <p className="text-[11px] text-earth-600 mt-0.5">Handcrafted</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-earth-200 shadow-sm">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-terracotta">20+</span>
                  <p className="text-[11px] text-earth-600 mt-0.5">Artisan Families</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-earth-200 shadow-sm">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-terracotta">10,000+</span>
                  <p className="text-[11px] text-earth-600 mt-0.5">Happy Homes</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-earth-900 hover:text-terracotta transition-colors group"
                >
                  Read Our Full Story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-earth-700 hover:text-terracotta flex items-center gap-1 mt-2 md:mt-0 transition-colors group"
          >
            Explore All Best Sellers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE ROUNIYAR DECOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            The Rouniyar Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 mt-1">
            Why Choose Rouniyar Decor
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              100% Handmade Products
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              Every toran and pooja cover is uniquely hand-woven by experienced rural artisans using traditional crochet and knitting techniques.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gold-accent/15 text-gold-accent flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              Premium Quality Materials
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              We exclusively use soft, color-fast wool yarn, genuine brass bells, and durable wooden beads that don't lose color or luster over time.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              Auspicious & Beautiful Designs
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              Carefully conceptualized color combinations (maroon, turmeric yellow, forest green, vermillion) inspired by Vedic aesthetics.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              Damage-Proof Packaging
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              Triple-layer protective packaging ensures your decorative hangings, bells, and thali covers arrive in pristine ready-to-hang condition.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              Reliable Pan India Delivery
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              Fast courier dispatch with real-time tracking across 20,000+ Indian pincodes. Free delivery on orders above ₹999.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900">
              Dedicated Customer Support
            </h3>
            <p className="text-xs sm:text-sm text-earth-600 mt-2 leading-relaxed">
              Friendly phone, email, and WhatsApp assistance for product inquiries, custom size orders, and order status updates.
            </p>
          </div>
        </div>
      </section>

      {/* 9. TRENDING EDITORIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-earth-900 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 text-cream-50">
              <span className="text-xs uppercase tracking-widest text-gold-accent font-semibold">
                Festive Season Special
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Warm Welcomes for Navratri, Diwali & Griha Pravesh
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-cream-200/80">
                Enhance your home entrance with our celebrated White, Green & Brown Pom-Pom Torans and Marigold Garland Sets. Handcrafted to make every homecoming feel blessed.
              </p>
              <div>
                <Link
                  href="/shop/toran-bandarwal"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-full font-semibold text-xs sm:text-sm transition-all shadow-md group"
                >
                  Shop Festive Collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[300px] lg:min-h-[440px]">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80"
                alt="Festive Toran and Garland collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. REAL CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Loved Across India
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-earth-900 mt-1">
            Words from Our Patrons
          </h2>
          <p className="text-xs sm:text-sm text-earth-600 mt-1">
            Read verified reviews from customers who welcomed Rouniyar Decor into their homes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-2xl border border-earth-100 shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-accent mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-accent" />
                  ))}
                </div>
                {rev.title && (
                  <h4 className="font-serif font-bold text-sm text-earth-900 line-clamp-1">
                    "{rev.title}"
                  </h4>
                )}
                <p className="text-xs text-earth-700 mt-2 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-earth-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-earth-900">{rev.customerName}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Verified Buyer ✓</p>
                </div>
                {rev.product && (
                  <Link
                    href={`/product/${rev.product.slug}`}
                    className="text-[10px] text-terracotta hover:underline line-clamp-1 max-w-[100px] text-right"
                  >
                    {rev.product.name}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. SOCIAL / INSTAGRAM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold flex items-center gap-1.5">
              <Instagram className="w-4 h-4" /> @rouniyardecor
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
              Homes Adorned with Rouniyar Decor
            </h2>
          </div>
          <span className="text-xs text-earth-600 mt-2 sm:mt-0">
            Tag us in your festive pictures using #RouniyarDecor to get featured!
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-square relative group">
            <img
              src="https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80"
              alt="Home entrance with Rouniyar Toran"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Entrance Toran
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square relative group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
              alt="Pooja room with thali posh"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Mandir Thali Posh
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square relative group">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
              alt="Door side latkans"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Shubh Labh Latkans
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square relative group">
            <img
              src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80"
              alt="Wall hanging in living room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Artisan Wall Accents
            </div>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-100 border border-earth-200 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Stay Connected
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Get Updates on New Collections & Offers
          </h2>
          <p className="text-xs sm:text-sm text-earth-700 max-w-md mx-auto">
            Subscribe to receive exclusive festive discounts, artisan stories, and first access to limited edition handmade releases.
          </p>
          <form
            action="#"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-full bg-white border border-earth-300 text-xs sm:text-sm focus:outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-terracotta hover:bg-terracotta-hover text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-sm"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-earth-600">
            No spam, ever. Unsubscribe anytime with a single click.
          </p>
        </div>
      </section>
    </div>
  );
}

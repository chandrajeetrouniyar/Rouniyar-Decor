'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const discountPercent =
    product.discount ||
    (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.images === 'string'
    ? JSON.parse(product.images || '[]')
    : [];
  const primaryImage = product.thumbnail || images[0] || 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80';
  const secondaryImage = images[1] || primaryImage;

  return (
    <div className="group relative bg-white rounded-2xl border border-earth-100 shadow-card hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-cream-50">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-terracotta text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Low Stock Badge */}
        {product.stock <= product.lowStockThreshold && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-amber-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
            Only {product.stock} left!
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            isWishlisted
              ? 'bg-red-50 text-red-600 scale-105'
              : 'bg-white/80 text-earth-700 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-[11px] text-earth-600 mb-1">
            <span className="uppercase tracking-wider font-medium text-earth-600">
              {product.category?.name || 'Handcrafted'}
            </span>
            <div className="flex items-center gap-1 font-semibold text-earth-800 bg-cream-100 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 text-gold-accent fill-gold-accent" />
              <span>{product.rating || 4.8}</span>
              <span className="text-earth-600 font-normal">({product.reviewCount || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-earth-900 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Colors available indicator */}
          {product.colors && (
            <p className="text-[11px] text-earth-600 mt-1 truncate">
              {Array.isArray(product.colors)
                ? product.colors.join(' • ')
                : typeof product.colors === 'string'
                ? JSON.parse(product.colors).join(' • ')
                : ''}
            </p>
          )}
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-2 border-t border-earth-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-earth-900">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-earth-600 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-earth-900 hover:bg-terracotta text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

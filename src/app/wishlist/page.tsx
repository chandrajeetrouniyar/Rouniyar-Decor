'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    setIsCartOpen(true);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-earth-600">
          <Heart className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-900">Your Wishlist is Empty</h1>
        <p className="text-sm text-earth-600 max-w-md mx-auto">
          Save your favorite handcrafted torans, door hangings, and thali covers so you can easily find them later.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-full text-sm font-semibold transition-all shadow-md"
        >
          Explore Handcrafted Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Saved Favorites
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs text-earth-600 hover:text-red-600 font-medium self-start sm:self-auto"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const images = Array.isArray(product.images)
            ? product.images
            : typeof product.images === 'string'
            ? JSON.parse(product.images || '[]')
            : [];
          const image = product.thumbnail || images[0];

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-earth-100 shadow-card flex flex-col overflow-hidden group"
            >
              <div className="relative aspect-square bg-cream-50 overflow-hidden">
                <Link href={`/product/${product.slug}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-earth-600 hover:text-red-600 shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-xs sm:text-sm font-semibold text-earth-900 hover:text-terracotta line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-earth-900">
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
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2 bg-earth-900 hover:bg-terracotta text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

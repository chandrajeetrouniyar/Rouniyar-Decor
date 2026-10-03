'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface CartPageClientProps {
  upsellProducts: Product[];
}

export default function CartPageClient({ upsellProducts }: CartPageClientProps) {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    couponDiscount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    const res = await applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
    setCouponLoading(false);
  };

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-earth-600">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-earth-900">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-earth-600 max-w-md mx-auto">
          You haven't added any handcrafted decor pieces yet. Explore our handcrafted torans, brass bell latkans, and festive pooja covers.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 mt-1">
          Review your items and proceed to secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Progress bar */}
          <div className="p-4 bg-cream-100 rounded-2xl border border-earth-200/80 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div>
                <p className="text-earth-900 mb-1.5 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-gold-accent shrink-0" />
                  Add <strong className="text-terracotta">{formatPrice(remainingForFreeShipping)}</strong> more to unlock <strong>FREE Delivery</strong> across India!
                </p>
                <div className="w-full bg-cream-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-terracotta h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-800 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                You've qualified for FREE Delivery!
              </p>
            )}
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-earth-100 shadow-card divide-y divide-earth-100 overflow-hidden">
            {items.map((item) => {
              const price = item.variant?.price || item.product.price;
              const mrp = item.variant?.mrp || item.product.mrp;
              const image = item.image || item.product.thumbnail;

              return (
                <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="w-20 sm:w-28 aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-earth-100 shrink-0"
                  >
                    <img
                      src={image}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info & Quantity */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-serif text-sm sm:text-base font-bold text-earth-900 hover:text-terracotta transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-earth-600 mt-0.5">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span> • </span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-earth-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-earth-300 rounded-xl bg-cream-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-earth-700 hover:text-terracotta font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-earth-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-earth-700 hover:text-terracotta font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-earth-900">
                          {formatPrice(price * item.quantity)}
                        </div>
                        {mrp > price && (
                          <div className="text-xs text-earth-600 line-through">
                            {formatPrice(mrp * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link
              href="/shop"
              className="text-earth-700 hover:text-terracotta font-semibold flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6 sticky top-28">
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-5">
            <h2 className="font-serif text-lg font-bold text-earth-900 pb-3 border-b border-earth-100">
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Code: {appliedCoupon.code}</p>
                      <p className="text-[11px] text-emerald-700">Saved {formatPrice(couponDiscount)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-semibold underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label className="block text-xs font-bold text-earth-700">Apply Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME100, FESTIVE15"
                      className="flex-1 px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta uppercase"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-earth-900 hover:bg-terracotta text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs text-earth-700 pt-2 border-t border-earth-100">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-earth-900">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-semibold">FREE</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (GST)</span>
                <span className="text-emerald-700">Included</span>
              </div>
              <div className="pt-3 border-t border-earth-200 flex justify-between text-base font-bold text-earth-900">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-terracotta">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold text-sm transition-all shadow-premium flex items-center justify-center gap-2 group"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Trust Details */}
            <div className="pt-3 border-t border-earth-100 space-y-2 text-[11px] text-earth-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                <span>Cash on Delivery Available Pan India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {upsellProducts.length > 0 && (
        <section className="pt-10 border-t border-earth-200">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              Curated for You
            </span>
            <h2 className="font-serif text-2xl font-bold text-earth-900 mt-1">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {upsellProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

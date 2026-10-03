'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-earth-100 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="font-serif text-lg font-bold text-earth-900">Your Shopping Bag</h2>
              <span className="text-xs bg-cream-200 text-earth-800 px-2 py-0.5 rounded-full font-semibold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-earth-700 hover:bg-earth-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="bg-cream-100 px-4 py-2.5 border-b border-earth-100 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div>
                <p className="text-earth-800 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                  Add <strong className="text-terracotta">{formatPrice(remainingForFreeShipping)}</strong> more to get <strong>FREE Delivery</strong>!
                </p>
                <div className="w-full bg-cream-300 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-terracotta h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Congratulations! You have unlocked FREE shipping.
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-cream-100 text-earth-600 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-earth-900">Your bag is empty</h3>
                  <p className="text-xs text-earth-600 mt-1 max-w-xs mx-auto">
                    Explore our handcrafted torans, brass bell latkans, and festive pooja decor.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push('/shop');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-earth-900 text-white text-xs font-semibold hover:bg-terracotta transition-colors shadow-sm"
                >
                  Explore Collections <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = item.variant?.price || item.product.price;
                const mrp = item.variant?.mrp || item.product.mrp;
                const image = item.image || item.product.thumbnail;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b border-earth-100 group"
                  >
                    {/* Item Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-20 h-20 bg-cream-100 rounded-lg overflow-hidden relative shrink-0 border border-earth-100"
                    >
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs sm:text-sm font-semibold text-earth-900 hover:text-terracotta line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-earth-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] text-earth-600 mt-0.5">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span> • </span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-earth-200 rounded-lg bg-cream-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-terracotta transition-colors text-earth-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 text-earth-900 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-terracotta transition-colors text-earth-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-bold text-earth-900">
                            {formatPrice(price * item.quantity)}
                          </div>
                          {mrp > price && (
                            <div className="text-[10px] text-earth-600 line-through">
                              {formatPrice(mrp * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-cream-50 border-t border-earth-100 space-y-4">
              {/* Coupon Code Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(couponDiscount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-semibold text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. FESTIVE15)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta uppercase"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCodeInput.trim()}
                      className="px-3.5 py-1.5 bg-earth-800 text-white rounded-lg text-xs font-semibold hover:bg-terracotta transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-earth-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-900">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-semibold">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>
                <div className="border-t border-earth-200 pt-2 flex justify-between text-sm sm:text-base font-bold text-earth-900">
                  <span>Estimated Total</span>
                  <span className="text-terracotta font-serif text-lg">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-earth-600 text-center pt-0.5">
                  Taxes included. Cash on Delivery available at checkout.
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

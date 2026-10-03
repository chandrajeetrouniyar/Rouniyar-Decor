'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { CheckCircle, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage: cartToast, clearToast: clearCartToast } = useCart();
  const { toastMessage: wishlistToast, clearToast: clearWishlistToast } = useWishlist();

  const message = cartToast || wishlistToast;
  const clear = cartToast ? clearCartToast : clearWishlistToast;

  if (!message) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 animate-slide-up pointer-events-auto">
      <div className="bg-earth-900 text-cream-50 px-4 py-3 rounded-xl shadow-premium border border-earth-700 flex items-center gap-3 text-xs sm:text-sm font-medium">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{message}</span>
        <button
          onClick={clear}
          className="text-earth-300 hover:text-white transition-colors ml-2"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-earth-100 shadow-premium space-y-6">
        <span className="font-serif text-6xl font-bold text-terracotta block">404</span>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-earth-900">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-earth-600">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Back Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cream-100 hover:bg-cream-200 text-earth-900 rounded-full text-xs font-semibold transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

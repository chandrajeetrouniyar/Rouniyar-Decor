'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-earth-900 text-cream-50 text-xs sm:text-sm py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-gold-accent font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Festive Season Offer: Use code <strong className="text-white underline">FESTIVE15</strong> for 15% off!</span>
        </div>
        <div className="w-full md:w-auto flex items-center justify-center md:justify-end gap-6 text-[11px] sm:text-xs tracking-wide">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-gold-accent" />
            100% Handmade in India
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-gold-accent" />
            Free Shipping over ₹999
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-gold-accent" />
            COD Available
          </span>
          <Link href="/admin/login" className="text-cream-200 hover:text-white transition-colors underline hidden lg:inline">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

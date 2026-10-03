'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-earth-950 text-cream-100 pt-16 pb-24 lg:pb-12 border-t border-earth-900">
      {/* Brand Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-earth-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-gold-accent shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Handcrafted</h4>
              <p className="text-xs text-earth-300 mt-0.5">Woven by skilled Indian artisans</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-gold-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Pan India Delivery</h4>
              <p className="text-xs text-earth-300 mt-0.5">Free delivery on orders above ₹999</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-gold-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
              <p className="text-xs text-earth-300 mt-0.5">UPI, Cards, NetBanking & COD</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-gold-accent shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-earth-300 mt-0.5">Hassle-free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                ROUNIYAR <span className="text-terracotta">DECOR</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-earth-300 max-w-sm">
              Handcrafted Details for Beautiful Homes. We bring the timeless warmth of traditional Indian handicraft, handmade woolen torans, crochet thali posh, and festive entrance decor directly to your sanctuary.
            </p>
            <div className="pt-2 text-xs space-y-2 text-earth-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                <span>Rouniyar Handicrafts Studio, New Delhi & Gorakhpur, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                <a href="mailto:support@rouniyardecor.com" className="hover:text-white transition-colors">
                  support@rouniyardecor.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-accent shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210 (Mon-Sat, 10am - 7pm)
                </a>
              </p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-earth-300">
              <li>
                <Link href="/shop" className="hover:text-gold-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/toran-bandarwal" className="hover:text-gold-accent transition-colors">
                  Toran & Bandarwal
                </Link>
              </li>
              <li>
                <Link href="/shop/door-hangings" className="hover:text-gold-accent transition-colors">
                  Door Hangings & Latkans
                </Link>
              </li>
              <li>
                <Link href="/shop/pooja-decor-thali-posh" className="hover:text-gold-accent transition-colors">
                  Pooja Decor & Thali Posh
                </Link>
              </li>
              <li>
                <Link href="/shop/wall-decor" className="hover:text-gold-accent transition-colors">
                  Wall Decor & Jharokhas
                </Link>
              </li>
              <li>
                <Link href="/shop/festive-decor" className="hover:text-gold-accent transition-colors">
                  Festive Specials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-earth-300">
              <li>
                <Link href="/about" className="hover:text-gold-accent transition-colors">
                  About Rouniyar Decor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-accent transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-gold-accent transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-terracotta hover:underline font-medium">
                  Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Policies & Help
            </h3>
            <ul className="space-y-2.5 text-xs text-earth-300">
              <li>
                <Link href="/shipping-policy" className="hover:text-gold-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-gold-accent transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-earth-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-400">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Rouniyar Decor. Handcrafted with pride in India. All rights reserved.
        </p>
        <div className="flex items-center gap-3 text-xs text-earth-300 font-medium">
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">UPI</span>
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">RuPay</span>
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">Visa</span>
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">Mastercard</span>
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">NetBanking</span>
          <span className="px-2 py-1 bg-earth-900 rounded border border-earth-800">COD</span>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | Rouniyar Decor',
  description: 'Learn the story behind Rouniyar Decor, our dedication to traditional Indian handicrafts, and our artisan families.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Artisanal Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-earth-900 leading-tight">
          Handcrafted Details for Beautiful Homes
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 leading-relaxed">
          Preserving the sacred charm of Indian hand-knitted entrance torans and pooja decor for the modern home.
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-premium">
        <img
          src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=1400&auto=format&fit=crop&q=80"
          alt="Rouniyar Decor Artisan at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white text-xs sm:text-sm">
          <p className="font-serif italic font-medium">
            "A home's entrance sets the energy for all who step inside. We pour heart, tradition, and blessing into every single stitch."
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs sm:text-sm leading-relaxed text-earth-700">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-earth-900">Our Beginnings</h2>
          <p>
            Rouniyar Decor was born out of a deep reverence for the warmth of traditional Indian homes. During festivals and auspicious ceremonies, our elders would spend days weaving floral bandarwals, shaping soft woolen pom-poms, and crocheting sacred covers for the household mandir thalis.
          </p>
          <p>
            As synthetic, mass-manufactured plastic hangings flooded the market, we noticed the loss of that tactile warmth, soulful texture, and genuine craftsmanship. We made it our mission to revive these handcrafted traditions.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-earth-900">The Artisan Touch</h2>
          <p>
            Today, Rouniyar Decor partners with rural women artisans and master crocheters. Each door toran, latkan pair, and 16-inch thali posh represents hours of meticulous needlework using premium, skin-friendly soft wool and genuine brass bells.
          </p>
          <p>
            When you bring a Rouniyar Decor piece into your home, you aren't just purchasing decor—you are supporting traditional Indian artisan families and bringing timeless blessings to your doorstep.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-earth-100">
        <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card text-center space-y-2">
          <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-earth-900">100% Handcrafted</h3>
          <p className="text-xs text-earth-600">
            Never machine-stamped. Every floret and tassel is hand-knitted with dedication.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-gold-accent mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-earth-900">Built to Last</h3>
          <p className="text-xs text-earth-600">
            Washable, color-fast, and designed to be reused festival after festival.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card text-center space-y-2">
          <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-earth-900">Artisan Empowerment</h3>
          <p className="text-xs text-earth-600">
            Providing sustainable fair wages and financial independence to Indian craftswomen.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-cream-100 rounded-3xl border border-earth-200 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-earth-900">
          Ready to Adorn Your Sanctuary?
        </h3>
        <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
          Explore our signature White, Green & Brown Pom-Pom Torans and sacred pooja covers today.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md"
        >
          Explore Full Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

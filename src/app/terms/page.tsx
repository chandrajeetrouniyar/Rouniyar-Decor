import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | Rouniyar Decor',
  description: 'Terms of service and commercial guidelines for purchasing from Rouniyar Decor.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-earth-100 pb-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Legal
        </span>
        <h1 className="font-serif text-3xl font-bold text-earth-900 mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-earth-600 mt-1">Last updated: October 2025</p>
      </div>

      <div className="prose prose-earth text-xs sm:text-sm text-earth-800 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and shopping on the Rouniyar Decor website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">2. Handcrafted Product Nature</h2>
          <p>
            All products displayed on Rouniyar Decor are handmade. Because each piece is manually knit and dyed, minuscule variations in color tone, tassel density, or dimension are inherent characteristics of genuine craftsmanship.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">3. Pricing & Currency</h2>
          <p>
            All prices listed on the website are in Indian Rupees (INR) and inclusive of applicable Goods and Services Tax (GST) unless explicitly stated otherwise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">4. Intellectual Property</h2>
          <p>
            The Rouniyar Decor brand name, original logo, product photography, product descriptions, and site styling are protected under Indian intellectual property laws. Unauthorized reproduction is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}

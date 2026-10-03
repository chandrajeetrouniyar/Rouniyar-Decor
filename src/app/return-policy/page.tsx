import React from 'react';

export const metadata = {
  title: 'Return & Refund Policy | Rouniyar Decor',
  description: 'Understand the 7-day hassle-free replacement and refund guidelines at Rouniyar Decor.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-earth-100 pb-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl font-bold text-earth-900 mt-1">
          Return, Replacement & Refund Policy
        </h1>
        <p className="text-xs text-earth-600 mt-1">Last updated: October 2025</p>
      </div>

      <div className="prose prose-earth text-xs sm:text-sm text-earth-800 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">1. 7-Day Hassle-Free Replacement</h2>
          <p>
            At Rouniyar Decor, every piece is inspected before dispatch. If your order arrives damaged in courier transit, has a defect, or is not what you ordered, we offer a <strong>7-day replacement guarantee</strong> from the date of delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">2. How to Request a Replacement</h2>
          <p>
            Simply email us at <a href="mailto:support@rouniyardecor.com" className="text-terracotta underline font-semibold">support@rouniyardecor.com</a> or WhatsApp us at <strong>+91 98765 43210</strong> with your Order Number and photos of the product/outer box. Our team will arrange a reverse pickup and dispatch a fresh replacement promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">3. Handcrafted Variations</h2>
          <p>
            Because each toran and thali cover is handmade by rural artisans using natural wool yarn and crochet loops, slight variations in shade or floret shape are the natural hallmark of genuine artisan craftsmanship and are not considered manufacturing defects.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">4. Refund Processing</h2>
          <p>
            If a replacement item is out of stock, a full refund will be processed back to your original payment method (Bank/UPI/Card) within 5 to 7 business days. For Cash on Delivery orders, refunds are credited directly to your bank account via UPI or IMPS.
          </p>
        </section>
      </div>
    </div>
  );
}

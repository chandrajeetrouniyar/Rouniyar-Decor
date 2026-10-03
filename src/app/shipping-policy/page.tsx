import React from 'react';

export const metadata = {
  title: 'Shipping Policy | Rouniyar Decor',
  description: 'Learn about Rouniyar Decor shipping timelines, couriers, and delivery rates across India.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-earth-100 pb-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl font-bold text-earth-900 mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-earth-600 mt-1">Last updated: October 2025</p>
      </div>

      <div className="prose prose-earth text-xs sm:text-sm text-earth-800 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">1. Pan-India Delivery Coverage</h2>
          <p>
            Rouniyar Decor delivers across all serviceable pin codes in India through trusted premium courier partners such as Blue Dart, Delhivery, DTDC, and India Post.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">2. Processing & Dispatch Timeline</h2>
          <p>
            Each handcrafted toran, brass latkan, or crochet thali cover undergoes a thorough quality inspection and secure triple-layer packaging. In-stock products are dispatched within <strong>24 to 48 hours</strong> of order placement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">3. Estimated Transit Times</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Metro Cities (Delhi NCR, Bengaluru, Mumbai, Hyderabad, Kolkata, Chennai):</strong> 3 to 4 business days.</li>
            <li><strong>Tier 2 & Tier 3 Cities:</strong> 4 to 6 business days.</li>
            <li><strong>Remote & North-Eastern Locations:</strong> 6 to 8 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">4. Shipping Charges</h2>
          <p>
            • Orders above <strong>₹999</strong>: <strong>FREE Delivery</strong> across India.
          </p>
          <p>
            • Orders below ₹999: A nominal flat shipping charge of <strong>₹50</strong> applies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">5. Tracking Your Order</h2>
          <p>
            As soon as your package is dispatched, you will receive an SMS and email notification containing your live courier tracking link. You can also track your status anytime under <a href="/orders" className="text-terracotta underline font-semibold">My Orders</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

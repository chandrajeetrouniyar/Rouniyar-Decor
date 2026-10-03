import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Rouniyar Decor',
  description: 'Understand how Rouniyar Decor protects and handles your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-earth-100 pb-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Legal
        </span>
        <h1 className="font-serif text-3xl font-bold text-earth-900 mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-earth-600 mt-1">Last updated: October 2025</p>
      </div>

      <div className="prose prose-earth text-xs sm:text-sm text-earth-800 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">1. Information We Collect</h2>
          <p>
            When you visit Rouniyar Decor or place an order, we collect information necessary to fulfill your purchases, including your full name, shipping address, email address, phone number, and order preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">2. Payment Security</h2>
          <p>
            We partner with certified Level-1 PCI-DSS payment gateways (such as Razorpay). We <strong>never store or have access to your credit card numbers, UPI PINs, or CVVs</strong> on our servers. All sensitive data transmission is encrypted via 256-bit SSL.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-earth-900">3. How We Use Your Data</h2>
          <p>
            Your information is used strictly to dispatch orders, notify you of courier updates, provide customer support, and (if opted in) send occasional promotional discounts. We do not sell or rent customer data to third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
}

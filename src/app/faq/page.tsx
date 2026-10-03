'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Are all Rouniyar Decor products genuinely handmade?',
      a: 'Yes, 100%! Every door toran, latkan hanging, and thali posh is hand-knitted and crocheted by skilled Indian artisans using premium soft wool yarn, wooden beads, and authentic brass bells. No automated mass-stamping machines are used.',
    },
    {
      q: 'How should I clean and wash woolen torans and thali poshs?',
      a: 'We recommend gentle hand washing in cold water using a mild liquid wool detergent. Gently rinse without twisting or wringing. Lay flat on a clean dry towel in shade to maintain the shape and vibrant color of the woolen pom-poms and crochet motifs.',
    },
    {
      q: 'What is the standard size of your door torans?',
      a: 'Our standard entrance torans measure 38 to 39 inches in length, which fits standard Indian main wooden doors and pooja room doors perfectly. We also offer 42-inch larger variations for double-door entrance gates.',
    },
    {
      q: 'What are the delivery timelines across India?',
      a: 'Orders are dispatched within 24 to 48 hours from our studio. Delivery takes 3 to 5 business days for major metro cities (Delhi NCR, Bengaluru, Mumbai, Hyderabad, Kolkata, Chennai) and 4 to 7 days for other locations.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across most serviceable pincodes in India for your convenience.',
    },
    {
      q: 'Can I order customized sizes or bulk festive quantities?',
      a: 'Yes! For custom dimensions, wedding favors, corporate Diwali gifts, or bulk mandir decor orders, please reach out directly via WhatsApp or email at support@rouniyardecor.com.',
    },
    {
      q: 'What is your return or replacement policy?',
      a: 'We offer a 7-day hassle-free replacement guarantee if an item arrives damaged in transit or differs from what you ordered.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Got Questions?
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
          Find quick answers about our craftsmanship, delivery speeds, care instructions, and custom orders.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-earth-100 shadow-card overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-earth-900 hover:text-terracotta transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-terracotta' : 'text-earth-400'}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-earth-700 leading-relaxed border-t border-earth-50 pt-3">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="p-8 bg-cream-100 rounded-3xl border border-earth-200 text-center space-y-3">
        <h3 className="font-serif font-bold text-lg text-earth-900">Still have a question?</h3>
        <p className="text-xs text-earth-600">Our customer care team is available to assist you anytime.</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs font-semibold transition-colors"
        >
          Contact Support <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

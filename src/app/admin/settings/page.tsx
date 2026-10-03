'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Check, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Rouniyar Decor');
  const [tagline, setTagline] = useState('Handcrafted Details for Beautiful Homes');
  const [supportEmail, setSupportEmail] = useState('support@rouniyardecor.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('999');
  const [standardShippingFee, setStandardShippingFee] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-4 border-b border-earth-200">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
          Store & Gateway Settings
        </h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Support WhatsApp / Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rules */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Shipping Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Razorpay Integration Status */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-earth-100">
            <h2 className="font-serif text-base font-bold text-earth-900">
              Razorpay Payment Gateway Integration
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Test Mode Active
            </span>
          </div>

          <div className="space-y-3 text-xs text-earth-700">
            <p className="leading-relaxed">
              The payment abstraction is configured to seamlessly switch to live mode as soon as your Razorpay production keys are added to your <code className="bg-cream-100 px-1.5 py-0.5 rounded text-terracotta">.env</code> file:
            </p>
            <div className="bg-earth-950 text-cream-100 p-4 rounded-2xl font-mono text-[11px] space-y-1">
              <p>NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_your_key_here"</p>
              <p>RAZORPAY_KEY_SECRET="your_secret_key_here"</p>
            </div>
            <p className="text-[11px] text-earth-600">
              When live credentials are not present, test mode simulates instant checkout and webhook verification so you can test end-to-end purchasing anytime.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

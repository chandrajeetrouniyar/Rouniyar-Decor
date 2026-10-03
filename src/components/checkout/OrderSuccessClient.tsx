'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderSuccessClient({ order }: { order: Order | any }) {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C85A32', '#D4AF37', '#2C1A11', '#FAF7F0'],
      });
    } catch (e) {
      // safe ignore if canvas-confetti is not loaded
    }
  }, []);

  const timelineSteps = [
    { label: 'Order Placed', desc: 'Received & Logged', done: true },
    { label: 'Confirmed', desc: 'Artisan Preparing', done: true },
    { label: 'Packed', desc: 'Triple-Layer Boxed', done: false },
    { label: 'Shipped', desc: 'In Courier Transit', done: false },
    { label: 'Delivered', desc: 'At Your Doorstep', done: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-soft animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
          Thank You for Supporting Handcrafted Art!
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
          We have received your order{' '}
          <strong className="text-earth-900">{order?.orderNumber || '#RD-ORDER'}</strong>. A confirmation
          has been sent to <strong>{order?.customerEmail || 'your email'}</strong>.
        </p>
      </div>

      {/* Order Tracking Timeline */}
      <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-terracotta" /> Order Status & Tracking
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                  step.done
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                    : 'bg-cream-200 text-earth-600'
                }`}
              >
                {step.done ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <p className="text-xs font-bold text-earth-900">{step.label}</p>
              <p className="text-[10px] text-earth-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details & Summary */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Details */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <h3 className="font-serif text-base font-bold text-earth-900 flex items-center gap-2 pb-2 border-b border-earth-100">
              <MapPin className="w-4 h-4 text-terracotta" /> Shipping Address
            </h3>
            <div className="text-xs text-earth-800 space-y-1">
              <p className="font-bold text-sm text-earth-900">{order.customerName}</p>
              <p>{order.shippingAddress?.houseFlat}</p>
              <p>{order.shippingAddress?.street}</p>
              {order.shippingAddress?.area && <p>{order.shippingAddress.area}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                <strong className="text-earth-900">{order.shippingAddress?.pincode}</strong>
              </p>
              <p className="pt-1 text-earth-600">Mobile: +91 {order.customerMobile}</p>
            </div>

            <div className="pt-2 border-t border-earth-100 text-xs">
              <p className="text-earth-600">
                Payment Method:{' '}
                <strong className="text-earth-900">{order.paymentMethod}</strong> (
                {order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <h3 className="font-serif text-base font-bold text-earth-900 flex items-center gap-2 pb-2 border-b border-earth-100">
              <Package className="w-4 h-4 text-terracotta" /> Items Summary
            </h3>
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {order.items?.map((it: any) => (
                <div key={it.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-12 h-12 rounded-lg object-cover bg-cream-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-earth-900 truncate">{it.name}</p>
                    <p className="text-[11px] text-earth-600">Qty: {it.quantity}</p>
                  </div>
                  <span className="font-bold text-earth-900">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-earth-100 flex justify-between items-center text-sm font-bold text-earth-900">
              <span>Total Paid</span>
              <span className="font-serif text-lg text-terracotta">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-earth-900 hover:bg-earth-800 text-white rounded-full text-xs sm:text-sm font-semibold transition-colors text-center"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-cream-100 hover:bg-cream-200 text-earth-900 rounded-full text-xs sm:text-sm font-semibold transition-colors text-center flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 border border-earth-300 hover:bg-cream-50 text-earth-800 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Receipt
        </button>
      </div>
    </div>
  );
}

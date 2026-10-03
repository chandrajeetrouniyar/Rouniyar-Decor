'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then((data) => setOrder(data.order))
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, orderStatus: 'CANCELLED' } : prev));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-earth-900">Order Not Found</h2>
        <p className="text-xs text-earth-600">The requested order #{id} could not be located.</p>
        <Link
          href="/orders"
          className="inline-block px-6 py-2.5 bg-earth-900 text-white rounded-full text-xs font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PACKED', label: 'Packed' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-600 hover:text-terracotta mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to All Orders
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-earth-600 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 border border-earth-300 rounded-xl text-xs font-semibold hover:bg-cream-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
          {(order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED') && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-terracotta" /> Live Delivery Progress
        </h2>

        {order.orderStatus === 'CANCELLED' ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-semibold text-center">
            This order has been cancelled.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {steps.map((st, i) => {
              const isPastOrCurrent = currentStepIndex >= i;
              return (
                <div key={st.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                      isPastOrCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-cream-200 text-earth-600'
                    }`}
                  >
                    {isPastOrCurrent ? '✓' : i + 1}
                  </div>
                  <span className="text-[11px] font-bold text-earth-900">{st.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items and Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List (2 Cols) */}
        <div className="md:col-span-2 p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
          <h3 className="font-serif text-base font-bold text-earth-900 pb-3 border-b border-earth-100">
            Items in Order ({order.items.length})
          </h3>
          <div className="space-y-4 divide-y divide-earth-100">
            {order.items.map((it) => (
              <div key={it.id} className="pt-3 first:pt-0 flex items-center gap-4 text-xs">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 object-cover rounded-xl bg-cream-100 shrink-0 border border-earth-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-earth-900 text-sm">{it.name}</p>
                  <p className="text-earth-600 mt-0.5">
                    SKU: {it.sku} {it.color && `• Color: ${it.color}`}
                  </p>
                  <p className="text-earth-600">
                    Quantity: <strong className="text-earth-900">{it.quantity}</strong> × {formatPrice(it.price)}
                  </p>
                </div>
                <span className="font-bold text-earth-900 text-sm">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 border-t border-earth-200 space-y-1.5 text-xs text-earth-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-earth-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-earth-200 flex justify-between text-base font-bold text-earth-900">
              <span>Total Paid</span>
              <span className="font-serif text-lg text-terracotta">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address and Delivery Info (1 Col) */}
        <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
          <h3 className="font-serif text-base font-bold text-earth-900 pb-3 border-b border-earth-100">
            Delivery Details
          </h3>
          <div className="text-xs text-earth-800 space-y-1">
            <p className="font-bold text-earth-900">{order.customerName}</p>
            <p>{order.shippingAddress?.houseFlat}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
              {order.shippingAddress?.pincode}
            </p>
            <p className="pt-1 text-earth-600">Phone: +91 {order.customerMobile}</p>
          </div>

          <div className="pt-3 border-t border-earth-100 text-xs space-y-1">
            <p className="font-semibold text-earth-900">Payment:</p>
            <p className="text-earth-600">
              {order.paymentMethod} • <span className="text-emerald-700 font-bold">{order.paymentStatus}</span>
            </p>
          </div>

          {order.trackingNumber && (
            <div className="pt-3 border-t border-earth-100 text-xs space-y-1">
              <p className="font-semibold text-earth-900">Tracking Number:</p>
              <p className="font-mono text-terracotta font-bold">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, ArrowRight, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function CustomerOrdersPage() {
  const { user, token, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    } else if (!isLoading) {
      setLoadingOrders(false);
    }
  }, [token, isLoading]);

  if (isLoading || loadingOrders) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-earth-900">Sign in to View Orders</h2>
        <p className="text-xs text-earth-600">Please sign in with your email to view order history and tracking.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-terracotta text-white rounded-full text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Delivered ✓</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">In Transit 🚚</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Processing</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Order Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            My Orders ({orders.length})
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs font-semibold text-terracotta hover:underline self-start sm:self-auto"
        >
          Shop More Collections →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-earth-100 p-8 space-y-4 max-w-md mx-auto">
          <Package className="w-12 h-12 text-earth-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-earth-900">No Orders Placed Yet</h3>
          <p className="text-xs text-earth-600">
            Explore our artisanal door torans and pooja essentials to place your first handcrafted order.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 bg-white rounded-3xl border border-earth-100 shadow-card hover:shadow-premium transition-all space-y-4"
            >
              {/* Order header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-earth-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-earth-900">{order.orderNumber}</span>
                  <span className="text-earth-600">• Placed on {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus)}
                  <span className="font-serif font-bold text-sm text-earth-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.map((it) => (
                    <div key={it.id} className="relative group shrink-0">
                      <img
                        src={it.image}
                        alt={it.name}
                        title={it.name}
                        className="w-14 h-14 object-cover rounded-xl bg-cream-100 border border-earth-100"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-earth-800 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {it.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-earth-700 pl-2">
                    <p className="font-semibold line-clamp-1 max-w-[200px]">{order.items[0]?.name}</p>
                    {order.items.length > 1 && (
                      <p className="text-[11px] text-earth-600">+{order.items.length - 1} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/orders/${order.orderNumber || order.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-earth-900 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Track & View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

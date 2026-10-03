'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  };

  const salesChart = data?.salesChart || [];
  const maxRevenue = Math.max(...salesChart.map((d: any) => d.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Store Performance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-earth-300 text-earth-800 rounded-xl text-xs font-semibold hover:bg-cream-50 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-earth-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-earth-900">
            {formatPrice(metrics.totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Today: {formatPrice(metrics.todayRevenue)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-earth-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-earth-900">
            {metrics.totalOrders}
          </p>
          <p className="text-[11px] text-sky-700 font-semibold">
            Today: {metrics.todayOrders} new orders
          </p>
        </div>

        {/* Total Customers */}
        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-earth-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-earth-900">
            {metrics.totalCustomers}
          </p>
          <p className="text-[11px] text-earth-600 font-medium">Verified Buyers</p>
        </div>

        {/* Active Products */}
        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <div className="flex items-center justify-between text-earth-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Live Catalog</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-earth-900">
            {metrics.totalProducts}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">
            {metrics.lowStockCount} Low stock alerts
          </p>
        </div>
      </div>

      {/* Secondary Status Pipeline Counts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-amber-800 font-medium">Pending Processing</p>
            <p className="text-lg font-bold text-amber-900">{metrics.pendingOrders} orders</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-medium">Successfully Delivered</p>
            <p className="text-lg font-bold text-emerald-900">{metrics.deliveredOrders} orders</p>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-red-800 font-medium">Cancelled Orders</p>
            <p className="text-lg font-bold text-red-900">{metrics.cancelledOrders} orders</p>
          </div>
        </div>
      </div>

      {/* Charts Section: Revenue over time & Low stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100">
            <div>
              <h2 className="font-serif text-base font-bold text-earth-900">
                Revenue Trajectory (Last 7 Days)
              </h2>
              <p className="text-xs text-earth-600">Daily gross customer purchases</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Real DB Data
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2">
            {salesChart.map((point: any, idx: number) => {
              const heightPercent = Math.max(8, Math.round((point.revenue / maxRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-earth-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(point.revenue)}
                  </span>
                  <div
                    className="w-full bg-cream-200 group-hover:bg-terracotta rounded-t-xl transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-earth-600 font-semibold truncate max-w-full">
                    {point.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100">
            <h2 className="font-serif text-base font-bold text-earth-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Alerts
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-earth-600 py-6 text-center">
                All catalog items have healthy stock levels.
              </p>
            ) : (
              data?.lowStockProducts?.map((prod: any) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.thumbnail}
                      alt={prod.name}
                      className="w-9 h-9 rounded-lg object-cover bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-earth-900 truncate">{prod.name}</p>
                      <p className="text-[10px] text-earth-600">{formatPrice(prod.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] shrink-0">
                    {prod.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-earth-100">
          <div>
            <h2 className="font-serif text-base font-bold text-earth-900">Recent Customer Orders</h2>
            <p className="text-xs text-earth-600">Real-time order dispatches</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-100">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {data?.recentOrders?.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="p-3 font-bold text-earth-900">{ord.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-semibold text-earth-900">{ord.customerName}</p>
                    <p className="text-[10px] text-earth-600">{ord.customerEmail}</p>
                  </td>
                  <td className="p-3 text-earth-600">{formatDate(ord.createdAt)}</td>
                  <td className="p-3 font-bold text-earth-900">{formatPrice(ord.total)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold ${
                        ord.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/orders/${ord.orderNumber || ord.id}`}
                      target="_blank"
                      className="text-terracotta hover:underline font-semibold"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

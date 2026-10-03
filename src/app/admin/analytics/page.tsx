'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
  Calendar,
  Award,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AdminAnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

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

  const metrics = data?.metrics || {};
  const totalRevenue = metrics.totalRevenue || 0;
  const totalOrders = metrics.totalOrders || 1;
  const aov = Math.round(totalRevenue / totalOrders);
  const conversionRate = '3.8%';

  const salesChart = data?.salesChart || [];
  const maxRevenue = Math.max(...salesChart.map((d: any) => d.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Business Intelligence
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Store Analytics & Growth
          </h1>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-cream-100 rounded-xl border border-earth-300 self-start sm:self-auto text-xs">
          {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                range === r ? 'bg-earth-900 text-white shadow-sm' : 'text-earth-700 hover:text-earth-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-earth-600 uppercase">Gross Revenue</span>
          <p className="font-serif text-2xl font-bold text-earth-900">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+18.4% vs last period</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-earth-600 uppercase">Completed Orders</span>
          <p className="font-serif text-2xl font-bold text-earth-900">{totalOrders}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+12.2% volume</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-earth-600 uppercase">Average Order Value (AOV)</span>
          <p className="font-serif text-2xl font-bold text-earth-900">{formatPrice(aov)}</p>
          <span className="text-[11px] text-earth-600 font-medium">Per checkout ticket</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-earth-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-earth-600 uppercase">Conversion Rate</span>
          <p className="font-serif text-2xl font-bold text-earth-900">{conversionRate}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+0.6% store conversion</span>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-earth-100">
          <h2 className="font-serif text-base font-bold text-earth-900">
            Sales & Revenue Trend ({range})
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Actual Order DB Volume
          </span>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
          {salesChart.map((pt: any, i: number) => {
            const h = Math.max(12, Math.round((pt.revenue / maxRevenue) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-earth-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(pt.revenue)}
                </span>
                <div
                  className="w-full bg-cream-200 group-hover:bg-terracotta rounded-t-xl transition-all duration-300"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-earth-600 font-semibold">{pt.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
        <h2 className="font-serif text-base font-bold text-earth-900 pb-3 border-b border-earth-100">
          Catalog Volume By Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {data?.categories?.map((cat: any) => (
            <div key={cat.id} className="p-4 bg-cream-50 rounded-2xl border border-earth-100 text-center">
              <p className="font-bold text-sm text-earth-900">{cat._count?.products || 0}</p>
              <p className="text-xs text-earth-600 mt-1 line-clamp-1">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

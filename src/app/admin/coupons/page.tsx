'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // New Coupon Form
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [minOrderValue, setMinOrderValue] = useState('499');
  const [maxDiscount, setMaxDiscount] = useState('300');
  const [usageLimit, setUsageLimit] = useState('500');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCoupons = () => {
    fetch('/api/coupons?all=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCoupons(data.coupons || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchCoupons();
  }, [token]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderValue: parseFloat(minOrderValue) || 0,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');

      setCode('');
      setDescription('');
      fetchCoupons();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-earth-200">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Promotion Engine
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
          Discount Coupons ({coupons.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coupons List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-earth-200 p-5 shadow-card space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-base font-bold text-earth-900 tracking-wider">
                      {c.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-earth-400 hover:text-red-600 p-1"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-earth-700 leading-snug">{c.description}</p>

                <div className="pt-2 border-t border-earth-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-earth-600">Discount: </span>
                    <strong className="text-earth-900">
                      {c.discountType === 'PERCENTAGE'
                        ? `${c.discountValue}% OFF`
                        : `Flat ₹${c.discountValue} OFF`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-earth-600">Min Order: </span>
                    <strong className="text-earth-900">₹{c.minOrderValue}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-earth-600 pt-1">
                  <span>Used: {c.usedCount} times</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Coupon Form (1 col) */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4 sticky top-28">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Create New Coupon
          </h2>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. DIWALI20"
                className="w-full p-2.5 border border-earth-300 rounded-xl uppercase font-mono font-bold focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-earth-700 mb-1">Type *</label>
                <select
                  value={discountType}
                  onChange={(e: any) => setDiscountType(e.target.value)}
                  className="w-full p-2.5 border border-earth-300 rounded-xl bg-white focus:border-terracotta"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-earth-700 mb-1">Value *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="15"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-earth-700 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="499"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-earth-700 mb-1">Max Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="300"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="15% off on festive decor above ₹499"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Coupon Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

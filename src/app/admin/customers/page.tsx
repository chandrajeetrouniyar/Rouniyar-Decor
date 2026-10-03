'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Mail, Phone, Calendar } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/admin/customers', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCustomers(data.customers || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-earth-200">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Customer Directory
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
          Registered Customers ({customers.length})
        </h1>
      </div>

      {/* Search */}
      <div className="p-4 bg-white rounded-2xl border border-earth-200">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
          />
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-earth-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-earth-600">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-earth-600">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-200">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Total Orders</th>
                  <th className="p-3.5">Total Spent</th>
                  <th className="p-3.5">Member Since</th>
                  <th className="p-3.5">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-earth-900 text-sm">{c.name}</p>
                      <span className="text-[10px] text-emerald-700 font-medium">Verified Account</span>
                    </td>
                    <td className="p-3.5 text-earth-600 space-y-0.5">
                      <p className="flex items-center gap-1.5 font-medium text-earth-800">
                        <Mail className="w-3.5 h-3.5 text-earth-400" /> {c.email}
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-earth-400" /> {c.phone}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-earth-900 bg-cream-100 px-2 py-0.5 rounded">
                        {c.ordersCount} orders
                      </span>
                    </td>
                    <td className="p-3.5 font-serif font-bold text-sm text-terracotta">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="p-3.5 text-earth-600">{formatDate(c.createdAt)}</td>
                    <td className="p-3.5 text-earth-600">
                      {c.lastOrderDate ? formatDate(c.lastOrderDate) : 'No orders yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

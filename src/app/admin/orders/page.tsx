'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingNumber }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Orders ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-earth-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer, or Email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
          />
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <label className="text-earth-600 font-medium">Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-white border border-earth-300 rounded-xl text-xs text-earth-900 focus:outline-none focus:border-terracotta"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-earth-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-earth-600">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-earth-600">No orders match criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-200">
                <tr>
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Customer & Address</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total & Payment</th>
                  <th className="p-3.5">Status Update</th>
                  <th className="p-3.5">Tracking Number</th>
                  <th className="p-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-earth-900">
                      <span>{ord.orderNumber}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-earth-900">{ord.customerName}</p>
                      <p className="text-[10px] text-earth-600 truncate">{ord.customerEmail}</p>
                      <p className="text-[10px] text-earth-600 truncate">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.pincode})
                      </p>
                    </td>
                    <td className="p-3.5 text-earth-600 whitespace-nowrap">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-earth-900">
                        {ord.items?.length || 0} items
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-serif font-bold text-sm text-earth-900">
                        {formatPrice(ord.total)}
                      </p>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`p-1.5 rounded-lg border text-xs font-bold focus:outline-none ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-cream-50 text-earth-900 border-earth-300'
                        }`}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <input
                        type="text"
                        defaultValue={ord.trackingNumber || ''}
                        onBlur={(e) => handleTrackingUpdate(ord.id, e.target.value)}
                        placeholder="e.g. BLUEDART99182"
                        className="p-1.5 border border-earth-300 rounded-lg text-xs font-mono w-32 focus:border-terracotta"
                      />
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/orders/${ord.orderNumber || ord.id}`}
                        target="_blank"
                        className="text-terracotta hover:underline font-bold"
                      >
                        Details →
                      </Link>
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

'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, Search, Check, Save } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AdminInventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInventory = () => {
    fetch('/api/admin/inventory', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(data.inventory || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  const handleStockDelta = async (productId: string, delta: number) => {
    setUpdatingId(productId);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, delta }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((it) => (it.id === productId ? { ...it, stock: data.product.stock } : it))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetStock = async (productId: string, newStock: number) => {
    setUpdatingId(productId);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, newStock }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((it) => (it.id === productId ? { ...it, stock: data.product.stock } : it))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.sku.toLowerCase().includes(search.toLowerCase());

    if (filter === 'low') return matchesSearch && it.stock <= it.lowStockThreshold && it.stock > 0;
    if (filter === 'out') return matchesSearch && it.stock <= 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Stock Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Inventory & Stock Control
          </h1>
        </div>
      </div>

      {/* Control bar */}
      <div className="p-4 bg-white rounded-2xl border border-earth-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or product title..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
          />
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'all' ? 'bg-earth-900 text-white' : 'bg-cream-100 text-earth-800'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'low' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
            }`}
          >
            Low Stock Alerts
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'out' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-900'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-earth-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-earth-600">Loading inventory data...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-earth-600">No inventory items match filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-200">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Alert Threshold</th>
                  <th className="p-3.5 text-right">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filteredItems.map((it) => {
                  const isLow = it.stock <= it.lowStockThreshold && it.stock > 0;
                  const isOut = it.stock <= 0;

                  return (
                    <tr key={it.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={it.thumbnail}
                          alt={it.name}
                          className="w-10 h-10 rounded-lg object-cover bg-cream-100 shrink-0 border border-earth-100"
                        />
                        <span className="font-bold text-earth-900 line-clamp-1 max-w-xs">{it.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-earth-800 font-semibold">{it.sku}</td>
                      <td className="p-3.5 text-earth-600">{it.category?.name}</td>
                      <td className="p-3.5 font-bold text-earth-900">{formatPrice(it.price)}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isOut
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'OUT OF STOCK' : `${it.stock} Units Available`}
                        </span>
                      </td>
                      <td className="p-3.5 text-earth-600">≤ {it.lowStockThreshold} units</td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5 border border-earth-300 rounded-xl p-0.5 bg-cream-50">
                          <button
                            onClick={() => handleStockDelta(it.id, -1)}
                            disabled={it.stock <= 0 || updatingId === it.id}
                            className="p-1 hover:text-terracotta disabled:opacity-30"
                            title="Decrease stock by 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            defaultValue={it.stock}
                            key={it.stock}
                            onBlur={(e) => handleSetStock(it.id, parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-bold bg-white rounded border border-earth-200 py-0.5"
                          />
                          <button
                            onClick={() => handleStockDelta(it.id, 1)}
                            disabled={updatingId === it.id}
                            className="p-1 hover:text-terracotta"
                            title="Increase stock by 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

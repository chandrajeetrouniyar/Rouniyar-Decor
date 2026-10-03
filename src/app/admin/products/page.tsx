'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  UploadCloud,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const fetchProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category?.slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-earth-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/import-csv"
            className="flex items-center gap-1.5 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-earth-900 rounded-xl text-xs font-semibold border border-earth-300 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-terracotta" /> Import CSV
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-earth-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
          />
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <label className="text-earth-600 font-medium">Category:</label>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="p-2 bg-white border border-earth-300 rounded-xl text-xs text-earth-900 focus:outline-none focus:border-terracotta"
          >
            <option value="all">All Categories</option>
            <option value="toran-bandarwal">Toran & Bandarwal</option>
            <option value="door-hangings">Door Hangings</option>
            <option value="pooja-decor-thali-posh">Pooja Decor & Thali Posh</option>
            <option value="wall-decor">Wall Decor</option>
            <option value="festive-decor">Festive Decor</option>
            <option value="handmade-handicrafts">Handmade Handicrafts</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-earth-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-earth-600">Loading catalog items...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-earth-600">No products found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-200">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Selling Price</th>
                  <th className="p-3.5">MRP</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={prod.thumbnail}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-cream-100 shrink-0 border border-earth-100"
                      />
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="font-bold text-earth-900 hover:text-terracotta line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <p className="text-[10px] text-earth-600 truncate">
                          {prod.colors && Array.isArray(prod.colors) ? prod.colors.join(', ') : ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] font-semibold text-earth-800">
                      {prod.sku}
                    </td>
                    <td className="p-3.5 text-earth-700 font-medium">
                      {prod.category?.name || 'Unassigned'}
                    </td>
                    <td className="p-3.5 font-bold text-earth-900">{formatPrice(prod.price)}</td>
                    <td className="p-3.5 text-earth-600 line-through">{formatPrice(prod.mrp)}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.stock <= prod.lowStockThreshold
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-cream-100 text-earth-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="p-1 text-earth-600 hover:text-earth-900"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod.slug)}
                          className="p-1 text-earth-400 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

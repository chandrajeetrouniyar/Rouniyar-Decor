'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80'
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCats = () => {
    fetch('/api/categories?all=true')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setName('');
      setDescription('');
      fetchCats();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-earth-200">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Taxonomy Structure
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
          Categories ({categories.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Categories List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-earth-200 p-4 shadow-card flex gap-4 items-center group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-cream-100 shrink-0 border border-earth-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm text-earth-900 truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-earth-600 line-clamp-1 mt-0.5">
                    {cat.description || 'No description provided'}
                  </p>
                  <p className="text-[11px] font-semibold text-terracotta mt-1">
                    {cat._count?.products || 0} Products active
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-earth-400 hover:text-red-600 p-1 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Category Form (1 col) */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4 sticky top-28">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Create Category
          </h2>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Festive Specials"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Image URL *</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Auspicious decor and handcrafted hangings..."
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

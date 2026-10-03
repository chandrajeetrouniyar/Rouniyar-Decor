'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('15');
  const [lowStockThreshold, setLowStockThreshold] = useState('3');
  const [imageUrls, setImageUrls] = useState(
    'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80\nhttps://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
  );
  const [colors, setColors] = useState('White & Earth Brown, Maroon & Gold');
  const [material, setMaterial] = useState('100% Premium Soft Wool Yarn & Wooden Beads');
  const [dimensions, setDimensions] = useState('38 x 8.5 Inches (Standard Door Size)');
  const [weight, setWeight] = useState('260 Grams');
  const [careInstructions, setCareInstructions] = useState(
    'Gentle hand wash in cold water with mild liquid detergent. Dry flat in shade.'
  );
  const [tags, setTags] = useState('Toran, Handmade, Woolen, Door Hanging, Festive');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories[0]) setCategoryId(data.categories[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const parsedImages = imageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    const parsedColors = colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload = {
        name,
        sku,
        categoryId,
        price: parseFloat(price),
        mrp: parseFloat(mrp),
        stock: parseInt(stock),
        lowStockThreshold: parseInt(lowStockThreshold),
        images: parsedImages,
        thumbnail: parsedImages[0] || '',
        colors: parsedColors,
        material,
        dimensions,
        weight,
        careInstructions,
        tags: parsedTags,
        shortDescription,
        description,
        featured,
        bestSeller,
        newArrival,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-earth-200">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-earth-600 hover:text-terracotta mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="font-serif text-2xl font-bold text-earth-900">Add New Creation</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-earth-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!sku) {
                    setSku(`RD-${Math.floor(100 + Math.random() * 900)}`);
                  }
                }}
                placeholder="e.g. Handmade Crochet Door Toran with Brown Pom Pom Gonda"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">SKU (Stock Keeping Unit) *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. RD-TOR-101"
                className="w-full p-2.5 border border-earth-300 rounded-xl font-mono focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl bg-white focus:border-terracotta focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="499"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">MRP (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="899"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Current Stock *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="15"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Low Stock Alert at</label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                placeholder="3"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Attributes Card */}
        <div className="p-6 bg-white rounded-3xl border border-earth-200 shadow-card space-y-4">
          <h2 className="font-serif text-base font-bold text-earth-900 pb-2 border-b border-earth-100">
            Product Images & Specifications
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-earth-700 mb-1">
                Image URLs (one URL per line) *
              </label>
              <textarea
                rows={3}
                required
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl font-mono text-[11px] focus:border-terracotta focus:outline-none"
              />
              <p className="text-[10px] text-earth-600 mt-1">The first URL will be used as the primary thumbnail.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-earth-700 mb-1">Available Colors (comma separated)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="White & Brown, Maroon & Gold"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-earth-700 mb-1">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Wool Yarn, Wooden Beads, Brass Bells"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-earth-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 38 x 8.5 Inches"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold text-earth-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 260 Grams"
                  className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Tags (comma separated for search)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Toran, Bandarwal, Handmade, Diwali, Pooja"
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Care Instructions</label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Short Summary (1-2 sentences)</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Handcrafted crochet door toran with soft pom-pom gondas."
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block font-bold text-earth-700 mb-1">Detailed Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the artisan technique, materials, styling ideas and auspicious value..."
                className="w-full p-2.5 border border-earth-300 rounded-xl focus:border-terracotta"
              />
            </div>

            {/* Badges / Visibility toggles */}
            <div className="pt-2 border-t border-earth-100 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-earth-800">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="accent-terracotta"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-earth-800">
                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="accent-terracotta"
                />
                <span>Best Seller Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-earth-800">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="accent-terracotta"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-earth-300 text-earth-800 rounded-xl text-xs font-semibold hover:bg-cream-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Save & Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

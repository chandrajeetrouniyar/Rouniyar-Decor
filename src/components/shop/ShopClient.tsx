'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, X, ChevronDown, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/utils';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
  categoryName?: string;
  categoryDescription?: string;
}

export default function ShopClient({
  initialProducts,
  categories,
  initialCategorySlug,
  categoryName,
  categoryDescription,
}: ShopClientProps) {
  const router = useRouter();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Colors available across products
  const availableColors = ['White', 'Red', 'Yellow', 'Green', 'Maroon', 'Gold', 'Brown', 'Blue'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Price filter
        if (selectedPrice === 'under-400' && p.price >= 400) return false;
        if (selectedPrice === '400-600' && (p.price < 400 || p.price > 600)) return false;
        if (selectedPrice === '600-900' && (p.price < 600 || p.price > 900)) return false;
        if (selectedPrice === 'above-900' && p.price <= 900) return false;

        // In Stock
        if (inStockOnly && p.stock <= 0) return false;

        // Rating
        if (minRating > 0 && p.rating < minRating) return false;

        // Discount
        if (minDiscount > 0 && p.discount < minDiscount) return false;

        // Color
        if (selectedColor !== 'all') {
          const colors = Array.isArray(p.colors)
            ? p.colors
            : typeof p.colors === 'string'
            ? JSON.parse(p.colors || '[]')
            : [];
          const matchesColor = colors.some((c: string) =>
            c.toLowerCase().includes(selectedColor.toLowerCase())
          );
          if (!matchesColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'best-seller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    initialProducts,
    selectedCategory,
    selectedPrice,
    selectedColor,
    inStockOnly,
    minRating,
    minDiscount,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory(initialCategorySlug || 'all');
    setSelectedPrice('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setMinRating(0);
    setMinDiscount(0);
    setSortBy('featured');
  };

  const hasActiveFilters =
    (selectedCategory !== 'all' && selectedCategory !== initialCategorySlug) ||
    selectedPrice !== 'all' ||
    selectedColor !== 'all' ||
    inStockOnly ||
    minRating > 0 ||
    minDiscount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Banner or Shop Title */}
      <div className="mb-8 pb-6 border-b border-earth-100">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Handcrafted Indian Home Decor
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900 mt-1">
          {categoryName || 'All Handcrafted Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-earth-600 mt-2 max-w-2xl">
          {categoryDescription ||
            'Explore our authentic collection of woolen door torans, crochet thali poshs, auspicious brass latkans, and festive decorations.'}
        </p>
      </div>

      {/* Control Bar: Filter toggle & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-cream-100 hover:bg-cream-200 border border-earth-200 rounded-lg text-xs font-semibold text-earth-900"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
            Filters {hasActiveFilters && '• Active'}
          </button>

          <span className="text-xs text-earth-600">
            Showing <strong className="text-earth-900 font-semibold">{filteredProducts.length}</strong> items
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-terracotta hover:underline ml-2 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sortSelect" className="text-xs text-earth-600 font-medium">
            Sort by:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs px-3 py-1.5 bg-white border border-earth-200 rounded-lg text-earth-900 font-medium focus:outline-none focus:border-terracotta"
          >
            <option value="featured">Featured First</option>
            <option value="best-seller">Best Selling</option>
            <option value="newest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-earth-100 shadow-card sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100">
            <h3 className="font-serif font-bold text-base text-earth-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-terracotta" /> Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2.5">
              Category
            </h4>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer hover:text-terracotta">
                <input
                  type="radio"
                  name="catFilter"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                  className="accent-terracotta"
                />
                <span className={selectedCategory === 'all' ? 'font-semibold text-terracotta' : 'text-earth-700'}>
                  All Collections
                </span>
              </label>
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-terracotta"
                >
                  <input
                    type="radio"
                    name="catFilter"
                    checked={selectedCategory === c.slug}
                    onChange={() => setSelectedCategory(c.slug)}
                    className="accent-terracotta"
                  />
                  <span className={selectedCategory === c.slug ? 'font-semibold text-terracotta' : 'text-earth-700'}>
                    {c.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-earth-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2.5">
              Price Range
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Prices', val: 'all' },
                { label: 'Under ₹400', val: 'under-400' },
                { label: '₹400 - ₹600', val: '400-600' },
                { label: '₹600 - ₹900', val: '600-900' },
                { label: 'Above ₹900', val: 'above-900' },
              ].map((p) => (
                <label key={p.val} className="flex items-center gap-2 cursor-pointer hover:text-terracotta">
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={selectedPrice === p.val}
                    onChange={() => setSelectedPrice(p.val)}
                    className="accent-terracotta"
                  />
                  <span className={selectedPrice === p.val ? 'font-semibold text-terracotta' : 'text-earth-700'}>
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="pt-4 border-t border-earth-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2.5">
              Primary Color
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedColor === 'all'
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-cream-50 text-earth-700 border-earth-200 hover:border-earth-400'
                }`}
              >
                All
              </button>
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedColor === color
                      ? 'bg-terracotta text-white border-terracotta'
                      : 'bg-cream-50 text-earth-700 border-earth-200 hover:border-earth-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-earth-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-earth-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-terracotta rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Discount Filter */}
          <div className="pt-4 border-t border-earth-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2.5">
              Discount
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Discounts', val: 0 },
                { label: '30% or more', val: 30 },
                { label: '40% or more', val: 40 },
              ].map((d) => (
                <label key={d.val} className="flex items-center gap-2 cursor-pointer hover:text-terracotta">
                  <input
                    type="radio"
                    name="discountFilter"
                    checked={minDiscount === d.val}
                    onChange={() => setMinDiscount(d.val)}
                    className="accent-terracotta"
                  />
                  <span className={minDiscount === d.val ? 'font-semibold text-terracotta' : 'text-earth-700'}>
                    {d.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-earth-100">
                <h3 className="font-serif font-bold text-lg text-earth-900">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded text-earth-700 hover:bg-earth-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category radio */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2">
                  Category
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mCat"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="accent-terracotta"
                    />
                    <span>All Collections</span>
                  </label>
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mCat"
                        checked={selectedCategory === c.slug}
                        onChange={() => setSelectedCategory(c.slug)}
                        className="accent-terracotta"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-4 border-t border-earth-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 mb-2">
                  Price
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'All Prices', val: 'all' },
                    { label: 'Under ₹400', val: 'under-400' },
                    { label: '₹400 - ₹600', val: '400-600' },
                    { label: '₹600 - ₹900', val: '600-900' },
                    { label: 'Above ₹900', val: 'above-900' },
                  ].map((p) => (
                    <label key={p.val} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mPrice"
                        checked={selectedPrice === p.val}
                        onChange={() => setSelectedPrice(p.val)}
                        className="accent-terracotta"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-earth-100 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 bg-cream-100 text-earth-800 rounded-xl text-xs font-semibold hover:bg-cream-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-terracotta text-white rounded-xl text-xs font-semibold hover:bg-terracotta-hover"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-earth-100 p-8 space-y-4">
              <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-earth-500">
                <Filter className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-xl font-bold text-earth-900">
                No matching creations found
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 max-w-md mx-auto">
                We couldn't find any products matching your selected filters. Try changing or clearing your filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-full text-xs font-semibold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

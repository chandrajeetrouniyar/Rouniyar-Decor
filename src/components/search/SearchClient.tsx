'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface SearchClientProps {
  initialQuery: string;
  allProducts: Product[];
  categories: Category[];
}

export default function SearchClient({
  initialQuery,
  allProducts,
  categories,
}: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);

  const popularSearches = ['Toran', 'Thali Posh', 'Brass Bell', 'Marigold', 'Ganesh', 'Shubh Labh', 'Mandala'];

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allProducts;

    return allProducts.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCat = p.category?.name.toLowerCase().includes(q);
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const matchTag = tags.some((t: string) => t.toLowerCase().includes(q));

      return matchName || matchDesc || matchSku || matchCat || matchTag;
    });
  }, [allProducts, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header & Input */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Search Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
          Find Your Perfect Handmade Piece
        </h1>

        {/* Search Input Bar */}
        <div className="relative pt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, category, SKU, or tags..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-earth-300 rounded-2xl shadow-soft text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-earth-900"
            autoFocus
          />
          <Search className="w-5 h-5 text-earth-600 absolute left-4 top-5 pointer-events-none" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-5 text-earth-400 hover:text-earth-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-earth-600 font-medium">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-cream-50 text-earth-700 border-earth-200 hover:bg-cream-100'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-earth-100 mb-6 text-xs text-earth-600">
          <span>
            Showing <strong className="text-earth-900 font-bold">{results.length}</strong> creations
            {query && (
              <>
                {' '}
                for "<strong className="text-terracotta">{query}</strong>"
              </>
            )}
          </span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-terracotta font-semibold hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-earth-100 p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-earth-600">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif text-xl font-bold text-earth-900">
              No creations found for "{query}"
            </h3>
            <p className="text-xs text-earth-600">
              Try searching with more general terms like "toran", "brass", "thali", or browse our categories below.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop/${c.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-cream-50 hover:bg-cream-100 text-xs font-medium text-earth-800 border border-earth-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

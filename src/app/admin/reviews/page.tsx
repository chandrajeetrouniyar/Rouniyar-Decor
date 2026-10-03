'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Check, X, Trash2, Eye, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types';

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch('/api/reviews?all=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchReviews();
  }, [token]);

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved: !currentApproved }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, approved: !currentApproved } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-earth-200">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Customer Sentiment
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
          Review Moderation ({reviews.length})
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-earth-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-earth-600">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-earth-600">No customer reviews yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-earth-700 font-bold uppercase tracking-wider text-[10px] border-b border-earth-200">
                <tr>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Reviewer</th>
                  <th className="p-3.5">Feedback</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-gold-accent font-bold">
                        <span>★ {rev.rating}</span>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      {rev.product ? (
                        <Link
                          href={`/product/${rev.product.slug}`}
                          target="_blank"
                          className="font-bold text-earth-900 hover:text-terracotta line-clamp-1 flex items-center gap-1"
                        >
                          {rev.product.name} <ExternalLink className="w-3 h-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-earth-600">Store Review</span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-earth-900">{rev.customerName}</td>
                    <td className="p-3.5 max-w-sm">
                      {rev.title && <p className="font-bold text-earth-900 mb-0.5">{rev.title}</p>}
                      <p className="text-earth-700 italic line-clamp-2">"{rev.comment}"</p>
                    </td>
                    <td className="p-3.5 text-earth-600 whitespace-nowrap">
                      {formatDate(rev.createdAt)}
                    </td>
                    <td className="p-3.5">
                      {rev.approved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Visible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleToggleApprove(rev.id, rev.approved)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            rev.approved
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {rev.approved ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1 text-earth-400 hover:text-red-600"
                          title="Delete review"
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

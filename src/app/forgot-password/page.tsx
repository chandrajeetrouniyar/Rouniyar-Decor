'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-earth-100 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Account Recovery
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Reset Password
          </h1>
          <p className="text-xs text-earth-600">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-sm text-emerald-900">Reset Link Dispatched</h3>
            <p className="text-xs text-emerald-800">
              We have sent password recovery instructions to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs font-bold text-terracotta hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-earth-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
                <Mail className="w-4 h-4 text-earth-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-700 hover:text-terracotta"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

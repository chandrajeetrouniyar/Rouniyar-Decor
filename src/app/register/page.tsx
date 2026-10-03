'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMsg(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-earth-100 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Join Rouniyar Decor
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Create Customer Account
          </h1>
          <p className="text-xs text-earth-600">
            Track your handcrafted decor orders and receive member discounts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-earth-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shalini Roy"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
              />
              <User className="w-4 h-4 text-earth-400 absolute left-3 top-3" />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-earth-700 mb-1">Mobile Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
              />
              <Phone className="w-4 h-4 text-earth-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-earth-700 mb-1">Create Password (Min 6 chars)</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
              />
              <Lock className="w-4 h-4 text-earth-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-earth-600 border-t border-earth-100">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-terracotta hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

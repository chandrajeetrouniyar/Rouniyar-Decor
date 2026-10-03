'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setErrorMsg(res.error || 'Invalid email or password');
    }
  };

  const handleDemoCustomer = () => {
    setEmail('ananya@example.com');
    setPassword('customer123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-earth-100 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Welcome Back
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-earth-600">
            Access your orders, saved addresses, and wishlist.
          </p>
        </div>

        {/* Demo Login Button */}
        <div className="p-3 bg-cream-100 rounded-2xl border border-earth-200 text-center space-y-1.5">
          <p className="text-xs text-earth-800 font-medium">Demo Customer Account:</p>
          <button
            type="button"
            onClick={handleDemoCustomer}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto-fill Demo Login (ananya@example.com)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

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

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-earth-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-terracotta hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
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
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-earth-600 space-y-2 border-t border-earth-100">
          <p>
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-terracotta hover:underline">
              Create an Account
            </Link>
          </p>
          <p>
            Are you a team member?{' '}
            <Link href="/admin/login" className="font-semibold text-earth-800 hover:underline">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

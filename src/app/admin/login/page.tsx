'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
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
      if (res.user?.role !== 'ADMIN') {
        setErrorMsg('Access denied. This account does not possess administrator privileges.');
        return;
      }
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Invalid administrator credentials');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@rouniyardecor.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-earth-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-earth-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-earth-900 text-gold-accent rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Staff Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900">
            Admin Management
          </h1>
          <p className="text-xs text-earth-600">
            Secure administrative control for Rouniyar Decor operations.
          </p>
        </div>

        {/* Demo Admin Auto-fill Button */}
        <div className="p-3.5 bg-cream-50 rounded-2xl border border-earth-200 text-center space-y-1.5">
          <p className="text-xs font-semibold text-earth-800">Development Admin Credentials:</p>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto-fill Admin (admin@rouniyardecor.com)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-earth-700 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rouniyardecor.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
              />
              <Mail className="w-4 h-4 text-earth-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-earth-700 mb-1">Admin Password</label>
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
            className="w-full py-3 bg-earth-900 hover:bg-terracotta text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-earth-100">
          <Link href="/" className="text-xs text-earth-600 hover:text-earth-900 font-semibold">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

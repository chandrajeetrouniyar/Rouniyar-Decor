'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Address form
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [addresses, setAddresses] = useState<any[]>(user?.addresses || []);
  const [savedMsg, setSavedMsg] = useState(false);

  // Password change
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-earth-900">Sign in to View Account</h2>
        <p className="text-xs text-earth-600">Please sign in to view your orders, addresses, and account details.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-terracotta text-white rounded-full text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (house && street && city && pincode) {
      const newAddr = {
        id: Date.now().toString(),
        houseFlat: house,
        street,
        city,
        pincode,
        state: 'Delhi',
      };
      setAddresses([...addresses, newAddr]);
      setSavedMsg(true);
      setHouse('');
      setStreet('');
      setCity('');
      setPincode('');
      setTimeout(() => setSavedMsg(false), 2000);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMsg('New password must be at least 6 characters long.');
      return;
    }
    setPassMsg('Password updated successfully! ✓');
    setCurrPass('');
    setNewPass('');
    setTimeout(() => setPassMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-earth-600 mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="flex items-center gap-2 px-4 py-2 bg-earth-900 text-white rounded-xl text-xs font-semibold hover:bg-earth-800 transition-colors shadow-sm"
          >
            <Package className="w-4 h-4" /> My Orders
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-earth-300 text-earth-800 rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="bg-white rounded-3xl border border-earth-100 shadow-card p-4 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-terracotta text-white'
                : 'text-earth-800 hover:bg-cream-100'
            }`}
          >
            <User className="w-4 h-4" /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'addresses'
                ? 'bg-terracotta text-white'
                : 'text-earth-800 hover:bg-cream-100'
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'security'
                ? 'bg-terracotta text-white'
                : 'text-earth-800 hover:bg-cream-100'
            }`}
          >
            <Lock className="w-4 h-4" /> Password & Security
          </button>
          <Link
            href="/orders"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left text-earth-800 hover:bg-cream-100"
          >
            <Package className="w-4 h-4" /> Order History
          </Link>
          <Link
            href="/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-left text-earth-800 hover:bg-cream-100"
          >
            <Heart className="w-4 h-4" /> My Wishlist
          </Link>

          {user.role === 'ADMIN' && (
            <div className="pt-2 border-t border-earth-100">
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left bg-terracotta/10 text-terracotta hover:bg-terracotta/20"
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </Link>
            </div>
          )}
        </aside>

        {/* Main Tab Content */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-earth-100 shadow-card p-6 sm:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-earth-900 pb-3 border-b border-earth-100">
                Personal Profile Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-cream-50 rounded-2xl border border-earth-100 space-y-1">
                  <span className="text-earth-600 font-medium">Full Name</span>
                  <p className="font-bold text-sm text-earth-900">{user.name}</p>
                </div>
                <div className="p-4 bg-cream-50 rounded-2xl border border-earth-100 space-y-1">
                  <span className="text-earth-600 font-medium">Registered Email</span>
                  <p className="font-bold text-sm text-earth-900">{user.email}</p>
                </div>
                <div className="p-4 bg-cream-50 rounded-2xl border border-earth-100 space-y-1">
                  <span className="text-earth-600 font-medium">Phone Number</span>
                  <p className="font-bold text-sm text-earth-900">{user.phone || 'Not provided'}</p>
                </div>
                <div className="p-4 bg-cream-50 rounded-2xl border border-earth-100 space-y-1">
                  <span className="text-earth-600 font-medium">Account Role</span>
                  <p className="font-bold text-sm text-terracotta">{user.role}</p>
                </div>
              </div>

              {/* Quick Order Shortcut */}
              <div className="p-5 bg-cream-100 rounded-2xl border border-earth-200/80 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-earth-900 text-sm">Need to track a package?</h3>
                  <p className="text-xs text-earth-600 mt-0.5">Check order status, tracking IDs, and delivery estimates.</p>
                </div>
                <Link
                  href="/orders"
                  className="px-4 py-2 bg-earth-900 text-white rounded-xl text-xs font-semibold hover:bg-terracotta transition-colors"
                >
                  View Orders
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-earth-900 pb-3 border-b border-earth-100">
                Manage Delivery Addresses
              </h2>

              {/* Saved Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-cream-50 rounded-2xl border border-earth-200 text-xs space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Primary Default
                  </span>
                  <p className="font-bold text-sm text-earth-900 mt-1">{user.name}</p>
                  <p>Flat 402, Lotus Towers, Koramangala 4th Block</p>
                  <p>Bengaluru, Karnataka - 560034</p>
                  <p className="text-earth-600 pt-1">Mobile: +91 98111 22334</p>
                </div>

                {addresses.map((a) => (
                  <div key={a.id} className="p-4 bg-white rounded-2xl border border-earth-200 text-xs space-y-1">
                    <p className="font-bold text-sm text-earth-900">{user.name}</p>
                    <p>{a.houseFlat}, {a.street}</p>
                    <p>{a.city} - {a.pincode}</p>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              <div className="pt-4 border-t border-earth-100">
                <h3 className="font-serif text-sm font-bold text-earth-900 mb-3">Add New Address</h3>
                {savedMsg && (
                  <p className="text-xs text-emerald-700 font-semibold mb-2">Address saved! ✓</p>
                )}
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Building *"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street / Road *"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-xl font-semibold transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <h2 className="font-serif text-lg font-bold text-earth-900 pb-3 border-b border-earth-100">
                Change Password
              </h2>
              {passMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                  {passMsg}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-earth-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-bold text-earth-700 mb-1">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-earth-200 rounded-xl focus:border-terracotta"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

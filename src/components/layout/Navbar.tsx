'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Shield,
  Package,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/shop' },
    { label: 'Toran & Bandarwal', href: '/shop/toran-bandarwal' },
    { label: 'Door Hangings', href: '/shop/door-hangings' },
    { label: 'Pooja Decor', href: '/shop/pooja-decor-thali-posh' },
    { label: 'Wall Decor', href: '/shop/wall-decor' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-soft py-2.5'
          : 'bg-[#FDFBF7] border-b border-earth-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-earth-800 hover:text-terracotta transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-center lg:items-start group">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-earth-900 font-bold group-hover:text-terracotta transition-colors">
                ROUNIYAR
              </span>
              <span className="font-serif text-xl sm:text-2xl tracking-widest text-terracotta font-medium">
                DECOR
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-earth-600 font-medium">
              Handcrafted Details for Beautiful Homes
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.slice(0, 6).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium transition-colors hover:text-terracotta relative py-1 ${
                    isActive ? 'text-terracotta font-semibold' : 'text-earth-800'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search torans, thali posh..."
                className="pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-cream-50 border border-earth-200 rounded-full focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta w-44 lg:w-56 text-earth-900 placeholder:text-earth-600 transition-all"
              />
              <Search className="w-4 h-4 text-earth-600 absolute left-3 pointer-events-none" />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-earth-800 hover:text-terracotta transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-earth-800 hover:text-terracotta transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2 text-earth-800 hover:text-terracotta transition-colors flex items-center gap-1"
                aria-label="User Account"
              >
                <UserIcon className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 hidden sm:block opacity-70" />
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-earth-100 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-earth-100">
                        <p className="text-xs text-earth-600 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-earth-900 truncate">{user.name}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded bg-cream-100 text-terracotta uppercase">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-earth-800 hover:bg-cream-50 hover:text-terracotta transition-colors"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-earth-800 hover:bg-cream-50 hover:text-terracotta transition-colors"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-terracotta bg-terracotta/10 hover:bg-terracotta/20 transition-colors"
                        >
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-earth-100 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-earth-100">
                        <p className="text-xs text-earth-600 font-medium">Welcome to Rouniyar Decor</p>
                        <p className="text-xs text-earth-800 mt-0.5">Sign in to track orders & save wishlist</p>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-earth-900 hover:bg-cream-50 hover:text-terracotta transition-colors"
                      >
                        Customer Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-earth-700 hover:bg-cream-50 transition-colors"
                      >
                        Create New Account
                      </Link>
                      <div className="border-t border-earth-100 my-1" />
                      <Link
                        href="/admin/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-earth-600 hover:text-terracotta hover:bg-cream-50"
                      >
                        <Shield className="w-3.5 h-3.5 text-terracotta" /> Admin Login Portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-earth-900 text-cream-50 hover:bg-terracotta transition-all shadow-sm group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-earth-900">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search torans, thali posh, hangings..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-cream-50 border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta"
                autoFocus
              />
              <Search className="w-4 h-4 text-earth-600 absolute left-3.5 top-3" />
            </div>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 border-t border-earth-100 pt-3 pb-4 space-y-2 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-terracotta text-white'
                    : 'text-earth-900 hover:bg-cream-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-earth-200/60 flex items-center justify-between px-3 text-xs text-earth-600">
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Brand</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Support</Link>
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-terracotta font-medium">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Boxes,
  BarChart3,
  Settings,
  UploadCloud,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on admin login page, render children without admin layout wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/admin/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center text-cream-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs tracking-wider text-earth-300">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Import CSV', href: '/admin/import-csv', icon: UploadCloud },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col lg:flex-row text-earth-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-earth-950 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold-accent" />
          <span className="font-serif font-bold tracking-wider">ROUNIYAR ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded text-earth-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-earth-950 text-cream-100 p-5 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="pb-4 border-b border-earth-800">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-base tracking-wider text-white block">
                  ROUNIYAR
                </span>
                <span className="text-[10px] text-gold-accent uppercase tracking-widest block font-medium">
                  Admin Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-earth-300 hover:bg-earth-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-earth-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-earth-300 hover:text-gold-accent rounded-xl hover:bg-earth-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 rounded-xl hover:bg-earth-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for desktop */}
        <header className="hidden lg:flex bg-white border-b border-earth-200/80 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-earth-600">
            <span className="font-semibold text-earth-900">Rouniyar Decor Operations</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Database Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-earth-700 hover:text-terracotta flex items-center gap-1 font-semibold"
            >
              Open Live Store <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-earth-200">
              <span className="font-bold text-earth-900">{user.name}</span>
              <span className="px-2 py-0.5 rounded bg-terracotta text-white font-bold text-[10px]">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

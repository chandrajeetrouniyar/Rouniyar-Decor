'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function CheckoutClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, couponDiscount, shippingFee, total, appliedCoupon, clearCart } = useCart();

  // Step 1: Contact
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerMobile, setCustomerMobile] = useState(user?.phone || '');

  // Step 2: Shipping Address
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Step 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('Standard Delivery (3-5 Days)');

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card' | 'COD'>('Razorpay');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerMobile) setCustomerMobile(user.phone);
    }
  }, [user]);

  // If cart is empty, redirect to /cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Demo auto-fill helper for frictionless testing
  const handleAutoFillDemo = () => {
    setCustomerName('Ananya Sharma');
    setCustomerEmail('ananya@example.com');
    setCustomerMobile('9811122334');
    setHouseFlat('Flat 402, Lotus Towers');
    setStreet('Koramangala 4th Block');
    setArea('Near Sony World Junction');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('560034');
    setLandmark('Opposite Cafe Coffee Day');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form validation
    if (!customerName || !customerEmail || !customerMobile || !houseFlat || !street || !city || !pincode) {
      setErrorMsg('Please complete all required fields (Name, Email, Mobile, Address, City, Pincode).');
      return;
    }

    if (pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerMobile,
        shippingAddress: {
          name: customerName,
          mobile: customerMobile,
          houseFlat,
          street,
          area,
          city,
          state,
          pincode,
          landmark,
        },
        deliveryMethod,
        paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod,
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          name: it.product.name,
          price: it.variant?.price || it.product.price,
          quantity: it.quantity,
          image: it.image || it.product.thumbnail,
          color: it.selectedColor,
          size: it.selectedSize,
        })),
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const createdOrder = data.order;

      // Handle Razorpay test / live modal if Razorpay selected
      if (paymentMethod === 'Razorpay' || paymentMethod === 'UPI' || paymentMethod === 'Card') {
        const payRes = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            receipt: createdOrder.orderNumber,
          }),
        });

        const payData = await payRes.json();

        // In test mode, verify payment immediately
        await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id,
            razorpayOrderId: payData.orderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: 'simulated_test_signature',
          }),
        });
      }

      clearCart();
      router.push(`/order-success?orderId=${createdOrder.orderNumber || createdOrder.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error processing order. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-earth-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Safe & Secure Checkout
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-900 mt-1">
            Complete Your Order
          </h1>
        </div>

        {/* Demo Auto-fill Helper */}
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-earth-200 text-xs font-semibold text-terracotta transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-fill Sample Address
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Multi-step details */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: Customer Contact Info */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-earth-100">
              <span className="w-6 h-6 rounded-full bg-earth-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-earth-900">
                Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Shalini Roy"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. shalini@example.com"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Mobile Number (for delivery updates) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-cream-100 border border-r-0 border-earth-300 rounded-l-xl text-xs text-earth-700 font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-xs border border-earth-300 rounded-r-xl focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Shipping Address */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-earth-100">
              <span className="w-6 h-6 rounded-full bg-earth-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-earth-900">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  House / Flat / Building <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={houseFlat}
                  onChange={(e) => setHouseFlat(e.target.value)}
                  placeholder="e.g. Flat 301, Krishna Apartments"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Street / Road <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 1st Main, Indiranagar"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Near Metro Station"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560038"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-earth-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opp. Apollo Pharmacy"
                  className="w-full px-3 py-2 text-xs border border-earth-300 rounded-xl focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: Delivery Method */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-earth-100">
              <span className="w-6 h-6 rounded-full bg-earth-900 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-earth-900">
                Delivery Speed
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod.includes('Standard')
                    ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                    : 'border-earth-200 hover:border-earth-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod.includes('Standard')}
                    onChange={() => setDeliveryMethod('Standard Delivery (3-5 Days)')}
                    className="accent-terracotta"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-earth-900">
                      Standard Pan-India Delivery
                    </p>
                    <p className="text-[11px] text-earth-600">Arrives in 3 to 5 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod.includes('Express')
                    ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                    : 'border-earth-200 hover:border-earth-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod.includes('Express')}
                    onChange={() => setDeliveryMethod('Express Courier (2-3 Days)')}
                    className="accent-terracotta"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-earth-900">
                      Express Courier Delivery
                    </p>
                    <p className="text-[11px] text-earth-600">Priority dispatch within 48-72 hours</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-earth-900">₹99</span>
              </label>
            </div>
          </div>

          {/* STEP 4: Payment Options */}
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-earth-100">
              <span className="w-6 h-6 rounded-full bg-earth-900 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-earth-900">
                Payment Option
              </h2>
            </div>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                    : 'border-earth-200 hover:border-earth-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-terracotta"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-earth-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-terracotta" />
                      Razorpay Secure (UPI, Cards, NetBanking, Wallets)
                    </p>
                    <p className="text-[11px] text-earth-600">
                      Pay via Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Recommended
                </span>
              </label>

              {/* UPI Direct */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                    : 'border-earth-200 hover:border-earth-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-terracotta"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-earth-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-terracotta" />
                      Instant UPI QR / ID
                    </p>
                    <p className="text-[11px] text-earth-600">Scan & Pay via any UPI app</p>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                    : 'border-earth-200 hover:border-earth-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-terracotta"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-earth-900 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-terracotta" />
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-[11px] text-earth-600">
                      Pay with cash when your package arrives at your doorstep
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-6 sticky top-28">
          <div className="p-6 bg-white rounded-3xl border border-earth-100 shadow-card space-y-4">
            <h3 className="font-serif text-base sm:text-lg font-bold text-earth-900 pb-3 border-b border-earth-100">
              Order Summary ({items.length} items)
            </h3>

            {/* Compact items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={it.image || it.product.thumbnail}
                    alt={it.product.name}
                    className="w-12 h-12 object-cover rounded-lg bg-cream-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-earth-900 truncate">{it.product.name}</p>
                    <p className="text-[11px] text-earth-600">
                      Qty: {it.quantity} {it.selectedColor && `• ${it.selectedColor}`}
                    </p>
                  </div>
                  <span className="font-bold text-earth-900">
                    {formatPrice((it.variant?.price || it.product.price) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-earth-100 space-y-2 text-xs text-earth-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-earth-900">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-earth-200 flex justify-between text-base font-bold text-earth-900">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-terracotta">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl font-semibold text-sm transition-all shadow-premium flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> PLACE ORDER NOW ({formatPrice(total)})
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-earth-600 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Guaranteed Safe & Secure Checkout
              </p>
              <p>We protect your personal and payment information.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Check,
  MapPin,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
  initialReviews: Review[];
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
  initialReviews,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  // Parse images and colors safely
  const images: string[] = Array.isArray(product.images)
    ? product.images
    : typeof product.images === 'string'
    ? JSON.parse(product.images || '[]')
    : [];
  if (images.length === 0 && product.thumbnail) images.push(product.thumbnail);

  const colors: string[] = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === 'string'
    ? JSON.parse(product.colors || '[]')
    : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || 'Default');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  // Pincode checker
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [deliveryDateEstimate, setDeliveryDateEstimate] = useState<string | null>(null);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Price calculations based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const discountPercent =
    currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      setDeliveryDateEstimate(
        deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );
      setPincodeChecked(true);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedColor, selectedVariant?.size || undefined);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, selectedColor, selectedVariant?.size || undefined);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          title: newReviewTitle,
          comment: newReviewComment,
          customerName: newReviewAuthor.trim() || 'Verified Customer',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsList([data.review, ...reviewsList]);
        setReviewSuccessMsg(true);
        setTimeout(() => {
          setReviewModalOpen(false);
          setReviewSuccessMsg(false);
          setNewReviewTitle('');
          setNewReviewComment('');
          setNewReviewAuthor('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-earth-600">
        <Link href="/" className="hover:text-terracotta transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-terracotta transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-terracotta transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-earth-900 font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase: Left Gallery + Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* LEFT: Multi-image Gallery */}
        <div className="space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-cream-100 border border-earth-100 shadow-premium group">
            <img
              src={images[activeImageIndex] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-terracotta text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-earth-800 hover:text-red-500 shadow-sm transition-transform hover:scale-110"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-cream-50 ${
                    activeImageIndex === idx
                      ? 'border-terracotta ring-2 ring-terracotta/20 scale-105'
                      : 'border-earth-200 hover:border-earth-400 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              {product.category?.name || 'Handcrafted Decor'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-earth-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex items-center gap-3 mt-2 text-xs text-earth-600">
              <div className="flex items-center gap-1 font-bold text-earth-900 bg-cream-100 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 text-gold-accent fill-gold-accent" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span>({product.reviewCount || reviewsList.length} verified ratings)</span>
              <span>•</span>
              <span>SKU: {selectedVariant?.sku || product.sku}</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-earth-100 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">
                {formatPrice(currentPrice)}
              </span>
              {currentMrp > currentPrice && (
                <span className="text-base text-earth-600 line-through">
                  {formatPrice(currentMrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-earth-600">
              Inclusive of all taxes. Free shipping on orders above ₹999.
            </p>
          </div>

          {/* Stock Status indicator */}
          <div>
            {product.stock > product.lowStockThreshold ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
              </span>
            ) : product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Hurry! Only {product.stock} pieces left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Currently Out of Stock
              </span>
            )}
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800">
                Color:{' '}
                <span className="font-semibold text-terracotta capitalize">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedColor === c
                        ? 'border-terracotta bg-terracotta text-white shadow-sm'
                        : 'border-earth-200 bg-white text-earth-800 hover:border-earth-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant / Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-earth-800">
                Size / Variant:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-terracotta bg-cream-50 ring-1 ring-terracotta'
                        : 'border-earth-200 hover:border-earth-400 bg-white'
                    }`}
                  >
                    <p className="text-xs font-semibold text-earth-900">{v.name}</p>
                    <p className="text-[11px] text-earth-600 mt-0.5">{formatPrice(v.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-earth-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-earth-700 hover:text-terracotta text-base font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-earth-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-earth-700 hover:text-terracotta text-base font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-6 bg-earth-900 hover:bg-earth-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-3.5 px-6 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-premium flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" /> BUY NOW (FAST CHECKOUT)
            </button>
          </div>

          {/* Pincode Check Section */}
          <div className="p-4 bg-white rounded-2xl border border-earth-200/80 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-earth-900">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span>Check Delivery Availability</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 px-3 py-2 text-xs border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-earth-800 hover:bg-earth-900 text-white rounded-lg text-xs font-semibold"
              >
                Check
              </button>
            </form>
            {pincodeChecked && deliveryDateEstimate && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Delivery available by <strong>{deliveryDateEstimate}</strong>
              </p>
            )}
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-earth-800">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 border border-earth-100">
              <Sparkles className="w-4 h-4 text-gold-accent shrink-0" />
              <span>100% Hand-knitted Wool</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 border border-earth-100">
              <RefreshCw className="w-4 h-4 text-gold-accent shrink-0" />
              <span>Washable & Long-lasting</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 border border-earth-100">
              <ShieldCheck className="w-4 h-4 text-gold-accent shrink-0" />
              <span>Resonant Brass Bells</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 border border-earth-100">
              <Truck className="w-4 h-4 text-gold-accent shrink-0" />
              <span>COD Available Pan-India</span>
            </div>
          </div>

          {/* Accordion Sections: Description, Specs, Shipping, Care */}
          <div className="border-t border-earth-200 pt-4 space-y-2">
            {/* Description */}
            <div className="border border-earth-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-earth-900 bg-cream-50"
              >
                <span>Description</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openAccordion === 'desc' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'desc' && (
                <div className="p-4 text-xs sm:text-sm text-earth-700 leading-relaxed bg-white">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="border border-earth-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-earth-900 bg-cream-50"
              >
                <span>Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="p-4 text-xs space-y-2 bg-white">
                  <div className="grid grid-cols-2 py-1 border-b border-earth-100">
                    <span className="text-earth-600">Material</span>
                    <span className="font-semibold text-earth-900">{product.material || 'Wool & Beads'}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1 border-b border-earth-100">
                    <span className="text-earth-600">Dimensions</span>
                    <span className="font-semibold text-earth-900">{product.dimensions || 'Standard'}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1 border-b border-earth-100">
                    <span className="text-earth-600">Weight</span>
                    <span className="font-semibold text-earth-900">{product.weight || '250g'}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1 border-b border-earth-100">
                    <span className="text-earth-600">Brand</span>
                    <span className="font-semibold text-earth-900">{product.brand || 'Rouniyar Decor'}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1">
                    <span className="text-earth-600">Country of Origin</span>
                    <span className="font-semibold text-earth-900">India</span>
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div className="border border-earth-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-earth-900 bg-cream-50"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="p-4 text-xs leading-relaxed text-earth-700 bg-white">
                  <p>{product.careInstructions || 'Gentle hand wash in cold water with mild liquid detergent. Do not wring or bleach. Dry flat in shade.'}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border border-earth-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'ship' ? null : 'ship')}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-bold text-earth-900 bg-cream-50"
              >
                <span>Shipping & Returns</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openAccordion === 'ship' ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordion === 'ship' && (
                <div className="p-4 text-xs leading-relaxed text-earth-700 space-y-1 bg-white">
                  <p>• Standard delivery across India in 3 to 5 business days.</p>
                  <p>• Free shipping on prepaid and COD orders above ₹999.</p>
                  <p>• 7-day hassle-free replacement in case of transit damage.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t border-earth-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              Customer Reviews ({reviewsList.length})
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-gold-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-accent" />
                ))}
              </div>
              <span className="text-xs font-semibold text-earth-900">
                {product.rating || 4.8} out of 5 stars
              </span>
            </div>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-5 py-2.5 bg-earth-900 hover:bg-terracotta text-white rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-2xl border border-earth-100 shadow-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gold-accent">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-accent" />
                  ))}
                </div>
                <span className="text-[10px] text-earth-600">Verified Buyer</span>
              </div>
              {rev.title && (
                <h4 className="font-serif font-bold text-sm text-earth-900">{rev.title}</h4>
              )}
              <p className="text-xs text-earth-700 leading-relaxed italic">"{rev.comment}"</p>
              <div className="pt-2 text-[11px] font-semibold text-earth-900">
                {rev.customerName}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-center pb-2 border-b border-earth-100">
              <h3 className="font-serif text-lg font-bold text-earth-900">Write a Review</h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-earth-600 hover:text-earth-900"
              >
                ✕
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="py-8 text-center text-emerald-700 font-semibold text-sm">
                Thank you! Your review has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? 'text-gold-accent fill-gold-accent'
                              : 'text-earth-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Shalini Roy"
                    className="w-full px-3 py-2 text-xs border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Beautiful quality toran!"
                    className="w-full px-3 py-2 text-xs border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Review</label>
                  <textarea
                    rows={4}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    required
                    placeholder="Tell us about the craftsmanship, color, packaging..."
                    className="w-full px-3 py-2 text-xs border border-earth-200 rounded-lg focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-earth-700 hover:bg-earth-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-earth-200">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              Complete the Aesthetic
            </span>
            <h2 className="font-serif text-2xl font-bold text-earth-900 mt-1">
              You May Also Adore
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Cart Bottom Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md p-3 border-t border-earth-200 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="text-xs font-bold text-earth-900">{formatPrice(currentPrice)}</div>
          <div className="text-[10px] text-emerald-700 font-medium">In Stock</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-earth-900 text-white rounded-lg text-xs font-semibold shrink-0"
          >
            Add to Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="px-4 py-2 bg-terracotta text-white rounded-lg text-xs font-semibold shrink-0"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

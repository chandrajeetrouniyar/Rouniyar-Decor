export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  active: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  color?: string | null;
  size?: string | null;
  image?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  categoryId: string;
  category?: Category;
  brand: string;
  sku: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  lowStockThreshold: number;
  images: string[]; // parsed array of strings
  thumbnail: string;
  colors: string[]; // parsed array of strings
  material?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  careInstructions?: string | null;
  tags: string[]; // parsed array of strings
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  reviews?: Review[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  image?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
  addresses?: Address[];
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  color?: string | null;
  size?: string | null;
  product?: Product;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  shippingAddress: Address | any;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingFee: number;
  tax: number;
  total: number;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: string | null;
  trackingNumber?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export interface Review {
  id: string;
  productId: string;
  userId?: string | null;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  approved: boolean;
  createdAt: string | Date;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  expiryDate?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  active: boolean;
}

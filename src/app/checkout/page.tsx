import React from 'react';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata = {
  title: 'Secure Checkout | Rouniyar Decor',
  description: 'Enter your shipping address and choose your payment method to complete your handcrafted order.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

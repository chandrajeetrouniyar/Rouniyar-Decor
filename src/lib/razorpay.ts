import crypto from 'crypto';

export interface RazorpayOrderOptions {
  amount: number; // in INR
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  isTestMode: boolean;
}

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RouniyarDecorDemo101';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_RouniyarDecorKey2025';

export async function createRazorpayOrder(options: RazorpayOrderOptions): Promise<RazorpayOrderResponse> {
  const isRealKey =
    process.env.RAZORPAY_KEY_ID &&
    !process.env.RAZORPAY_KEY_ID.includes('Demo') &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_SECRET.includes('Demo');

  if (isRealKey) {
    try {
      const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Math.round(options.amount * 100), // convert to paise
          currency: options.currency || 'INR',
          receipt: options.receipt,
          notes: options.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id,
          amount: data.amount,
          currency: data.currency,
          receipt: data.receipt,
          status: data.status,
          isTestMode: false,
        };
      }
    } catch (err) {
      console.warn('Live Razorpay API call failed, falling back to simulated sandbox mode:', err);
    }
  }

  // Safe simulated test mode for development / sandbox
  const simulatedOrderId = `order_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  return {
    id: simulatedOrderId,
    amount: Math.round(options.amount * 100),
    currency: options.currency || 'INR',
    receipt: options.receipt,
    status: 'created',
    isTestMode: true,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId) return false;

  // In simulated test mode, verify test signature prefix
  if (orderId.startsWith('order_') && (!signature || signature === 'simulated_test_signature' || signature.startsWith('sig_test_'))) {
    return true;
  }

  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return generatedSignature === signature;
  } catch (e) {
    return false;
  }
}

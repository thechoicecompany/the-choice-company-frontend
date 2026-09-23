

// ─── ECOMMERCE TYPES ─────────────────────────────────────────────────────────

export interface SampleProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  description: string;
  samplePrice: number;   // price per demo unit (e.g. ₹499 for 1 sample)
  moq: number;   // bulk MOQ shown as upsell
  bulkPrice: number;   // bulk price per unit (shown for comparison)
  maxSampleQty: number;   // max units in demo purchase (e.g. 5)
  inStock: boolean;
  tags: string[];
  material: string;
  dimensions?: string;
  weight?: string;
  brandingOptions: string[];
  shippingDays: number;
}

export interface RazorpayOrder {
  id: string;   // Razorpay order ID (order_xxxx)
  amount: number;   // in paise (₹1 = 100 paise)
  currency: string;   // "INR"
  receipt: string;   // our internal reference
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export type OrderStatus =
  | "pending" | "payment_pending" | "paid"
  | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface DemoOrder {
  id: string;   // TCC-DEMO-2026-XXXXX
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  samplePrice: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: ShippingAddress;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}






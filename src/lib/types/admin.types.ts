export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "SALES_MANAGER" | "SALES_EXECUTIVE" | "CONTENT_MANAGER";
}

// ─── API WRAPPERS ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, string>;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export interface StatEntry { label: string; count: number; percentage: number; }
export interface MonthlyTrend { month: string; count: number; }

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  acknowledgedInquiries: number;
  quoteSentInquiries: number;
  convertedInquiries: number;
  closedInquiries: number;
  inquiriesToday: number;
  inquiriesThisWeek: number;
  inquiriesThisMonth: number;
  topStatesByInquiry: StatEntry[];
  topCategoriesByInquiry: StatEntry[];
  inquiryBySource: StatEntry[];
  totalCatalogueRequests: number;
  catalogueRequestsToday: number;
  catalogueRequestsThisMonth: number;
  catalogueBySource: StatEntry[];
  catalogueMonthlyTrend: MonthlyTrend[];
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockUnits: number;
  totalDemoOrders: number;
  demoOrdersThisMonth: number;
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export interface PricingTier {
  id?: number;
  minQty: number;
  maxQty: number;
  price: number;
  label: string;
  sortOrder?: number;
}

/** Full image record from product_images table — returned by admin endpoints */
export interface ProductImageInfo {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  listingUrl?: string;
  detailUrl?: string;
  thumbnailUrl?: string;
}

/** Slim ref sent to backend when creating a product (images pre-uploaded to Cloudinary) */
export interface ProductImageRef {
  url: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface InventoryInfo {
  inventoryId: number;
  stockQty: number;
  reservedQty: number;
  availableQty: number;
  reorderLevel: number;
  maxStockQty: number;
  isLowStock: boolean;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  sku: string | null;
  lastRestockedAt: string | null;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  /** Primary category — mirrors categories[0] */
  category: string;
  categorySlug: string;
  /** All categories this product belongs to */
  categories: string[];
  categorySlugs: string[];
  description: string;
  fullDescription?: string;
  image: string;
  images?: string[];
  /** Full image objects from product_images table — ordered by sortOrder asc */
  productImages?: ProductImageInfo[];
  moq: number;
  basePrice: number;
  material?: string;
  leadTime?: string;
  brandingOptions?: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  pricingTiers: PricingTier[];
  inventory?: InventoryInfo;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  /** Primary category — first entry of categories, sent for backward-compat */
  category: string;
  categorySlug: string;
  /** All categories this product belongs to — required, at least one */
  categories: string[];
  categorySlugs: string[];
  description: string;
  fullDescription?: string;
  /** Primary image URL — required by backend @NotBlank */
  image: string;
  /** Extra image URLs (legacy list on product entity) */
  images?: string[];
  moq: number;
  basePrice: number;
  material?: string;
  leadTime?: string;
  brandingOptions?: string[];
  isFeatured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  pricingTiers?: Omit<PricingTier, "id">[];
  inventory?: {
    stockQty?: number;
    reorderLevel?: number;
    maxStockQty?: number;
    sku?: string;
    warehouseNotes?: string;
  };
  /** Pre-uploaded Cloudinary image refs — backend saves as ProductImage records */
  productImages?: ProductImageRef[];
}

export type UpdateProductPayload = Partial<Omit<CreateProductPayload, "inventory" | "pricingTiers">>;

// ─── INVENTORY ────────────────────────────────────────────────────────────────
export type InventoryAction =
  | "RESTOCK" | "ADJUSTMENT" | "RESERVED" | "RELEASED"
  | "DISPATCHED" | "DAMAGED" | "RETURNED";

export interface InventoryResponse {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productCategory: string;
  productImage: string;
  stockQty: number;
  reservedQty: number;
  availableQty: number;
  reorderLevel: number;
  maxStockQty: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  sku: string | null;
  warehouseNotes: string | null;
  lastRestockedAt: string | null;
  updatedAt: string;
}

export interface UpdateInventoryPayload {
  action: InventoryAction;
  quantity: number;
  note?: string;
  absoluteStock?: number;
  reorderLevel?: number;
  maxStockQty?: number;
  sku?: string;
  warehouseNotes?: string;
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────
export type InquiryStatus =
  | "NEW" | "ACKNOWLEDGED" | "QUOTE_SENT" | "FOLLOW_UP" | "CONVERTED" | "CLOSED";

export interface Inquiry {
  id: number;
  refNumber: string;
  companyName: string;
  contactPerson: string;
  designation?: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  productCategory: string;
  quantityRequired: number;
  budgetRange: string;
  deliveryLocation: string;
  brandingRequired: boolean;
  additionalNotes?: string;
  logoUrl?: string;
  source: string;
  status: InquiryStatus;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── CATALOGUE ────────────────────────────────────────────────────────────────
export interface CatalogueRequest {
  id: number;
  email: string;
  companyName?: string;
  phone?: string;
  source: string;
  pageUrl?: string;
  emailSent: boolean;
  createdAt: string;
}

// ── Add to lib/types/admin.types.ts ─────────────────────────────────────────
// Mirrors ContactResponse.java / ContactStatus.java field-for-field.

export type ContactStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";

export interface ContactMessage {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}
// // ── DEMO ORDERS ───────────────────────────────────────────────────────────────
export type DemoOrderStatus =
  | "PAYMENT_PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface DemoOrderSummaryDto {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  quantity: number;
  status: DemoOrderStatus;
  createdAt: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  city?: string;
  state?: string;
  trackingNumber?: string;
  courierName?: string;
  statusNote?: string;
}

export interface DemoOrderDetailDto extends DemoOrderSummaryDto {
  companyName?: string;
  message?: string;
  notes?: string;
  updatedAt: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: DemoOrderStatus;
  trackingNumber?: string;
  notes?: string;
}
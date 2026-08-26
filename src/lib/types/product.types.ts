export interface ProductImage {
  id: number;
  imageUrl: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
  // Cloudinary transformation URLs (computed by backend)
  listingUrl?: string;   // 600×600
  detailUrl?: string;   // 1000×1000
  thumbnailUrl?: string;   // 150×150
}

export interface PricingTier {
  minQty: number;
  maxQty: number;
  price: number;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  fullDescription?: string;
  // Primary image (backward compat)
  image: string;
  // Multiple images from product_images table
  images?: string[];          // extra image URLs
  productImages?: ProductImage[];    // full image objects with metadata
  moq: number;
  basePrice: number;
  material?: string;
  leadTime?: string;
  brandingOptions?: string[];
  isFeatured: boolean;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  pricingTiers?: PricingTier[];
  relatedProducts?: Product[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductFilters {
  category?: string;
  budget?: string;
  occasion?: string;
  sort?: string;
  page?: number;
  moq?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
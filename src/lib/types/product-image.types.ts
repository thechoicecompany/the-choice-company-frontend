// ─── CLOUDINARY UPLOAD STATE ─────────────────────────────────────────────────

export interface ImageSlot {
  uid: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error" | "deleting";
  progress: number;
  url?: string;
  publicId?: string;
  error?: string;
  /** DB record ID — only set for images pre-loaded from an existing product (edit mode) */
  dbImageId?: number;
}

// ─── API TYPES ────────────────────────────────────────────────────────────────

export interface ProductImageResponse {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  listingUrl: string;
  detailUrl: string;
  thumbnailUrl: string;
}

export interface UploadedImageRef {
  url: string;
  publicId: string;
  sortOrder: number;
  isPrimary: boolean;
}

// ─── PRODUCT CREATION ─────────────────────────────────────────────────────────

export interface CreateProductWithImagesPayload {
  name: string;
  slug?: string;
  description: string;
  fullDescription?: string;
  category: string;
  categorySlug: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  moq: number;
  basePrice: number;
  material?: string;
  leadTime?: string;
  brandingOptions?: string[];
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  pricingTiers?: Array<{
    minQty: number; maxQty: number; price: number; label: string;
  }>;
  inventory?: {
    stockQty?: number; reorderLevel?: number; sku?: string;
  };
  images: UploadedImageRef[];
}

// ─── UPLOAD ZONE PROPS ────────────────────────────────────────────────────────

export interface ImageUploadZoneProps {
  slots: ImageSlot[];
  onChange: (slots: ImageSlot[]) => void;
  maxImages?: number;
  disabled?: boolean;
  /** Product ID — required in edit mode so removeSlot() can call the delete API */
  productId?: number;
}
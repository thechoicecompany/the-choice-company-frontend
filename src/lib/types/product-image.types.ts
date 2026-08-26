// ─── CLOUDINARY UPLOAD STATE ─────────────────────────────────────────────────

/** State for a single image slot in the uploader */
export interface ImageSlot {
  /** Unique client-side ID for React keys and DnD */
  uid:       string;
  /** Original browser File object — used for upload */
  file:      File;
  /** Object URL for preview (URL.createObjectURL) — must be revoked on unmount */
  preview:   string;
  /** Upload status */
  status:    "pending" | "uploading" | "done" | "error";
  /** 0–100 upload progress (simulated for single-chunk uploads) */
  progress:  number;
  /** Cloudinary secure_url — set after successful upload */
  url?:      string;
  /** Cloudinary public_id — needed for deletion */
  publicId?: string;
  /** Error message if status === "error" */
  error?:    string;
}

// ─── API TYPES ────────────────────────────────────────────────────────────────

/** What the backend returns per image after product creation */
export interface ProductImageResponse {
  id:           number;
  productId:    number;
  imageUrl:     string;
  publicId:     string;
  sortOrder:    number;
  isPrimary:    boolean;
  createdAt:    string;
  /** Computed by backend: w_600,h_600 */
  listingUrl:   string;
  /** Computed by backend: w_1000,h_1000 */
  detailUrl:    string;
  /** Computed by backend: w_150,h_150 */
  thumbnailUrl: string;
}

/** Uploaded image reference sent to backend when creating product */
export interface UploadedImageRef {
  url:       string;
  publicId:  string;
  sortOrder: number;
  isPrimary: boolean;
}

// ─── PRODUCT CREATION ─────────────────────────────────────────────────────────

/** Full payload sent to POST /api/admin/products */
export interface CreateProductWithImagesPayload {
  // Product fields
  name:            string;
  slug?:           string;
  description:     string;
  fullDescription?: string;
  category:        string;
  categorySlug:    string;
  sku:             string;
  price:           number;
  discountPrice?:  number;
  stockQuantity:   number;
  moq:             number;
  basePrice:       number;
  material?:       string;
  leadTime?:       string;
  brandingOptions?: string[];
  isFeatured:      boolean;
  isActive:        boolean;
  tags?:           string[];
  metaTitle?:      string;
  metaDescription?: string;
  // Pricing
  pricingTiers?: Array<{
    minQty: number; maxQty: number; price: number; label: string;
  }>;
  // Initial inventory
  inventory?: {
    stockQty?: number; reorderLevel?: number; sku?: string;
  };
  // Images — already uploaded to Cloudinary; backend saves metadata
  images: UploadedImageRef[];
}

// ─── UPLOAD ZONE PROPS ────────────────────────────────────────────────────────

export interface ImageUploadZoneProps {
  /** Current image slots */
  slots:       ImageSlot[];
  /** Called when slots change (add, remove, reorder, primary change) */
  onChange:    (slots: ImageSlot[]) => void;
  /** Max images allowed */
  maxImages?:  number;
  /** Whether form is submitting (disables interactions) */
  disabled?:   boolean;
}

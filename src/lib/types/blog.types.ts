// ─── Blog ───────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  publishedAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  category?: string;
  page?: string;
  search?: string;
}

// ─── Inquiry ────────────────────────────────────────────────────────────────
export type InquiryStatus =
  | "new" | "acknowledged" | "quote_sent" | "follow_up" | "converted" | "closed";

export interface Inquiry {
  id: number;
  refNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  productCategory: string;
  quantity: number;
  budgetRange: string;
  status: InquiryStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  notes: InquiryNote[];
}

export interface InquiryNote {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

// ─── Kit Builder ─────────────────────────────────────────────────────────────
export interface AIRecommendation {
  kitName: string;
  recommendation: string;
  reasoning: string;
  suggestedAddonNames: string[];
  estimatedValue: string;
  perceivedValue: "Low" | "Medium" | "High" | "Luxury";
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface AdminBlogPost extends BlogPost {
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  featuredImagePublicId?: string;
  createdAt: string;
}

export interface BlogRequest {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImagePublicId?: string;
  category: string;
  tags?: string[];
  author: string;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ImageUploadResult {
  url: string;
  publicId: string;
}
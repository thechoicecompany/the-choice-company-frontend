export interface Product {
  id:           number;
  name:         string;
  slug:         string;
  category:     string;
  categorySlug: string;
  image:        string;
  moq:          number;
  basePrice:    number;
  description:  string;
  isFeatured:   boolean;
  tags:         string[];
}

export interface ProductDetail extends Product {
  images:          string[];
  fullDescription: string;
  material:        string;
  leadTime:        string;
  brandingOptions: string[];
  pricingTiers:    PricingTier[];
  relatedProducts: Product[];
  specifications:  Record<string, string>;
}

export interface PricingTier {
  minQty: number;
  maxQty: number;
  price:  number;
  label?: string;
}

export interface ProductFilters {
  category?: string;
  budget?:   string;
  occasion?: string;
  sort?:     string;
  page?:     number;
  moq?:      number;
}

export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  perPage:    number;
  totalPages: number;
}

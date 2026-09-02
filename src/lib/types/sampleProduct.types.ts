// Public shape — matches SampleProductResponse.java field-for-field.
// Same shape as the old static SampleProduct type, so ShopGrid / ShopProductDetail
// need no internal changes beyond where the data comes from.
export interface SampleProduct {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    image: string;
    images: string[];
    samplePrice: number;
    bulkPrice: number;
    maxSampleQty: number;
    moq: number;
    shippingDays: number;
    material?: string;
    dimensions?: string;
    weight?: string;
    brandingOptions: string[];
    tags: string[];
}

// Admin shape — matches SampleProductAdminResponse.java.
export interface SampleProductImageRef {
    id: number;
    imageUrl: string;
    publicId?: string;
    sortOrder: number;
    isPrimary: boolean;
}

export interface AdminSampleProduct {
    id: number;
    name: string;
    slug: string;
    category: string;
    categorySlug?: string;
    description: string;
    image: string;
    images: string[];
    samplePrice: number;
    bulkPrice: number;
    maxSampleQty: number;
    moq: number;
    shippingDays: number;
    material?: string;
    dimensions?: string;
    weight?: string;
    brandingOptions: string[];
    tags: string[];
    isActive: boolean;
    isBestseller: boolean;
    sortOrder: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
    productImages: SampleProductImageRef[];
}

export interface CreateSampleProductPayload {
    name: string;
    slug?: string;
    category: string;
    categorySlug?: string;
    description: string;
    image: string;
    images?: string[];
    samplePrice: number;
    bulkPrice: number;
    maxSampleQty: number;
    moq: number;
    shippingDays: number;
    material?: string;
    dimensions?: string;
    weight?: string;
    brandingOptions?: string[];
    tags?: string[];
    isActive?: boolean;
    isBestseller?: boolean;
    sortOrder?: number;
    metaTitle?: string;
    metaDescription?: string;
    productImages?: Array<{ url: string; publicId?: string; sortOrder: number; isPrimary: boolean }>;
}

export type UpdateSampleProductPayload = Partial<CreateSampleProductPayload>;
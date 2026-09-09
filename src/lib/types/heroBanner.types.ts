export interface HeroBanner {
    id: number;
    tag: string;
    headlineTop: string;
    headlineBottom: string;
    body: string;
    imageUrl: string;
    imagePublicId: string;
    displayOrder: number;
    active: boolean;
    ctaLink: string | null;
    ctaLabel: string | null;
}

export interface CreateHeroBannerPayload {
    tag: string;
    headlineTop: string;
    headlineBottom: string;
    body: string;
    imageUrl: string;
    imagePublicId: string;
    displayOrder: number;
    active: boolean;
    ctaLink?: string;
    ctaLabel?: string;
}

export interface UpdateHeroBannerPayload {
    tag?: string;
    headlineTop?: string;
    headlineBottom?: string;
    body?: string;
    imageUrl?: string;
    imagePublicId?: string;
    displayOrder?: number;
    active?: boolean;
    ctaLink?: string;
    ctaLabel?: string;
}

export interface ImageUploadResult {
    url: string;
    publicId: string;
}

export interface BannerFormValues {
    tag: string;
    headlineTop: string;
    headlineBottom: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
    displayOrder: number;
    active: boolean;
    imageUrl: string;
    imagePublicId: string;
}

export const EMPTY_FORM_VALUES: BannerFormValues = {
    tag: "",
    headlineTop: "",
    headlineBottom: "",
    body: "",
    ctaLabel: "",
    ctaLink: "",
    displayOrder: 0,
    active: true,
    imageUrl: "",
    imagePublicId: "",
};
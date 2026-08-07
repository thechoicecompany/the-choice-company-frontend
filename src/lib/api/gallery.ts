import { springApi } from "./client";

export interface GalleryItem {
  id:          number;
  image:       string;
  caption:     string;
  category:    "products" | "packaging" | "branding" | "events" | "corporate";
  projectName: string;
  clientIndustry?: string;
  quantity?:   number;
}

export async function fetchGalleryItems(category?: string): Promise<GalleryItem[]> {
  const query = category ? `?category=${category}` : "";
  const res   = await springApi.get(`/api/gallery${query}`);
  return res.data;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export type FileType = "image" | "pdf" | "poster" | "document" | "video";

const VALID_FILE_TYPES = new Set<FileType>(["image", "pdf", "poster", "document", "video"]);

function normaliseItem(raw: GalleryItem): GalleryItem {
  return {
    ...raw,
    fileType: VALID_FILE_TYPES.has(raw.fileType) ? raw.fileType : "image",
    thumbnailUrl: raw.thumbnailUrl ?? "",
  };
}

export interface GalleryItem {
  id: number;
  caption: string;
  projectName: string;
  category: "products" | "packaging" | "branding" | "events" | "corporate";
  clientIndustry?: string;
  quantity?: number;
  sortOrder: number;
  fileType: FileType;
  thumbnailUrl: string;
}

export interface GalleryItemDetail extends GalleryItem {
  fullUrl: string;
}

export async function fetchGalleryItems(category?: string): Promise<GalleryItem[]> {
  const url = category
    ? `${API}/api/gallery?category=${category}`
    : `${API}/api/gallery`;
  const res = await fetch(url, { next: { revalidate: 7200 } });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map(normaliseItem);
}

export async function fetchGalleryItemDetail(id: number): Promise<GalleryItemDetail | null> {
  const res = await fetch(`${API}/api/gallery/${id}/detail`);
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.data) return null;
  return { ...normaliseItem(json.data), fullUrl: json.data.fullUrl ?? "" };
}
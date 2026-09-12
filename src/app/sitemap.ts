import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thechoicecompany.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await fetchProductSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/catalog`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/shop/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

// Backend responses on this API are inconsistently shaped — some routes
// return a bare array, others wrap it in ApiResponse<T> as { data: [...] }.
// Handle both, and never let anything but a real string[] reach sitemap()'s
// .map() call (a bad/unreachable response must not fail the whole build).
async function fetchProductSlugs(): Promise<string[]> {
  const API = process.env.NEXT_PUBLIC_API_URL;
  if (!API) return [];

  try {
    const res = await fetch(`${API}/api/products/slugs`);
    if (!res.ok) return [];

    const json = await res.json();

    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;

    return [];
  } catch {
    return [];
  }
}
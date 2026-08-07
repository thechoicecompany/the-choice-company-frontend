import type { MetadataRoute } from "next";
import { fetchAllProductSlugs } from "@/lib/api/products";
import { fetchAllBlogSlugs }   from "@/lib/api/blog";
import { INDUSTRIES }           from "@/lib/constants/industries";
const BASE = "https://thechoicecompany.in";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs,blogSlugs] = await Promise.all([fetchAllProductSlugs().catch(()=>[]),fetchAllBlogSlugs().catch(()=>[])]);
  return [
    {url:BASE,lastModified:new Date(),changeFrequency:"weekly",priority:1.0},
    {url:`${BASE}/about`,lastModified:new Date(),changeFrequency:"monthly",priority:0.7},
    {url:`${BASE}/products`,lastModified:new Date(),changeFrequency:"daily",priority:0.9},
    {url:`${BASE}/bulk-orders`,lastModified:new Date(),changeFrequency:"weekly",priority:0.9},
    {url:`${BASE}/build-your-kit`,lastModified:new Date(),changeFrequency:"monthly",priority:0.8},
    {url:`${BASE}/industries`,lastModified:new Date(),changeFrequency:"monthly",priority:0.7},
    {url:`${BASE}/gallery`,lastModified:new Date(),changeFrequency:"weekly",priority:0.6},
    {url:`${BASE}/blog`,lastModified:new Date(),changeFrequency:"daily",priority:0.8},
    {url:`${BASE}/contact`,lastModified:new Date(),changeFrequency:"monthly",priority:0.7},
    ...INDUSTRIES.map(i=>({url:`${BASE}/industries/${i.slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:0.8})),
    ...productSlugs.map(s=>({url:`${BASE}/products/${s}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:0.85})),
    ...blogSlugs.map(s=>({url:`${BASE}/blog/${s}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:0.6})),
  ];
}

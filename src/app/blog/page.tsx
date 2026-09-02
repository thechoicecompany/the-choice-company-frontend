import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types/blog.types";
import PageHero from "@/components/layout/PageHero";
import { fetchPosts, fetchBlogCategories } from "@/lib/api/blog";
export const revalidate = 1800;
export const metadata: Metadata = { title: "Blog", description: "Corporate gifting ideas and trends." };
interface Props { searchParams: Promise<{ category?: string; page?: string }> }
export default async function BlogPage({ searchParams }: Props) {
  const p = await searchParams;
  const [postsData, categories] = await Promise.all([
    fetchPosts({ category: p.category, page: p.page }).catch(() => ({ data: [], total: 0, page: 1, perPage: 12, totalPages: 0 })),
    fetchBlogCategories().catch(() => [] as string[]),
  ]);
  return (<><PageHero title="Corporate Gifting Blog" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
    <section className="section-py"><div className="container-site">
      <div className="flex flex-wrap gap-2 mb-10">
        <Link href="/blog" className={`badge ${!p.category ? "badge-navy" : "badge-gray"}`}>All</Link>
        {categories.map((c: string) => <Link key={c} href={`/blog?category=${c}`} className={`badge ${p.category === c ? "badge-navy" : "badge-gray"}`}>{c}</Link>)}
      </div>
      {postsData.data.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">📝</div><p className="text-gray-500">No posts yet. Check back soon!</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsData.data.map((post: BlogPost) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group block">

              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-5xl">📝</div>
                )}
              </div>
              <div className="p-5">
                <span className="badge-gold text-[10px] mb-2 inline-block">{post.category}</span>
                <h3 className="font-bold text-navy mb-2 group-hover:text-gold transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <span className="inline-block mt-4 text-xs font-semibold text-gold">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></section></>);
}

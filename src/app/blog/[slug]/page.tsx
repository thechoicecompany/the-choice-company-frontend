import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link  from "next/link";
import PageHero from "@/components/layout/PageHero";
import SchemaMarkup from "@/components/ui/SchemaMarkup";
import { fetchPostBySlug, fetchAllBlogSlugs } from "@/lib/api/blog";
export const revalidate = 3600;
export async function generateStaticParams() {
  return (await fetchAllBlogSlugs().catch(()=>[])).map(s=>({slug:s}));
}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const {slug}=await params; const post = await fetchPostBySlug(slug).catch(()=>null);
  return post ? {title:post.title,description:post.excerpt} : {title:"Post Not Found"};
}
export default async function BlogDetailPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const post=await fetchPostBySlug(slug).catch(()=>null);
  if (!post) notFound();
  return (<><SchemaMarkup schema={{"@context":"https://schema.org","@type":"Article",headline:post.title,author:{"@type":"Person",name:post.author}}} />
    <PageHero title={post.title} breadcrumbs={[{label:"Home",href:"/"},{label:"Blog",href:"/blog"},{label:post.category}]} />
    <section className="section-py"><div className="container-site max-w-3xl mx-auto">
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
        <span>By <strong className="text-navy">{post.author}</strong></span>
        <span>·</span><span>{post.readTime} min read</span>
        <span className="badge-gold">{post.category}</span>
      </div>
      <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{__html:post.content}} />
      <div className="mt-12 p-8 rounded-2xl text-center" style={{background:"var(--navy)"}}>
        <h3 className="font-playfair text-2xl font-bold text-white mb-3">Ready to Place a Bulk Order?</h3>
        <Link href="/bulk-orders#inquiry-form" className="btn-gold btn-lg">Submit Requirement →</Link>
      </div>
    </div></section></>);
}

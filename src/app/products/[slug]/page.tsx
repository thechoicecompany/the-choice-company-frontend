import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero        from "@/components/layout/PageHero";
import ProductGallery  from "@/components/sections/products/ProductGallery";
import PricingTiers    from "@/components/sections/products/PricingTiers";
import QuickInquiryForm from "@/components/sections/products/QuickInquiryForm";
import RelatedProducts from "@/components/sections/products/RelatedProducts";
import SchemaMarkup    from "@/components/ui/SchemaMarkup";
import { fetchProductBySlug, fetchAllProductSlugs } from "@/lib/api/products";
export const revalidate = 1800;
export async function generateStaticParams() { return (await fetchAllProductSlugs().catch(()=>[])).map(s=>({slug:s})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const {slug}=await params; const p=await fetchProductBySlug(slug).catch(()=>null);
  return p ? {title:p.name,description:p.description} : {title:"Product Not Found"};
}
export default async function ProductDetailPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const product=await fetchProductBySlug(slug).catch(()=>null);
  if (!product) notFound();
  return (<><SchemaMarkup schema={{"@context":"https://schema.org","@type":"Product",name:product.name,description:product.description}} />
    <PageHero title={product.name} breadcrumbs={[{label:"Home",href:"/"},{label:"Products",href:"/products"},{label:product.name}]} />
    <section className="section-py"><div className="container-site">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductGallery images={product.images} productName={product.name} />
        <div>
          <span className="badge-gold mb-4 inline-block">{product.category}</span>
          <h1 className="section-title text-3xl mt-3 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.fullDescription}</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            {[["Min. Order Qty",`${product.moq} units`],["Lead Time",product.leadTime],["Material",product.material],["Branding",product.brandingOptions?.join(", ")||"Available"]].map(([l,v])=>(
              <div key={l as string} className="flex border-b border-gray-100 last:border-0">
                <div className="w-40 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600">{l as string}</div>
                <div className="flex-1 px-4 py-3 text-sm text-gray-700">{v as string}</div>
              </div>
            ))}
          </div>
          <PricingTiers tiers={product.pricingTiers} />
          <QuickInquiryForm productName={product.name} productId={product.id} />
        </div>
      </div>
      {product.relatedProducts?.length > 0 && <RelatedProducts products={product.relatedProducts} />}
    </div></section></>);
}

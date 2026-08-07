import type { Metadata } from "next";
import PageHero       from "@/components/layout/PageHero";
import ProductFilters from "@/components/sections/products/ProductFilters";
import ProductGrid    from "@/components/sections/products/ProductGrid";
import { fetchProducts } from "@/lib/api/products";
export const revalidate = 3600;
interface Props { searchParams: Promise<{category?:string;budget?:string;occasion?:string;sort?:string;page?:string}> }
export const metadata: Metadata = { title:"Corporate Gift Products", description:"Browse premium corporate gifts. MOQ from 50 units." };
export default async function ProductsPage({searchParams}:Props) {
  const p = await searchParams;
  const {data:products,total} = await fetchProducts({category:p.category,budget:p.budget,occasion:p.occasion,sort:p.sort||"popular",page:Number(p.page)||1}).catch(()=>({data:[],total:0,page:1,perPage:24,totalPages:0}));
  return (<><PageHero title="Products & Solutions" subtitle="Premium corporate gifts with custom branding"
    breadcrumbs={[{label:"Home",href:"/"},{label:"Products"}]} />
    <section className="section-py"><div className="container-site">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0"><ProductFilters activeFilters={p} /></aside>
        <div className="flex-1 min-w-0"><ProductGrid products={products} total={total} /></div>
      </div>
    </div></section></>);
}

import type { Metadata } from "next";
import Link     from "next/link";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/sections/home/CtaBanner";
import { INDUSTRIES } from "@/lib/constants/industries";
export const metadata: Metadata = { title:"Industry Solutions", description:"Corporate gifting for every business sector." };
export default function IndustriesPage() {
  return (<><PageHero title="Industries We Serve" breadcrumbs={[{label:"Home",href:"/"},{label:"Industries"}]} />
    <section className="section-py"><div className="container-site">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {INDUSTRIES.map(ind => (
          <Link key={ind.slug} href={`/industries/${ind.slug}`} className="card p-8 text-center group cursor-pointer">
            <div className="text-5xl mb-4">{ind.icon}</div>
            <h3 className="font-bold text-navy text-lg mb-2 group-hover:text-gold transition-colors">{ind.label}</h3>
            <p className="text-sm text-gray-500">{ind.description.substring(0,80)}...</p>
          </Link>
        ))}
      </div>
    </div></section><CtaBanner /></>);
}

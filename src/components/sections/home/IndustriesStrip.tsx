import Link from "next/link";
import { INDUSTRIES } from "@/lib/constants/industries";
export default function IndustriesStrip() {
  return (
    <section className="section-py" style={{ background:"var(--cream)" }}>
      <div className="container-site">
        <div className="text-center mb-10">
          <span className="section-label">INDUSTRIES WE SERVE</span>
          <h2 className="section-title">Gifting for Every Sector</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {INDUSTRIES.map((ind) => (
            <Link key={ind.slug} href={`/industries/${ind.slug}`}
              className="flex flex-col items-center gap-2 group w-[90px]">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl group-hover:shadow-md group-hover:scale-105 transition-all">
                {ind.icon}
              </div>
              <span className="text-[11px] text-center text-gray-600 font-medium group-hover:text-gold transition-colors">{ind.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

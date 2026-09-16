// PAGE HERO — SERVER COMPONENT
// Reusable hero for all inner pages. Auto-injects BreadcrumbList JSON-LD.
import Link from "next/link";
import SchemaMarkup from "@/components/ui/SchemaMarkup";

interface Crumb { label: string; href?: string; }
interface Props { title: string; subtitle?: string; breadcrumbs?: Crumb[]; }

export default function PageHero({ title, subtitle, breadcrumbs = [] }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `https://thechoicecompany.in${c.href}` } : {}),
    })),
  };

  return (
    <section className="py-12 md:py-16"
      style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1A3A2A 100%)" }}>
      {breadcrumbs.length > 0 && <SchemaMarkup schema={schema} />}
      <div className="container-site">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-white/50 mb-4">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {c.href
                  ? <Link href={c.href} className="hover:text-gold transition-colors">{c.label}</Link>
                  : <span className="text-white/80">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-playfair text-5xl md:text-4xl font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-white/65 text-sm max-w-xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}

// 
"use client";
// CHANGED: Centered nav links using a 3-column grid layout
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIcon from "@/components/cart/CartIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Our Products" },
  { href: "/shop", label: "Sample Shop", badge: "Try Now" },
  { href: "/industries", label: "Industries" },
  { href: "/build-your-kit", label: "Build Your Kit", highlight: true },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-[100] bg-white transition-all duration-200"
      style={{
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        borderBottom: scrolled ? "none" : "1px solid #f3f4f6",
      }}>
      {/* CHANGED: grid instead of flex justify-between so the middle column can be truly centered */}
      <nav className="container-site grid grid-cols-[auto_1fr_auto] h-[70px] items-center gap-4">

        {/* Logo — col 1 */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-lg font-bold"
            style={{ background: "var(--teal)" }}>🎁</div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-bold leading-tight" style={{ color: "var(--navy)" }}>
              THE CHOICE COMPANY
            </div>
            <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
              Making Every Gift Memorable
            </div>
          </div>
        </Link>

        {/* Desktop nav — col 2, centered regardless of col 1 / col 3 widths */}
        <ul className="hidden xl:flex items-center justify-center gap-1">
          {NAV_LINKS.map(({ href, label, highlight, badge }) => (
            <li key={href}>
              {highlight ? (
                <Link href={href}
                  className="ml-1 px-3 py-1.5 rounded-full text-[12px] font-semibold text-white whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,var(--teal),var(--navy))" }}>
                  ✨ {label}
                </Link>
              ) : (
                <Link href={href}
                  className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${isActive(href) ? "text-gold font-semibold" : "text-gray-600 hover:text-gold"
                    }`}>
                  {label}
                  {badge && (
                    <span className="absolute -top-1.5 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: "var(--orange)" }}>
                      {badge}
                    </span>
                  )}
                  {isActive(href) && <span className="block h-0.5 mt-0.5 rounded-full bg-gold" />}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right side — col 3, Cart + CTA + Hamburger */}
        <div className="flex items-center justify-end gap-2 flex-shrink-0">
          <CartIcon />

          <Link href="/bulk-orders#inquiry-form"
            className="hidden lg:inline-flex btn-navy text-sm">
            Get Quote
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden flex flex-col gap-1.5 p-2 rounded-md"
            aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ background: "var(--navy)" }} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{ background: "var(--navy)" }} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ background: "var(--navy)" }} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`xl:hidden fixed inset-0 top-[70px] z-[99] bg-white transition-all duration-300 overflow-y-auto ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}>
        <div className="container-site py-6">
          <ul className="space-y-1 mb-6">
            {NAV_LINKS.map(({ href, label, highlight, badge }) => (
              <li key={href}>
                <Link href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${highlight ? "text-white" : isActive(href) ? "bg-navy/5 text-navy font-semibold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  style={highlight ? { background: "linear-gradient(135deg,var(--teal),var(--navy))" } : {}}>
                  {highlight && "✨ "}{label}
                  {badge && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "var(--orange)" }}>{badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link href="/cart" className="btn-outline-navy flex-1 text-center">🛒 View Cart</Link>
            <Link href="/bulk-orders#inquiry-form" className="btn-gold flex-[2] text-center">📋 Bulk Inquiry</Link>
          </div>
        </div>
      </div>
    </header>
  );
} 
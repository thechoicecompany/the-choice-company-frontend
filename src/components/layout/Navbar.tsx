"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CartIcon from "@/components/cart/CartIcon";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Our Products" },
  { href: "/shop", label: "Sample Shop", badge: "Try Now" },
  { href: "/industries", label: "Industries" },
  // { href: "/build-your-kit", label: "Build Your Kit", highlight: true },
  { href: "/gallery", label: "Gallery", highlight: false },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default function NavbarAnimated() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // ── Scroll handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Shrink header on scroll ────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!headerRef.current) return;
      gsap.to(headerRef.current, {
        paddingTop: scrolled ? "0px" : undefined,
        boxShadow: scrolled
          ? "0 8px 30px rgba(13,27,42,0.12)"
          : "0 1px 0 rgba(0,0,0,0.06)",
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [scrolled], scope: headerRef }
  );

  // ── Sidebar open/close animation ──────────────────────────────────────────
  useGSAP(
    () => {
      const sidebar = sidebarRef.current;
      const backdrop = backdropRef.current;
      if (!sidebar || !backdrop) return;

      if (sideOpen) {
        document.body.style.overflow = "hidden";
        gsap.set(sidebar, { x: "-100%" });
        gsap.set(backdrop, { opacity: 0, pointerEvents: "auto" });

        const tl = gsap.timeline();
        tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" }).to(
          sidebar,
          { x: "0%", duration: 0.4, ease: "power3.out" },
          "-=0.2"
        );

        // Stagger menu items
        const items = sidebar.querySelectorAll(".nav-item");
        tl.fromTo(
          items,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" },
          "-=0.15"
        );
      } else {
        document.body.style.overflow = "";
        const tl = gsap.timeline({
          onComplete: () => {
            if (backdrop) backdrop.style.pointerEvents = "none";
          },
        });
        tl.to(sidebar, { x: "-100%", duration: 0.35, ease: "power3.in" }).to(
          backdrop,
          { opacity: 0, duration: 0.25, ease: "power2.in" },
          "-=0.15"
        );
      }
    },
    { dependencies: [sideOpen] }
  );

  // ── Mount animation ────────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!headerRef.current) return;
      gsap.fromTo(
        headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    },
    { scope: headerRef }
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const close = () => setSideOpen(false);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-[300] w-full bg-white will-change-transform"
        style={{ opacity: 0 }}
      >
        {/* Desktop nav */}
        <nav className="hidden h-[76px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 md:grid lg:h-[80px] lg:gap-5 lg:px-5 xl:h-[84px] xl:gap-8 xl:px-7 2xl:px-10">
          {/* Logo */}
          <Link
            ref={logoRef}
            href="/"
            className="relative z-20 flex shrink-0 items-center group"
            aria-label="The Choice Company Home"
          >
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={195}
              height={90}
              priority
              className="h-auto w-[120px] object-contain transition-transform duration-300 group-hover:scale-105 lg:w-[135px] xl:w-[150px]"
            />
          </Link>

          {/* Nav links */}
          <div className="min-w-0">
            <ul className="flex items-center justify-center gap-0 lg:gap-0.5 xl:gap-1">
              {NAV_LINKS.map(({ href, label, highlight, badge }) => (
                <li key={href} className="relative shrink-0">
                  {highlight ? (
                    <Link
                      href={href}
                      className="group flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-[10px] font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg lg:px-2.5 lg:text-[11px] xl:gap-1.5 xl:px-4 xl:py-2.5 xl:text-[13px]"
                      style={{
                        background:
                          "linear-gradient(135deg,var(--teal),var(--navy))",
                      }}
                    >
                      <span className="transition-transform duration-300 group-hover:rotate-12">
                        ✨
                      </span>
                      {label}
                    </Link>
                  ) : (
                    <Link
                      href={href}
                      className={`group relative flex items-center whitespace-nowrap rounded-lg px-1.5 py-2 text-[10px] transition-all duration-200 lg:px-2 lg:text-[11px] xl:px-3 xl:py-2.5 xl:text-[13px] ${isActive(href)
                        ? "font-semibold text-navy"
                        : "font-medium text-gray-600 hover:text-navy"
                        }`}
                    >
                      {label}
                      {badge && (
                        <span
                          className="absolute -right-1 -top-1.5 rounded-full px-1 py-[2px] text-[7px] font-bold leading-none text-white shadow-sm lg:px-1.5 lg:text-[8px]"
                          style={{ background: "var(--orange)" }}
                        >
                          {badge}
                        </span>
                      )}
                      {/* Active / hover underline */}
                      <span
                        className={`absolute bottom-0.5 left-1.5 right-1.5 h-[2px] origin-center rounded-full transition-all duration-300 xl:left-3 xl:right-3 ${isActive(href)
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50"
                          }`}
                        style={{ background: "var(--gold)" }}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="relative z-20 flex shrink-0 items-center justify-end gap-2 lg:gap-3">
            <CartIcon />
            <Link
              href="/bulk-orders#inquiry-form"
              className="btn-navy hidden rounded-xl px-3 py-2 text-[11px] font-semibold whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:block lg:px-4 lg:py-2.5 lg:text-[12px] xl:px-5 xl:text-[13px]"
            >
              Get Quote
            </Link>
          </div>
        </nav>

        {/* Mobile top bar */}
        <div className="flex h-[70px] w-full items-center justify-between px-4 sm:px-6 md:hidden">
          <Link href="/" aria-label="The Choice Company Home">
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={135}
              height={55}
              priority
              className="h-auto w-[125px] object-contain sm:w-[135px]"
            />
          </Link>
          <div className="flex items-center gap-1">
            <CartIcon />
            <button
              type="button"
              onClick={() => setSideOpen(true)}
              aria-label="Open menu"
              aria-expanded={sideOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl transition-colors hover:bg-gray-100"
            >
              <span className="block h-[2px] w-[22px] rounded-full bg-navy transition-all" />
              <span className="ml-[6px] block h-[2px] w-[16px] self-start rounded-full bg-navy transition-all" />
              <span className="block h-[2px] w-[22px] rounded-full bg-navy transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile backdrop ──────────────────────────────────────────────────── */}
      <div
        ref={backdropRef}
        onClick={close}
        aria-hidden
        className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px] opacity-0 pointer-events-none md:hidden"
      />

      {/* ── Mobile sidebar ───────────────────────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 z-[201] flex h-dvh w-[300px] max-w-[88vw] flex-col bg-white shadow-2xl md:hidden will-change-transform"
        style={{ transform: "translateX(-100%)" }}
      >
        {/* Header */}
        <div
          className="flex h-[76px] shrink-0 items-center justify-between px-5"
          style={{ background: "var(--navy)" }}
        >
          <Link href="/" onClick={close}>
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={135}
              height={55}
              priority
              className="h-auto w-[115px] object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl font-light text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            ×
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Navigation
          </p>
          <ul className="space-y-1">
            {NAV_LINKS.map(({ href, label, highlight, badge }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className={`nav-item group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-[14px] transition-all duration-200 opacity-0 ${highlight
                    ? "font-bold text-white shadow-sm"
                    : isActive(href)
                      ? "font-semibold"
                      : "font-medium text-gray-700 hover:bg-gray-50"
                    }`}
                  style={
                    highlight
                      ? { background: "linear-gradient(135deg,var(--teal),var(--navy))" }
                      : isActive(href)
                        ? { background: "rgba(13,27,42,0.06)", color: "var(--navy)" }
                        : undefined
                  }
                >
                  {isActive(href) && !highlight && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
                  )}
                  {highlight && <span>✨</span>}
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className="rounded-full px-2 py-1 text-[9px] font-bold leading-none text-white"
                      style={{ background: "var(--orange)" }}
                    >
                      {badge}
                    </span>
                  )}
                  {!highlight && (
                    <span className="text-gray-300 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50 p-4">
          <Link
            href="/bulk-orders#inquiry-form"
            onClick={close}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
            style={{ background: "var(--navy)" }}
          >
            📋 Get a Bulk Quote
          </Link>
          <Link
            href="/cart"
            onClick={close}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 bg-white py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
            style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
          >
            🛒 View Cart
          </Link>
        </div>

        {/* Brand footer */}
        <div className="shrink-0 px-5 py-3 text-center" style={{ background: "var(--navy)" }}>
          <p className="text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
            Making Every Gift Memorable
          </p>
        </div>
      </aside>
    </>
  );
}

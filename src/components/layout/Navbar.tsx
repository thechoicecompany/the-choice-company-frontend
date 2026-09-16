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

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import CartIcon from "@/components/cart/CartIcon";

// gsap.registerPlugin(useGSAP);

// const NAV_LINKS = [
//   { href: "/", label: "Home" },
//   { href: "/about", label: "About Us" },
//   { href: "/products", label: "Our Products" },
//   { href: "/shop", label: "Sample Shop", badge: "Try Now" },
//   { href: "/industries", label: "Industries" },
//   { href: "/gallery", label: "Gallery" },
//   { href: "/blog", label: "Blog" },
//   { href: "/contact", label: "Contact Us" },
// ];

// export default function NavbarAnimated() {
//   const pathname = usePathname();
//   const [scrolled, setScrolled] = useState(false);
//   const [sideOpen, setSideOpen] = useState(false);
//   const [trustVisible, setTrustVisible] = useState(true);

//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const trustRef = useRef<HTMLDivElement>(null);
//   const pillRef = useRef<HTMLDivElement>(null);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const backdropRef = useRef<HTMLDivElement>(null);
//   const indicatorRef = useRef<HTMLSpanElement>(null);
//   const navListRef = useRef<HTMLUListElement>(null);

//   // ── Scroll: hide trust strip + morph pill ──────────────────────────────────
//   useEffect(() => {
//     const onScroll = () => {
//       const y = window.scrollY;
//       setScrolled(y > 20);
//       setTrustVisible(y < 40);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // ── Trust strip slide out on scroll ────────────────────────────────────────
//   useGSAP(
//     () => {
//       const trust = trustRef.current;
//       if (!trust) return;
//       gsap.to(trust, {
//         height: trustVisible ? "auto" : 0,
//         opacity: trustVisible ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//       });
//     },
//     { dependencies: [trustVisible] }
//   );

//   // ── Mount animation ─────────────────────────────────────────────────────────
//   useGSAP(
//     () => {
//       if (!wrapperRef.current) return;
//       gsap.fromTo(
//         wrapperRef.current,
//         { y: -100, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.9, ease: "power4.out", delay: 0.15 }
//       );
//     },
//     { scope: wrapperRef }
//   );

//   // ── Pill glass morph on scroll ──────────────────────────────────────────────
//   useGSAP(
//     () => {
//       const pill = pillRef.current;
//       if (!pill) return;
//       gsap.to(pill, {
//         boxShadow: scrolled
//           ? "0 8px 32px rgba(13,27,42,0.10), 0 1.5px 0 rgba(255,255,255,0.55) inset, 0 -1px 0 rgba(13,27,42,0.06) inset"
//           : "0 2px 12px rgba(13,27,42,0.06), 0 1px 0 rgba(255,255,255,0.4) inset",
//         duration: 0.45,
//         ease: "power2.out",
//       });
//     },
//     { dependencies: [scrolled] }
//   );

//   // ── Gliding active indicator ────────────────────────────────────────────────
//   useEffect(() => {
//     const list = navListRef.current;
//     const indicator = indicatorRef.current;
//     if (!list || !indicator) return;

//     const activeLink = list.querySelector<HTMLElement>("[data-active='true']");
//     if (!activeLink) {
//       gsap.to(indicator, { opacity: 0, duration: 0.2 });
//       return;
//     }

//     const listRect = list.getBoundingClientRect();
//     const linkRect = activeLink.getBoundingClientRect();

//     gsap.to(indicator, {
//       x: linkRect.left - listRect.left,
//       width: linkRect.width,
//       opacity: 1,
//       duration: 0.4,
//       ease: "power3.out",
//     });
//   }, [pathname]);

//   // ── Sidebar open / close ────────────────────────────────────────────────────
//   useGSAP(
//     () => {
//       const sidebar = sidebarRef.current;
//       const backdrop = backdropRef.current;
//       if (!sidebar || !backdrop) return;

//       if (sideOpen) {
//         document.body.style.overflow = "hidden";
//         gsap.set(sidebar, { x: "-100%" });
//         gsap.set(backdrop, { opacity: 0, pointerEvents: "auto" });

//         const tl = gsap.timeline();
//         tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" })
//           .to(sidebar, { x: "0%", duration: 0.42, ease: "power3.out" }, "-=0.2");

//         const items = sidebar.querySelectorAll(".nav-item");
//         tl.fromTo(
//           items,
//           { opacity: 0, x: -18 },
//           { opacity: 1, x: 0, stagger: 0.048, duration: 0.32, ease: "power2.out" },
//           "-=0.15"
//         );
//       } else {
//         document.body.style.overflow = "";
//         const tl = gsap.timeline({
//           onComplete: () => {
//             if (backdrop) backdrop.style.pointerEvents = "none";
//           },
//         });
//         tl.to(sidebar, { x: "-100%", duration: 0.35, ease: "power3.in" }).to(
//           backdrop,
//           { opacity: 0, duration: 0.25, ease: "power2.in" },
//           "-=0.15"
//         );
//       }
//     },
//     { dependencies: [sideOpen] }
//   );

//   const isActive = (href: string) =>
//     href === "/" ? pathname === "/" : pathname.startsWith(href);

//   const close = () => setSideOpen(false);

//   return (
//     <>
//       {/* ── Fixed wrapper: trust strip + pill ──────────────────────────────── */}
//       <div
//         ref={wrapperRef}
//         className="fixed top-0 left-0 right-0 z-[300] flex flex-col items-center pointer-events-none"
//         style={{ opacity: 0 }}
//       >
//         {/* ── Trust strip ──────────────────────────────────────────────────── */}
//         <div
//           ref={trustRef}
//           className="pointer-events-auto w-full overflow-hidden"
//         >
//           <div
//             className="flex items-center justify-center gap-6 px-4 py-[7px] text-[11px] font-medium text-white/90 md:gap-10 md:text-[11.5px]"
//             style={{ background: "var(--navy)" }}
//           >
//             {/* Trust items — swap these out for your actual TrustStrip component if you have one */}
//             <span className="flex items-center gap-1.5 shrink-0">
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//               </svg>
//               Trusted by 500+ Companies
//             </span>
//             <span className="hidden sm:flex items-center gap-1.5 shrink-0">
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
//                 <rect x="1" y="3" width="15" height="13" rx="1" />
//                 <path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
//               </svg>
//               Free Delivery on Bulk Orders
//             </span>
//             <span className="hidden md:flex items-center gap-1.5 shrink-0">
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//               100% Custom Branding
//             </span>
//             <span className="hidden lg:flex items-center gap-1.5 shrink-0">
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
//                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//               </svg>
//               Premium Quality Guaranteed
//             </span>
//           </div>
//         </div>

//         {/* ── Liquid Glass Pill ─────────────────────────────────────────────── */}
//         <div className="pointer-events-auto w-full max-w-[1180px] px-4 pt-2 pb-2">
//           <div
//             ref={pillRef}
//             className="w-full rounded-[999px] border border-white/50 bg-white/60"
//             style={{
//               backdropFilter: "blur(18px) saturate(1.4)",
//               WebkitBackdropFilter: "blur(18px) saturate(1.4)",
//               boxShadow:
//                 "0 2px 12px rgba(13,27,42,0.06), 0 1px 0 rgba(255,255,255,0.4) inset",
//             }}
//           >
//             {/* ── Desktop nav ───────────────────────────────────────────────── */}
//             <nav className="hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 h-[62px] lg:h-[66px] lg:px-5 xl:px-6">
//               {/* Logo */}
//               <Link
//                 href="/"
//                 className="relative z-20 flex shrink-0 items-center group"
//                 aria-label="The Choice Company Home"
//               >
//                 <Image
//                   src="/logo.png"
//                   alt="The Choice Company"
//                   width={195}
//                   height={90}
//                   priority
//                   className="h-auto w-[108px] object-contain transition-transform duration-300 group-hover:scale-105 lg:w-[122px] xl:w-[138px]"
//                 />
//               </Link>

//               {/* Nav links */}
//               <div className="flex justify-center min-w-0">
//                 <div className="relative">
//                   {/* Gliding pill indicator */}
//                   <span
//                     ref={indicatorRef}
//                     aria-hidden
//                     className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[32px] rounded-full opacity-0"
//                     style={{ background: "rgba(13,27,42,0.07)" }}
//                   />
//                   <ul
//                     ref={navListRef}
//                     className="relative flex items-center gap-0.5 xl:gap-1"
//                   >
//                     {NAV_LINKS.map(({ href, label, badge }) => {
//                       const active = isActive(href);
//                       return (
//                         <li key={href} className="relative shrink-0">
//                           <Link
//                             href={href}
//                             data-active={active ? "true" : "false"}
//                             className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] xl:text-[12.5px] transition-colors duration-200 ${active
//                               ? "font-semibold text-[var(--navy)]"
//                               : "font-medium text-gray-500 hover:text-[var(--navy)]"
//                               }`}
//                           >
//                             {label}
//                             {badge && (
//                               <span
//                                 className="rounded-full px-1.5 py-[2px] text-[8px] font-bold leading-none text-white shadow-sm"
//                                 style={{ background: "var(--orange)" }}
//                               >
//                                 {badge}
//                               </span>
//                             )}
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               </div>

//               {/* Right actions */}
//               <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
//                 <CartIcon />
//                 <Link
//                   href="/bulk-orders#inquiry-form"
//                   className="hidden lg:flex items-center whitespace-nowrap rounded-full px-4 py-2 text-[11.5px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md xl:px-5 xl:text-[12.5px]"
//                   style={{
//                     background: "linear-gradient(135deg, var(--teal), var(--navy))",
//                   }}
//                 >
//                   Get Quote
//                 </Link>
//               </div>
//             </nav>

//             {/* ── Mobile top bar ─────────────────────────────────────────────── */}
//             <div className="flex md:hidden h-[58px] w-full items-center justify-between px-4 sm:px-5">
//               <Link href="/" aria-label="The Choice Company Home">
//                 <Image
//                   src="/logo.png"
//                   alt="The Choice Company"
//                   width={135}
//                   height={55}
//                   priority
//                   className="h-auto w-[110px] object-contain sm:w-[122px]"
//                 />
//               </Link>
//               <div className="flex items-center gap-1">
//                 <CartIcon />
//                 <button
//                   type="button"
//                   onClick={() => setSideOpen(true)}
//                   aria-label="Open menu"
//                   aria-expanded={sideOpen}
//                   className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-black/5"
//                 >
//                   <span className="block h-[1.5px] w-[20px] rounded-full bg-[var(--navy)]" />
//                   <span className="ml-[5px] block h-[1.5px] w-[14px] self-start rounded-full bg-[var(--navy)]" />
//                   <span className="block h-[1.5px] w-[20px] rounded-full bg-[var(--navy)]" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Spacer: trust strip height + pill height ───────────────────────── */}
//       <div className="h-[calc(34px+70px)] md:h-[calc(34px+78px)] lg:h-[calc(34px+82px)]" aria-hidden />

//       {/* ── Mobile backdrop ──────────────────────────────────────────────────── */}
//       <div
//         ref={backdropRef}
//         onClick={close}
//         aria-hidden
//         className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px] opacity-0 pointer-events-none md:hidden"
//       />

//       {/* ── Mobile sidebar ───────────────────────────────────────────────────── */}
//       <aside
//         ref={sidebarRef}
//         className="fixed left-0 top-0 z-[201] flex h-dvh w-[300px] max-w-[88vw] flex-col bg-white/85 shadow-2xl md:hidden will-change-transform"
//         style={{
//           transform: "translateX(-100%)",
//           backdropFilter: "blur(24px) saturate(1.5)",
//           WebkitBackdropFilter: "blur(24px) saturate(1.5)",
//         }}
//       >
//         {/* Sidebar header */}
//         <div
//           className="flex h-[68px] shrink-0 items-center justify-between px-5 border-b border-white/20"
//           style={{ background: "var(--navy)" }}
//         >
//           <Link href="/" onClick={close}>
//             <Image
//               src="/logo.png"
//               alt="The Choice Company"
//               width={135}
//               height={55}
//               priority
//               className="h-auto w-[108px] object-contain"
//             />
//           </Link>
//           <button
//             type="button"
//             onClick={close}
//             aria-label="Close menu"
//             className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-light text-white/60 hover:bg-white/10 hover:text-white transition-all"
//           >
//             ×
//           </button>
//         </div>

//         {/* Sidebar nav */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4">
//           <p className="px-4 pb-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-gray-400">
//             Navigation
//           </p>
//           <ul className="space-y-0.5">
//             {NAV_LINKS.map(({ href, label, badge }) => {
//               const active = isActive(href);
//               return (
//                 <li key={href}>
//                   <Link
//                     href={href}
//                     onClick={close}
//                     className={`nav-item group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-[13.5px] transition-all duration-200 opacity-0 ${active
//                       ? "font-semibold"
//                       : "font-medium text-gray-700 hover:bg-gray-50"
//                       }`}
//                     style={
//                       active
//                         ? { background: "rgba(13,27,42,0.06)", color: "var(--navy)" }
//                         : undefined
//                     }
//                   >
//                     {active && (
//                       <span
//                         className="h-1.5 w-1.5 shrink-0 rounded-full"
//                         style={{ background: "var(--gold)" }}
//                       />
//                     )}
//                     <span className="flex-1">{label}</span>
//                     {badge && (
//                       <span
//                         className="rounded-full px-2 py-[3px] text-[9px] font-bold leading-none text-white"
//                         style={{ background: "var(--orange)" }}
//                       >
//                         {badge}
//                       </span>
//                     )}
//                     {!active && (
//                       <span className="text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5">
//                         →
//                       </span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Sidebar CTA */}
//         <div className="shrink-0 border-t border-gray-100 bg-white/60 p-4 space-y-2">
//           <Link
//             href="/bulk-orders#inquiry-form"
//             onClick={close}
//             className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-[1px] hover:shadow-md transition-all"
//             style={{ background: "var(--navy)" }}
//           >
//             Get a Bulk Quote
//           </Link>
//           <Link
//             href="/cart"
//             onClick={close}
//             className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
//             style={{ color: "var(--navy)" }}
//           >
//             View Cart
//           </Link>
//         </div>

//         {/* Brand footer */}
//         <div
//           className="shrink-0 px-5 py-3 text-center"
//           style={{ background: "var(--navy)" }}
//         >
//           <p
//             className="text-[9px] font-medium uppercase tracking-[0.2em]"
//             style={{ color: "var(--gold)" }}
//           >
//             Making Every Gift Memorable
//           </p>
//         </div>
//       </aside>
//     </>
//   );
// }
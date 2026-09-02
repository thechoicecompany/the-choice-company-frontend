"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CartIcon from "@/components/cart/CartIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Our Products" },
  { href: "/shop", label: "Sample Shop", badge: "Try Now" },
  { href: "/industries", label: "Industries" },
  {
    href: "/build-your-kit",
    label: "Build Your Kit",
    highlight: true,
  },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // SCROLL SHADOW
  // =========================================================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // CLOSE SIDEBAR WHEN ROUTE CHANGES
  // =========================================================
  useEffect(() => {
    setSideOpen(false);
  }, [pathname]);

  // =========================================================
  // CLOSE SIDEBAR WHEN CLICKING OUTSIDE
  // =========================================================
  useEffect(() => {
    if (!sideOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSideOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [sideOpen]);

  // =========================================================
  // LOCK BODY SCROLL WHEN SIDEBAR IS OPEN
  // =========================================================
  useEffect(() => {
    document.body.style.overflow = sideOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sideOpen]);

  // =========================================================
  // ACTIVE ROUTE
  // =========================================================
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header
        className="
          sticky
          top-0
          z-[100]
          w-full
          bg-white
          transition-all
          duration-300
        "
        style={{
          boxShadow: scrolled
            ? "0 8px 30px rgba(13, 27, 42, 0.10)"
            : "0 1px 0 rgba(0,0,0,0.06)",
        }}
      >
        {/* ===================================================
            DESKTOP NAVBAR
            md and above
        ==================================================== */}
        <nav
          className="
            hidden
            h-[76px]
            w-full
            grid-cols-[auto_minmax(0,1fr)_auto]
            items-center
            gap-3
            px-4
            md:grid
            lg:h-[80px]
            lg:gap-5
            lg:px-5
            xl:h-[84px]
            xl:gap-8
            xl:px-7
            2xl:px-10
        "
        >
          {/* =================================================
              LEFT — LOGO
          ================================================== */}
          <Link
            href="/"
            className="
              relative
              z-20
              flex
              shrink-0
              items-center
            "
            aria-label="The Choice Company Home"
          >
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={195}
              height={90}
              priority
              className="
                h-auto
                w-[120px]
                object-contain
                lg:w-[135px]
                xl:w-[150px]
                2xl:w-[165px]
              "
            />
          </Link>

          {/* =================================================
              CENTER — NAVIGATION
          ================================================== */}
          <div className="min-w-0">
            <ul
              className="
                flex
                items-center
                justify-center
                gap-0
                lg:gap-0.5
                xl:gap-1
              "
            >
              {NAV_LINKS.map(
                ({
                  href,
                  label,
                  highlight,
                  badge,
                }) => (
                  <li
                    key={href}
                    className="relative shrink-0"
                  >
                    {highlight ? (
                      /* =======================================
                         BUILD YOUR KIT
                      ======================================== */
                      <Link
                        href={href}
                        className="
                          group
                          flex
                          items-center
                          gap-1
                          whitespace-nowrap
                          rounded-full
                          px-2
                          py-2
                          text-[10px]
                          font-bold
                          text-white
                          shadow-sm
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:shadow-md
                          lg:gap-1
                          lg:px-2.5
                          lg:text-[11px]
                          xl:gap-1.5
                          xl:px-4
                          xl:py-2.5
                          xl:text-[13px]
                        "
                        style={{
                          background:
                            "linear-gradient(135deg,var(--teal),var(--navy))",
                        }}
                      >
                        <span
                          className="
                            transition-transform
                            duration-200
                            group-hover:rotate-6
                          "
                        >
                          ✨
                        </span>

                        {label}
                      </Link>
                    ) : (
                      /* =======================================
                         NORMAL NAV LINK
                      ======================================== */
                      <Link
                        href={href}
                        className={`
                          group
                          relative
                          flex
                          items-center
                          whitespace-nowrap
                          rounded-lg
                          px-1.5
                          py-2
                          text-[10px]
                          transition-all
                          duration-200
                          lg:px-2
                          lg:text-[11px]
                          xl:px-3
                          xl:py-2.5
                          xl:text-[13px]

                          ${isActive(href)
                            ? "font-semibold text-[color:var(--navy)]"
                            : "font-medium text-gray-600 hover:text-[color:var(--navy)]"
                          }
                        `}
                      >
                        {label}

                        {/* TRY NOW BADGE */}
                        {badge && (
                          <span
                            className="
                              absolute
                              -right-1
                              -top-1.5
                              rounded-full
                              px-1
                              py-[2px]
                              text-[7px]
                              font-bold
                              leading-none
                              text-white
                              shadow-sm
                              lg:-right-1.5
                              lg:-top-2
                              lg:px-1.5
                              lg:py-[3px]
                              lg:text-[8px]
                            "
                            style={{
                              background:
                                "var(--orange)",
                            }}
                          >
                            {badge}
                          </span>
                        )}

                        {/* ACTIVE / HOVER LINE */}
                        <span
                          className={`
                            absolute
                            bottom-0.5
                            left-1.5
                            right-1.5
                            h-[2px]
                            origin-center
                            rounded-full
                            transition-all
                            duration-200
                            xl:left-3
                            xl:right-3

                            ${isActive(href)
                              ? "scale-x-100 opacity-100"
                              : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50"
                            }
                          `}
                          style={{
                            background:
                              "var(--gold)",
                          }}
                        />
                      </Link>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* =================================================
              RIGHT — CART + GET QUOTE
          ================================================== */}
          <div
            className="
              relative
              z-20
              flex
              shrink-0
              items-center
              justify-end
              gap-2
              lg:gap-3
            "
          >
            {/* CART */}
            <div
              className="
                flex
                items-center
                justify-center
              "
            >
              <CartIcon />
            </div>

            {/* GET QUOTE */}
            <Link
              href="/bulk-orders#inquiry-form"
              className="
                btn-navy
                hidden
                rounded-xl
                px-3
                py-2
                text-[11px]
                font-semibold
                whitespace-nowrap
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                lg:block
                lg:px-4
                lg:py-2.5
                lg:text-[12px]
                xl:px-5
                xl:text-[13px]
              "
            >
              Get Quote
            </Link>
          </div>
        </nav>

        {/* =====================================================
            MOBILE TOP BAR
            Below md
        ====================================================== */}
        <div
          className="
            flex
            h-[70px]
            w-full
            items-center
            justify-between
            px-4
            sm:px-6
            md:hidden
          "
        >
          {/* MOBILE LOGO */}
          <Link
            href="/"
            className="
              flex
              shrink-0
              items-center
            "
            aria-label="The Choice Company Home"
          >
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={135}
              height={55}
              priority
              className="
                h-auto
                w-[125px]
                object-contain
                sm:w-[135px]
              "
            />
          </Link>

          {/* MOBILE RIGHT ACTIONS */}
          <div className="flex items-center gap-1">
            {/* CART */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
              "
            >
              <CartIcon />
            </div>

            {/* HAMBURGER */}
            <button
              type="button"
              onClick={() => setSideOpen(true)}
              aria-label="Open menu"
              aria-expanded={sideOpen}
              className="
                flex
                h-10
                w-10
                flex-col
                items-center
                justify-center
                gap-[5px]
                rounded-xl
                transition-colors
                hover:bg-gray-100
              "
            >
              <span
                className="
                  block
                  h-[2px]
                  w-[22px]
                  rounded-full
                "
                style={{
                  background: "var(--navy)",
                }}
              />

              <span
                className="
                  ml-[9px]
                  block
                  h-[2px]
                  w-[16px]
                  self-start
                  rounded-full
                "
                style={{
                  background: "var(--navy)",
                }}
              />

              <span
                className="
                  block
                  h-[2px]
                  w-[22px]
                  rounded-full
                "
                style={{
                  background: "var(--navy)",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE SIDEBAR BACKDROP
      ========================================================== */}
      <div
        onClick={() => setSideOpen(false)}
        aria-hidden="true"
        className={`
          fixed
          inset-0
          z-[200]
          bg-black/45
          backdrop-blur-[2px]
          transition-all
          duration-300
          md:hidden

          ${sideOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* =========================================================
          MOBILE SIDEBAR
      ========================================================== */}
      <aside
        ref={sidebarRef}
        className={`
          fixed
          left-0
          top-0
          z-[201]
          flex
          h-dvh
          w-[300px]
          max-w-[88vw]
          flex-col
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          md:hidden

          ${sideOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* =====================================================
            SIDEBAR HEADER
        ====================================================== */}
        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            justify-between
            px-5
          "
          style={{
            background: "var(--navy)",
          }}
        >
          <Link
            href="/"
            onClick={() => setSideOpen(false)}
          >
            <Image
              src="/logo.png"
              alt="The Choice Company"
              width={135}
              height={55}
              priority
              className="
                h-auto
                w-[115px]
                object-contain
              "
            />
          </Link>

          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setSideOpen(false)}
            aria-label="Close menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-2xl
              font-light
              leading-none
              text-white/70
              transition-all
              hover:bg-white/10
              hover:text-white
            "
          >
            ×
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}
        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-4
          "
        >
          <p
            className="
              px-4
              pb-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-gray-400
            "
          >
            Navigation
          </p>

          <ul className="space-y-1">
            {NAV_LINKS.map(
              ({
                href,
                label,
                highlight,
                badge,
              }) => {
                const active = isActive(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() =>
                        setSideOpen(false)
                      }
                      className={`
                        group
                        flex
                        min-h-[48px]
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        text-[14px]
                        transition-all
                        duration-200

                        ${highlight
                          ? "font-bold text-white shadow-sm"
                          : active
                            ? "font-semibold"
                            : "font-medium text-gray-700 hover:bg-gray-50"
                        }
                      `}
                      style={
                        highlight
                          ? {
                            background:
                              "linear-gradient(135deg,var(--teal),var(--navy))",
                          }
                          : active
                            ? {
                              background:
                                "rgba(13,27,42,0.06)",
                              color:
                                "var(--navy)",
                            }
                            : undefined
                      }
                    >
                      {/* ACTIVE INDICATOR */}
                      {active && !highlight && (
                        <span
                          className="
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                          "
                          style={{
                            background:
                              "var(--gold)",
                          }}
                        />
                      )}

                      {highlight && (
                        <span>✨</span>
                      )}

                      <span className="flex-1">
                        {label}
                      </span>

                      {/* BADGE */}
                      {badge && (
                        <span
                          className="
                            rounded-full
                            px-2
                            py-1
                            text-[9px]
                            font-bold
                            leading-none
                            text-white
                          "
                          style={{
                            background:
                              "var(--orange)",
                          }}
                        >
                          {badge}
                        </span>
                      )}

                      {/* ARROW */}
                      {!highlight && (
                        <span
                          className="
                            text-gray-300
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                          "
                        >
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </nav>

        {/* =====================================================
            MOBILE CTA AREA
        ====================================================== */}
        <div
          className="
            shrink-0
            border-t
            border-gray-100
            bg-gray-50
            p-4
          "
        >
          <Link
            href="/bulk-orders#inquiry-form"
            onClick={() => setSideOpen(false)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
            "
            style={{
              background: "var(--navy)",
            }}
          >
            📋 Get a Bulk Quote
          </Link>

          <Link
            href="/cart"
            onClick={() => setSideOpen(false)}
            className="
              mt-2
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border-2
              bg-white
              py-3
              text-sm
              font-semibold
              transition-colors
              hover:bg-gray-50
            "
            style={{
              borderColor: "var(--navy)",
              color: "var(--navy)",
            }}
          >
            🛒 View Cart
          </Link>
        </div>

        {/* =====================================================
            BRAND FOOTER
        ====================================================== */}
        <div
          className="
            shrink-0
            px-5
            py-3
            text-center
          "
          style={{
            background: "var(--navy)",
          }}
        >
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
            "
            style={{
              color: "var(--gold)",
            }}
          >
            Making Every Gift Memorable
          </p>
        </div>
      </aside>
    </>
  );
}
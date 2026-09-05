"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  { icon: "🏅", iconLabel: "Medal", title: "Premium Quality", desc: "Curated products from verified manufacturers with strict quality checks" },
  { icon: "✏", iconLabel: "Pencil", title: "Custom Branding", desc: "Logo printing, embroidery, laser engraving, and full custom packaging" },
  { icon: "⚡", iconLabel: "Lightning bolt", title: "Fast Production", desc: "7–15 day turnaround for most orders, rush options available" },
  { icon: "📦", iconLabel: "Package box", title: "Bulk Order Experts", desc: "Handling orders from 50 to 50,000+ units with consistent quality" },
  { icon: "🔍", iconLabel: "Magnifying glass", title: "Quality Check", desc: "100% inspection before dispatch — zero defective units shipped" },
  { icon: "🤝", iconLabel: "Handshake", title: "Dedicated Support", desc: "Personal account manager for every client from inquiry to delivery" },
];

export default function WhyChooseUs() {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll<HTMLElement>("li"));

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      items.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .wcu-card {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.5s ease,
            transform 0.5s ease,
            border-color 0.25s ease,
            background-color 0.25s ease;
        }
        .wcu-card.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section
        className="section-py"
        style={{ background: "var(--navy)" }}
        aria-labelledby="why-choose-us-heading"
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="section-label text-gold">OUR PROMISE</span>
            <h2
              id="why-choose-us-heading"
              className="section-title text-white"
            >
              Why Choose The Choice Company?
            </h2>
          </div>

          <ul
            ref={gridRef}
            role="list"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 list-none p-0 m-0"
          >
            {ITEMS.map(({ icon, iconLabel, title, desc }) => (
              <li
                key={title}
                className="wcu-card text-center p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10"
              >
                <span
                  role="img"
                  aria-label={iconLabel}
                  className="block text-3xl mb-3"
                >
                  {icon}
                </span>
                <dl className="m-0">
                  <dt className="text-sm font-bold text-white mb-2">{title}</dt>
                  <dd className="text-[11px] text-white/50 leading-relaxed m-0">
                    {desc}
                  </dd>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const CATEGORIES = [
  // Festive & occasion-based
  { slug: "diwali-gifts", label: "Diwali Gifts", emoji: "🪔" },
  { slug: "holi-gifts", label: "Holi Gifts", emoji: "🎨" },
  { slug: "new-year-gifts", label: "New Year Gifts", emoji: "🎊" },
  { slug: "christmas-gifts", label: "Christmas Gifts", emoji: "🎄" },
  { slug: "festive-hampers", label: "Festive Hampers", emoji: "🧨" },

  // Product-type categories
  { slug: "gift-hampers", label: "Gift Hampers", emoji: "🎁" },
  { slug: "laptop-bags", label: "Laptop Bags", emoji: "💼" },
  { slug: "backpacks", label: "Backpacks", emoji: "🎒" },
  { slug: "trolley-bags", label: "Trolley Bags", emoji: "🧳" },
  { slug: "drinkware", label: "Drinkware", emoji: "🥤" },
  { slug: "office-essentials", label: "Office Desk", emoji: "📝" },
  { slug: "electronics", label: "Electronics", emoji: "🖥" },
  { slug: "apparel", label: "Apparel", emoji: "👕" },
  { slug: "travel-kits", label: "Travel Kits", emoji: "✈" },
  { slug: "eco-friendly", label: "Eco-Friendly", emoji: "♻️" },
  { slug: "premium", label: "Premium Gifts", emoji: "💎" },
  { slug: "custom-merchandise", label: "Custom Merch", emoji: "🏷" },

  // Corporate occasion categories
  { slug: "employee-welcome", label: "Employee Welcome", emoji: "🙌" },
  { slug: "work-anniversary", label: "Work Anniversary", emoji: "🏆" },
  { slug: "client-appreciation", label: "Client Appreciation", emoji: "🤝" },
  { slug: "conference-kits", label: "Conference Kits", emoji: "📋" },
  { slug: "retirement-gifts", label: "Retirement Gifts", emoji: "🎖" },
  { slug: "wedding-gifts", label: "Wedding Gifts", emoji: "💍" },
  { slug: "dealer-meet-gifts", label: "Dealer Meet Gifts", emoji: "👏" },
  { slug: "womens-day-gifts", label: "Women's Day", emoji: "🌸" },
];

export default function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "l" | "r") => ref.current?.scrollBy({ left: dir === "l" ? -300 : 300, behavior: "smooth" });

  return (
    <section className="section-py" style={{ background: "var(--cream)" }}>
      <div className="container-site">
        <div className="text-center mb-8">
          <span className="section-label">SHOP BY CATEGORY</span>
        </div>
        <div className="relative">
          <button onClick={() => scroll("l")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg" aria-label="Scroll left">‹</button>
          <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar px-2 pb-2">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/products/category/${cat.slug}`}
                //  href={`/products?category=${cat.slug}`}
                className="flex-shrink-0 w-[120px] group">
                <div className="w-full aspect-square rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-4xl group-hover:border-gold group-hover:shadow-md transition-all mb-2">
                  {cat.emoji}
                </div>
                <p className="text-[12px] font-medium text-center text-gray-600 group-hover:text-gold transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
          <button onClick={() => scroll("r")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg" aria-label="Scroll right">›</button>
        </div>
      </div>
    </section>
  );
}

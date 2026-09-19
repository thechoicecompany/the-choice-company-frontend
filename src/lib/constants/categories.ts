export interface CategoryDef {
  slug: string;
  label: string;
  color: string;   // background tint behind the image
  image: string;   // path to the image, e.g. "/categories/diwali-gifts.jpg"
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "diwali-gifts", label: "Diwali Gifts", color: "bg-orange-50", image: "/categories/Diwali Gift.png" },
  { slug: "new-year-gifts", label: "New Year Gifts", color: "bg-purple-50", image: "/categories/New Year.png" },
  { slug: "christmas-gifts", label: "Christmas Gifts", color: "bg-green-50", image: "/categories/Christmas Gifts.png" },
  { slug: "festive-hampers", label: "Festive Hampers", color: "bg-yellow-50", image: "/categories/Festive Hampers.png" },
  { slug: "electronics", label: "Electronics", color: "bg-blue-50", image: "/categories/Electronic.png" },
  {
    slug: "grooming-products",
    label: "Grooming Products",
    color: "bg-violet-50",
    image: "/categories/VEGA Grooming.png"
  },

  {
    slug: "utility-products",
    label: "Utility Products",
    color: "bg-amber-50",
    image: "/categories/Utility Products Kenstar.png"
  },
  { slug: "trolley-bags", label: "Trolley Bags", color: "bg-slate-50", image: "/categories/Trolley Bags.png" },
  { slug: "gift-hampers", label: "Gift Hampers", color: "bg-pink-50", image: "/categories/Gift Hampers.png" },
  { slug: "laptop-bags", label: "Laptop Bags", color: "bg-gray-50", image: "/categories/Laptop Bags.png" },
  { slug: "backpacks", label: "Backpacks", color: "bg-teal-50", image: "/categories/Backpacks.png" },
  { slug: "drinkware", label: "Drinkware", color: "bg-orange-50", image: "/categories/Drinkware.png" },
  { slug: "desk-essentials", label: "Desk Essentials", color: "bg-indigo-50", image: "/categories/Office Essentials.png" },
  { slug: "stationery", label: "Stationery", color: "bg-lime-50", image: "/categories/Stationery.png" },
  { slug: "apparel", label: "Apparel", color: "bg-fuchsia-50", image: "/categories/Apparel.png" },
  { slug: "wellness", label: "Wellness", color: "bg-rose-50", image: "/categories/Wellness.png" },
  { slug: "eco-friendly-gifts", label: "Eco-Friendly Gifts", color: "bg-emerald-50", image: "/categories/Eco-Friendly Gifts.png" },
  { slug: "premium-gifts", label: "Premium Gifts", color: "bg-violet-50", image: "/categories/Premium Gifts.png" },
  { slug: "custom-merchandise", label: "Custom Merchandise", color: "bg-orange-50", image: "/categories/Custom Merchandise.png" },
  { slug: "holi-gifts", label: "Holi Gifts", color: "bg-pink-50", image: "/categories/Holi Gifts.png" },
  { slug: "employee-welcome", label: "Employee Welcome", color: "bg-sky-50", image: "/categories/Employee Welcome.png" },
  { slug: "employee-kits", label: "Employee Kits", color: "bg-blue-50", image: "/categories/Employee Kits.png" },
  { slug: "work-anniversary", label: "Work Anniversary", color: "bg-yellow-50", image: "/categories/Work Anniversary.png" },
  { slug: "client-appreciation", label: "Client Appreciation", color: "bg-teal-50", image: "/categories/Client Appreciation.png" },
  { slug: "retirement-gifts", label: "Retirement Gifts", color: "bg-amber-50", image: "/categories/Retirement Gifts.png" },
  { slug: "wedding-gifts", label: "Wedding Gifts", color: "bg-rose-50", image: "/categories/Wedding Gifts.png" },
  { slug: "womens-day", label: "Women's Day", color: "bg-fuchsia-50", image: "/categories/Women Day.png" },
];
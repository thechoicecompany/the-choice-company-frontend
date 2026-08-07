export const OCCASIONS = [
  { slug: "diwali-gifts",        label: "Diwali Gifts",         icon: "🪔" },
  { slug: "employee-welcome",    label: "Employee Welcome",      icon: "🎒" },
  { slug: "work-anniversary",    label: "Work Anniversary",      icon: "🏆" },
  { slug: "client-appreciation", label: "Client Appreciation",   icon: "🤝" },
  { slug: "conference-kits",     label: "Conference Kits",       icon: "📋" },
  { slug: "new-year",            label: "New Year Gifts",        icon: "🎉" },
  { slug: "womens-day",          label: "Women's Day",           icon: "🌸" },
  { slug: "retirement",          label: "Retirement Gifts",      icon: "🎖" },
  { slug: "wedding-gifts",       label: "Wedding Gifts",         icon: "💍" },
  { slug: "dealer-meet",         label: "Dealer Meet Gifts",     icon: "🤲" },
  { slug: "festive-hampers",     label: "Festive Hampers",       icon: "🎁" },
] as const;

export type OccasionSlug = typeof OCCASIONS[number]["slug"];

import {
    Flame, GlassWater, Snowflake, Star, Monitor, Luggage,
    Gift, ShoppingBag, Laptop, Coffee, Pen,
    Folder, Paperclip, ShoppingCart, Plane, Trophy, HeartPulse,
    Flower2, Diamond, Tag, Palette, Package, Medal,
    ThumbsUp, ClipboardList, Clock, Users, Heart,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface CategoryDef {
    slug: string;
    label: string;
    icon: LucideIcon;
    color: string;
    iconColor: string;
}
export const CATEGORIES: CategoryDef[] = [
    // Festive & occasion-based
    { slug: "diwali-gifts", label: "Diwali Gifts", icon: Flame, color: "bg-orange-50", iconColor: "text-orange-500" },
    { slug: "new-year-gifts", label: "New Year Gifts", icon: GlassWater, color: "bg-purple-50", iconColor: "text-purple-500" },
    { slug: "christmas-gifts", label: "Christmas Gifts", icon: Snowflake, color: "bg-green-50", iconColor: "text-green-600" },
    { slug: "festive-hampers", label: "Festive Hampers", icon: Star, color: "bg-yellow-50", iconColor: "text-yellow-500" },
    { slug: "electronics", label: "Electronics", icon: Monitor, color: "bg-blue-50", iconColor: "text-blue-500" },
    { slug: "trolley-bags", label: "Trolley Bags", icon: Luggage, color: "bg-slate-50", iconColor: "text-slate-500" },
    // Product-type
    { slug: "gift-hampers", label: "Gift Hampers", icon: Gift, color: "bg-pink-50", iconColor: "text-pink-500" },
    { slug: "bags", label: "Bags", icon: ShoppingBag, color: "bg-amber-50", iconColor: "text-amber-600" },
    { slug: "laptop-bags", label: "Laptop Bags", icon: Laptop, color: "bg-gray-50", iconColor: "text-gray-600" },
    { slug: "backpacks", label: "Backpacks", icon: Package, color: "bg-teal-50", iconColor: "text-teal-500" },
    { slug: "drinkware", label: "Drinkware", icon: Coffee, color: "bg-orange-50", iconColor: "text-orange-700" },
    { slug: "desk-essentials", label: "Desk Essentials", icon: Pen, color: "bg-indigo-50", iconColor: "text-indigo-500" },
    { slug: "office-essentials", label: "Office Essentials", icon: Folder, color: "bg-sky-50", iconColor: "text-sky-500" },
    { slug: "stationery", label: "Stationery", icon: Paperclip, color: "bg-lime-50", iconColor: "text-lime-600" },
    { slug: "apparel", label: "Apparel", icon: ShoppingCart, color: "bg-fuchsia-50", iconColor: "text-fuchsia-500" },
    { slug: "travel-kits", label: "Travel Kits", icon: Plane, color: "bg-cyan-50", iconColor: "text-cyan-500" },
    { slug: "sports", label: "Sports", icon: Trophy, color: "bg-red-50", iconColor: "text-red-500" },
    { slug: "wellness", label: "Wellness", icon: HeartPulse, color: "bg-rose-50", iconColor: "text-rose-500" },
    { slug: "eco-friendly-gifts", label: "Eco-Friendly Gifts", icon: Flower2, color: "bg-emerald-50", iconColor: "text-emerald-600" },
    { slug: "premium-gifts", label: "Premium Gifts", icon: Diamond, color: "bg-violet-50", iconColor: "text-violet-500" },
    { slug: "custom-merchandise", label: "Custom Merchandise", icon: Tag, color: "bg-orange-50", iconColor: "text-orange-600" },
    { slug: "holi-gifts", label: "Holi Gifts", icon: Palette, color: "bg-pink-50", iconColor: "text-pink-600" },
    // Corporate & employee
    { slug: "employee-welcome", label: "Employee Welcome", icon: Gift, color: "bg-sky-50", iconColor: "text-sky-600" },
    { slug: "employee-kits", label: "Employee Kits", icon: Package, color: "bg-blue-50", iconColor: "text-blue-600" },
    { slug: "work-anniversary", label: "Work Anniversary", icon: Medal, color: "bg-yellow-50", iconColor: "text-yellow-600" },
    { slug: "client-appreciation", label: "Client Appreciation", icon: ThumbsUp, color: "bg-teal-50", iconColor: "text-teal-600" },
    { slug: "conference-kits", label: "Conference Kits", icon: ClipboardList, color: "bg-indigo-50", iconColor: "text-indigo-600" },
    { slug: "retirement-gifts", label: "Retirement Gifts", icon: Clock, color: "bg-amber-50", iconColor: "text-amber-700" },
    { slug: "wedding-gifts", label: "Wedding Gifts", icon: Heart, color: "bg-rose-50", iconColor: "text-rose-400" },
    { slug: "dealer-meet-gifts", label: "Dealer Meet Gifts", icon: Users, color: "bg-slate-50", iconColor: "text-slate-600" },
    { slug: "womens-day", label: "Women's Day", icon: Flower2, color: "bg-fuchsia-50", iconColor: "text-fuchsia-600" },
];
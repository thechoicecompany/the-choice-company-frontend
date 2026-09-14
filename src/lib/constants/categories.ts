export interface CategoryDef {
    slug: string;
    label: string;
    emoji?: string;
}

export const CATEGORIES: CategoryDef[] = [
    // Festive & occasion-based
    { slug: "diwali-gifts", label: "Diwali Gifts", emoji: "🪔" },
    { slug: "new-year-gifts", label: "New Year Gifts", emoji: "🎊" },
    { slug: "christmas-gifts", label: "Christmas Gifts", emoji: "🎄" },
    { slug: "festive-hampers", label: "Festive Hampers", emoji: "🧨" },
    { slug: "electronics", label: "Electronics", emoji: "🖥" },
    { slug: "trolley-bags", label: "Trolley Bags", emoji: "🧳" },
    // Product-type categories
    { slug: "gift-hampers", label: "Gift Hampers", emoji: "🎁" },
    { slug: "bags", label: "Bags", emoji: "👜" },
    { slug: "laptop-bags", label: "Laptop Bags", emoji: "💼" },
    { slug: "backpacks", label: "Backpacks", emoji: "🎒" },

    { slug: "drinkware", label: "Drinkware", emoji: "🥤" },
    { slug: "desk-essentials", label: "Desk Essentials", emoji: "📝" },
    { slug: "office-essentials", label: "Office Essentials", emoji: "🗂" },
    { slug: "stationery", label: "Stationery", emoji: "✏️" },
    { slug: "apparel", label: "Apparel", emoji: "👕" },
    { slug: "travel-kits", label: "Travel Kits", emoji: "✈" },

    { slug: "sports", label: "Sports", emoji: "🏅" },
    { slug: "wellness", label: "Wellness", emoji: "🧘" },
    { slug: "eco-friendly-gifts", label: "Eco-Friendly Gifts", emoji: "♻️" },
    { slug: "premium-gifts", label: "Premium Gifts", emoji: "💎" },
    { slug: "custom-merchandise", label: "Custom Merchandise", emoji: "🏷" },
    { slug: "holi-gifts", label: "Holi Gifts", emoji: "🎨" },
    // Corporate & employee categories
    { slug: "employee-welcome", label: "Employee Welcome", emoji: "🙌" },
    { slug: "employee-kits", label: "Employee Kits", emoji: "🎒" },
    { slug: "work-anniversary", label: "Work Anniversary", emoji: "🏆" },
    { slug: "client-appreciation", label: "Client Appreciation", emoji: "🤝" },
    { slug: "conference-kits", label: "Conference Kits", emoji: "📋" },
    { slug: "retirement-gifts", label: "Retirement Gifts", emoji: "🎖" },
    { slug: "wedding-gifts", label: "Wedding Gifts", emoji: "💍" },
    { slug: "dealer-meet-gifts", label: "Dealer Meet Gifts", emoji: "👏" },
    { slug: "womens-day", label: "Women's Day", emoji: "🌸" },
];
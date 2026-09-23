// One preset per page. Usage:  <PageHero {...heroPresets.about} />
// Images go in /public/images/hero/ (see notes on which photo suits which page).

import type { PageHeroProps } from "./PageHero";

export const heroPresets = {
    about: {
        variant: "premium",
        title: "About The Choice Company",
        subtitle: "Corporate gifting, built for meaningful connections.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "About Us" }],
        features: [
            { icon: "crown", label: "People", sublabel: "We Value" },
            { icon: "gift", label: "Brands", sublabel: "We Represent" },
            { icon: "handshake", label: "Relationships", sublabel: "We Build" },
        ],
        tagline: ["More", "than gifts", "a brighter", "tomorrow"],
        image: "/images/hero/about-hero.jpg",
        imageAlt: "Black corporate gift set with gold ribbon, notebook, bottle and watch",
        imagePosition: "center 60%",
    },

    products: {
        variant: "minimal",
        title: "Products & Solutions",
        subtitle: "Premium corporate gifts with custom branding.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Products" }],
        features: [
            { icon: "package", label: "Wide Range", sublabel: "of Products" },
            { icon: "tag", label: "Custom", sublabel: "Branding" },
            { icon: "truck", label: "Pan-India", sublabel: "Delivery" },
        ],
        tagline: ["Corporate Gifts", "for a Brighter Tomorrow"],
        bg: "linear-gradient(135deg, #F7EFDF 0%, #EEDFC0 100%)", // champagne
    },

    sampleShop: {
        variant: "overlay",
        title: "Try Before You Bulk Order",
        subtitle:
            "Order 1–5 sample units to evaluate quality, branding finish & packaging before committing to bulk.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Sample Shop" }],
        features: [
            { icon: "shield", label: "Check Quality", sublabel: "First" },
            { icon: "cart", label: "Low", sublabel: "Sample MOQ" },
            { icon: "star", label: "Trusted by", sublabel: "Businesses" },
        ],
        image: "/Shop Header.png",
        imageAlt: "Black gift box set with branded bottle, tumbler and laptop stand",
        imagePosition: "center 35%",
    },

    industries: {
        variant: "pattern",
        title: "Industries We Serve",
        subtitle: "Tailored gifting solutions for every industry.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Industries" }],
        features: [
            { icon: "building", label: "Diverse", sublabel: "Industries" },
            { icon: "users", label: "Enterprise", sublabel: "Solutions" },
            { icon: "settings", label: "Custom", sublabel: "Approach" },
        ],
        tagline: ["Solutions", "for a brighter", "tomorrow"],
    },
    gallery: {
        variant: "visual",
        eyebrow: "Our Collections",
        title: "Explore Our Catalogs",
        subtitle: "Discover thoughtfully curated corporate gifting ideas.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Gallery" }],
        features: [
            { icon: "image", label: "Curated", sublabel: "Collections" },
            { icon: "tag", label: "Latest", sublabel: "Trends" },
            { icon: "gift", label: "Gifts for", sublabel: "Every Occasion" },
        ],
        image: "/Gallery Header.png",
        imageAlt: "The Choice Company corporate gifting catalogue on a wooden desk",
        imagePosition: "right center",
    },
    blog: {
        variant: "visual",
        title: "Corporate Gifting Blog",
        subtitle: "Insights, ideas and trends to help you build stronger business relationships.",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Blog" }],
        features: [
            { icon: "file", label: "Latest", sublabel: "Insights" },
            { icon: "lightbulb", label: "Gifting", sublabel: "Ideas" },
            { icon: "users", label: "Industry", sublabel: "Trends" },
        ],
        tagline: ["Ideas", "Inspiration", "Stronger", "Relationships"],
        image: "/Blog header.png",
        imageAlt: "Black and gold corporate gifts on a wooden desk",
        imagePosition: "center 55%",
    },

    // Not in the reference sheet — same brand system, copy taken from your existing page.
    contact: {
        variant: "pattern",
        title: "Let's Talk Gifting",
        subtitle: "Our team responds within 2 business hours",
        breadcrumbs: [{ label: "Home", href: "/" }, { label: "Contact Us" }],
        features: [
            { icon: "clock", label: "Quick", sublabel: "Response" },
            { icon: "handshake", label: "Free", sublabel: "Consultation" },
            { icon: "truck", label: "Pan-India", sublabel: "Delivery" },
        ],
        tagline: ["Let's build", "stronger", "relationships"],
    },
} satisfies Record<string, PageHeroProps>;


// Bases for dynamic (slug) pages. Each page passes its own title / subtitle / breadcrumbs.
export const heroBases = {
    industryDetail: {
        variant: "pattern",
        features: [
            { icon: "tag", label: "Custom", sublabel: "Branding" },
            { icon: "package", label: "MOQ from", sublabel: "50 units" },
            { icon: "truck", label: "Pan-India", sublabel: "Delivery" },
        ],
    },
    blogPost: {
        variant: "pattern",
    },
    category: {
        variant: "minimal",
        bg: "linear-gradient(135deg, #F7EFDF 0%, #EEDFC0 100%)", // same champagne as Products
        features: [
            { icon: "package", label: "Wide Range", sublabel: "of Products" },
            { icon: "tag", label: "Custom", sublabel: "Branding" },
            { icon: "truck", label: "Pan-India", sublabel: "Delivery" },
        ],
    },
    sampleProduct: {
        variant: "pattern",
        features: [
            { icon: "shield", label: "Check Quality", sublabel: "First" },
            { icon: "cart", label: "Low", sublabel: "Sample MOQ" },
            { icon: "star", label: "Trusted by", sublabel: "Businesses" },
        ],
    },
} satisfies Record<string, Omit<PageHeroProps, "title">>;
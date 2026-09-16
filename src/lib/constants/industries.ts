export const INDUSTRIES = [
  {
    slug: "it-companies",
    label: "IT Companies",
    icon: "💻",
    metaTitle: "Corporate Gifts for IT Companies in India",
    description:
      "From employee onboarding kits and WFH essentials to hackathon swag and client demo-day merchandise, we help software companies, product firms and IT services teams gift consistently across distributed teams — with quick turnarounds for last-minute all-hands and tech conferences.",
    popularProducts: ["electronics", "laptop-bags", "desk-essentials", "drinkware"],
  },
  {
    slug: "pharma",
    label: "Pharma",
    icon: "💊",
    metaTitle: "Corporate Gifts for Pharma Industry",
    description:
      "We support pharmaceutical companies with doctor appreciation gifts, MR (medical representative) field kits, CME and conference merchandise, and compliance-conscious gifting that respects industry norms around value and branding — delivered reliably across hospital visits and pharma events.",
    popularProducts: ["premium-gifts", "conference-kits", "bags", "stationery"],
  },
  {
    slug: "manufacturing",
    label: "Manufacturing",
    icon: "🏭",
    metaTitle: "Corporate Gifts for Manufacturing Sector",
    description:
      "For manufacturing plants and industrial companies, we supply durable, shop-floor-ready gifting — safety kits, branded workwear and functional accessories for workers, plus dealer and distributor gifting for festive seasons like Diwali and plant anniversary events.",
    popularProducts: ["apparel", "employee-kits", "drinkware", "custom-merchandise"],
  },
  {
    slug: "education",
    label: "Education",
    icon: "🎓",
    metaTitle: "Corporate Gifts for Educational Institutions",
    description:
      "Schools, colleges and EdTech companies work with us for admission-season welcome kits, teacher's day appreciation gifts, annual day and convocation merchandise, and alumni-meet hampers — gifting that fits an academic calendar, not a retail one.",
    popularProducts: ["stationery", "backpacks", "desk-essentials", "gift-hampers"],
  },
  {
    slug: "hospitals",
    label: "Hospitals",
    icon: "🏥",
    metaTitle: "Corporate Gifts for Healthcare Industry",
    description:
      "For hospitals, clinics and healthcare organisations, we handle Doctor's Day and Nurse's Day appreciation gifts, staff recognition kits, patient discharge hampers and hospital-anniversary merchandise — gifting sensitive to a healthcare environment.",
    popularProducts: ["wellness", "premium-gifts", "bags", "eco-friendly-gifts"],
  },
  {
    slug: "hotels",
    label: "Hotels",
    icon: "🏨",
    metaTitle: "Corporate Gifts for Hospitality Sector",
    description:
      "Hotels and hospitality groups turn to us for guest welcome hampers, staff uniform accessories, F&B-branded merchandise, and festive gifting for corporate clients and MICE events — luxury gifting that matches a property's brand standards.",
    popularProducts: ["gift-hampers", "drinkware", "premium-gifts", "custom-merchandise"],
  },
  {
    slug: "banking",
    label: "Banking & BFSI",
    icon: "🏦",
    metaTitle: "Corporate Gifts for Banking Sector",
    description:
      "Banks and financial institutions rely on us for relationship-manager client gifting, HNI festive hampers, branch-inauguration merchandise and employee recognition kits — premium, professional gifting suited to a regulated, trust-driven industry.",
    popularProducts: ["premium-gifts", "desk-essentials", "custom-merchandise", "gift-hampers"],
  },
  {
    slug: "fmcg",
    label: "FMCG",
    icon: "🛒",
    metaTitle: "Corporate Gifts for FMCG Companies",
    description:
      "FMCG brands come to us for high-volume trade gifting — distributor and retailer incentive kits, dealer-meet merchandise, sales-conference giveaways and festive trade gifting around Diwali and New Year — built for scale without losing quality.",
    popularProducts: ["apparel", "custom-merchandise", "gift-hampers", "dealer-meet-gifts"],
  },
  {
    slug: "startups",
    label: "Startups",
    icon: "🚀",
    metaTitle: "Corporate Gifts for Startups",
    description:
      "Startups use us for new-hire onboarding kits, investor welcome gifts, hackathon and demo-day swag, and culture-building merchandise that actually reflects a young brand's identity — fast turnarounds for teams that move quickly.",
    popularProducts: ["employee-welcome", "apparel", "electronics", "eco-friendly-gifts"],
  },
] as const;

export type IndustrySlug = typeof INDUSTRIES[number]["slug"];
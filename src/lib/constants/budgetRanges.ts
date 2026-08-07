export const BUDGET_RANGES = [
  { value: "250-500",   label: "₹250 – ₹500",   description: "Everyday corporate gifts", isLuxury: false },
  { value: "500-1000",  label: "₹500 – ₹1000",  description: "Most popular range",       isLuxury: false },
  { value: "1000-2500", label: "₹1000 – ₹2500", description: "Premium gifting range",     isLuxury: false },
  { value: "2500-5000", label: "₹2500 – ₹5000", description: "Executive gifts",           isLuxury: false },
  { value: "5000+",     label: "₹5000+",         description: "Luxury collection",         isLuxury: true  },
] as const;

export type BudgetValue = typeof BUDGET_RANGES[number]["value"];

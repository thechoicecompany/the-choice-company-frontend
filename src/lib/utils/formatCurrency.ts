// ─── formatCurrency.ts ───────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style:                 "currency",
    currency:              "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRShort(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(0)}K`;
  return `₹${amount}`;
}

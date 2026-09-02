// TOP UTILITY BAR — SERVER COMPONENT
const ITEMS = [
  { icon: "⭐", text: "India's Trusted Corporate Gifting Partner" },
  { icon: "✅", text: "GST Registered" },
  { icon: "🚚", text: "PAN India Delivery" },
  { icon: "⏱", text: "On-Time Delivery" },
  { icon: "📞", text: "+91 6268899194", href: "tel:+916268899194" },
  { icon: "✉", text: "info@thechoicecompany.in", href: "mailto:info@thechoicecompany.in" },
];

export default function TopUtilityBar() {
  return (
    <div className="hidden md:flex items-center justify-center gap-6 px-6 py-2 text-white"
      style={{ background: "var(--navy)" }}>
      {ITEMS.map(({ icon, text, href }) => (
        <span key={text} className="flex items-center gap-1.5 text-[11px] text-white/75">
          <span className="text-[11px]" style={{ color: "var(--gold)" }}>{icon}</span>
          {href
            ? <a href={href} className="hover:text-white transition-colors">{text}</a>
            : text}
        </span>
      ))}
    </div>
  );
}

const ITEMS = [
  { icon: "👥", stat: "500+",    label: "Corporate Clients" },
  { icon: "✅", stat: "GST",     label: "Registered" },
  { icon: "🚚", stat: "PAN",    label: "India Delivery" },
  { icon: "✏",  stat: "Custom", label: "Branding" },
  { icon: "👤", stat: "1:1",    label: "Account Manager" },
  { icon: "⏱",  stat: "On",    label: "Time Delivery" },
];
export default function TrustStrip() {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="container-site py-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 divide-x divide-gray-100">
          {ITEMS.map(({ icon, stat, label }) => (
            <div key={label} className="flex flex-col items-center text-center px-2">
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-sm font-bold text-navy">{stat}</span>
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

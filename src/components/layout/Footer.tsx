// FOOTER — SERVER COMPONENT. No 'use client' needed.
import Link from "next/link";

const QUICK_LINKS = [
  { label: "About Us",        href: "/about" },
  { label: "Our Products",    href: "/products" },
  { label: "Build Your Kit",  href: "/build-your-kit" },
  { label: "Bulk Orders",     href: "/bulk-orders" },
  { label: "Industries",      href: "/industries" },
  { label: "Gallery",         href: "/gallery" },
  { label: "Blog",            href: "/blog" },
  { label: "Contact Us",      href: "/contact" },
];

const CATEGORIES = [
  { label: "Gift Hampers",        href: "/products?category=gift-hampers" },
  { label: "Laptop Bags",         href: "/products?category=laptop-bags" },
  { label: "Drinkware",           href: "/products?category=drinkware" },
  { label: "Office Essentials",   href: "/products?category=office-essentials" },
  { label: "Apparel",             href: "/products?category=apparel" },
  { label: "Eco-Friendly Gifts",  href: "/products?category=eco-friendly" },
  { label: "Travel Kits",         href: "/products?category=travel-kits" },
  { label: "Premium Gifts",       href: "/products?category=premium" },
  { label: "Custom Merchandise",  href: "/products?category=custom-merchandise" },
];

const SOCIALS = [
  { icon: "f", label: "Facebook",  href: "https://facebook.com/thechoicecompany",  color: "#1877F2" },
  { icon: "in",label: "Instagram", href: "https://instagram.com/thechoicecompany", color: "#E1306C" },
  { icon: "li",label: "LinkedIn",  href: "https://linkedin.com/company/thechoicecompany", color: "#0A66C2" },
  { icon: "yt",label: "YouTube",   href: "https://youtube.com/@thechoicecompany",  color: "#FF0000" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)" }} className="text-white">
      {/* Main Grid */}
      <div className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "var(--teal)" }}>🎁</div>
              <div>
                <div className="text-sm font-bold">THE CHOICE COMPANY</div>
                <div className="text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>
                  Making Every Gift Memorable
                </div>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed mb-5 max-w-56">
              India's trusted bulk corporate gifting partner — custom branded gifts delivered pan-India since 2010.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-white/20 transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/55 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>Product Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-white/55 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>Contact Us</h4>
            <div className="space-y-3 text-xs text-white/55 mb-6">
              <a href="tel:+918109000100"
                className="flex items-start gap-2 hover:text-white transition-colors">
                <span className="mt-0.5">📞</span>
                <span>+91 81090 00100</span>
              </a>
              <a href="mailto:info@thechoicecompany.in"
                className="flex items-start gap-2 hover:text-white transition-colors">
                <span className="mt-0.5">✉</span>
                <span>info@thechoicecompany.in</span>
              </a>
              <a href="https://wa.me/918109000100" target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors">
                <span className="mt-0.5">💬</span>
                <span>WhatsApp Us</span>
              </a>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>Indore, Madhya Pradesh, India</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">🕐</span>
                <span>Mon–Sat: 9AM – 6PM IST</span>
              </div>
            </div>

            {/* Newsletter */}
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>Newsletter</h4>
            <p className="text-xs text-white/40 mb-3">
              Get updates on new collections &amp; offers.
            </p>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex gap-0"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="flex-1 px-3 py-2 text-xs text-gray-800 rounded-l-lg outline-none border-0"
              />
              <button
                type="submit"
                className="px-4 py-2 text-white text-sm rounded-r-lg font-medium flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ background: "var(--gold)" }}
                aria-label="Subscribe to newsletter"
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container-site flex flex-wrap justify-center gap-6">
          {["GST Registered", "500+ Corporate Clients", "Pan-India Delivery", "10+ Years Experience"].map((item) => (
            <span key={item} className="text-xs text-white/40 flex items-center gap-1.5">
              <span className="text-gold">✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-4">
        <div className="container-site flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} The Choice Company. All Rights Reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Build Your Kit", href: "/build-your-kit" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "Industries", href: "/industries" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const CATEGORIES = [
  { label: "Gift Hampers", href: "/products?category=gift-hampers" },
  { label: "Laptop Bags", href: "/products?category=laptop-bags" },
  { label: "Drinkware", href: "/products?category=drinkware" },
  { label: "Office Essentials", href: "/products?category=office-essentials" },
  { label: "Apparel", href: "/products?category=apparel" },
  { label: "Eco-Friendly Gifts", href: "/products?category=eco-friendly" },
  { label: "Travel Kits", href: "/products?category=travel-kits" },
  { label: "Premium Gifts", href: "/products?category=premium" },
  { label: "Custom Merchandise", href: "/products?category=custom-merchandise" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/thechoicecompany.in", icon: "/icons/facebook.png" },
  { label: "Instagram", href: "https://www.instagram.com/the_choice.company", icon: "/icons/instagram.png" },
  { label: "LinkedIn", href: "https://linkedin.com/company/thechoicecompany", icon: "/icons/linkedin.png" },
  { label: "WhatsApp", href: "https://wa.me/916268899194", icon: "/icons/whatsapp.png" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)" }} className="text-white">
      <div className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="The Choice Company"
                width={68}
                height={68}
                className="rounded-xl object-contain"
              />
              <div>
                <div className="text-sm font-bold">THE CHOICE COMPANY</div>
                <div
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--gold)" }}
                >
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
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 hover:scale-110 transition-all duration-200 flex-shrink-0"
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
              Quick Links
            </h4>
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
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
              Product Categories
            </h4>
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

          {/* Col 4 — Contact + Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-white/55 mb-6">
              <a
                href="tel:+916268899194"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <span className="mt-0.5">📞</span>
                <span>+91 916268 899194</span>
              </a>
              <a
                href="mailto:info@thechoicecompany.in"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <span className="mt-0.5">✉</span>
                <span>info@thechoicecompany.in</span>
              </a>
              <a
                href="https://wa.me/916268899194"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Image
                  src="/icons/whatsapp.png"
                  alt="WhatsApp"
                  width={16}
                  height={16}
                  className="rounded-full"
                />
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

            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>
              Newsletter
            </h4>
            <p className="text-xs text-white/40 mb-3">
              Get updates on new collections &amp; offers.
            </p>
            {/* <form action="/api/newsletter" method="POST" className="flex">
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
            </form> */}
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>
              Newsletter
            </h4>
            <p className="text-xs text-white/40 mb-3">
              Get updates on new collections &amp; offers.
            </p>
            <NewsletterForm />
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

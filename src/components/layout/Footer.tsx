
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import { Label } from "recharts";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Products", href: "/products" },
  // { label: "Build Your Kit", href: "/build-your-kit" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "Industries", href: "/industries" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  // In your footer links or header nav
  { label: "Track Order", href: "/track-order" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "FAQ", href: "/faq" },
];

const CATEGORIES = [
  { label: "Diwali Gifts", href: "/products/category/diwali-gifts" },
  { label: "New Year Gifts", href: "/products/category/new-year-gifts" },
  { label: "Festive Hampers", href: "/products/category/festive-hampers" },
  { label: "Electronics", href: "/products/category/electronics" },
  { label: "Bags", href: "/products/category/bags" },
  { label: "Trolley Bags", href: "/products/category/trolley-bags" },
  { label: "Laptop Bags", href: "/products/category/laptop-bags" },
  { label: "Gift Hampers", href: "/products/category/gift-hampers" },
  { label: "Employee Kits", href: "/products/category/employee-kits" },
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
              {/* <Image
                src="/logo1.png"
                alt="The Choice Company"
                width={150}
                height={150}
                className="rounded-xl object-contain"
              /> */}
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
              India's trusted bulk corporate gifting partner — custom branded gifts delivered pan-India since 2025.
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
                <span>+91 6268 899194</span>
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
            <NewsletterForm />
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-4">
        <div className="container-site flex justify-center items-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} The Choice Company. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
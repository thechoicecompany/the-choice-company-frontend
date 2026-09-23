
// import Link from "next/link";
// import Image from "next/image";
// import NewsletterForm from "./NewsletterForm";
// import { Label } from "recharts";

// const QUICK_LINKS = [
//   { label: "About Us", href: "/about" },
//   { label: "Our Products", href: "/products" },
//   // { label: "Build Your Kit", href: "/build-your-kit" },
//   { label: "Bulk Orders", href: "/bulk-orders" },
//   { label: "Industries", href: "/industries" },
//   { label: "Gallery", href: "/gallery" },
//   { label: "Blog", href: "/blog" },
//   { label: "Contact Us", href: "/contact" },
//   // In your footer links or header nav
//   { label: "Track Order", href: "/track-order" },
//   { label: "Privacy Policy", href: "/privacy-policy" },
//   { label: "Terms & Conditions", href: "/terms" },
//   { label: "FAQ", href: "/faq" },
// ];

// const CATEGORIES = [
//   { label: "Diwali Gifts", href: "/products/category/diwali-gifts" },
//   { label: "New Year Gifts", href: "/products/category/new-year-gifts" },
//   { label: "Festive Hampers", href: "/products/category/festive-hampers" },
//   { label: "Electronics", href: "/products/category/electronics" },
//   { label: "Bags", href: "/products/category/bags" },
//   { label: "Trolley Bags", href: "/products/category/trolley-bags" },
//   { label: "Laptop Bags", href: "/products/category/laptop-bags" },
//   { label: "Gift Hampers", href: "/products/category/gift-hampers" },
//   { label: "Employee Kits", href: "/products/category/employee-kits" },
// ];

// const SOCIALS = [
//   { label: "Facebook", href: "https://www.facebook.com/thechoicecompany.in", icon: "/icons/facebook.png" },
//   { label: "Instagram", href: "https://www.instagram.com/the_choice.company", icon: "/icons/instagram.png" },
//   { label: "LinkedIn", href: "https://linkedin.com/company/thechoicecompany", icon: "/icons/linkedin.png" },
//   { label: "WhatsApp", href: "https://wa.me/916268899194", icon: "/icons/whatsapp.png" },
// ];
// export default function Footer() {
//   return (
//     <footer style={{ background: "var(--navy)" }} className="text-white">
//       <div className="container-site py-14">
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

//           {/* Col 1 — Brand */}
//           <div className="col-span-2 md:col-span-4 lg:col-span-1">
//             <div className="flex items-center gap-3 mb-4">
//               {/* <Image
//                 src="/logo1.png"
//                 alt="The Choice Company"
//                 width={150}
//                 height={150}
//                 className="rounded-xl object-contain"
//               /> */}
//               <div>
//                 <div className="text-sm font-bold">THE CHOICE COMPANY</div>
//                 <div
//                   className="text-[10px] tracking-widest uppercase"
//                   style={{ color: "var(--gold)" }}
//                 >
//                   Making Every Gift Memorable
//                 </div>
//               </div>
//             </div>
//             <p className="text-xs text-white/50 leading-relaxed mb-5 max-w-56">
//               India’s trusted corporate gifting partner — customized gifts, branded solutions, and seamless delivery across India.
//             </p>

//             {/* Social Icons */}
//             <div className="flex items-center gap-3">
//               {SOCIALS.map(({ label, href, icon }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={label}
//                   className="w-8 h-8 rounded-full overflow-hidden hover:opacity-80 hover:scale-110 transition-all duration-200 flex-shrink-0"
//                 >
//                   <Image
//                     src={icon}
//                     alt={label}
//                     width={32}
//                     height={32}
//                     className="w-full h-full object-cover"
//                   />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Col 2 — Quick Links */}
//           <div>
//             <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
//               Quick Links
//             </h4>
//             <ul className="space-y-2.5">
//               {QUICK_LINKS.map(({ label, href }) => (
//                 <li key={label}>
//                   <Link href={href} className="text-xs text-white/55 hover:text-white transition-colors">
//                     {label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Col 3 — Categories */}
//           <div>
//             <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
//               Product Categories
//             </h4>
//             <ul className="space-y-2.5">
//               {CATEGORIES.map(({ label, href }) => (
//                 <li key={label}>
//                   <Link href={href} className="text-xs text-white/55 hover:text-white transition-colors">
//                     {label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Col 4 — Contact + Newsletter */}
//           <div>
//             <h4 className="text-sm font-semibold mb-5" style={{ color: "var(--gold)" }}>
//               Contact Us
//             </h4>
//             <div className="space-y-3 text-xs text-white/55 mb-6">
//               <a
//                 href="tel:+916268899194"
//                 className="flex items-start gap-2 hover:text-white transition-colors"
//               >
//                 <span className="mt-0.5">📞</span>
//                 <span>+91 6268 899194</span>
//               </a>
//               <a
//                 href="mailto:info@thechoicecompany.in"
//                 className="flex items-start gap-2 hover:text-white transition-colors"
//               >
//                 <span className="mt-0.5">✉</span>
//                 <span>info@thechoicecompany.in</span>
//               </a>
//               <a
//                 href="https://wa.me/916268899194"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 hover:text-white transition-colors"
//               >
//                 <Image
//                   src="/icons/whatsapp.png"
//                   alt="WhatsApp"
//                   width={16}
//                   height={16}
//                   className="rounded-full"
//                 />
//                 <span>WhatsApp Us</span>
//               </a>
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5">📍</span>
//                 <span>Indore, Madhya Pradesh, India</span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <span className="mt-0.5">🕐</span>
//                 <span>Mon–Sat: 9AM – 6PM IST</span>
//               </div>
//             </div>

//             <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--gold)" }}>
//               Newsletter
//             </h4>
//             <p className="text-xs text-white/40 mb-3">
//               Get updates on new collections &amp; offers.
//             </p>
//             <NewsletterForm />
//           </div>
//         </div>
//       </div>
//       {/* Bottom Bar */}
//       <div className="border-t border-white/5 py-4">
//         <div className="container-site flex justify-center items-center">
//           <p className="text-xs text-white/30">
//             © {new Date().getFullYear()} The Choice Company. All Rights Reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";

import FooterCTA from "./FooterCTA";
import FooterMain from "./FooterMain";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  return (
    <footer
      style={{ background: "#071827" }}
      className="relative overflow-hidden text-white"
    >
      {/* Botanical background decorations */}
      <BotanicalDecor />
      <FooterCTA />
      <FooterMain />
      <FooterBottom />
    </footer>
  );
}

function BotanicalDecor() {
  return (
    <>
      {/* Bottom-left botanical */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-72 select-none"
        style={{ opacity: 0.07 }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="60" cy="270" rx="60" ry="20" fill="#D4A63A" />
        <path d="M60 270 Q20 180 80 120 Q120 60 100 20" stroke="#D4A63A" strokeWidth="3" fill="none" />
        <path d="M80 200 Q10 190 30 140" stroke="#D4A63A" strokeWidth="2" fill="none" />
        <path d="M90 160 Q150 150 130 100" stroke="#D4A63A" strokeWidth="2" fill="none" />
        <ellipse cx="100" cy="20" rx="18" ry="28" fill="#D4A63A" transform="rotate(-20 100 20)" />
        <ellipse cx="30" cy="140" rx="22" ry="14" fill="#D4A63A" transform="rotate(-40 30 140)" />
        <ellipse cx="130" cy="100" rx="20" ry="13" fill="#D4A63A" transform="rotate(25 130 100)" />
      </svg>

      {/* Bottom-right botanical */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 w-72 select-none"
        style={{ opacity: 0.07 }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="240" cy="270" rx="60" ry="20" fill="#D4A63A" />
        <path d="M240 270 Q280 180 220 120 Q180 60 200 20" stroke="#D4A63A" strokeWidth="3" fill="none" />
        <path d="M220 200 Q290 190 270 140" stroke="#D4A63A" strokeWidth="2" fill="none" />
        <path d="M210 160 Q150 150 170 100" stroke="#D4A63A" strokeWidth="2" fill="none" />
        <ellipse cx="200" cy="20" rx="18" ry="28" fill="#D4A63A" transform="rotate(20 200 20)" />
        <ellipse cx="270" cy="140" rx="22" ry="14" fill="#D4A63A" transform="rotate(40 270 140)" />
        <ellipse cx="170" cy="100" rx="20" ry="13" fill="#D4A63A" transform="rotate(-25 170 100)" />
      </svg>
    </>
  );
}
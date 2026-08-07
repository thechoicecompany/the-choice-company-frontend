// import type { Metadata, Viewport } from "next";
// import { Playfair_Display, Inter } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import TopUtilityBar from "@/components/layout/TopUtilityBar";
// import WhatsAppButton from "@/components/ui/WhatsAppButton";
// import StickyMobileBar from "@/components/ui/StickyMobileBar";
// import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
// import "./globals.css";

// const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
// const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0D1B2A" };

// export const metadata: Metadata = {
//   title: { template: "%s | The Choice Company", default: "India's Trusted Corporate Gifting Partner | The Choice Company" },
//   description: "Bulk corporate gifts, employee kits, festive hampers & promotional merchandise. Custom branding. Pan-India delivery. 500+ clients.",
//   openGraph: { type: "website", locale: "en_IN", url: "https://thechoicecompany.in", siteName: "The Choice Company", images: [{ url: "/og-default.jpg" }] },
//   robots: { index: true, follow: true },
//   alternates: { canonical: "https://thechoicecompany.in" },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
//       <body className="font-inter antialiased">
//         <TopUtilityBar />
//         <Navbar />
//         <main className="min-h-screen">{children}</main>
//         <Footer />
//         <WhatsAppButton />
//         <StickyMobileBar />
//         <ExitIntentPopup />
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/lib/hooks/useCart";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopUtilityBar from "@/components/layout/TopUtilityBar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import StickyMobileBar from "@/components/ui/StickyMobileBar";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0D1B2A" };

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    template: "%s | The Choice Company",
    default: "India's Trusted Corporate Gifting Partner | The Choice Company",
  },
  description: "Bulk corporate gifts, employee kits, festive hampers & promotional merchandise. Custom branding. Pan-India delivery. 500+ corporate clients.",
  openGraph: {
    type: "website", locale: "en_IN", url: "https://thechoicecompany.in",
    siteName: "The Choice Company",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        {/* CartProvider wraps everything so cart state is available globally */}
        <CartProvider>
          <TopUtilityBar />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <StickyMobileBar />
          <ExitIntentPopup />
        </CartProvider>

      </body>
    </html>
  );
}

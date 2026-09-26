import type { Metadata, Viewport } from "next";

import { Playfair_Display, Inter, Poppins, Dancing_Script } from "next/font/google";
import { CartProvider } from "@/lib/hooks/useCart";
import SiteChrome from "@/components/layout/SiteChrome";
import "./globals.css";

// ── Fonts ──────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-script",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// ── Viewport ───────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D1B2A",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ── Metadata ───────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | The Choice Company",
    default: "India's Trusted Corporate Gifting Partner | The Choice Company",
  },
  description:
    "Bulk corporate gifts, employee kits, festive hampers & promotional merchandise. Custom branding. Pan-India delivery. 500+ corporate clients.",
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon-32x32.png",
    apple: "/favicon_io/apple-touch-icon.png",
    other: {
      rel: "manifest",
      url: "/favicon_io/site.webmanifest",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "The Choice Company",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "msvalidate.01": "7B110763B6D0F09AF67054B694ADBB10",
    },
  },

};

// ── Root Layout ────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${poppins.variable} ${dancingScript.variable}`}
    >
      <body className="font-inter antialiased">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
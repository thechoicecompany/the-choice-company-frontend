import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: { turbo: {} },
const nextConfig: NextConfig = {
  turbopack: {},
  transpilePackages: ["gsap"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcc-assets.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8089",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "thechoicecompany.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/wq1did1g/**",
      },
    ],

    formats: ["image/avif", "image/webp"],

    // Whitelist every quality value used across the codebase.
    // Next.js 15 warns (Next.js 16 will error) if quality={n} is used
    // on an <Image> without the value listed here.
    // 85  → hero banner (HeroBanner.tsx)
    // 75  → Next.js default (all other <Image> components)
    qualities: [75, 85],

    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 400],

    // Cache optimized images for 7 days — default 60s causes re-optimization
    // on nearly every request after a deploy.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",

          [
            "script-src",
            "'self'",
            "'unsafe-eval'",
            "'unsafe-inline'",
            "https://www.google.com",
            "https://www.gstatic.com",
            "https://checkout.razorpay.com",
            "https://api.razorpay.com",
            // Risk-detection bundle loaded by checkout.razorpay.com at
            // payment time — without this, Razorpay's fraud/risk signals
            // are blocked (console CSP violation, no visible checkout
            // breakage, but you lose that signal on every transaction).
            "https://cdn.razorpay.com",
          ].join(" "),

          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

          "font-src 'self' https://fonts.gstatic.com",

          "img-src 'self' data: blob: https: https://*.razorpay.com https://res.cloudinary.com",

          [
            "connect-src",
            "'self'",
            "http://localhost:8080",
            "http://localhost:8089",
            "http://127.0.0.1:8089",
            "https://api.thechoicecompany.in",
            "https://the-choice-company-backend.onrender.com",
            "https://graph.facebook.com",
            "https://www.google.com",
            "https://api.razorpay.com",
            "https://checkout.razorpay.com",
            "https://lumberjack.razorpay.com",
            "https://lumberjack-cx.razorpay.com",
            // The risk-detection bundle itself makes calls back out —
            // same host as the script, so it needs a connect-src entry too.
            "https://cdn.razorpay.com",
          ].join(" "),

          [
            "frame-src",
            "https://www.google.com",
            "https://api.razorpay.com",
            "https://checkout.razorpay.com",
            "https://*.razorpay.com",
          ].join(" "),

        ].join("; "),
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/gift",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/corporate",
        destination: "/industries",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
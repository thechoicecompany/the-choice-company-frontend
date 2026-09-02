import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack for faster dev builds
  experimental: { turbo: {} },

  // Image optimisation — allow S3, Cloudinary, and CDN domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcc-assets.s3.ap-south-1.amazonaws.com",
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
        pathname: "/wq1did1g/**", // scoped to your Cloudinary cloud_name only
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers on every response
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
      // Add this inside the securityHeaders array in next.config.ts
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",

          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",

          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

          "font-src 'self' https://fonts.gstatic.com",

          // 'https:' already covers res.cloudinary.com — no change needed here
          "img-src 'self' data: blob: https:",

          // Local Spring Boot + production API
          "connect-src 'self' http://localhost:8089 http://127.0.0.1:8089 https://api.thechoicecompany.in https://graph.facebook.com https://www.google.com",

          "frame-src https://www.google.com",
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

  // SEO redirects
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
      // {
      //   source: "/catalog",
      //   destination: "/products",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
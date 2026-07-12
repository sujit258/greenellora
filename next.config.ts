import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow SVG files in the public directory to be served by next/image.
    // contentDispositionType: 'attachment' forces the browser to download
    // SVGs rather than execute them, mitigating XSS risk from inline scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        // YouTube CDN thumbnails (standard)
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        // YouTube CDN thumbnails (alternate)
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        // Cloudinary-hosted product and asset images
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

/* eslint-disable @typescript-eslint/no-require-imports -- Next.js loads this file as CommonJS on the host. */
const imageConfig = require("./src/lib/image-config.json");

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  experimental: { serverActions: { bodySizeLimit: "9mb" } },
  images: {
    // Existing public image variants are pre-built by
    // scripts/optimize-images.mjs (run on prebuild) and resolved by this loader.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Every width listed here must exist as a generated variant.
    deviceSizes: imageConfig.deviceSizes,
    imageSizes: imageConfig.imageSizes,
  },
  trailingSlash: true,
};

module.exports = nextConfig;

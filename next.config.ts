import type { NextConfig } from "next";
import { legacyClientSyntax } from "./scripts/legacy-client-syntax.mjs";
import imageConfig from "./src/lib/image-config.json";

const nextConfig: NextConfig = {
  output: "export",
  webpack(config, { dev, isServer, webpack }) {
    if (!dev && !isServer) config.plugins.push(legacyClientSyntax(webpack));
    return config;
  },
  images: {
    // Static export has no image optimizer, so variants are pre-built by
    // scripts/optimize-images.mjs (run on prebuild) and resolved by this loader.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Every width listed here must exist as a generated variant.
    deviceSizes: imageConfig.deviceSizes,
    imageSizes: imageConfig.imageSizes,
  },
  trailingSlash: true,
};

export default nextConfig;

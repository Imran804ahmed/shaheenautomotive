import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";
import { DEVICE_SIZES, IMAGE_SIZES } from "./src/lib/image-sizes.mjs";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
  },
  trailingSlash: true,
};

export default nextConfig;

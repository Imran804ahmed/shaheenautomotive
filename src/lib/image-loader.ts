import { withBasePath } from "./base-path";
import { IMAGE_WIDTHS, OPT_DIR, SRC_DIR } from "./image-sizes.mjs";

const local = new RegExp(`^/${SRC_DIR}/(.+)\\.(jpe?g|png)$`, "i");

// Static export has no optimisation API, so scripts/optimize-images.mjs
// pre-renders a WebP per width and this loader picks the matching file.
// next/image also does not apply `basePath` to `src`, so it is added here.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const match = src.match(local);
  if (!match) return withBasePath(src);
  const w = IMAGE_WIDTHS.find((size) => size >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return withBasePath(`/${OPT_DIR}/${match[1]}-${w}.webp`);
}

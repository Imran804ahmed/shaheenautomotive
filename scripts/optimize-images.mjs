// Generates resized WebP copies of everything in public/images into
// public/img-opt, one file per width next/image can request. The custom image
// loader (src/lib/image-loader.ts) points <Image> at these instead of the
// originals. Runs before `dev` and `build`; unchanged images are skipped.
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_WIDTHS, OPT_DIR, SRC_DIR } from "../src/lib/image-sizes.mjs";

const root = path.resolve(import.meta.dirname, "..", "public");
const srcRoot = path.join(root, SRC_DIR);
const outRoot = path.join(root, OPT_DIR);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield full;
  }
}

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

let made = 0;
let skipped = 0;
for await (const file of walk(srcRoot)) {
  const rel = path.relative(srcRoot, file).replace(/\.[^.]+$/, "");
  const srcTime = await mtime(file);
  const targets = IMAGE_WIDTHS.map((w) => [w, path.join(outRoot, `${rel}-${w}.webp`)]);
  const stale = [];
  for (const [w, out] of targets) if ((await mtime(out)) < srcTime) stale.push([w, out]);
  if (!stale.length) {
    skipped++;
    continue;
  }
  await mkdir(path.dirname(targets[0][1]), { recursive: true });
  await Promise.all(
    stale.map(([w, out]) =>
      sharp(file)
        .rotate() // respect EXIF orientation from phone photos
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 75, effort: 5 })
        .toFile(out),
    ),
  );
  made++;
}
console.log(`optimize-images: ${made} processed, ${skipped} up to date`);

/**
 * Runs after `next build`. Everything under out/_next/static/ has a content hash in its
 * filename, so it can be cached by browsers for a year without revalidating. Apache /
 * LiteSpeed apply this per-directory .htaccess on top of out/.htaccess (from public/).
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve(import.meta.dirname, "../out/_next/static");

await writeFile(
  path.join(dir, ".htaccess"),
  `# written by scripts/postbuild.mjs: hashed build assets never change
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
</IfModule>
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`
);
console.log("postbuild: wrote out/_next/static/.htaccess");

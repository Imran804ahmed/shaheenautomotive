# Shaheen Automotive

The dynamic branch runs the existing corporate site and an admin workspace in one Next.js App Router application. Public URLs and the existing Tailwind, Motion, and image treatments remain in place. The workspace opens at `/admin`.

## Development

Use Node.js 24 with npm. Set up the environment and install the locked dependencies.

```bash
npm ci
cp .env.example .env.local
npm run images
```

Create the `shaheenautomotive` database and assign a dedicated MySQL user such as `shaheen_app` in phpMyAdmin or your hosting panel. Use MySQL 8.0.13+ or MariaDB 10.11. Copy the actual database name, user, host, port and password into `.env.local`. Use `MYSQL_SOCKET` for XAMPP socket connections. On cPanel, use the full prefixed database and user names shown in the panel. Set `MYSQL_TLS=1` if your host requires a trusted TLS connection.

```bash
npm run db:migrate
```

For an existing SQLite installation, import its data into an empty MySQL database **before opening the app**. The importer transfers administrator hashes, published content, drafts, inquiries, uploaded media and audit history. Administrators sign in again after the move.

```bash
npm run db:import-sqlite -- data/shaheen.sqlite
```

Run `npm run dev` and open http://localhost:3000. The CMS inserts missing sections on first use and preserves saved edits. The administrator account table is `administrators`.

For a fresh database, provision the first super administrator. Enter a unique password of 6–128 characters through standard input. For example, in Bash use an interactive hidden prompt and clear the variable afterward.

```bash
read -rs -p 'Initial admin password: ' shaheen_initial_password
printf '\n'
printf '%s\n' "$shaheen_initial_password" | npm run admin:provision -- you@example.com 'Site Administrator'
unset shaheen_initial_password
```

Sign in at http://localhost:3000/admin. Super administrators can create, deactivate, and assign roles to other administrators. Both roles can manage website content, media, and inquiries. Each administrator can update their own profile and password.

## Editorial workflow

- **Website content** contains the home hero and section order, company information, capability cards and equipment, product families and specifications, facility and galleries, awards, CSR, branding, settings, and page SEO. Array sections support adding, removing, reordering, searching, and paging through entries.
- **Save draft** stores changes privately. **Publish changes** makes the current editor values visible on the next public request. The home hero and page banners support a private preview after saving a draft. A stale editor revision is rejected so a second editor cannot silently overwrite it.
- **Product families** use SEO slugs. The four imported slugs remain routable. Use Visible to control listings and Featured to control placement on the home page. Product Details accepts matching slugs for specifications and additional images.
- **Media library** accepts JPEG, PNG, and WebP and converts them to WebP. Use the media picker in image fields and set contextual alternative text where the editor provides it. An image referenced by published content or a draft must be detached before deletion. Replacing a shared image changes its appearance wherever it is used.
- **Inquiries** stores submitted RFQs and their optional attachments. Staff can filter, sort, download attachments, change the inquiry status, and export the filtered results as CSV. Review unread inquiries from the dashboard or sidebar. Attachment downloads require an authenticated account.
- **SEO** accepts optional title, description, canonical, and sharing image overrides. The base URL and indexing policy control metadata, robots, and sitemap generation.

The content source in `src/content/` provides the initial seed. The runtime uses published database values. Registered page banners and editorial modules are editable. Presentation copy inside some existing components and fixed equipment anchors are part of the layouts.

## Production deployment

1. Deploy with a Node.js server and HTTPS reverse proxy. Build with `npm run build`, then start with `npm run start`. Use `npm run build -- --webpack` on systems that restrict Turbopack's worker processes. The existing Google fonts are downloaded during the build.
2. Set the MySQL environment variables and run `npm run db:migrate` or `npm run db:import-sqlite` before starting the Node.js app. The runtime applies the schema when its connection pool opens and needs SELECT, INSERT, UPDATE, DELETE, CREATE, and REFERENCES privileges on its own database. Keep credentials and database backups private. Set MySQL's allowed packet size above the application upload limits and test restoring a backup before cutover.
3. Set `APP_ORIGIN` to the exact public HTTPS origin. Forward the original host and protocol through the reverse proxy. Serve authenticated and dynamic HTML without shared caching. Keep the request body limit at least 9 MB for admin uploads and configure request rate limits at the proxy.
4. For self-service password reset, set `RESEND_API_KEY` and `PASSWORD_RESET_FROM` with a verified sender. The app stores a hash of the single-use token and expires it after 30 minutes. Exclude reset URL query strings from access logs. Test delivery in the target environment.
5. Provision the first account in the configured MySQL database. Review the migrated business claims, contact details, canonical origin, and page metadata. Submit a test RFQ and confirm it appears under Inquiries.
6. Preserve the existing deployment and database backup until the new service is verified. Keep the Node process under your service manager and monitor errors, storage capacity, and backup health.

MySQL stores CMS data, sessions, inquiries and uploads. The dynamic branch requires a Node.js process even when the database is managed with phpMyAdmin.

## Checks

```bash
npm run lint
npx next typegen
npx tsc --noEmit
npm run build -- --webpack
node --test scripts/database.test.mjs
```

For release verification, sign in with a disposable test database first. Exercise admin and super-admin access, draft and publish visibility, media replacement and dependency checks, RFQ validation and export, session expiry and logout, and password-reset delivery. Verify the existing public routes and product slugs on desktop and mobile.

## Migrated business information

The original SAPL Profile 2025 content remains the source for the imported figures and photographed parts. Confirm production volumes, ISO certificate revisions and expiry dates, and the current galvanizing and powder-coating status before public rollout. Confirm photo-to-part pairings with the company before changing captions. Record completed expansion projects after the operating team verifies them.

### Browser smoke test

Build the app first. Install `playwright-core` in a temporary tooling directory and use a local Chrome or Chromium installation. Set `PLAYWRIGHT_MODULE` to the absolute path of `playwright-core/index.mjs` and `CHROME_PATH` to the browser executable. Set `MYSQL_TEST_DATABASE` to an empty disposable database whose name starts with `shaheen_test_`, and supply its MySQL connection settings in the environment. Run `node scripts/browser-smoke.mjs`. The test starts a loopback production server on port 3314, provisions disposable accounts and exercises public routes, role checks, draft publishing, image management, RFQ handling, and single-use reset tokens. Set `SMOKE_PORT` if 3314 is occupied.

## Homepage image inventory

Open `/admin/homepage/images/` under Website management → Home page. The inventory is derived from the configured homepage. The first visit records each original source before any replacements.

| Location | Recommended canvas | Rendering |
| --- | --- | --- |
| Hero background and optional video poster | 1920 × 1080 | Full-width cover with the existing hero layout |
| Header and footer wordmarks | 1000 × 231 | Separate logo masks |
| Footer watermark | 512 × 509 | Decorative mark |
| Client marquee logos | 480 × 200 | Transparent contain canvas. Both loop copies use the same client slot |
| Capability cards | 960 × 540 | Cover with the existing card focal positions |
| Featured product covers | 1000 × 800 | Cover within each product card |
| Shop-floor background and video poster | 1920 × 1080 and 1280 × 720 | Cover. The existing video remains in use |
| Featured award photographs | 720 × 960 | Contain within the existing award card |

The same slots serve desktop and mobile. Managed replacements are stored as responsive WebP variants in MySQL. Each replacement has a new URL, and the five most recent uploads per slot remain available for restore. The original source is retained separately. The video files and embedded map keep their existing CMS or application configuration.

## Website-wide image management

The main dashboard and the Website Management sidebar link directly to each page. The protected overview at `/admin/website/images/` links to each page's inventory, including product category detail pages. Its cards show the page URL, preview, image-slot count, and most recent edit. The existing `/admin/homepage/images/` URL continues to manage the same homepage slots and version history.

### Page-wise inventory

| Public page | Independently managed image locations |
| --- | --- |
| `/` | Every homepage slot listed above, plus the page-specific social sharing image |
| `/about/` | Banner, press-shop photograph, individual board and management portraits, and sharing image |
| `/capabilities/` | Banner, each capability card photograph, and sharing image |
| `/facility/` | Banner, each facility gallery entry, and sharing image |
| `/products/` | Banner, each product family cover, each product gallery entry, and sharing image |
| `/products/jack-assemblies/` | Banner, each jack and hinge gallery image, and sharing image |
| `/products/sheet-metal-parts/` | Banner, each sheet metal gallery image, and sharing image |
| `/products/bent-rod-parts/` | Banner, each rod gallery image, and sharing image |
| `/products/formed-pipe-parts/` | Banner, each pipe gallery image, and sharing image |
| `/quality/` | Banner, the three production-stage photographs, each award or certificate photograph, and sharing image |
| `/csr/` | Banner, each CSR initiative image, and sharing image |
| `/gallery/` | Banner, each plant gallery image, and sharing image |
| `/contact/` | Banner and sharing image |
| Global | Header and footer wordmarks, footer watermark, favicon and Apple touch icon, default social image, and each client logo shared by the homepage and Products |

Each page inventory lists the current source preview, recommended dimensions, original or uploaded dimensions when known, file size when available, alternative text, and edit history. The original asset is preserved per slot even when two pages initially use the same file. Home branding and client logo slots with explicit edits take priority on Home. Decorative icons, embedded maps, and video streams retain their existing rendering.

### Registering future image slots

1. Add the public page and its default image slots to `src/lib/server/website-image-inventory.ts`. Use a durable content identifier such as a product slug, team member slug, or source gallery identifier. Give each image its own section, title, fallback, and recommended canvas.
2. In the public server component, load the page's image map with `getPageImages(pageKey)`. Resolve each slot by the same key before passing it into the existing image component. Preserve its container, crop position, loading priority, and responsive sizes.
3. Open Website Management once to register new slots. The additive `website_image_pages` index maps slots to pages, while the existing slot, version, and file tables retain previous homepage uploads. Page rendering also registers its own missing slots. Verify a replacement and restore on the new page.

The existing protected upload endpoint and immutable WebP URLs serve both homepage and website-wide images. Apply `npm run db:migrate` when rolling out the feature. Routine image edits use the Admin Panel and take effect on the next public request.

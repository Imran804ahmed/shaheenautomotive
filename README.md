# Shaheen Automotive (Pvt.) Ltd. — corporate website

A static, production-ready corporate website for SAPL, built with Next.js (App Router), TypeScript and Tailwind CSS v4. Content and imagery are sourced from `SAPL Profile 2025.pptx`.

## Stack

- Next.js 16 (App Router, static export via `output: "export"`)
- TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) for restrained, reduced-motion-aware animation
- Phosphor Icons

No server, database, or API routes are used anywhere; this is a fully static site.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build & static export

```bash
npm run build
```

This runs `next build`, which, because `next.config.ts` sets `output: "export"`, also produces a fully static site in `out/`. Deploy the contents of `out/` to any static host (Netlify, Cloudflare Pages, S3 + CloudFront, GitHub Pages, Vercel static, etc.) or behind any web server.

```bash
npx serve out      # quick local preview of the exported site
```

## Project structure

```
src/
  app/                 Routes (App Router). Each folder is a page.
  components/
    layout/             Header, Footer
    sections/           Page-level sections reused across routes (Hero, PageHeader, CtaBanner, ...)
    ui/                 Small reusable primitives (Button, Container, Reveal, StatCounter, ...)
    forms/              RfqForm (the Request a Quote form)
  content/
    company.ts          All factual company content, sourced from the SAPL profile deck. Edit this file to update stats, capabilities, equipment lists, awards, products, clients, etc.
    site.ts              Business/contact configuration and navigation. Edit this file to fill in placeholders.
  lib/cn.ts             Small classnames helper
public/images/           All imagery extracted from the source PPTX (brand, clients, awards, product photos, one facility photo)
```

## Before you launch: things that still need real information

The source PowerPoint did not contain a public-facing address, phone number, or contact email, and its ISO / "Future Plans" content was inconsistent or time-sensitive. Rather than invent any of this, the site ships with clearly labelled placeholders. Fix all of the following before going live:

### 1. `src/content/site.ts`
- `domain` / `baseUrl` — set to your real production domain (used for canonical URLs, sitemap, Open Graph).
- `contact.email`, `contact.phone`, `contact.addressLine1/2`, `contact.city` — real business contact details.
- `contact.mapEmbedUrl` — optional, if you want an embedded map on the Contact page.
- `social.linkedin` — optional.
- `rfqFormEndpoint` — see "RFQ form" below.

### 2. RFQ form delivery (`src/content/site.ts` → `rfqFormEndpoint`)
This is a static site, so the "Request a Quote" form cannot post to a database on its own. It supports two modes:

- **Recommended:** sign up for a static-form provider (Formspree, Getform, Basin, etc.), create a form, and paste its POST endpoint URL into `rfqFormEndpoint`. The form will then submit directly to that service client-side, including the optional file attachment, and show a real success/error state.
- **Default fallback (no configuration needed):** with `rfqFormEndpoint` left empty, the form builds a pre-filled `mailto:` link to `contact.email` and opens the visitor's own email client. This is clearly labelled in the UI ("this form opens a pre-filled email...") so visitors are never told something was "submitted" when nothing was actually sent anywhere. Note that file attachments cannot be auto-attached via `mailto:`; the UI tells the visitor to attach the file manually.

### 3. Certifications (`src/content/company.ts` → `certificationsNote`)
The source deck references **inconsistent ISO standard revisions** across slides ("ISO 19001:2008", "ISO 9001:2004", and two different ISO 14001 dates). Rather than publish a specific certificate number / revision / validity date that cannot be verified from the source material, the Quality page shows a clearly-labelled placeholder statement instead of ISO badges. Once you have the actual certificates in hand, update `certificationsNote` with the verified standard, revision, certificate number and validity date, and consider adding the real certificate badge images to `public/images/`.

### 4. "Future Plans" slide (excluded)
Slide 19 of the source deck ("Future Plans") lists 2025-dated expansion items (press tonnage upgrade, new pipe grooving machine, facility expansion). Because their completion status cannot be confirmed from the source material and the target dates have since passed, **this content was deliberately left out of the site**. If these have since been completed, consider adding them to Capabilities as confirmed, dated achievements rather than "future plans."

### 5. Galvanizing & powder coating status
The Capabilities page carries a note that this facility's current operating status should be reconfirmed before publishing without qualification (per the source brief). Remove the note once confirmed, or update the copy if the facility's status has changed.

### 6. Production figures
350+ parts, 200+ projects, 8+ OEMs and 100–120 tons/month are presented as figures published in the SAPL Profile 2025 deck, not as independently re-verified current figures. They live in `src/content/company.ts` (`heroStats`, `aboutStats`) as single-source-of-truth values, easy to update once reconfirmed.

### 7. Imagery
`public/images/` contains only photography and logos that were verifiably genuine (SAPL's own logo, real award/trophy photographs, real product photographs shot on the shop floor, one real factory-floor photograph, and OEM/client logos). Generic vendor/catalog stock photos of machinery that appeared in the source deck (press, welder, FARO arm, caliper stock photography) were **deliberately excluded** rather than presented as photographs of SAPL's own equipment; equipment specifications are instead presented as data (Capabilities page) rather than stock imagery. If you commission real photography of your press shop, pipe shop, welding shop and inspection room, add it to `public/images/facility/` and wire it into `src/content/company.ts` and the relevant section components.

### 8. Product photo → part name pairing
The source deck lists named parts per OEM (e.g. "Support Radiator", "Luggage Hinges") separately from its photographs, with no explicit pairing between a specific photo and a specific part name. To avoid misattributing a part identity, the Products pages show the verified part-name lists and the photo galleries as two independent, clearly-labelled sections rather than force-pairing them. If you can confirm which photograph is which named part, update the `alt` text and captions in `src/content/company.ts` (`productPrograms`, `categoryPhotos`) accordingly.

## Updating content

Almost everything you'll want to change day-to-day lives in two files:

- `src/content/company.ts` — facts: history, vision/mission, stats, capabilities, equipment lists, awards, products, clients.
- `src/content/site.ts` — business config: contact details, RFQ endpoint, nav labels, product category slugs/labels.

Both are plain, typed TypeScript objects; editing a string value and re-running `npm run build` is all that's needed for most changes.

## SEO

- Per-page metadata (title, description, canonical URL) is set in each `page.tsx`.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` and `robots.txt` at build time; update `siteConfig.baseUrl` first.
- Open Graph / Twitter card defaults are set in `src/app/layout.tsx`.

## Accessibility & performance notes

- All interactive components are keyboard-navigable with visible focus states (see `:focus-visible` in `globals.css`).
- Motion respects `prefers-reduced-motion` throughout (see `src/components/ui/Reveal.tsx`, `StatCounter.tsx`, and the reduced-motion block in `globals.css`).
- Images use `next/image` with `unoptimized: true` (required for static export) and explicit `sizes` attributes.
- There is exactly one marquee on the site (the client logo strip on the homepage) and no scroll-hijacking.

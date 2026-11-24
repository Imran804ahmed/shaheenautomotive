import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { dataRows, defaults, isContentKey, type ContentKey } from "@/lib/server/content";
import { db } from "@/lib/server/database.mjs";
import { saveContent } from "../../content-actions";
import { Editor, type Value } from "../../editor";

const groups = {
  Home: ["hero", "homeSections", "homeCapabilityOrder", "heroStats", "clients", "processSteps"],
  Company: ["pageHeaders", "history", "vision", "mission", "aboutPillars", "industriesServed", "leadership", "managementTeam"],
  Capabilities: ["capabilities", "capabilityImages", "capabilityVisibility", "equipmentDesignDev", "equipmentPressShop", "equipmentPipeShop", "equipmentWeldingShop", "equipmentInspection", "pressShopTotal", "weldingShopTotal"],
  Products: ["productCategories", "productDetails", "categoryPhotos", "jackHingeCategories", "jackHingePhotos", "productGalleryCategories", "productGalleryPhotos"],
  Facility: ["floorCategories", "floorPhotos", "galleryCategories", "galleryPhotos"],
  Quality: ["awardPhotos", "namedAwards", "certificationsNote"],
  CSR: ["csrIntro", "csrAreas"],
  Settings: ["settings", "brand", "seo"],
} satisfies Record<string, ContentKey[]>;
const sections = Object.values(groups).flat() as ContentKey[];
const titleFor = (key: string) => key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`).replace(/^./, (letter) => letter.toUpperCase());

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ section?: string; q?: string; saved?: string }> }) {
  await requireAdministrator();
  const query = await searchParams;
  const selected = typeof query.section === "string" && isContentKey(query.section) && sections.includes(query.section) ? query.section : "hero";
  const term = typeof query.q === "string" ? query.q.slice(0, 100).toLowerCase() : "";
  await dataRows();
  const database = db();
  const row = (await database.prepare("SELECT published,draft,revision FROM cms WHERE cms_key=?").get(selected))!;
  const media = (await database.prepare("SELECT id,name FROM media ORDER BY created_at DESC LIMIT 250").all())
    .map(({ id, name }) => ({ url: `/media/${id}/`, name: String(name) }));
  const saved = { draft: "Draft saved.", publish: "Changes published.", discard: "Draft discarded." }[String(query.saved)];
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Administration / Website content</p><h1>Website content</h1></div></div>
      <div className="admin-editor-layout">
        <aside className="admin-card admin-editor-nav">
          <form className="admin-form"><label>Find a section<input name="q" defaultValue={term} maxLength={100} type="search" /></label><button>Search</button></form>
          {Object.entries(groups).map(([group, keys]) => {
            const matches = keys.filter((key) => !term || `${group} ${titleFor(key)}`.toLowerCase().includes(term));
            return matches.length ? <details key={group} open={Boolean(term) || matches.some((key) => key === selected)}><summary>{group}</summary>{matches.map((key) => <Link key={key} aria-current={key === selected ? "page" : undefined} href={`/admin/content?section=${key}`}>{titleFor(key)}</Link>)}</details> : null;
          })}
        </aside>
        <section className="admin-card">
          <div className="admin-heading"><h2>{titleFor(selected)}</h2><span className="admin-badge">{row.draft ? "Draft" : "Published"}</span></div>
          {selected === "productCategories" && <p>Existing product URLs stay available. Use Visible to control listings and Featured to control the home page.</p>}
          {typeof row.draft === "string" && (selected === "hero" || selected === "pageHeaders") && <Link href={`/admin/content/preview?section=${selected}`}>Preview saved draft ↗</Link>}
          {saved && <p role="status" className="admin-notice">{saved}</p>}
          <Editor key={`${selected}-${row.revision}`} initial={JSON.parse(String(row.draft ?? row.published))} sample={defaults[selected] as unknown as Value}
            revision={Number(row.revision)} media={media} hasDraft={Boolean(row.draft)} save={saveContent.bind(null, selected)} />
        </section>
      </div>
    </>
  );
}

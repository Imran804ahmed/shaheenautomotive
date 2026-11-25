import Image from "next/image";
import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { getWebsiteInventory, imageManagementHref } from "@/lib/server/website-image-inventory";
import { getWebsiteSlots } from "@/lib/server/website-images";

export default async function WebsiteImagesOverview({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdministrator();
  const query = (await searchParams).q;
  const term = typeof query === "string" ? query.trim().slice(0, 100) : "";
  const [inventory, slots] = await Promise.all([getWebsiteInventory(), getWebsiteSlots()]);
  const matching = inventory.filter(({ title, path }) => `${title} ${path}`.toLowerCase().includes(term.toLowerCase()));
  const byPage = Map.groupBy(slots, (slot) => slot.pageKey);

  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Website management</p><h1>Website images</h1></div></div>
      <form className="admin-filters"><label>Search pages<input type="search" name="q" defaultValue={term} maxLength={100} /></label><button>Search</button></form>
      {!matching.length && <p>No pages match this search.</p>}
      <div className="admin-media-grid home-image-grid">
        {matching.map(({ key, title, path }) => {
          const rows = byPage.get(key) ?? [];
          const preview = rows.find(({ src }) => src);
          const updated = Math.max(0, ...rows.map(({ updatedAt }) => Number(updatedAt)));
          return (
            <article className="admin-card" key={key}>
              <span className="home-photo">
                {preview && <Image src={preview.src} alt="" fill sizes="(max-width: 760px) 100vw, 330px" className={key === "global" ? "object-contain" : "object-cover"} />}
              </span>
              <h2>{title}</h2>
              <p>{key === "global" ? "Shared across public pages" : path}</p>
              <p>{rows.length} image slots · {updated ? `Updated ${new Date(updated * 1000).toISOString().slice(0, 10)} UTC` : "Original assets"}</p>
              <div className="admin-inline">
                <Link className="admin-button" href={imageManagementHref(key)}>Manage images</Link>
                <Link href={path} target="_blank">View live page</Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";
import { FeedbackForm } from "../../feedback-form";
import { deleteImage, saveImage } from "../../media-actions";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdministrator();
  const query = await searchParams;
  const term = typeof query.q === "string" ? query.q.slice(0, 100) : "";
  const page = Math.min(10_000, Math.max(1, Number.parseInt(query.page ?? "", 10) || 1));
  const items = await db().prepare("SELECT id,name,alt FROM media WHERE instr(lower(CONCAT_WS(' ',name,alt)),lower(?))>0 OR ?='' ORDER BY created_at DESC,id LIMIT 13 OFFSET ?").all(term, term, (page - 1) * 12);
  const pageLink = (number: number) => `/admin/media?${new URLSearchParams({ q: term, page: String(number) })}`;
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Administration / Media library</p><h1>Media library</h1></div></div>
      <section className="admin-card">
        <h2>Upload image</h2>
        <FeedbackForm submit={saveImage.bind(null, "")} label="Upload image">
          <label>JPEG, PNG or WebP · up to 8 MB<input type="file" name="image" accept="image/jpeg,image/png,image/webp" required /></label>
          <label>Alternative text<input name="alt" maxLength={300} required /></label>
        </FeedbackForm>
      </section>
      <form className="admin-filters"><label>Search images<input type="search" name="q" defaultValue={term} maxLength={100} /></label><button>Search</button></form>
      {!items.length && <p>No images match this search.</p>}
      <div className="admin-media-grid">
        {items.slice(0, 12).map(({ id, name, alt }) => {
          const url = `/media/${id}/`;
          return (
            <article className="admin-card" key={String(id)}>
              <Image className="admin-media-image" src={url} alt={String(alt)} width={300} height={180} unoptimized />
              <h2>{String(name)}</h2>
              <label>Image URL<input readOnly value={url} /></label>
              <details>
                <summary>Edit image</summary>
                <FeedbackForm submit={saveImage.bind(null, String(id))} label="Save image">
                  <label>Alternative text<input name="alt" defaultValue={String(alt)} maxLength={300} required /></label>
                  <label>Replace image<input type="file" name="image" accept="image/jpeg,image/png,image/webp" /></label>
                </FeedbackForm>
                <FeedbackForm submit={deleteImage.bind(null, String(id))} label="Delete image" confirmation="Permanently delete this image?" />
              </details>
            </article>
          );
        })}
      </div>
      <nav className="admin-pagination" aria-label="Media pages">{page > 1 && <Link href={pageLink(page - 1)}>Previous</Link>}<span>Page {page}</span>{items.length > 12 && <Link href={pageLink(page + 1)}>Next</Link>}</nav>
    </>
  );
}

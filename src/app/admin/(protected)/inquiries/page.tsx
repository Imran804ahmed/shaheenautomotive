import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";
import { inquiryFilter } from "@/lib/server/inquiries";

export default async function Inquiries({ searchParams }: { searchParams: Promise<{ q?: string; state?: string; order?: string; page?: string }> }) {
  await requireAdministrator();
  const query = await searchParams;
  const { term, status, where, parameters } = inquiryFilter(query);
  const page = Math.min(10_000, Math.max(1, Number.parseInt(query.page ?? "", 10) || 1));
  const order = query.order === "oldest" ? "oldest" : "newest";
  const rows = await db().prepare(`SELECT id,name,company,category,status,created_at FROM inquiries ${where}
    ORDER BY id ${order === "oldest" ? "ASC" : "DESC"} LIMIT 21 OFFSET ?`).all(...parameters, (page - 1) * 20);
  const base = new URLSearchParams({ q: term, state: status, order });
  const pageLink = (number: number) => `/admin/inquiries?${base}&page=${number}`;
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Administration / Inquiries</p><h1>Inquiries</h1></div><a className="admin-button" href={`/admin/inquiries/export/?${base}`}>Export CSV</a></div>
      <section className="admin-card">
        <form className="admin-filters">
          <label>Search inquiries<input name="q" type="search" defaultValue={term} maxLength={100} /></label>
          <label>Status<select name="state" defaultValue={status}><option value="">All statuses</option><option value="unread">Unread</option><option value="read">Read</option><option value="closed">Closed</option></select></label>
          <label>Sort<select name="order" defaultValue={order}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
          <button>Apply</button>
        </form>
        {rows.length ? <div className="admin-table-wrap">
          <table><thead><tr><th>Name</th><th>Company</th><th>Category</th><th>Status</th><th>Submitted (UTC)</th></tr></thead>
            <tbody>{rows.slice(0, 20).map((row) => <tr key={String(row.id)}><td><Link href={`/admin/inquiries/${row.id}`}>{String(row.name)}</Link></td><td>{String(row.company)}</td><td>{String(row.category)}</td><td>{String(row.status)}</td><td>{new Date(Number(row.created_at) * 1000).toISOString().slice(0, 10)}</td></tr>)}</tbody>
          </table>
        </div> : <p>No inquiries match these filters.</p>}
        <nav className="admin-pagination" aria-label="Inquiry pages">{page > 1 && <Link href={pageLink(page - 1)}>Previous</Link>}<span>Page {page}</span>{rows.length > 20 && <Link href={pageLink(page + 1)}>Next</Link>}</nav>
      </section>
    </>
  );
}

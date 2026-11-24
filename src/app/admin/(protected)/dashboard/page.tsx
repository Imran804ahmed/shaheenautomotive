import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";

export default async function Dashboard() {
  await requireAdministrator();
  const database = db();
  const inquiries = await database.prepare("SELECT id, company, category, status FROM inquiries ORDER BY id DESC LIMIT 5").all();
  const events = await database.prepare(`
    SELECT audit.id, action, subject, audit.created_at, name FROM audit
    LEFT JOIN administrators ON administrators.id=audit.administrator_id ORDER BY audit.id DESC LIMIT 8`).all();
  const today = new Date();
  const monthStart = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1) / 1000;
  const metrics = [
    ["Unread inquiries", "SELECT count(*) AS total FROM inquiries WHERE status='unread'"],
    ["Inquiries this month", "SELECT count(*) AS total FROM inquiries WHERE created_at>=?", monthStart],
    ["Content drafts", "SELECT count(*) AS total FROM cms WHERE draft IS NOT NULL"],
    ["Uploaded images", "SELECT count(*) AS total FROM media"],
  ] as const;
  const totals = await Promise.all(metrics.map(async ([label, query, ...args]) => [label, (await database.prepare(query).get(...args))?.total ?? 0] as const));
  const days = await database.prepare(`
    WITH RECURSIVE dates(day) AS (
      SELECT CAST(? AS SIGNED) UNION ALL SELECT day+86400 FROM dates WHERE day<?
    ) SELECT day,count(inquiries.id) AS total FROM dates LEFT JOIN inquiries
    ON inquiries.created_at>=day AND inquiries.created_at<day+86400 GROUP BY day ORDER BY day
  `).all(Math.floor(today.getTime() / 86400000) * 86400 - 6 * 86400, Math.floor(today.getTime() / 86400000) * 86400);
  const peak = Math.max(1, ...days.map(({ total }) => Number(total)));
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Workspace</p><h1>Overview</h1></div><Link className="admin-button" href="/admin/content">Edit website</Link></div>
      <div className="admin-metrics">{totals.map(([label, total]) => <article key={label}><p>{label}</p><strong>{String(total)}</strong></article>)}</div>
      <div className="admin-columns">
        <section className="admin-card">
          <h2>Inquiries over the last seven days</h2>
          <ul className="admin-chart">{days.map(({ day, total }) => (
            <li key={String(day)}>
              <span>{new Date(Number(day) * 1000).toISOString().slice(5, 10)}</span><meter min={0} max={peak} value={Number(total)} aria-label={String(day)} /> <strong>{String(total)}</strong>
            </li>
          ))}</ul>
        </section>
        <section className="admin-card">
          <h2>Recent inquiries</h2>
          {inquiries.length ? <ul className="admin-list">{inquiries.map((row) => <li key={String(row.id)}><Link href={`/admin/inquiries/${row.id}`}>{String(row.company)}</Link><small>{String(row.status)}</small></li>)}</ul> : <p>No inquiries have been submitted.</p>}
          <Link href="/admin/inquiries">Open inbox →</Link>
        </section>
      </div>
      <section className="admin-card">
        <h2>Recent activity</h2>
        {events.length ? <ul className="admin-list">{events.map((event) => <li key={String(event.id)}><span>{String(event.name ?? "System")} · {String(event.action)} · {String(event.subject)}</span><small>{new Date(Number(event.created_at) * 1000).toISOString().slice(0, 16).replace("T", " ")} UTC</small></li>)}</ul> : <p>There is no activity yet.</p>}
      </section>
    </>
  );
}

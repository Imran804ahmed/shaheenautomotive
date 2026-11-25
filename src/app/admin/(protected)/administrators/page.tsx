import Link from "next/link";
import { requireAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";
import { removeAdministratorAccess, saveAdministrator } from "../../account-actions";
import { FeedbackForm } from "../../feedback-form";

function Role({ role = "admin" }: { role?: string }) {
  return <label>Role<select name="role" defaultValue={role}><option value="admin">Administrator</option><option value="super_admin">Super administrator</option></select></label>;
}

export default async function Administrators({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; removed?: string }> }) {
  const administrator = await requireAdministrator(true);
  const query = await searchParams;
  const term = typeof query.q === "string" ? query.q.slice(0, 100) : "";
  const page = Math.min(10_000, Math.max(1, Number.parseInt(query.page ?? "", 10) || 1));
  const accounts = await db().prepare("SELECT id,email,name,role,active FROM administrators WHERE ?='' OR instr(lower(CONCAT_WS(' ',name,email)),lower(?))>0 ORDER BY name,id LIMIT 21 OFFSET ?")
    .all(term, term, (page - 1) * 20);
  const pageLink = (number: number) => `/admin/administrators?${new URLSearchParams({ q: term, page: String(number) })}`;
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Administration / Users</p><h1>Users</h1></div></div>
      {query.removed === "1" && <p className="admin-notice" role="status">User access removed.</p>}
      <section className="admin-card"><h2>Add a user</h2>
        <FeedbackForm submit={saveAdministrator.bind(null, 0)} label="Add user">
          <label>Name<input name="name" maxLength={120} required /></label>
          <label>Email<input name="email" type="email" maxLength={254} required /></label>
          <label>Initial password<input name="password" type="password" autoComplete="new-password" minLength={6} maxLength={128} required /></label>
          <Role />
        </FeedbackForm>
      </section>
      <section className="admin-card">
        <h2>Account access</h2>
        <form className="admin-filters"><label>Search accounts<input type="search" name="q" defaultValue={term} maxLength={100} /></label><button>Search</button></form>
        {!accounts.length && <p>No matching accounts.</p>}
        <ul className="admin-list">{accounts.slice(0, 20).map((row) => (
          <li key={String(row.id)}>
            <div><strong>{String(row.name)}</strong><br /><small>{String(row.email)} · {row.role === "super_admin" ? "Super administrator" : "Administrator"} · {row.active ? "Active" : "Inactive"}</small></div>
            {row.id !== administrator.id && <div className="admin-user-controls"><details>
              <summary>Edit access</summary>
              <FeedbackForm submit={saveAdministrator.bind(null, Number(row.id))} label="Update access" confirmation="Update access and sign this administrator out of existing sessions?">
                <Role role={String(row.role)} />
                <label className="admin-check"><input type="checkbox" name="active" defaultChecked={Boolean(row.active)} /> Active</label>
              </FeedbackForm>
            </details>
              {Boolean(row.active) && (
                <FeedbackForm submit={removeAdministratorAccess.bind(null, Number(row.id))} label="Remove access"
                  confirmation="Remove this user’s access and sign them out? You can reactivate the account later." />
              )}
            </div>}
          </li>
        ))}</ul>
        <nav className="admin-pagination" aria-label="Account pages">{page > 1 && <Link href={pageLink(page - 1)}>Previous</Link>}<span>Page {page}</span>{accounts.length > 20 && <Link href={pageLink(page + 1)}>Next</Link>}</nav>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";
import { updateInquiry } from "../../../inquiry-actions";
import { FeedbackForm } from "../../../feedback-form";

export default async function Inquiry({ params }: { params: Promise<{ id: string }> }) {
  await requireAdministrator();
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const row = await db().prepare("SELECT id,name,company,email,phone,category,quantity,description,message,status,created_at,attachment_name FROM inquiries WHERE id=?").get(id);
  if (!row) notFound();
  const details = {
    Company: row.company, Email: row.email, Phone: row.phone, Category: row.category,
    "Estimated quantity": row.quantity, "Part description": row.description, "Additional message": row.message,
    Submitted: new Date(Number(row.created_at) * 1000).toISOString(),
  };
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker"><Link href="/admin/inquiries">Inquiries</Link> / #{id}</p><h1>{String(row.name)}</h1></div></div>
      <section className="admin-card">
        <dl className="admin-description">{Object.entries(details).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{String(value || "—")}</dd></div>)}</dl>
        {typeof row.attachment_name === "string" && <a className="admin-button" href={`/admin/inquiries/${id}/attachment/`}>Download {row.attachment_name}</a>}
      </section>
      <section className="admin-card">
        <h2>Inquiry status</h2>
        <FeedbackForm submit={updateInquiry.bind(null, id)} label="Update status">
          <div className="admin-editor-value">
            <label htmlFor="inquiry-status">Status</label>
            <select id="inquiry-status" name="status" defaultValue={String(row.status)}>
              <option value="unread">Unread</option><option value="read">Read</option><option value="closed">Closed</option>
            </select>
          </div>
        </FeedbackForm>
      </section>
    </>
  );
}

import { audit, getAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";
import { csvCell, inquiryFilter } from "@/lib/server/inquiries";

export async function GET(request: Request) {
  const admin = await getAdministrator();
  if (!admin) return new Response(null, { status: 401 });
  const url = new URL(request.url);
  const { where, parameters } = inquiryFilter({ q: url.searchParams.get("q") ?? "", state: url.searchParams.get("state") ?? "" });
  const fields = ["id", "name", "company", "email", "phone", "category", "quantity", "description", "message", "status", "submitted_utc"];
  const order = url.searchParams.get("order") === "oldest" ? "ASC" : "DESC";
  const rows = await db().prepare(`SELECT ${fields.slice(0, -1).join(",")}, created_at
    FROM inquiries ${where} ORDER BY id ${order}`).all(...parameters);
  await audit(admin.id, "Exported inquiries", `${rows.length} records`);
  const text = [fields.join(","), ...rows.map((row) => fields.map((field) => csvCell(field === "submitted_utc" ? new Date(Number(row.created_at) * 1000).toISOString() : row[field])).join(","))].join("\r\n");
  return new Response(text, { headers: {
    "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="shaheen-inquiries.csv"',
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  } });
}

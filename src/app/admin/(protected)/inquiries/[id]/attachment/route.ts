import { getAdministrator } from "@/lib/server/auth";
import { db } from "@/lib/server/database.mjs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdministrator()) return new Response(null, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) return new Response(null, { status: 404 });
  const row = await db().prepare("SELECT attachment_name,attachment FROM inquiries WHERE id=?").get(id);
  if (!row?.attachment || typeof row.attachment_name !== "string") return new Response(null, { status: 404 });
  return new Response(Buffer.from(row.attachment as Uint8Array), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${row.attachment_name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

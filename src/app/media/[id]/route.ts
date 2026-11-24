import { db } from "@/lib/server/database.mjs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const row = await db().prepare("SELECT bytes FROM media WHERE id=?").get(id);
  if (!row) return new Response(null, { status: 404 });
  return new Response(Buffer.from(row.bytes as Uint8Array), {
    headers: { "Content-Type": "image/webp", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache" },
  });
}

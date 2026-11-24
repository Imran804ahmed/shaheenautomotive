import { db } from "@/lib/server/database.mjs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string; width: string }> }) {
  const { id, width } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id) || !/^\d{1,4}$/.test(width)) return new Response(null, { status: 404 });
  const requested = Number(width) || 2400;
  const row = await db().prepare(`
    SELECT bytes FROM homepage_image_files WHERE version_id=?
    ORDER BY (width<?), ABS(width-?) LIMIT 1
  `).get(id, requested, requested);
  if (!row) return new Response(null, { status: 404 });
  return new Response(Buffer.from(row.bytes as Uint8Array), {
    headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
  });
}

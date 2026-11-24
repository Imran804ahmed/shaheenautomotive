import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { PageHeader } from "@/components/sections/PageHeader";
import { requireAdministrator } from "@/lib/server/auth";
import type { Content } from "@/lib/server/content";
import { db } from "@/lib/server/database.mjs";

export default async function Preview({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  await requireAdministrator();
  const { section } = await searchParams;
  if (section !== "hero" && section !== "pageHeaders") notFound();
  const draft = (await db().prepare("SELECT draft FROM cms WHERE cms_key=?").get(section))?.draft;
  if (typeof draft !== "string") notFound();
  return (
    <>
      <div className="admin-heading">
        <div><p className="admin-kicker">Website content</p><h1>Draft preview</h1></div>
        <Link href={`/admin/content?section=${section}`}>Back to editor</Link>
      </div>
      <div className="admin-public-preview overflow-hidden rounded-xl">
        {section === "hero"
          ? <Hero preview={JSON.parse(draft) as Content["hero"]} />
          : Object.entries(JSON.parse(draft) as Content["pageHeaders"]).map(([page, values]) => <PageHeader key={page} {...values} flat />)}
      </div>
    </>
  );
}

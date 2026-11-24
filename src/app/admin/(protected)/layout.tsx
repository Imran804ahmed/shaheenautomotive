import Link from "next/link";
import Image from "next/image";
import { requireAdministrator } from "@/lib/server/auth";
import { getContent } from "@/lib/server/content";
import { db } from "@/lib/server/database.mjs";
import { logout } from "../auth-actions";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdministrator();
  const { brand, settings } = await getContent();
  const unread = Number((await db().prepare("SELECT count(*) AS total FROM inquiries WHERE status='unread'").get())?.total);
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard"><Image src={brand.logoFullLight} alt={settings.siteName} width={192} height={50} unoptimized /></Link>
        <details open className="admin-navigation">
          <summary>Workspace</summary>
          <nav aria-label="Admin">
            <Link href="/admin/dashboard">Overview</Link>
            <Link href="/admin/content">Website content</Link>
            <details className="admin-home-nav">
              <summary>Website management</summary>
              <details open>
                <summary>Home page</summary>
                <Link href="/admin/homepage/images">Image management</Link>
              </details>
            </details>
            <Link href="/admin/inquiries">Inquiries {unread > 0 && <span className="admin-badge">{unread}</span>}</Link>
            <Link href="/admin/media">Media library</Link>
            {admin.role === "super_admin" && <Link href="/admin/administrators">Administrators</Link>}
          </nav>
        </details>
        <Link className="admin-public-link" href="/">View website ↗</Link>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <Link href="/admin/dashboard">Administration</Link>
          <details className="admin-profile">
            <summary>{admin.name}</summary>
            <div>
              <small>{admin.email}</small>
              <Link href="/admin/account">My account</Link>
              <form action={logout}><button>Sign out</button></form>
            </div>
          </details>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/server/content";
import { AuthForm } from "./auth-form";

export async function AuthPanel({ mode, token, reset }: { mode: "login" | "forgot" | "reset"; token?: string; reset?: boolean }) {
  const { brand, settings } = await getContent();
  return (
    <main className="admin-auth">
      <div className="admin-auth-brand">
        <Image src={brand.logoFullLight} width={245} height={85} alt={settings.siteName} unoptimized />
        <Link href="/">View website ↗</Link>
      </div>
      <section className="admin-auth-card">
        <p className="admin-kicker">Website administration</p>
        <h1>{{ login: "Sign in", forgot: "Recover access", reset: "Set a new password" }[mode]}</h1>
        {reset && <p role="status" className="admin-notice">Password updated. Sign in with your new password.</p>}
        <AuthForm mode={mode} token={token} />
      </section>
    </main>
  );
}

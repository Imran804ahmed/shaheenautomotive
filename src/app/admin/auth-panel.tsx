import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/server/content";
import { getHomepageImages } from "@/lib/server/website-images";
import { AuthForm } from "./auth-form";

export async function AuthPanel({ mode, token, reset }: { mode: "login" | "forgot" | "reset"; token?: string; reset?: boolean }) {
  const { brand, settings, hero } = await getContent();
  const heroImage = mode === "login" ? (await getHomepageImages())["hero-background"]?.src || hero.image : null;
  return (
    <main className="admin-auth">
      <div className={heroImage ? "admin-auth-brand admin-auth-hero" : "admin-auth-brand"}>
        {heroImage && <Image className="admin-auth-photo" src={heroImage} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" loading="eager" fetchPriority="high" />}
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { List, X, CaretDown } from "@phosphor-icons/react";
import { siteConfig } from "@/content/site";
import { brand } from "@/content/company";
import { cn } from "@/lib/cn";

const productCategories = siteConfig.productCategories;

const menuItem = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const } },
};

const ctaClasses =
  "inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-[0_8px_20px_-8px_rgb(23_112_63/0.7)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-accent-strong";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // State flips only when crossing the threshold, never per frame.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  const closeMenu = () => setOpen(false);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-[var(--header-h)] px-3 pt-3 sm:px-6">
      <div className="pointer-events-auto relative mx-auto max-w-7xl">
        <div
          className={cn(
            "relative flex h-14 items-center justify-between rounded-full border border-white/40 pl-4 pr-2 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 sm:pl-5",
            scrolled
              ? "bg-bg-elevated shadow-[0_14px_44px_-12px_rgb(4_12_8/0.55)]"
              : "bg-bg-elevated/90 shadow-[0_10px_40px_-14px_rgb(4_12_8/0.35)]"
          )}
        >
          {/* reading progress: a thin line along the bar's lower edge */}
          {!reduce && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <motion.span
                style={{ scaleX: progress }}
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-accent to-glow"
              />
            </span>
          )}

          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${siteConfig.siteName} home`}>
            <Image
              src={brand.logoFull}
              alt={siteConfig.companyLegalName}
              width={1000}
              height={231}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const linkClasses = cn(
                "group/link relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                active ? "text-fg" : "text-fg-muted hover:text-fg"
              );
              const pill = active && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                />
              );
              const underline = !active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 motion-reduce:transition-none"
                />
              );
              if (item.label === "Products") {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    onFocus={() => setProductsOpen(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setProductsOpen(false);
                    }}
                  >
                    <Link href={item.href} className={linkClasses} aria-current={active ? "page" : undefined}>
                      {pill}
                      {underline}
                      {item.label}
                      <CaretDown
                        size={12}
                        weight="bold"
                        className={cn("transition-transform duration-200", productsOpen && "rotate-180")}
                      />
                    </Link>
                    <AnimatePresence>
                      {productsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3"
                        >
                          <div className="rounded-3xl border border-border bg-bg-elevated p-2 shadow-lift">
                            {productCategories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products/${cat.slug}`}
                                className="block rounded-2xl px-3.5 py-2.5 text-sm text-fg-muted transition-[background-color,color,transform] duration-150 hover:translate-x-0.5 hover:bg-accent-soft hover:text-accent"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={linkClasses} aria-current={active ? "page" : undefined}>
                  {pill}
                  {underline}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center lg:flex">
            <Link href="/contact" className={ctaClasses}>
              Request a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg transition-[background-color,transform] duration-150 hover:bg-accent-soft active:scale-90 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "list"}
                initial={reduce ? false : { opacity: 0, rotate: open ? -60 : 60 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: open ? 60 : -60 }}
                transition={{ duration: 0.12 }}
                className="flex"
              >
                {open ? <X size={22} /> : <List size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[1.75rem] border border-border bg-bg-elevated p-3 shadow-deep lg:hidden"
            >
              <motion.div
                className="flex flex-col gap-1"
                initial={reduce ? false : "hidden"}
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
              >
                {siteConfig.nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <motion.div key={item.href} variants={menuItem}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent-soft",
                          active ? "bg-accent-soft text-accent" : "text-fg"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div variants={menuItem} className="mt-1 flex flex-col gap-0.5 border-t border-border pt-2">
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products/${cat.slug}`}
                      onClick={closeMenu}
                      className="rounded-2xl px-4 py-2.5 text-sm text-fg-muted transition-colors hover:bg-accent-soft"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </motion.div>
                <motion.div variants={menuItem}>
                  <Link href="/contact" onClick={closeMenu} className={cn(ctaClasses, "mt-2 w-full py-3.5")}>
                    Request a Quote
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

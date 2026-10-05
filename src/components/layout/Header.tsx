"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { List, X, CaretDown, ArrowUpRight } from "@phosphor-icons/react";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

const productCategories = siteConfig.productCategories;

const menuItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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

  // while the menu is open: lock page scroll and take the page behind it out of
  // the tab order / accessibility tree, so focus can't wander under the overlay
  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById("main-content"), document.querySelector("body > footer")];
    document.body.style.overflow = "hidden";
    behind.forEach((el) => el?.setAttribute("inert", ""));
    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => el?.removeAttribute("inert"));
    };
  }, [open]);

  // the overlay is lg:hidden, so close it if the viewport grows past lg (rotation, resize)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // transparent over the dark page hero, frosted glass once scrolled or open
  const solid = scrolled || open;

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)]">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/55 to-transparent transition-opacity duration-500",
          solid ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "glass-dark absolute inset-0 border-b border-white/[0.07] transition-opacity duration-500",
          solid ? "opacity-100" : "opacity-0"
        )}
      />
      {/* reading progress along the header's lower edge */}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent via-glow to-accent transition-opacity duration-500",
            solid ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      <Container className="relative flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex h-11 shrink-0 items-center active:scale-[0.98]"
          aria-label={`${siteConfig.companyLegalName}, home`}
        >
          <span
            className={cn(
              "logo-duo h-9 w-auto origin-left transition-transform duration-500 ease-out sm:h-11",
              solid && "scale-[0.84]"
            )}
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center lg:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            const linkClasses = cn(
              "relative flex items-center gap-1 whitespace-nowrap px-2.5 py-3 text-[0.8125rem] font-medium tracking-wide transition-colors duration-200 xl:px-3.5 xl:text-sm",
              active ? "text-white" : "text-white/65 hover:text-white"
            );
            const indicator = active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-x-2.5 -bottom-px h-[2px] rounded-full bg-glow shadow-[0_0_12px_rgb(56_194_122/0.8)] xl:inset-x-3.5"
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
                    {indicator}
                    {item.label}
                    <CaretDown
                      size={11}
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
                        className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                      >
                        <div className="glass-dark rounded-2xl p-2">
                          {productCategories.map((cat, i) => (
                            <Link
                              key={cat.slug}
                              href={`/products/${cat.slug}`}
                              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white"
                            >
                              <span className="mono-figure text-[11px] text-glow">{String(i + 1).padStart(2, "0")}</span>
                              <span className="flex-1">{cat.label}</span>
                              <ArrowUpRight
                                size={13}
                                weight="bold"
                                className="opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                              />
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
                {indicator}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-accent-strong px-4 py-2.5 xl:px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_10px_24px_-10px_rgb(23_112_63/0.8)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-accent active:translate-y-0"
          >
            Contact Us
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-90 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
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
              {open ? <X size={20} /> : <List size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="menu-ink fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto lg:hidden"
          >
            <motion.nav
              aria-label="Mobile"
              className="flex min-h-full flex-col px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-8"
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
            >
              {siteConfig.nav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.div key={item.href} variants={menuItem} className="border-b border-white/[0.07]">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-4"
                    >
                      <span className={cn("mono-figure text-xs", active ? "text-glow" : "text-white/35")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[1.65rem] font-bold leading-none tracking-tight transition-colors",
                          active ? "text-white" : "text-white/70 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={menuItem} className="mt-6 flex flex-wrap gap-2">
                {productCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    onClick={closeMenu}
                    className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/5 px-4 text-sm text-white/75 transition-colors hover:border-glow/50 hover:text-white"
                  >
                    {cat.label}
                  </Link>
                ))}
              </motion.div>
              <motion.div variants={menuItem} className="mt-auto pt-10">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-strong py-4 text-base font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] active:scale-[0.98]"
                >
                  Contact Us
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

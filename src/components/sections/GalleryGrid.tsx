"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowsOut, X } from "@phosphor-icons/react";
import { galleryCategories, type GalleryPhoto, type PhotoCategory } from "@/content/company";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Bento spans per breakpoint so any filtered count lands on a clean rectangle:
 * - base (2 cols, square tiles): the feature photo runs full width, and an
 *   odd trailing photo widens to fill the last row.
 * - sm (3 cols) / lg (4 cols): the feature is a 2×2 tile; at sm the last
 *   photo stretches to close the final row, at lg trailing photos widen to 2
 *   columns until the last row is full.
 */
function spanFor(i: number, n: number) {
  const feature = n >= 5;
  if (feature && i === 0) return "col-span-2 aspect-[16/10] sm:row-span-2 lg:row-span-2";

  const last = i === n - 1;
  const base = last && (feature ? n - 1 : n) % 2 === 1 ? "col-span-2 aspect-[2/1]" : "aspect-square";
  if (!feature) return cn(base, "sm:col-span-1");

  const smFill = (3 - ((n + 3) % 3)) % 3;
  const sm = last && smFill ? (smFill === 1 ? "sm:col-span-2" : "sm:col-span-3") : "sm:col-span-1";
  const lg = i >= n - (4 - ((n + 3) % 4)) % 4 ? "lg:col-span-2" : "lg:col-span-1";
  return cn(base, sm, lg);
}

export function GalleryGrid({
  photos,
  categories = galleryCategories,
  showFilters = false,
  tone = "light",
}: {
  photos: GalleryPhoto[];
  categories?: PhotoCategory[];
  showFilters?: boolean;
  tone?: "light" | "dark";
}) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const categoryLabel = (key: string) => categories.find((c) => c.key === key)?.label ?? "";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const current = openIndex === null ? null : visible[openIndex];

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const filters: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: photos.length },
    ...categories.map((c) => ({
      key: c.key,
      label: c.label,
      count: photos.filter((p) => p.category === c.key).length,
    })),
  ];

  const dark = tone === "dark";

  return (
    <div>
      {showFilters && (
        <div className="mb-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Filter gallery"
            className={cn(
              "flex max-w-full gap-1 overflow-x-auto rounded-full border p-1.5 [scrollbar-width:none]",
              dark ? "border-white/10 bg-white/5" : "border-border bg-bg-elevated shadow-soft"
            )}
          >
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "relative flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                    active ? "text-accent-fg" : dark ? "text-fg-inverted-muted hover:text-fg-inverted" : "text-fg-muted hover:text-fg"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 -z-0 rounded-full bg-accent shadow-[0_8px_20px_-8px_rgb(23_112_63/0.7)]"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                  <span
                    className={cn(
                      "mono-figure relative rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                      active ? "bg-white/20" : dark ? "bg-white/10" : "bg-bg"
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <motion.div layout className="grid grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-3 sm:gap-4 md:auto-rows-[13rem] lg:auto-rows-[15rem] lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((photo, i) => {
            const feature = i === 0 && visible.length >= 5;
            return (
              <motion.button
                key={photo.src}
                layout={!reduce}
                type="button"
                onClick={() => setOpenIndex(i)}
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.92 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: reduce ? 0 : (i % 8) * 0.05, ease }}
                aria-label={`View photo: ${photo.caption}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl text-left ring-1 transition-shadow duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass sm:aspect-auto",
                  dark
                    ? "bg-ink-3 ring-white/10 hover:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] hover:ring-brass/50"
                    : "bg-bg-elevated ring-border hover:shadow-lift hover:ring-accent/40",
                  spanFor(i, visible.length)
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={feature ? "(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* legibility fade: always present, deepens on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 via-45% to-transparent transition-colors duration-500 group-hover:from-black/80" />

                <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-fg opacity-0 shadow-soft transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <ArrowsOut size={16} weight="bold" />
                </span>

                <div className={cn("absolute inset-x-0 bottom-0 p-3 sm:p-4", feature && "sm:p-5 lg:p-6")}>
                  <span
                    className={cn(
                      "inline-block max-w-full truncate rounded-full bg-brass/90 px-2 py-0.5 align-bottom text-[9px] font-semibold uppercase tracking-[0.12em] text-brass-fg sm:text-[10px] sm:tracking-[0.14em]",
                      feature && "lg:text-[11px]"
                    )}
                  >
                    {categoryLabel(photo.category)}
                  </span>
                  <p
                    className={cn(
                      "mt-1.5 line-clamp-1 font-semibold text-white transition-transform duration-500 group-hover:-translate-y-0.5",
                      feature ? "text-sm sm:mt-2 sm:text-lg lg:mt-2.5 lg:text-2xl lg:tracking-tight" : "text-xs sm:text-sm"
                    )}
                  >
                    {photo.caption}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-inverted/85 p-4 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={close}
          >
            <motion.div
              className="relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[1.5rem] bg-bg-elevated shadow-deep sm:rounded-[1.75rem]"
              initial={reduce ? false : { opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* height is capped on short (landscape phone) screens so the caption bar stays visible */}
              <div className="relative aspect-[3/2] max-h-[calc(100dvh-9rem)] w-full overflow-hidden bg-bg">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={current.src}
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image src={current.src} alt={current.alt} fill sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" priority />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  autoFocus
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-fg shadow-soft transition-colors hover:bg-white"
                >
                  <X size={18} weight="bold" />
                </button>

                {visible.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-fg shadow-soft transition-[background-color,transform] hover:-translate-x-0.5 hover:bg-white"
                    >
                      <ArrowLeft size={18} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-fg shadow-soft transition-[background-color,transform] hover:translate-x-0.5 hover:bg-white"
                    >
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">{categoryLabel(current.category)}</p>
                  <p className="mt-1.5 text-lg font-semibold tracking-tight text-fg sm:text-xl">{current.caption}</p>
                </div>
                <p className="mono-figure shrink-0 text-sm text-fg-muted">
                  {String(openIndex! + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

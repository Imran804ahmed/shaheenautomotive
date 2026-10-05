"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Muted looping video that only fetches and plays while it's on screen, and
 * pauses when scrolled away. Reduced-motion and data-saver users get the
 * poster alone, so the clip costs nothing on the page's initial load.
 */
export function InViewVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}

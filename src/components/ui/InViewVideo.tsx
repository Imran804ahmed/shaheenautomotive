"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Muted looping video that only fetches and plays while it's on screen, and
 * pauses when scrolled away. Reduced-motion and data-saver users get the
 * poster alone, so the clip costs nothing on the page's initial load.
 *
 * The poster is a lazy, responsive next/image (a /images source) under the video
 * rather than the `poster` attribute, which browsers fetch eagerly at full size.
 */
export function InViewVideo({
  src,
  poster,
  posterSizes,
  label,
  className,
}: {
  src: string;
  poster: string;
  posterSizes: string;
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
    <>
      <Image src={poster} alt="" fill sizes={posterSizes} className={cn("object-cover", className)} />
      {/* transparent until its first frame is decoded, so the poster shows through */}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    </>
  );
}

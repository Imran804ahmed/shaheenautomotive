"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Optional looping background video streamed over HLS (.m3u8).
 * - Safari plays HLS natively; other browsers load hls.js on demand, so the
 *   library costs nothing unless a video source is actually configured.
 * - Skipped entirely for reduced-motion and data-saver users (poster only).
 */
export function HlsBackground({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let hls: { destroy: () => void } | undefined;
    let cancelled = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      void video.play().catch(() => {});
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        const instance = new Hls({ capLevelToPlayerSize: true, startLevel: 0 });
        instance.loadSource(src);
        instance.attachMedia(video);
        instance.on(Hls.Events.MANIFEST_PARSED, () => void video.play().catch(() => {}));
        hls = instance;
      });
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={cn("absolute inset-0 -z-10 h-full w-full object-cover opacity-30", className)}
    />
  );
}

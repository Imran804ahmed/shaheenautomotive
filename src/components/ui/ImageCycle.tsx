"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

type Photo = { src: string; alt: string };

export function ImageCycle({
  images,
  sizes,
  interval = 3800,
  offset = 0,
  className = "",
  indicators = false,
}: {
  images: Photo[];
  sizes: string;
  interval?: number;
  offset?: number;
  className?: string;
  /** Segmented progress bar (top-right) showing which photo is active. */
  indicators?: boolean;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || images.length < 2) return;
    let timer: ReturnType<typeof setInterval>;
    // Stagger start so neighbouring cards don't swap in unison.
    const start = setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
      timer = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    }, interval + offset);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [reduce, images.length, interval, offset]);

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={false}
          aria-hidden={i !== index}
          className={`object-cover transition-[opacity,transform] duration-1000 ease-out ${i === index ? "opacity-100" : "opacity-0"} ${className}`}
        />
      ))}
      {indicators && images.length > 1 && (
        <div aria-hidden="true" className="absolute right-4 top-5 z-10 flex gap-1">
          {images.map((img, i) => (
            <span
              key={img.src}
              className={`h-[3px] rounded-full transition-[width,background-color] duration-700 ease-out ${i === index ? "w-6 bg-brass" : "w-2.5 bg-fg-inverted/35"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

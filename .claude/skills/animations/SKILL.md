---
name: animations
description: Motion-design skill for the Shaheen Automotive site (Next.js/React). Load before adding or reviewing any animation — hero entrances, scroll reveals, hover/tap feedback, inventory/vehicle card interactions, page transitions. Covers when motion is justified, the Motion Intensity dial, Motion (Framer Motion) + GSAP ScrollTrigger implementation patterns, reduced-motion and performance guardrails, and the animation clichés to avoid.
---

# Site Animations: Design & Implementation

Adapted from [taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT, © Leonxlnx), scoped down to motion/animation and tuned for an automotive dealership site — a **trust-first commerce** context, not an agency portfolio. Customers here are deciding whether to trust a business with a large purchase; motion should read as polished and confident, never gimmicky.

> Every rule below is contextual. Read the section you're building, then pull only what fits. Don't animate for its own sake.

---

## 0. The one rule that matters more than any other

**Motion must be motivated.** Before adding any animation, answer in one sentence: what does this communicate?

Valid reasons: hierarchy (draw the eye to the right thing), storytelling (reveal content in an order that matches how a person reads the page), feedback (acknowledge that a click/tap landed), state change (show that something updated — a filter applied, a form submitted, a car added to comparison).

Invalid reason: "it looked cool." If every card has the same infinite pulse or shimmer, none of them are saying anything — turn it off and let the still ones stay still.

---

## 1. Motion Intensity dial

Set one value for the whole site (override per-section only with a reason), 1–10:

| Range | Feel | What it looks like |
|---|---|---|
| 1-3 (Static) | No automatic motion | `:hover`/`:active` CSS states only |
| 4-7 (Fluid) | Confident, restrained | `transition` on transform/opacity, load-in cascades, scroll-reveal |
| 8-10 (Choreographed) | Cinematic | Scroll-pinned sequences, parallax, scroll-driven animation |

**Default for this site: 5.** A dealership sells trust and a premium feel at once — enough motion that the site feels alive and modern (scroll reveals, hover lift on vehicle cards, smooth nav), not so much that it feels like an agency reel or distracts from browsing inventory and reading prices. Push toward 6-7 for a hero/landing moment; stay at 3-4 for anything transactional (financing forms, contact forms, inventory filters) — motion on a form should feel instant and reliable, not decorative.

Any section above intensity 3 **must** honor `prefers-reduced-motion` (see §5).

---

## 2. Stack

* **Micro-interactions, hover/tap states, entrance/reveal animation:** [Motion](https://motion.dev) (formerly Framer Motion). `import { motion } from "motion/react"`.
* **Scroll-pinned sequences, horizontal pan, scrub-tied sequences:** GSAP + `ScrollTrigger`. Reach for GSAP only when Motion's `whileInView` genuinely can't do the job (pinning, scrubbing) — it's the heavier tool.
* **Simple "item appears as it scrolls into view":** Motion's `whileInView`, not GSAP. Lighter, no plugin needed (see §3.A).
* **Client boundary:** any component using Motion, GSAP, scroll listeners, or pointer physics needs `"use client"` at the top. Server Components render static layout only.
* **Before importing either library**, check `package.json`. If missing, surface the install command (`npm install motion` / `npm install gsap`) rather than assuming it's there.

---

## 3. Canonical patterns

### 3.A Scroll-reveal stagger (default choice — vehicle grids, feature lists, testimonials)

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function RevealStagger({ items }: { items: React.ReactNode[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-6">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
```

Use for: inventory/vehicle card grids, "why choose us" feature rows, testimonial grids, brand/partner logo strips. `viewport={{ once: true }}` — reveal once, don't re-trigger on scroll-back.

### 3.B Hover lift on cards (vehicle listings, service cards)

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 24 }}
  className="rounded-lg border"
>
  {/* card content */}
</motion.div>
```

Spring physics, not linear easing, for anything that responds to a pointer.

### 3.C GSAP sticky-stack (only for a deliberate pinned sequence — e.g. a "how financing works" walkthrough)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">
          {card}
        </div>
      ))}
    </div>
  );
}
```

Critical: `start: "top top"` (not `"top 80%"` — that's the #1 way this pattern breaks), every card but the last is pinned, the shrink/fade on a card is driven by the *next* card's trigger.

---

## 4. Motivated motion by section (common to a dealership site)

* **Hero:** one entrance moment — headline/subtext/CTA fade-up on load, staggered ~60ms apart. Don't loop anything in the hero forever; it competes with the CTA for attention.
* **Vehicle/inventory grid:** scroll-reveal stagger on cards (§3.A) + hover lift (§3.B). No per-card infinite shimmer or pulse — that reads as "loading," not "premium."
* **Filters / search / sort controls:** near-instant (`duration: 0.15-0.2`), no bounce. This is a tool, not a moment — motion here should feel responsive, not delightful.
* **Financing / contact / trade-in forms:** minimal motion. Error and success states can transition in (`opacity`/`y`), but nothing playful — form trust > form delight.
* **"Why choose us" / trust badges / reviews:** scroll-reveal stagger is enough. This content's job is credibility, not spectacle.
* **Nav:** smooth height/opacity transition on mobile menu open, subtle underline/color transition on link hover. Nav motion should be near-instant (`150-200ms`) — a laggy nav reads as broken, not polished.
* **"Trusted by" / dealership certifications / brand logos:** a single marquee is fine if the list is long; **never more than one marquee on the page**.

---

## 5. Reduced motion & performance (non-negotiable above intensity 3)

* Wrap Motion components with `useReducedMotion()` and degrade to a static/instant state — don't just shorten the animation, skip it.
* In plain CSS, gate keyframes behind `@media (prefers-reduced-motion: no-preference)`, or disable under `@media (prefers-reduced-motion: reduce)`.
* Animate **only** `transform` and `opacity`. Never animate `top`, `left`, `width`, `height` — they force layout recalculation and will jank on mobile, which is where most dealership-site traffic lands.
* `will-change: transform` only on elements that are actually about to animate — not applied broadly.
* Infinite loops, parallax, and scroll-hijack effects must collapse to static under reduced motion, no exceptions.

---

## 6. Forbidden patterns

* `window.addEventListener("scroll", ...)` — banned, runs every frame, jank-prone. Use Motion's `useScroll()`, GSAP `ScrollTrigger`, `IntersectionObserver`, or CSS `animation-timeline: view()`.
* `useState` to track a continuously-changing value (scroll position, pointer position, drag physics). Use `useMotionValue`/`useTransform` — `useState` re-renders the tree every frame and dies on mobile.
* A `requestAnimationFrame` loop that writes to React state. Same reason.
* Every card/section on the page carrying its own infinite loop (pulse, shimmer, float). Reserve perpetual motion for the one or two elements where it's actually signaling something live (e.g. a "currently available" indicator), and only above intensity 5.
* More than one marquee on the page.
* Shipping an animation you "claim" (intensity dial set high) but didn't actually implement, or a half-built one that jumps/cuts off (broken ScrollTrigger, missing cleanup on unmount). Either finish it or drop the dial and ship static.

---

## 7. Pre-flight check before calling an animated section done

- [ ] Can you state in one sentence what each animation communicates?
- [ ] Does it honor `prefers-reduced-motion`?
- [ ] Does it animate only `transform`/`opacity`?
- [ ] Does every GSAP `useEffect` return a cleanup (`ctx.revert()` / `ScrollTrigger.kill()`)?
- [ ] Tested on a throttled/mobile viewport, not just desktop at full speed?
- [ ] Is there at most one marquee, and at most one pinned/scroll-hijacked sequence, on this page?

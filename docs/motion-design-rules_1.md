# Motion Design Rules for Claude Code
*Based on analysis of marimba.design (Awwwards Nominee 2026, CSS Winner 2026) and Awwwards-level motion patterns*

---

## THE HERO SCROLL ANIMATION (Marimba's Laptop Sequence)

This is a **scroll-driven image sequence** — the most iconic technique on award-winning sites. Here's exactly how it works and how to replicate it:

### Technique: Scroll-Scrubbed Frame Sequence

Marimba uses a numbered `.webp` sequence (`laptop-sequence-_00001.webp`, `00002.webp`, etc.) pinned to the viewport. As the user scrolls, GSAP's `ScrollTrigger` with `scrub` advances the visible frame — creating the illusion that scrolling is "controlling" a video or 3D render in real time. The section takes up 3–5× the viewport height so scroll travel is long but the visual stays fixed on screen.

```js
// THE CORE PATTERN — Marimba-style scroll sequence
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const frames = { current: 0 };
const totalFrames = 60; // however many webp frames you have
const images = [];

// Preload all frames
for (let i = 1; i <= totalFrames; i++) {
  const img = new Image();
  img.src = `./frames/frame-${String(i).padStart(5, "0")}.webp`;
  images.push(img);
}

// Draw to canvas on each frame update
function drawFrame(index) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(images[index], 0, 0);
}

// Pin + scrub: section height = scroll travel distance
gsap.to(frames, {
  current: totalFrames - 1,
  ease: "none",
  onUpdate: () => drawFrame(Math.round(frames.current)),
  scrollTrigger: {
    trigger: ".hero-sequence-section",
    start: "top top",
    end: "bottom bottom",   // section is 400vh tall = lots of scroll room
    scrub: 0.5,             // 0.5 = slight lag for cinematic feel (not instant)
    pin: ".canvas-wrapper", // pin the canvas while section scrolls
  },
});
```

### Key implementation details:
- **Section height**: Set the wrapper to `400vh` or `500vh`. The canvas/image stays `position: sticky; top: 0; height: 100vh`.
- **`scrub: 0.5`** — not `scrub: true` (too snappy) and not `scrub: 2` (too laggy). 0.5 gives a cinematic pull.
- **WebP format**: Dramatically smaller than PNG for sequences. Export from After Effects or Premiere as WebP image sequence.
- **Canvas vs `<img>`**: Canvas is faster for sequences (no DOM reflow). Use `<canvas>` and draw frames with `ctx.drawImage()`.
- **Preload before reveal**: Load all images before the user reaches the section. Show a loading state or keep it below the fold.
- **Floating shapes** (Marimba's circles, stars, leaves): These are separate elements with their own `gsap.to()` scroll parallax — different `y` speeds create depth as the sequence plays.

---

## ✅ DOS — What Awwwards-Level Motion Looks Like

### Scrolling & Triggering
- **Use `scrub`** on ScrollTrigger for any animation tied to scroll position. `scrub: 0.5`–`1` is the sweet spot.
- **Use Lenis** (or GSAP ScrollSmoother) for smooth scroll. Native scroll feels jerky with complex animations. Install Lenis first, then pass its scroll values to GSAP.
- **Pin sections** for scroll-driven reveals. A section that stays fixed while its content animates = cinematic.
- **Use `stagger`** on text and list reveals. Words should enter sequentially, not all at once.
- **Parallax at multiple speeds** — foreground, midground, background move at 3 different rates. Even a 20% speed difference reads as depth.

### Text Animation
- **Split text into chars or words** using GSAP SplitText or a custom splitter. Animate each unit independently.
- **Reveal text from behind a mask** (`overflow: hidden` on the parent, `y: 100%` → `y: 0` on the child). This is the single most-used technique on award sites.
- **Stagger by line**, not character, for long headlines. Per-character stagger is for short words only.
- **Variable duration by element importance**: hero headline = 1.2s, body copy = 0.6s, labels = 0.4s.

### Easing
- **Use `power2.out` or `power3.out`** for entrances. Objects decelerate into rest — this is how real things move.
- **Use `power2.inOut`** for anything that goes and comes back (loops, toggles).
- **Use `expo.out`** for snap/whip effects (menu opens, modal appears).
- **Avoid `linear` except for scroll-scrubbed sequences** (where the scroll position IS the easing).
- **Custom cubic-bezier** for brand-specific feel: `cubic-bezier(0.16, 1, 0.3, 1)` = the "iOS spring" feel.

### Hover & Micro-interactions
- **Magnetic buttons**: elements that pull toward the cursor within a radius. Use `mousemove` + GSAP `to()` with `duration: 0.3`.
- **Cursor follower**: a custom cursor dot/circle that lags behind the real cursor (`lerp` or `gsap.to` with `duration: 0.15`).
- **Scale + shadow on card hover**: scale to 1.03–1.05, box-shadow depth increases. Not just opacity.
- **Clip-path reveals on hover**: images slide in from the side using `clip-path: inset()` animation.
- **Color transitions on section scroll**: background color changes as you scroll between sections using `ScrollTrigger` + `backgroundColor` tween.

### Page Transitions
- **Overlay wipe** on navigation: a full-screen overlay expands then contracts, hiding the page swap.
- **Use Barba.js + GSAP** for seamless page transitions without full reload.
- **Outgoing page**: fade or slide out with `opacity: 0` + `y: -30`.
- **Incoming page**: elements stagger in from below (`y: 60` → `y: 0`).
- **Transition duration**: 600–900ms total. Faster feels broken. Slower feels sluggish.

### Performance
- **Animate only `transform` and `opacity`**. Never animate `width`, `height`, `top`, `left`, `margin` — these cause layout recalc.
- **Use `will-change: transform`** on elements that animate frequently, but only those elements.
- **`gsap.set()`** to position elements before they animate in (prevent flash of wrong position).
- **`invalidateOnRefresh: true`** on ScrollTriggers so resize recalculates correctly.

---

## ❌ DON'TS — What Makes a Site Feel Basic or AI-Generated

### Scroll Animation
- **Don't use `AOS` (Animate On Scroll) library.** It's detectable, templated, and everyone has seen it. Build scroll triggers manually with GSAP or Intersection Observer.
- **Don't do simple fade-in-up on every element.** This is the #1 sign of a basic site. If everything fades up 20px, nothing is special.
- **Don't scroll-jack** (override native scroll speed or direction). Let scroll scroll; animate *in response to* scroll.
- **Don't animate everything at once.** A page where 12 things all animate simultaneously = visual chaos. Choreograph. Stagger. Let some things be still.
- **Don't use `scrub: true`** for image sequences — it's too snappy. Use a numeric value.

### Easing & Timing
- **Don't use `ease: "ease"` or `ease: "ease-in-out"` from CSS transitions** on complex animations. These are browser defaults. Use GSAP's named eases.
- **Don't use uniform duration.** Every element the same 0.6s = robotic. Vary it by size, importance, and distance traveled.
- **Don't bounce (`bounce` ease) unless it's on-brand.** Bounce easing on a luxury or professional site = cartoon. Reserve for playful, consumer brands.
- **Don't use `linear` ease for element entrances.** Objects don't enter the world at constant speed.

### Text
- **Don't animate entire `<p>` blocks.** Break text down. A block fading in is not text animation — it's just opacity.
- **Don't stagger more than 30–40 characters.** Beyond that the animation takes too long and the user has moved on.
- **Don't use typewriter effect** unless the concept requires it. In 2025–26, it reads as a beginner move.
- **Don't underline links with the default browser style** in animated contexts. Use custom underline `::after` pseudo-elements with `scaleX` transitions.

### Visual / CSS
- **Don't use `box-shadow` that looks like Material Design** (sharp, single-direction, gray). Use layered soft shadows or colored shadows that match brand hues.
- **Don't use `border-radius: 8px` universally** — it's the Tailwind default. Pick a radius that is intentional for the brand (either 0, 2px, 24px, or 50% — commit to it).
- **Don't use CSS gradient overlays on images without thought** — the dark-to-transparent bottom gradient on every hero image is 2018.
- **Don't use `transition: all`** — it transitions properties you don't want transitioned and is a performance hazard.
- **Don't set `overflow-x: hidden` on `<body>` to hide broken animations** — fix the animations.

### Loading & Entrance
- **Don't show the page immediately without an entrance.** Award sites always have a loader or entrance animation that establishes the design language before content appears.
- **Don't use a spinner as a loader.** Use a branded sequence — a logo morph, a number counting up, a shape expanding. The loader IS part of the design.
- **Don't skip `prefers-reduced-motion`.** Always wrap animations in a media query check. This is not optional.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## TECH STACK (What Awwwards Sites Actually Use)

| Purpose | Use This |
|---|---|
| Complex scroll animations | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Page transitions | Barba.js |
| Text splitting | GSAP SplitText or custom |
| 3D / WebGL | Three.js or Spline |
| Component animations | Framer Motion (React only) |
| Image sequences | Canvas + GSAP scrub |
| Floating/physics | Matter.js or custom spring math |

---

## THE MARIMBA MOTION LANGUAGE (Summary)

Marimba.design's specific motion identity is built on:

1. **Organic shapes as scroll actors** — circles, stars, leaves each have independent parallax speeds. They don't animate on hover; they move with scroll, creating ambient life.
2. **Image sequence as hero narrative** — the laptop render is the story. Scroll IS the animation controller.
3. **Stacking disks transition** — section changes are marked with satisfying geometric stacking (Awwwards "Stacking Disks" element). Transitions are the content.
4. **Page-load entrance** — shapes slide and rotate into position before content appears. The wait is earned.
5. **No idle movement** — nothing bounces or pulses when you're not scrolling. Motion is deliberate, not ambient noise.
6. **Typography enters from masks** — text reveals from clipped containers, never just fades.

---

*Feed this entire document to Claude Code as a system prompt addition or project `CLAUDE.md` file.*

"use client";

import HeroToProjects, { type Project } from "@/components/sections/HeroToProjects";
import Art, { type Artwork } from "@/components/sections/Art";
import Contact, { type SocialLink } from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";
import Nav from "@/components/ui/Nav";
import LifeAperture, { type LifePhoto } from "@/components/sections/LifeAperture";

// ── Projects ──────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    slug: "distributed-classifier",
    title: "Distributed Classifier",
    description:
      "Real-time ML inference pipeline handling 50k events/sec across a distributed cluster.",
    pullQuote:
      "What if labeling a stream of events could be as fast as reading them? That question drove every architectural decision here.",
    tech: ["Python", "Kafka", "React"],
    image: { src: "/art/c26cccab8b878003296b28596d909705.jpg", alt: "Study in Negative Space" },
    links: [
      { label: "GitHub", href: "#" },
      { label: "Case Study", href: "#" },
    ],
  },
  {
    slug: "review-lens",
    title: "Review Lens",
    description:
      "Collaborative code review tool with inline comments and AI-assisted suggestions for pull requests.",
    tech: ["Next.js", "TypeScript", "OpenAI"],
    image: { src: "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg", alt: "Lotus Field" },
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live Demo", href: "#" },
    ],
  },
  {
    slug: "env-forge",
    title: "Env Forge",
    description:
      "CLI tool that bootstraps reproducible dev environments from a single config file.",
    tech: ["Go", "Docker"],
    image: { src: "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg", alt: "White Petals" },
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    slug: "a11y-lens",
    title: "A11y Lens",
    description:
      "Browser extension for real-time WCAG auditing with per-element contrast and role feedback.",
    tech: ["JavaScript", "CSS"],
    image: { src: "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg", alt: "Emergence" },
    links: [
      { label: "GitHub", href: "#" },
      { label: "Chrome Store", href: "#" },
    ],
  },
];

// ── Art ───────────────────────────────────────────────────────────────

const ARTWORKS: Artwork[] = [
  { numeral: "I",   title: "Formal Garden",  medium: "Silver gelatin print",  src: "/art/34b6d504ac3596ccf84e839c55782d08.jpg" },
  { numeral: "II",  title: "Light Field",    medium: "Soft focus photograph", src: "/art/8a7f6cea1dddaf2b0446461b2388214d.jpg" },
  { numeral: "III", title: "Marginalia",     medium: "Contact print",         src: "/art/4b1c0bdb2c1fe76a8bcaf825a218896f.jpg" },
  { numeral: "IV",  title: "Peace Study",    medium: "Found collage",         src: "/art/1d036853ceea5beaa0543a8aa06bebba.jpg" },
];

// ── Life ──────────────────────────────────────────────────────────────

const LIFE_PHOTOS: LifePhoto[] = [
  { src: "/art/8a7f6cea1dddaf2b0446461b2388214d.jpg", alt: "Cat",             caption: "she showed up at my door three years ago and never left. sleeps on my keyboard, bites my ankles, and somehow makes everything better." },
  { src: "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg", alt: "Coffee & Matcha", caption: "the v60 is non-negotiable. had a properly-made matcha in kyoto once and couldn't go back to bags. mornings are a ritual now, not a routine." },
  { src: "/art/1d036853ceea5beaa0543a8aa06bebba.jpg", alt: "Food",            caption: "sundays from scratch. pasta dough never comes out the same twice and i've stopped trying to fix that. the mess is part of it." },
  { src: "/art/34b6d504ac3596ccf84e839c55782d08.jpg", alt: "Games",           caption: "currently deep in balatro. before that it was hollow knight. there's always one game that has me in a chokehold — i lean into it." },
];

// ── Contact ───────────────────────────────────────────────────────────

const BIO =
  "CS junior at UVA with a focus on systems and ML. Always open to interesting problems, internship opportunities, and creative collaborations. If you're working on something hard, let's talk.";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub",   href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email",    href: "mailto:bcu6cy@virginia.edu" },
];

// ── Page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <HeroToProjects projects={PROJECTS} />
        <Marquee />
        <Art artworks={ARTWORKS} bio={BIO} />
        <LifeAperture photos={LIFE_PHOTOS} />
        <Contact links={SOCIAL_LINKS} />
      </main>
    </>
  );
}

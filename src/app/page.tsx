"use client";

import { useState } from "react";
import HeroSectionCollage from "@/components/HeroSectionCollage";
import LoadingScreen from "@/components/LoadingScreen";
import Projects, { type Project } from "@/components/Projects";
import Skills, { type SkillCategory } from "@/components/Skills";
import Art, { type Artwork } from "@/components/Art";
import Contact, { type SocialLink } from "@/components/Contact";

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
    image: { src: "/art/8a7f6cea1dddaf2b0446461b2388214d.jpg", alt: "Distributed Classifier — architecture diagram" },
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
    image: { src: "", alt: "Review Lens — interface screenshot" },
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
    image: { src: "", alt: "Env Forge — terminal demo" },
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    slug: "a11y-lens",
    title: "A11y Lens",
    description:
      "Browser extension for real-time WCAG auditing with per-element contrast and role feedback.",
    tech: ["JavaScript", "CSS"],
    image: { src: "", alt: "A11y Lens — extension popup" },
    links: [
      { label: "GitHub", href: "#" },
      { label: "Chrome Store", href: "#" },
    ],
  },
];

// ── Skills ────────────────────────────────────────────────────────────

const SKILLS: SkillCategory[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Node.js", "FastAPI", "PyTorch"],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "Docker", "Linux", "AWS", "PostgreSQL"],
  },
];

// ── Art ───────────────────────────────────────────────────────────────

const ARTWORKS: Artwork[] = [
  { numeral: "I",   title: "Study in Negative Space", medium: "Wet plate photograph", src: "/art/c26cccab8b878003296b28596d909705.jpg" },
  { numeral: "II",  title: "Lotus Field",             medium: "Silver gelatin print",  src: "/art/2b589479c0734fdb8e8ed0bec8b74720.jpg" },
  { numeral: "III", title: "White Petals",            medium: "Soft focus photograph", src: "/art/cfc8cbc853889d8ec6d3dbfb772a57e9.jpg" },
  { numeral: "IV",  title: "Emergence",               medium: "Long exposure",         src: "/art/424ed3ceaa42d162a947f6a82f8a3a42.jpg" },
];

// ── Contact ───────────────────────────────────────────────────────────

const BIO =
  "Always open to interesting problems, internship opportunities, and creative collaborations. If you're working on something hard, let's talk.";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub",   href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email",    href: "mailto:bcu6cy@virginia.edu" },
];

// ── Page ──────────────────────────────────────────────────────────────
//
// Prop-threading for the hero entry animation:
//
//   isLoadingDone (false)
//       ↓ LoadingScreen.onComplete fires
//   isLoadingDone (true)
//       ↓ passed as startAnimation
//   HeroSection — begins stagger sequence

export default function Home() {
  const [isLoadingDone, setIsLoadingDone] = useState(false);

  return (
    <>
      {/* Loading overlay — renders on top of everything until dismissed */}
      <LoadingScreen onComplete={() => setIsLoadingDone(true)} />

      <main className="flex-1">
        <HeroSectionCollage startAnimation={isLoadingDone} />
        <Projects projects={PROJECTS} />
        <Skills skills={SKILLS} />
        <Art artworks={ARTWORKS} />
        <Contact bio={BIO} links={SOCIAL_LINKS} />
      </main>
    </>
  );
}

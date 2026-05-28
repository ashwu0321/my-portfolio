import Hero from "@/components/Hero";
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
    image: { src: "", alt: "Distributed Classifier — architecture diagram" },
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
  { numeral: "I",   title: "Study in Negative Space", medium: "Digital Illustration" },
  { numeral: "II",  title: "Systems Diagram No. 3",   medium: "Generative" },
  { numeral: "III", title: "Anthropomorphic UI",       medium: "Interface Design" },
  { numeral: "IV",  title: "Palette Study",            medium: "Digital Painting" },
];

// ── Contact ───────────────────────────────────────────────────────────

const BIO =
  "CS junior at the University of Virginia with a focus on systems and ML. I build tools that are fast, accessible, and honest about their complexity. Always open to interesting problems.";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub",   href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email",    href: "mailto:bcu6cy@virginia.edu" },
];

// ── Page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Projects projects={PROJECTS} />
      <Skills skills={SKILLS} />
      <Art artworks={ARTWORKS} />
      <Contact bio={BIO} links={SOCIAL_LINKS} />
    </main>
  );
}

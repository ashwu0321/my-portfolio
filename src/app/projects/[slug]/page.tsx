import Link from "next/link";
import { notFound } from "next/navigation";

// ── Filler data ───────────────────────────────────────────────────────
// Replace with real content when ready.

const PROJECTS = {
  "distributed-classifier": {
    title:       "Distributed Classifier",
    description: "Real-time ML inference pipeline handling 50k events/sec across a distributed cluster.",
    tech:        ["Python", "Kafka", "React"],
    year:        "2024",
  },
  "review-lens": {
    title:       "Review Lens",
    description: "Collaborative code review tool with inline comments and AI-assisted suggestions for pull requests.",
    tech:        ["Next.js", "TypeScript", "OpenAI"],
    year:        "2024",
  },
  "env-forge": {
    title:       "Env Forge",
    description: "CLI tool that bootstraps reproducible dev environments from a single config file.",
    tech:        ["Go", "Docker"],
    year:        "2025",
  },
  "a11y-lens": {
    title:       "A11y Lens",
    description: "Browser extension for real-time WCAG auditing with per-element contrast and role feedback.",
    tech:        ["JavaScript", "CSS"],
    year:        "2025",
  },
} as const;

type Slug = keyof typeof PROJECTS;

// ── Page ──────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project  = PROJECTS[slug as Slug];

  if (!project) notFound();

  const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

  return (
    <main className="max-w-screen-xl mx-auto px-8 py-24">

      {/* Back link */}
      <Link
        href="/#projects"
        className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors duration-200"
      >
        ← Back to Work
      </Link>

      {/* Header */}
      <div className="mt-12 flex gap-16">

        {/* Index column */}
        <aside className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-2">
          <div className="flex flex-col gap-1.5">
            <span className={meta}>Project</span>
            <span className={meta}>{project.year}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className={meta}>{t}</span>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <h1 className="font-serif italic font-light text-[52px] md:text-[72px] leading-none tracking-[-0.01em] text-ink mb-16">
            {project.title}
          </h1>

          {/* Placeholder image */}
          <div className="w-full aspect-[16/9] rounded-2xl bg-placeholder mb-12" />

          {/* Description + placeholder body */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12">
            <div className="flex flex-col gap-8">
              <p className="text-sm leading-relaxed text-ink">{project.description}</p>

              {/* Placeholder paragraphs */}
              {[
                "The architecture was designed around three core constraints: latency under 50ms, horizontal scalability, and zero message loss. Each of those shaped the choice of primitives at every layer.",
                "The interface presents a clean audit trail — every decision is traceable, every component is accountable. The goal was to remove ambiguity from the pipeline entirely.",
              ].map((text, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted">{text}</p>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div className="h-px bg-hairline" />
              <div className="flex flex-col gap-1.5">
                <span className={meta}>Stack</span>
                {project.tech.map((t) => (
                  <span key={t} className="font-serif italic font-light text-[18px] text-ink">{t}</span>
                ))}
              </div>
              <div className="h-px bg-hairline" />
              <p className={`${meta} text-muted/60`}>Full case study coming soon.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

// ── Static params (optional, for build-time pre-rendering) ────────────

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

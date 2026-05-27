import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────

export type ProjectLink = { label: string; href: string };

export type Project = {
  title: string;
  description: string;
  pullQuote?: string; // shown only in featured (A) slot
  tech: string[];
  image: { src: string; alt: string };
  links: ProjectLink[];
};

// ── Shared styles ────────────────────────────────────────────────────

const meta =
  "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

const ctaLink =
  "font-serif italic font-light text-base text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200";

// ── Sub-components ───────────────────────────────────────────────────

function LabelRow({
  letter,
  title,
  tech,
}: {
  letter: string;
  title: string;
  tech: string[];
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className={meta}>{letter}.</span>
        <span className={`${meta} truncate`}>{title}</span>
      </div>
      <span className={`${meta} shrink-0`}>{tech.join(" · ")}</span>
    </div>
  );
}

function ProjectImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-placeholder">
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
        />
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function Projects({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects;
  const catalog = rest.slice(0, 3);
  const catalogLetters = ["B", "C", "D"] as const;

  return (
    <section id="projects" className="max-w-screen-xl mx-auto px-8 py-24">
      <div className="flex gap-16">

        {/* ── Left: 160px index column ── */}
        <aside className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1">
          <div className="flex flex-col gap-1.5">
            <span className={meta}>Selected</span>
            <span className={meta}>Work</span>
          </div>
          <span className={meta}>2024–25</span>
        </aside>

        {/* ── Right: content ── */}
        <div className="flex-1 min-w-0">

          {/* Section A: featured ─────────────────────────────────── */}
          {featured && (
            <>
              <LabelRow letter="A" title={featured.title} tech={featured.tech} />

              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 mt-4">
                {/* Large image */}
                <ProjectImage
                  src={featured.image.src}
                  alt={featured.image.alt}
                  sizes="(max-width: 768px) 100vw, 55vw"
                />

                {/* Pull-quote + links */}
                <div className="flex flex-col justify-between py-1 md:py-3">
                  {featured.pullQuote && (
                    <p className="font-serif italic font-light text-[26px] md:text-[30px] leading-[1.2] text-ink">
                      {featured.pullQuote}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-6 mt-6">
                    {featured.links.map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={ctaLink}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Divider ─────────────────────────────────────────────── */}
          <div className="border-t border-hairline my-12" />

          {/* Sections B / C / D: catalog row ────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {catalog.map((project, i) => (
              <article key={project.title} className="flex flex-col gap-3">
                <LabelRow
                  letter={catalogLetters[i]}
                  title={project.title}
                  tech={project.tech}
                />

                <ProjectImage
                  src={project.image.src}
                  alt={project.image.alt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <p className="text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-5">
                  {project.links.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={ctaLink}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Types ────────────────────────────────────────────────────────────

export type SkillCategory = {
  label: string;
  items: string[];
};

// ── Shared styles ────────────────────────────────────────────────────

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Component ────────────────────────────────────────────────────────

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  return (
    <section id="skills" className="max-w-screen-xl mx-auto px-8 py-24">

      {/* Section header */}
      <div className="flex items-end justify-between mb-6 pb-5 border-b border-hairline">
        <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink
                       text-[48px] md:text-[64px]">
          Skills
        </h2>
        <span className={meta}>Taxonomy</span>
      </div>

      {/* 3-column taxonomy grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10 pt-2">
        {skills.map((category) => (
          <div key={category.label} className="border-t border-hairline pt-5">
            <span className="font-serif italic font-light text-[22px] text-ink leading-none">
              {category.label}
            </span>
            <ul className="mt-5 flex flex-col gap-2" role="list">
              {category.items.map((item) => (
                <li
                  key={item}
                  className={`${meta} text-ink`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </section>
  );
}

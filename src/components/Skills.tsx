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
      <div className="flex gap-16">

        {/* ── Left: 160px index column ── */}
        <aside className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1">
          <div className="flex flex-col gap-1.5">
            <span className={meta}>Skills</span>
            <span className={meta}>Taxonomy</span>
          </div>
        </aside>

        {/* ── Right: 3-column taxonomy grid ── */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
          {skills.map((category) => (
            <div key={category.label} className="border-t border-hairline pt-4">
              <span className={meta}>{category.label}</span>
              <ul className="mt-5 flex flex-col gap-2" role="list">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="font-serif font-light text-[18px] leading-snug text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

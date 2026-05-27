// ── Types ────────────────────────────────────────────────────────────

export type Artwork = {
  numeral: string;
  title: string;
  medium?: string;
};

// ── Shared styles ────────────────────────────────────────────────────

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

// ── Piece heights: tall-short / short-tall creates gallery stagger ───
// Left col: I tall, III short · Right col: II short, IV tall

const HEIGHTS = ["h-80", "h-52", "h-52", "h-80"] as const;

// ── Component ────────────────────────────────────────────────────────

export default function Art({ artworks }: { artworks: Artwork[] }) {
  const [i1, i2, i3, i4] = artworks;

  function Piece({ artwork, height }: { artwork: Artwork; height: string }) {
    return (
      <figure className="flex flex-col gap-3">
        <div
          className={`rounded-2xl bg-placeholder ${height}`}
          role="img"
          aria-label={artwork.title}
        />
        <figcaption className="flex items-baseline gap-3">
          <span className={meta}>{artwork.numeral}</span>
          <span className={`${meta} text-ink`}>{artwork.title}</span>
          {artwork.medium && (
            <span className={`${meta} ml-auto`}>{artwork.medium}</span>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <section id="art" className="max-w-screen-xl mx-auto px-8 py-24">
      <div className="flex gap-16">

        {/* ── Left: 160px index column ── */}
        <aside className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1">
          <div className="flex flex-col gap-1.5">
            <span className={meta}>Gallery</span>
          </div>
          <span className={meta}>I–IV</span>
        </aside>

        {/* ── Right: gallery wall (two staggered columns) ── */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: tall then short */}
          <div className="flex flex-col gap-8">
            {i1 && <Piece artwork={i1} height={HEIGHTS[0]} />}
            {i3 && <Piece artwork={i3} height={HEIGHTS[2]} />}
          </div>

          {/* Right column: offset down, short then tall */}
          <div className="flex flex-col gap-8 md:mt-16">
            {i2 && <Piece artwork={i2} height={HEIGHTS[1]} />}
            {i4 && <Piece artwork={i4} height={HEIGHTS[3]} />}
          </div>
        </div>

      </div>
    </section>
  );
}

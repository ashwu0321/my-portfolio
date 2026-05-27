import Link from "next/link";
import MagneticLink from "./MagneticLink";

const LEFT_LINKS = [
  { label: "work", href: "#projects" },
  { label: "about", href: "#about" },
] as const;

const RIGHT_LINKS = [
  { label: "art", href: "#art" },
  { label: "contact", href: "#contact" },
] as const;

const linkClass =
  "font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:text-accent transition-colors duration-200";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper">
      <nav
        className="grid grid-cols-[1fr_auto_1fr] items-center h-16 px-8 max-w-screen-xl mx-auto"
        aria-label="Primary navigation"
      >
        {/* Left links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {LEFT_LINKS.map(({ label, href }) => (
            <li key={href}>
              <MagneticLink>
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              </MagneticLink>
            </li>
          ))}
        </ul>

        {/* Center: logo */}
        <MagneticLink strength={0.2}>
          <Link
            href="/"
            className="font-serif italic font-light text-[22px] tracking-wide text-ink hover:text-muted transition-colors duration-200 select-none"
            aria-label="Ashley Wu — home"
          >
            Ashley Wu
          </Link>
        </MagneticLink>

        {/* Right: links + résumé pill */}
        <div className="flex items-center justify-end gap-8">
          <ul className="hidden md:flex items-center gap-8" role="list">
            {RIGHT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <MagneticLink>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </MagneticLink>
              </li>
            ))}
          </ul>

          <MagneticLink>
            <a
              href="/resume.pdf"
              download
              className="font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-1.5 rounded-full border border-ink text-ink hover:bg-ink hover:text-paper transition-colors duration-200"
            >
              résumé
            </a>
          </MagneticLink>
        </div>
      </nav>
    </header>
  );
}

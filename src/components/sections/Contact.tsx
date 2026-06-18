"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "success" | "error";

export type SocialLink = { label: string; href: string };

// ── Shared ───────────────────────────────────────────────────────────

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] opacity-50" as const;
const metaLight = "font-mono text-[10px] uppercase tracking-[0.12em] text-[rgba(242,240,236,0.45)]" as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fieldClass =
  "w-full bg-transparent border-b border-[rgba(242,240,236,0.18)] py-2 text-[#F2F0EC] text-sm font-sans outline-none focus:border-[rgba(242,240,236,0.55)] placeholder:text-[rgba(242,240,236,0.28)] transition-colors duration-300";

const ctaLink =
  "cta-underline font-serif italic font-light text-base text-[#F2F0EC] hover:text-accent transition-colors duration-200";

// ── Registration mark ─────────────────────────────────────────────────

function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 text-hairline ${className}`}
      width="13" height="13" viewBox="0 0 13 13"
      fill="none" stroke="currentColor" strokeWidth="0.7"
      aria-hidden
    >
      <line x1="6.5" y1="0"   x2="6.5" y2="13" />
      <line x1="0"   y1="6.5" x2="13"  y2="6.5" />
      <circle cx="6.5" cy="6.5" r="2.8" />
    </svg>
  );
}

// ── Field ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={metaLight}>{label}</label>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function Contact({
  links,
  formAction = "https://formspree.io/f/REPLACE_ME",
}: {
  links:       SocialLink[];
  formAction?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const rm = !!useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(formAction, {
        method:  "POST",
        body:    new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("success"); form.reset(); }
      else          setStatus("error");
    } catch {
      setStatus("error");
    }
  }


  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        background:    "var(--c-black)",
        minHeight:     "100vh",
        display:       "flex",
        flexDirection: "column",
      }}
    >

      {/* ── § 03 section marker ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="flex items-center gap-4 py-12">
          <span className={metaLight}>§ 03</span>
          <RegMark className="text-[rgba(242,240,236,0.20)]" />
          <motion.div
            className="flex-1 h-px origin-left" style={{ background: "rgba(242,240,236,0.18)" }}
            initial={rm ? {} : { scaleX: 0 }}
            animate={rm ? {} : inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={rm ? {} : { duration: 1.1, ease: EASE }}
          />
          <span className={`${meta} opacity-0 select-none`} aria-hidden>§ 03</span>
        </div>
      </div>

      {/* ── Section body ─────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-8 pb-24 flex-1 flex flex-col justify-center">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 pb-5 border-b border-[rgba(242,240,236,0.18)]">
          <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-[#F2F0EC] text-[48px] md:text-[64px]">
            <span className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={rm ? {} : { y: "105%" }}
                animate={rm ? {} : { y: inView ? "0%" : "105%" }}
                transition={rm ? {} : { duration: 0.85, ease: EASE }}
              >
                Contact
              </motion.span>
            </span>
          </h2>
          <motion.span
            className={`${metaLight} overflow-hidden pb-1`}
            initial={rm ? {} : { clipPath: "inset(0 0 100% 0)" }}
            animate={rm ? {} : inView ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
            transition={rm ? {} : { duration: 0.85, delay: 0.4, ease: EASE }}
          >
            Response within 48h
          </motion.span>
        </div>

        <div className="flex gap-16">

          {/* ── Left index column ────────────────────────────────── */}
          <motion.aside
            className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1"
            initial={rm ? {} : { opacity: 0, y: 8 }}
            animate={rm ? {} : { opacity: inView ? 1 : 0, y: inView ? 0 : 8 }}
            transition={rm ? {} : { duration: 0.6, delay: 0.45, ease: EASE }}
          >
            <a
              href="mailto:bcu6cy@virginia.edu"
              className={`${metaLight} hover:text-accent transition-colors duration-200`}
            >
              bcu6cy@virginia.edu
            </a>
          </motion.aside>

          {/* ── Right: links + form ──────────────────────────── */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* Social links */}
            <div className="flex flex-col justify-start gap-4 pt-1">
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className={ctaLink}
                  initial={rm ? {} : { opacity: 0 }}
                  animate={rm ? {} : { opacity: inView ? 1 : 0 }}
                  transition={rm ? {} : { duration: 0.5, delay: 0.5 + i * 0.1, ease: EASE }}
                >
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} />

              {(["Name", "Email", "Message"] as const).map((label, i) => (
                <motion.div
                  key={label}
                  initial={rm ? {} : { opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={rm ? {} : { opacity: inView ? 1 : 0, x: inView ? 0 : (i % 2 === 0 ? -40 : 40) }}
                  transition={rm ? {} : { duration: 0.65, delay: 0.4 + i * 0.12, ease: EASE }}
                >
                  <Field label={label}>
                    {label === "Message" ? (
                      <textarea
                        name="message"
                        required
                        maxLength={500}
                        rows={4}
                        placeholder="What's on your mind?"
                        className={`${fieldClass} resize-none`}
                      />
                    ) : (
                      <input
                        type={label === "Email" ? "email" : "text"}
                        name={label.toLowerCase()}
                        required
                        autoComplete={label.toLowerCase()}
                        placeholder={label === "Email" ? "your@email.com" : "Your name"}
                        className={fieldClass}
                      />
                    )}
                  </Field>
                </motion.div>
              ))}

              <motion.div
                className="flex items-center justify-between"
                initial={rm ? {} : { opacity: 0 }}
                animate={rm ? {} : { opacity: inView ? 1 : 0 }}
                transition={rm ? {} : { duration: 0.5, delay: 0.7, ease: EASE }}
              >
                <button
                  type="submit"
                  disabled={status === "sending" || status === "success"}
                  className={`${ctaLink} appearance-none bg-transparent p-0 cursor-pointer disabled:opacity-40 disabled:cursor-default active:scale-[0.97] transition-transform duration-150`}
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>

                {status === "success" && (
                  <span className={metaLight}>Sent — I&#39;ll reply within 48 hours.</span>
                )}
                {status === "error" && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">Something went wrong — try again.</span>
                )}
              </motion.div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

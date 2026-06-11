"use client";

import { useState, FormEvent } from "react";

// ── Types ────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "success" | "error";

export type SocialLink = { label: string; href: string };

// ── Shared styles ────────────────────────────────────────────────────

const meta = "font-mono text-[10px] uppercase tracking-[0.12em] text-muted";

const fieldClass =
  "w-full bg-transparent border-b border-hairline py-2 text-ink text-sm font-sans outline-none focus:border-ink placeholder:text-placeholder transition-colors duration-150";

const ctaLink =
  "font-serif italic font-light text-base text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200";

// ── Sub-components ───────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={meta}>{label}</label>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function Contact({
  bio,
  links,
  formAction = "https://formspree.io/f/REPLACE_ME",
}: {
  bio: string;
  links: SocialLink[];
  formAction?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;

    try {
      const res = await fetch(formAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="max-w-screen-xl mx-auto px-8 py-24">

      {/* Section header */}
      <div className="flex items-end justify-between mb-6 pb-5 border-b border-hairline">
        <h2 className="font-serif italic font-light leading-none tracking-[-0.02em] text-ink
                       text-[48px] md:text-[64px]">
          Get In Touch
        </h2>
        <span className={meta}>Response within 48h</span>
      </div>

      <div className="flex gap-16">

        {/* ── Left: 160px index column ── */}
        <aside className="hidden md:flex w-40 shrink-0 flex-col gap-8 pt-1">
          <a
            href="mailto:bcu6cy@virginia.edu"
            className={`${meta} hover:text-accent transition-colors duration-200`}
          >
            bcu6cy@virginia.edu
          </a>
        </aside>

        {/* ── Right: bio/links + form ── */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Bio + social links */}
          <div className="flex flex-col justify-between gap-12">
            <p className="text-base leading-relaxed text-ink max-w-xs">
              {bio}
            </p>
            <div className="flex flex-col gap-4">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className={ctaLink}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Underline form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Honeypot — hidden from users, catches bots */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} />

            <Field label="Name">
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={fieldClass}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                className={fieldClass}
              />
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                required
                maxLength={500}
                rows={4}
                placeholder="What's on your mind?"
                className={`${fieldClass} resize-none`}
              />
            </Field>

            {/* Submit — italic Cormorant underline, no button styling */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className={`${ctaLink} appearance-none bg-transparent p-0 cursor-pointer disabled:opacity-40 disabled:cursor-default`}
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>

              {status === "success" && (
                <span className={meta}>
                  Sent — I&#39;ll reply within 48 hours.
                </span>
              )}
              {status === "error" && (
                <span className={`${meta} text-accent`}>
                  Something went wrong — try again.
                </span>
              )}
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}

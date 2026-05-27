# PRD: Personal Portfolio Website
**Author:** [Your Name]  
**Role:** Computer Science Major  
**Version:** 1.0  
**Last Updated:** 2026-05-26  
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose
A personal portfolio website designed to convert recruiter/hiring-manager visits into internship or entry-level job opportunities. The site functions as a living resume — showcasing technical projects, an art showcase, skills, and personality in a way a PDF resume cannot.

### 1.2 Problem Statement
Recruiters spend ~7 seconds scanning a resume. A portfolio gives candidates a controlled, richer medium to demonstrate depth, taste, and technical ability before an interview, increasing callback rates for internships and entry-level roles.

### 1.3 Success Metrics
| Metric | Target |
|---|---|
| Time-on-site (recruiter session) | ≥ 90 seconds |
| Resume download rate | ≥ 20% of unique visitors |
| Contact form submissions | ≥ 1 per week during recruiting season |
| Lighthouse performance score | ≥ 90 |
| Lighthouse accessibility score | ≥ 95 |

---

## 2. Target Users

### Primary: Technical Recruiters & Hiring Managers
- Skimming 50+ profiles/day; need fast signal
- Care about: projects, tech stack, GitHub activity, presentation quality
- Arrive via: LinkedIn, resume link, job application

### Secondary: Peers & Collaborators
- Fellow CS students, open-source contributors
- Care about: project detail, code quality, contact

---

## 3. Scope

### In Scope (v1.0)
- Static or SSR portfolio site (single domain)
- Sections: Hero/Bio, Projects, Skills & Tech Stack, Art Showcase, Resume Download, Contact Form
- Mobile-responsive design
- Deployed and publicly accessible

### Out of Scope (v1.0)
- CMS / admin dashboard
- Blog / writing section
- Authentication
- Analytics dashboard (can add tag; not building)

---

## 4. Sections — Detailed Requirements

### 4.1 Hero / About Me
**Goal:** Immediate clarity on who you are and what you're looking for.

**Content:**
- Name (large, prominent)
- One-line tagline: role + seeking status (e.g., "CS Junior @ [University] · Seeking Summer 2027 Internships")
- 2–3 sentence bio: background, interests, what makes you different
- Headshot or avatar (optional but recommended)
- CTA buttons: [View My Work] → Projects section, [Download Resume] → PDF

**Acceptance Criteria:**
- [ ] Name and tagline visible above the fold on mobile and desktop
- [ ] Bio is ≤ 60 words
- [ ] Both CTAs functional

---

### 4.2 Projects
**Goal:** Show technical depth and breadth through real work.

**Content per project card:**
- Project title
- 1–2 sentence description (what it does + why it's interesting)
- Tech stack tags (e.g., React, Python, PostgreSQL)
- Links: [GitHub] and/or [Live Demo]
- Optional: screenshot or short GIF

**Layout:** Grid of cards (2-col desktop, 1-col mobile), sorted by recency or impact.

**Recommended count:** 3–5 highlighted projects (quality > quantity).

**Acceptance Criteria:**
- [ ] Each card shows title, description, stack, and at least one link
- [ ] Cards are responsive
- [ ] Broken links return 404 before launch

---

### 4.3 Skills & Tech Stack
**Goal:** Let recruiters quickly pattern-match against job requirements.

**Content:**
- Grouped by category (e.g., Languages, Frameworks, Tools, Platforms)
- Examples: Python, Java, C++, JavaScript/TypeScript, React, Node.js, Git, Linux, AWS

**Layout:** Icon grid or tag cloud — visually scannable in < 5 seconds.

**Acceptance Criteria:**
- [ ] Skills grouped into at least 2 logical categories
- [ ] No skills listed that you couldn't answer a basic interview question about
- [ ] Renders clearly on mobile

---

### 4.4 Art Showcase
**Goal:** Differentiate — demonstrate creativity, aesthetic sensibility, and range beyond pure engineering.

**Content:**
- Gallery of artwork (illustrations, generative art, design work, 3D, etc.)
- Each piece: title, medium/tools, optional short caption
- Optional: link to full-res or external portfolio (Behance, ArtStation, etc.)

**Layout:** Masonry or grid gallery with lightbox on click.

**Acceptance Criteria:**
- [ ] Images lazy-loaded (performance)
- [ ] Lightbox or modal opens on click with title + caption
- [ ] Section is clearly labeled so it doesn't confuse technical recruiters

---

### 4.5 Resume Download
**Goal:** Zero-friction access to the PDF resume for ATS submission.

**Implementation:**
- Prominent button (in Hero + sticky nav or footer)
- Direct download of a versioned PDF (e.g., `YourName_Resume_2026.pdf`)
- PDF hosted in `/public` or on a CDN

**Acceptance Criteria:**
- [ ] Click triggers download (not a new tab with PDF viewer)
- [ ] PDF is ≤ 2MB
- [ ] Resume is current (updated before launch)

---

### 4.6 Contact Form
**Goal:** Low-friction way for recruiters or collaborators to reach out.

**Fields:**
- Name (required)
- Email (required, validated)
- Message (required, 500-char limit)
- Submit button

**Backend options (pick one):**
- Formspree / EmailJS (no backend needed)
- Next.js API route + Resend/SendGrid
- Netlify Forms (if deploying to Netlify)

**Acceptance Criteria:**
- [ ] Form validates all fields client-side before submit
- [ ] Success state shown after submission ("Thanks! I'll reply within 48 hours.")
- [ ] Error state handled gracefully
- [ ] You receive email notification on submission
- [ ] No spam without at minimum a honeypot field or reCAPTCHA

---

## 5. Design & UX Requirements

### 5.1 Aesthetic Direction — Editorial / Brutalist-Lite
Inspired by: deconstructed fashion editorial, typographic-first layout, asymmetric grid, high-contrast B&W with one accent.

**Core principles:**
- Typography IS the design. Large display type does the heavy lifting; imagery is secondary.
- Asymmetric, broken-grid layouts — content intentionally placed off-center or overlapping.
- Annotation aesthetic — small labeling text, barcode-like elements, bracket/arrow motifs as decoration.
- Generous negative space punctuated by dense info clusters.
- Art section breaks the rule — warm, organic, textured to contrast the tech sections.

### 5.2 Color Palette
| Token | Value | Usage |
|---|---|---|
| `--c-black` | `#0D0D0D` | Primary text, nav, buttons |
| `--c-white` | `#F5F5F0` | Page background (warm off-white, not pure white) |
| `--c-accent` | `#CC3333` | ONE accent only — CTAs, hover states, art section marker |
| `--c-mid` | `#888880` | Captions, metadata, secondary labels |
| `--c-border` | `#D8D8D2` | Hairlines, dividers |

> Rule: accent appears max 3 times per page. Everything else is black/white/gray.

### 5.3 Typography
| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero name | `Space Grotesk` or `Bebas Neue` | 700–900 | 96–120px |
| Section headings | `Space Grotesk` | 500 | 48–64px |
| Body / prose | `Inter` | 400 | 16px, line-height 1.7 |
| Labels / metadata | `Space Mono` | 400 | 11–13px, uppercase, tracking 0.1em |
| Annotation text | `Space Mono` | 400 | 10–11px |

> All fonts free on Google Fonts. `Space Mono` for all the small annotation/counter elements gives the technical editorial feel.

### 5.4 Layout System
- Base unit: **8px**
- Grid: **12-column** on desktop, intentionally broken — elements may span odd column counts
- Hero: full-bleed, name enormous, NOT centered (left or right-offset)
- Section labels: rotated 90° vertically along the left margin (like magazine section markers)
- Counter elements: `<100>` style number callouts for stats (projects built, technologies known, etc.)
- Decorative motifs: hairline rules, corner brackets `[ ]`, barcode dividers

### 5.5 Responsive Breakpoints
| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 640px | Stack everything, display font scales to 64px |
| Tablet | 640px – 1024px | 2-col grid, reduced whitespace |
| Desktop | > 1024px | Full broken-grid layout |

### 5.6 Accessibility
- All images have `alt` text
- Color contrast ratio ≥ 4.5:1 (WCAG AA) — verify accent red on white
- Keyboard-navigable (tab order logical)
- Focus states visible (accent color ring)

### 5.7 Performance
- Lighthouse Performance ≥ 90
- Images in WebP format, lazy-loaded
- No layout shift (CLS < 0.1)
- Fonts: use `font-display: swap`

---

## 6. Tech Stack Recommendations

> Choose based on your familiarity and desired learning:

| Option | Stack | Best For |
|---|---|---|
| **Recommended** | Next.js + Tailwind CSS + Vercel | Most recruiter-impressive, SSR/static, easy deploy |
| Simpler | React (Vite) + Tailwind + Netlify | Pure SPA, fast to build |
| Minimal | HTML/CSS/JS + GitHub Pages | Fastest to ship, shows fundamentals |

**Form handling:** Formspree (free tier, zero backend)  
**Image hosting:** Cloudinary free tier or `/public` folder  
**Analytics:** Plausible or Vercel Analytics (privacy-friendly)

---

## 7. Content Checklist (Pre-Launch)

- [ ] Bio written and proofread
- [ ] 3–5 projects documented with descriptions and links
- [ ] All GitHub repos are public and have READMEs
- [ ] Skills list reviewed and honest
- [ ] Art showcase images exported at 1x and 2x (retina)
- [ ] Resume PDF exported, spell-checked, and up to date
- [ ] Contact form tested end-to-end
- [ ] Custom domain configured (optional but recommended: `yourname.dev`)
- [ ] OG meta tags set (so LinkedIn/Twitter previews look good)
- [ ] Favicon added

---

## 8. Token-Efficient Prompting Guide for Claude / Claude Code

> How to use this PRD with Claude without wasting tokens:

### 8.1 Context Management Strategy

**Do:** Paste only the relevant section when working on a feature.
```
# Working on: Section 4.2 Projects
[paste only Section 4.2 here]
Task: Build the ProjectCard React component.
```

**Don't:** Paste the entire PRD every message — Claude can reference prior context in the same conversation.

### 8.2 Recommended Workflow with Claude Code

1. **Start a session with the full PRD once** — Claude Code indexes it.
2. **Reference sections by number** in follow-up prompts: "Implement Section 4.4 Art Showcase per the PRD."
3. **Use a `CONTEXT.md`** in your repo root with a compressed summary (see below).
4. **One feature per session** — context fragmentation across long sessions degrades output quality.

### 8.3 Compressed Context File (save as `CONTEXT.md` in repo root)

```markdown
# Portfolio CONTEXT (for AI assistants)
Goal: Internship-landing portfolio for CS major
Stack: Next.js 14, Tailwind CSS, Vercel, Formspree
Sections: Hero, Projects, Skills, Art Showcase, Resume Download, Contact Form
Design: [your color palette], [your fonts]
Breakpoints: mobile <640, tablet 640-1024, desktop >1024
Accessibility: WCAG AA, all images alt-tagged
Performance target: Lighthouse ≥ 90
Current task: [update this line each session]
```

### 8.4 Prompt Templates

**Component build:**
```
Using CONTEXT.md and Section [X] of the PRD, build [ComponentName].
Requirements: [list 2-3 key acceptance criteria].
Return: single-file React component with Tailwind classes.
```

**Debugging:**
```
Component: [name]. Bug: [describe]. 
Relevant PRD section: [X].
Here is the code: [paste only the broken component]
```

**Review:**
```
Review this component against Section [X] acceptance criteria.
Flag: missing criteria, accessibility issues, performance concerns.
[paste component]
```

---

## 9. Milestones

| Milestone | Deliverable | Target |
|---|---|---|
| M1 | Repo setup + design system (colors, fonts, layout shell) | Week 1 |
| M2 | Hero + Projects sections live | Week 2 |
| M3 | Skills + Art Showcase live | Week 3 |
| M4 | Resume download + Contact Form working | Week 4 |
| M5 | QA, accessibility audit, Lighthouse ≥ 90, deploy to custom domain | Week 5 |

---

## 10. Open Questions

- [ ] What's your preferred color palette / aesthetic? (minimalist, bold, dark mode, etc.)
- [ ] What art medium(s) are you showcasing? (illustration, generative, UI design, 3D?)
- [ ] Do you have an existing GitHub profile to link prominently?
- [ ] Custom domain purchased? (`yourname.dev` recommended, ~$12/yr)
- [ ] Will you want dark mode support in v1?

# me.frankie.wang Implementation Plan

> **For agentic workers:** This is a continuation handoff, not permission to invent the unfinished visual design. Use `brainstorming` to complete the design gate first. After the user approves it, use `writing-plans` and then `executing-plans` or `subagent-driven-development` for implementation.

**Goal:** Build and publish an independent, photo-first personal home, journal, and moments site at `https://me.frankie.wang` for Frankie and friends.

**Architecture:** Use one public Astro repository with static output and local Content Collections. The site has English, Chinese, and French routes, defaults to English, and has no CMS, database, authentication, comments, or runtime backend.

**Tech stack:** Astro, TypeScript, MDX/Markdown, Astro image processing, npm, GitHub, Vercel, and Cloudflare DNS for the `frankie.wang` zone.

## Global constraints

- Work only in `/Users/fwmbam4/CodeHub/Frankie/me-frankie-wang`.
- Do not modify the sibling repository `/Users/fwmbam4/CodeHub/Frankie/frankiewang-site`.
- Primary OS is macOS and the shell is zsh.
- Use npm for Astro/Node dependencies. If Python is needed for a helper, use `uv`; do not create a pip-managed environment.
- The new GitHub repository must be public and named `FrankieeW/me-frankie-wang`.
- The new Vercel project must be independent and named `me-frankie-wang`.
- The production domain is exactly `me.frankie.wang`.
- `/` must redirect to `/en/`; English is the default locale.
- The supported locales are exactly `en`, `zh`, and `fr`.
- Approved navigation and route names are:
  - `/journal/`: `Journal` / `随笔` / `Journal`
  - `/moments/`: `Moments` / `片刻` / `Instants`
  - `/hello/`: `Hello` / `你好` / `Bonjour`
- The site is personal and life-first. Photos and recent moments outrank academic credentials and project lists.
- Keep the current academic site separate. Do not copy its visual system, post-history feature, generated diffs, or academic navigation.
- Store authored text in the repository and initial images under `src/assets`; let Astro generate responsive formats.
- Do not invent trips, dates, relationships, photographs, diary entries, or other personal facts. Empty states are preferable to fake content.
- Do not introduce a CMS, image CDN, database, analytics, login, comments, search, newsletter, or social-feed import unless the user expands scope.
- Before any UI component is written, create and obtain approval for `DESIGN.md` as required by the frontend workflow.

## Verified starting state

Verified on 2026-07-19:

- `/Users/fwmbam4/CodeHub/Frankie/me-frankie-wang` was empty before this file was written.
- `gh` is installed as version `2.96.0` and the active authenticated GitHub account is `FrankieeW` over SSH.
- `FrankieeW/me-frankie-wang` does not currently exist on GitHub.
- Node is `v26.5.0`; npm is `12.0.0`.
- A global `vercel` command is not installed. Use `npx --yes vercel@latest ...` during deployment unless the environment changes.
- Authoritative Cloudflare DNS for `me.frankie.wang` currently has no A, AAAA, or CNAME answer.
- The local resolver returns `198.18.12.77`, which is in the reserved `198.18.0.0/15` benchmark/Fake-IP range and must not be treated as public DNS truth.
- The authoritative nameservers observed for `frankie.wang` were `aarav.ns.cloudflare.com` and `chin.ns.cloudflare.com`; resolve them again at deployment time rather than assuming they remain unchanged.

## Confirmed product decisions

1. One new repository and one new Vercel project, both independent from `frankiewang-site`.
2. The intended audience is Frankie and friends rather than recruiters or academic visitors.
3. The homepage is photo- and recency-first.
4. The interface is English-first and fully available in English, Chinese, and French.
5. Content is authored as local Markdown/MDX and local image assets.
6. The first release is static and deliberately has no operational backend.
7. The generic labels `blog`, `plog`, and `about` are replaced with `Journal`, `Moments`, and `Hello` plus their approved translations.

## Open design gate

Do not start UI implementation until the next agent resolves these points with the user:

1. **Homepage composition.** Resume the interrupted visual-companion step and show three comparable layouts using the same content and palette:
   - Recommended: photo-first living scrapbook with one large recent image, a short “life lately” note, recent Moments, and recent Journal entries.
   - Alternative: one chronological stream interleaving photographs and writing.
   - Alternative: quiet editorial index with separate Journal, Moments, and Hello blocks.
2. **Translation completeness.** Recommended default: the navigation and core pages always exist in all three languages, while an individual Journal or Moments entry may exist in only some locales. A language switch must link only to translations that exist and otherwise return to that locale’s section index. Obtain explicit approval for this policy.
3. **Visual contract.** After the layout choice, complete the required frontend research and write `DESIGN.md` with exact typography, colors, spacing, photo treatment, motion, responsive behavior, accessibility constraints, and accepted design debt. Obtain user approval before components are created.

The following neutral introductory copy is safe for an empty first deployment and does not claim personal events:

- English: `A small place for life, photographs, and notes.`
- Chinese: `记录生活、照片与随笔的一小块地方。`
- French: `Un petit espace pour la vie, les photographies et les notes.`

## Scope

### In scope

- Complete the visual design gate and persist the approved design in `DESIGN.md`.
- Initialize a strict TypeScript Astro project in the existing directory without deleting `plan.md`.
- Build localized home, Journal, Moments, and Hello routes.
- Add local content schemas, draft filtering, chronological sorting, and optional translation relationships.
- Add responsive image generation, accessible alternative text, and stable aspect ratios.
- Add canonical URLs, `hreflang` alternates, Open Graph metadata, robots rules, and a sitemap.
- Add localized empty states without fabricated personal content.
- Verify static build, route generation, accessibility, performance, responsive layouts, and keyboard behavior.
- Create and push the public GitHub repository.
- Create and connect the Vercel project, deploy production, attach `me.frankie.wang`, configure only the necessary `me` DNS record, and verify HTTPS.

### Out of scope

- Editing or moving `frankiewang-site`.
- Migrating the existing mathematics post or its Git edit history.
- A CMS, admin dashboard, database, server functions, accounts, comments, likes, search, newsletter, analytics, or automated social imports.
- Full-resolution photo archives or storing private originals in Git.
- Requiring every Journal or Moments entry to have all three translations unless the user rejects the recommended partial-translation policy.

## Proposed file map

The design gate may refine component names, but it must preserve these ownership boundaries:

```text
.
├── .gitignore                       # Build, editor, Vercel, and brainstorm artifacts
├── DESIGN.md                        # Approved visual and interaction contract
├── README.md                        # Authoring, localization, build, and deploy instructions
├── astro.config.mjs                 # Static output, canonical site, sitemap integration
├── package.json                     # Scripts and exact dependencies
├── plan.md                          # This handoff
├── tsconfig.json                    # Astro strict TypeScript preset
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── assets/                      # Curated web-ready source photographs
    ├── components/
    │   ├── Header.astro
    │   ├── LanguageSwitcher.astro
    │   ├── JournalPreview.astro
    │   ├── MomentPreview.astro
    │   └── Footer.astro
    ├── content/
    │   ├── journal/<translation-key>/<locale>.mdx
    │   └── moments/<translation-key>/<locale>.md
    ├── content.config.ts            # Journal and Moments schemas
    ├── data/site.ts                 # Localized global copy and external links
    ├── i18n/
    │   ├── config.ts                # Locale type, default locale, labels, path helpers
    │   └── translations.ts          # UI strings for en/zh/fr
    ├── layouts/
    │   ├── SiteLayout.astro
    │   └── EntryLayout.astro
    ├── lib/
    │   ├── content.ts               # Query, sort, draft, and translation helpers
    │   └── seo.ts                   # Canonical and alternate-link helpers
    └── pages/
        ├── index.astro              # Redirect to /en/
        └── [lang]/
            ├── index.astro
            ├── hello/index.astro
            ├── journal/index.astro
            ├── journal/[...slug].astro
            ├── moments/index.astro
            └── moments/[...slug].astro
```

## Test strategy

- Do not add a large unit-test framework to an empty site solely for coverage.
- Use tests-after for pure helpers only if the implementation introduces non-trivial locale, translation, or sorting behavior worth regression protection.
- Every implementation task still requires agent-executed QA.
- Mandatory local gates are `npm run check`, `npm run build`, route inspection in `dist`, and real-browser visual QA at 375 px, 768 px, and 1280 px.
- Production verification must cover the GitHub remote, Vercel project linkage, Git deployment, authoritative DNS, TLS, HTTP status, locale routing, and all three language variants.

---

### Task 1: Complete and approve the design contract

**Files:**

- Create: `DESIGN.md`
- Preserve: `plan.md`

- [ ] Use the `brainstorming` and frontend-design workflow to show the three homepage compositions from the open design gate.
- [ ] Record the user’s selected composition and translation-completeness policy.
- [ ] Run the required greenfield frontend research and write the resulting tokens, primitives, responsive rules, motion rules, accessibility constraints, and accepted debt into `DESIGN.md`.
- [ ] Present `DESIGN.md` to the user and receive explicit approval before writing UI components.

**Acceptance:** `DESIGN.md` contains no unresolved choice, and its selected layout matches the user’s browser feedback.

**QA:** Re-open the complete file, scan for `TBD`, `TODO`, contradictory route names, or an accidental reuse of the academic-site design. Save design evidence under the path required by the frontend workflow.

**Commit:** `docs: define me.frankie.wang design system`

### Task 2: Initialize the Astro and Git foundation

**Files:**

- Create: `.gitignore`, `README.md`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`
- Preserve: `DESIGN.md`, `plan.md`

- [ ] Confirm `pwd -P` is exactly `/Users/fwmbam4/CodeHub/Frankie/me-frankie-wang` and verify the sibling repository status before any generative command.
- [ ] Initialize Git with `git init -b main` if `.git` is absent.
- [ ] Initialize npm metadata without overwriting existing Markdown files, then install Astro, `@astrojs/sitemap`, `@astrojs/check`, and TypeScript using current compatible releases.
- [ ] Add scripts for `dev`, `check`, `build`, and `preview`.
- [ ] Configure `site: "https://me.frankie.wang"`, static output, sitemap integration, and Astro’s strict TypeScript preset.
- [ ] Ignore `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.superpowers/`, `.DS_Store`, and log files.

**Acceptance:** `npm run check` and `npm run build` exit 0 from the repository root; `plan.md` and `DESIGN.md` remain intact.

**QA:** A clean checkout after dependency installation can run `npm ci`, `npm run check`, and `npm run build` without untracked build output.

**Commit:** `chore: initialize Astro site`

### Task 3: Add localization and content contracts

**Files:**

- Create: `src/content.config.ts`, `src/i18n/config.ts`, `src/i18n/translations.ts`, `src/data/site.ts`, `src/lib/content.ts`
- Optional test if helper complexity warrants it: `src/lib/content.test.ts`

**Interfaces:**

- `Locale` is the union `"en" | "zh" | "fr"`.
- `DEFAULT_LOCALE` is `"en"`.
- Journal metadata includes `locale`, `translationKey`, `title`, `summary`, `publishedAt`, optional `updatedAt`, `draft`, and optional local `cover`.
- Moments metadata includes `locale`, `translationKey`, `caption`, `takenAt`, `publishedAt`, optional `location`, `draft`, and one or more local images with localized alternative text.
- Production queries exclude drafts and sort descending by `publishedAt`.

- [ ] Implement locale parsing and locale-aware path helpers without accepting arbitrary route segments.
- [ ] Define all approved navigation labels and neutral empty-state copy in English, Chinese, and French.
- [ ] Define Journal and Moments collections with boundary validation for dates, locales, required images, and accessible alternative text.
- [ ] Implement query helpers for published entries, chronological sorting, and available translations.

**Acceptance:** Invalid locales, missing required fields, or Moments without image alt text fail `npm run check` or `npm run build`; drafts never appear in production queries.

**QA:** Exercise one valid and one invalid fixture locally. Remove any synthetic fixture before commit unless it is retained as an explicit automated regression test.

**Commit:** `feat: define localized content collections`

### Task 4: Build localized routes and navigation

**Files:**

- Create: `src/layouts/SiteLayout.astro`, `src/layouts/EntryLayout.astro`, `src/components/Header.astro`, `src/components/LanguageSwitcher.astro`, `src/components/Footer.astro`, and all routes listed in the proposed file map

- [ ] Implement a root redirect from `/` to `/en/` without client-side application code.
- [ ] Generate only `en`, `zh`, and `fr` locale routes.
- [ ] Implement Home, Journal index/detail, Moments index/detail, and Hello pages for each locale.
- [ ] Preserve the equivalent path when a translation exists; otherwise route the language switch to that locale’s section index.
- [ ] Render canonical and alternate-language metadata from the real generated paths.
- [ ] Render accurate localized empty states when collections contain no public entries.

**Acceptance:** All twelve core index pages build, unknown locale routes return 404, and no language switch points to a missing page.

**QA:** Inspect generated route files in `dist/`; drive navigation and language switching in a real browser with zero console errors.

**Commit:** `feat: add multilingual personal-site routes`

### Task 5: Implement the approved photo-first experience

**Files:**

- Create or modify only components and styles named by the approved `DESIGN.md`
- Create: `src/components/JournalPreview.astro`, `src/components/MomentPreview.astro`
- Create: `public/favicon.svg`, `public/robots.txt`

- [ ] Implement the approved homepage composition using the exact design tokens and responsive rules from `DESIGN.md`.
- [ ] Make Moments visually primary without making Journal or Hello difficult to discover.
- [ ] Use Astro image components for stable dimensions, responsive sources, lazy loading below the fold, and appropriate eager loading for the first meaningful image.
- [ ] Provide visible keyboard focus, semantic landmarks, reduced-motion handling, and meaningful alternative text.
- [ ] Use the neutral introductory copy and empty states until the user supplies real personal content.

**Acceptance:** The page matches the approved visual reference at 375 px, 768 px, and 1280 px; no fabricated life content appears.

**QA:** Run the `visual-qa` workflow across every route and interaction state. Correct both visual and implementation-oracle failures before proceeding.

**Commit:** `feat: add photo-first personal experience`

### Task 6: Complete local quality and production-build gates

**Files:**

- Modify only files implicated by failures
- Update: `README.md` with exact authoring, translation, image, build, and deploy procedures

- [ ] Run `npm run check`.
- [ ] Run `npm run build` and `npm run preview` against the production output.
- [ ] Verify no draft content, source originals, `.vercel` metadata, or secrets are included in `dist` or Git.
- [ ] Verify every localized page has one canonical URL and correct `hreflang` alternates.
- [ ] Run accessibility, performance, SEO, and responsive audits using the frontend workflow’s real-browser tooling.
- [ ] Verify keyboard navigation, image loading, language switching, missing-translation behavior, 404 behavior, and reduced motion.

**Acceptance:** Type/build gates exit 0, real-browser audits meet the frontend workflow’s required thresholds, and every observed issue caused by this project is resolved.

**QA evidence:** Save terminal logs and browser/visual evidence under the workflow-prescribed ignored artifact directory.

**Commit:** `docs: document authoring and deployment`

### Task 7: Create and publish the GitHub repository

**Files:**

- No product file changes unless publication reveals missing repository metadata

- [ ] Re-run `gh auth status` and require active account `FrankieeW`.
- [ ] Re-run `gh repo view FrankieeW/me-frankie-wang`; continue only if it still reports that the repository does not exist.
- [ ] Ensure `git status --short` contains only intentional project files and all local quality gates are green.
- [ ] Create the public repository and push with:

```zsh
gh repo create FrankieeW/me-frankie-wang --public --source=. --remote=origin --push
```

- [ ] Verify `origin`, the remote default branch, the full remote HEAD SHA, repository visibility, and the rendered README independently.

**Acceptance:** `gh repo view FrankieeW/me-frankie-wang` reports `PUBLIC`, local `HEAD` equals `refs/heads/main` on GitHub, and the remote URL is `git@github.com:FrankieeW/me-frankie-wang.git`.

**Failure rule:** If the repository exists unexpectedly, do not overwrite or force-push it. Inspect ownership and content, then ask the user.

### Task 8: Create the Vercel project and connect Git

**References:**

- Vercel CLI overview: <https://vercel.com/docs/cli>
- Git connection: <https://vercel.com/docs/cli/git>
- Custom-domain setup: <https://vercel.com/docs/domains/set-up-custom-domain>

- [ ] Use `npx --yes vercel@latest --version` and `npx --yes vercel@latest whoami`; authenticate interactively only if required.
- [ ] Link or create the independent `me-frankie-wang` project from this directory:

```zsh
npx --yes vercel@latest link --yes --project me-frankie-wang
```

- [ ] Connect the local Git remote to the linked Vercel project:

```zsh
npx --yes vercel@latest git connect --yes
```

- [ ] Push a no-op-safe follow-up commit only if needed to prove Git-triggered deployment; do not rely solely on a one-off CLI deployment.
- [ ] Verify the Vercel project’s Git repository is `FrankieeW/me-frankie-wang`, its production branch is `main`, and a commit deployment reaches `READY`.

**Acceptance:** A Git push to `main` creates a successful production deployment in the independent Vercel project, and the deployed commit SHA matches local and GitHub HEAD.

**Failure rule:** Do not connect to, rename, or reuse the existing `frankiewang-site` Vercel project.

### Task 9: Attach and verify `me.frankie.wang`

- [ ] Re-resolve authoritative nameservers and query `me.frankie.wang` directly before changing DNS.
- [ ] Confirm the subdomain is not assigned to another Vercel project:

```zsh
npx --yes vercel@latest domains ls
```

- [ ] Add the exact subdomain without `--force`:

```zsh
npx --yes vercel@latest domains add me.frankie.wang me-frankie-wang
npx --yes vercel@latest domains inspect me.frankie.wang
```

- [ ] In Cloudflare, add or change only the `me` record requested by the live Vercel inspection output. Do not change apex, mail, verification, or unrelated subdomain records. Do not hardcode a DNS target from this plan.
- [ ] Query the authoritative Cloudflare nameserver until the expected public record is visible; ignore local `198.18.0.0/15` Fake-IP answers.
- [ ] Verify Vercel domain status, certificate status, HTTPS, redirects, HTML, all locale roots, and a representative Journal/Moments/Hello route.

**Acceptance:** `https://me.frankie.wang/` resolves publicly, presents a valid certificate, redirects to `/en/`, returns the intended deployment, and exposes working English, Chinese, and French navigation.

**Failure rule:** If Vercel reports that the domain belongs to another project or requests verification beyond the exact `me` record, stop and present the live evidence before using `--force` or modifying broader DNS.

## Final verification wave

Run these only after all implementation tasks finish; every lane must approve the same deployed commit SHA:

- [ ] F1. Plan-compliance audit: verify every confirmed decision and out-of-scope boundary against code, GitHub, Vercel, and the live site.
- [ ] F2. Code-quality and security audit: verify strict types, dependency necessity, secret absence, content-boundary validation, and safe external links.
- [ ] F3. Real manual QA: navigate the live site at 375 px, 768 px, and 1280 px; exercise all locales, route families, keyboard focus, images, empty states, 404s, and language switches.
- [ ] F4. Publication audit: record local HEAD, GitHub `main` SHA, Vercel deployment SHA/status, authoritative DNS answer, certificate result, and live response status.

## Success criteria

- The approved design is persisted in `DESIGN.md` and the live site matches it.
- `npm ci`, `npm run check`, and `npm run build` succeed from a clean checkout.
- The public repository exists at `https://github.com/FrankieeW/me-frankie-wang` with `main` matching the verified local commit.
- A separate Vercel project named `me-frankie-wang` is connected to that repository and deploys from `main`.
- `https://me.frankie.wang` serves the verified deployment over valid HTTPS and defaults to English.
- Journal, Moments, and Hello work in English, Chinese, and French according to the approved translation policy.
- The sibling academic site and all unrelated DNS records remain unchanged.

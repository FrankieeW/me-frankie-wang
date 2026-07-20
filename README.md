# me.frankie.wang

Source for Frankie's personal website at
[`me.frankie.wang`](https://me.frankie.wang). The public GitHub repository is
[`FrankieeW/me-frankie-wang`](https://github.com/FrankieeW/me-frankie-wang),
and the independent Vercel project is `me-frankie-wang`.

This site is intentionally separate from the sibling academic site. The
approved visual and interaction contract is [`DESIGN.md`](./DESIGN.md); the
implementation and release sequence is [`plan.md`](./plan.md).

## Requirements

- Node.js 22.12.0 or newer
- npm 9.6.5 or newer
- Git, plus `gh` for GitHub administration
- Vercel CLI through `npx --yes vercel@latest` for project and deployment work
- Access to the `frankie.wang` zone in Cloudflare for custom-domain changes

Install exactly the locked dependencies after cloning:

```sh
git clone git@github.com:FrankieeW/me-frankie-wang.git
cd me-frankie-wang
npm ci
```

## Local development and quality gates

```sh
npm run dev
```

Astro prints the development URL. Before committing or deploying, run the
complete local gate:

```sh
npm test
npm run check
npm run build
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro's development server. |
| `npm test` | Run content, localization, SEO, and deployment-config regression tests. |
| `npm run check` | Run Astro and strict TypeScript diagnostics. |
| `npm run build` | Create the static production site in `dist/`. |
| `npm run preview` | Serve the existing `dist/` production build locally. |

When both content collections are genuinely empty, Astro 7.1.1 reports
`No files found matching ...` during content sync and
`The collection ... does not exist or is empty` when a page queries the empty
store. This repository preserves truthful empty collections instead of adding
fake draft entries or filtering framework warnings. The messages disappear for
each collection after its first valid source entry; any unrelated warning must
still be investigated.

## Preview the production build

Build first, then serve that exact output on a fixed local address:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Open `http://127.0.0.1:4321/en/`. Check the English, Chinese, and French home,
Journal, Moments, and Hello routes at 375, 768, and 1280 pixels before release.

Astro static output cannot attach an HTTP status to its root redirect, so local
preview serves `/` as a `200` page containing a meta refresh to `/en/`. Vercel
applies the `302` rule in `vercel.json` before serving the static file; deployed
requests to `/` must therefore return `302` with `Location: /en/`.

## Content layout

Authored content is local Markdown or MDX. Use one file per translation and the
same `translationKey` for every translation of one entry:

```text
src/content/journal/<translation-key>/<locale>.mdx
src/content/moments/<translation-key>/<locale>.md
```

`<locale>` is exactly `en`, `zh`, or `fr`. `translationKey` is lowercase
kebab-case and becomes the public entry slug. For example, a Journal source at
`src/content/journal/<translation-key>/zh.mdx` publishes at
`/zh/journal/<translation-key>/` when `draft` is `false`.

Do not invent a trip, date, relationship, photograph, location, diary entry, or
other personal fact to fill an empty collection. The localized empty states are
the correct output until real content exists.

### Journal entries

A Journal entry accepts Markdown or MDX. Its frontmatter contract is:

```yaml
---
locale: <en | zh | fr>
translationKey: <lowercase-kebab-case-key>
publishedAt: <ISO-8601 date or timestamp>
draft: true
title: <real localized title>
summary: <real localized summary>
updatedAt: <optional ISO-8601 date or timestamp>
cover: ../../../assets/<optional-web-ready-image>
coverAlt: <required localized alt text when cover is present>
---
```

Replace every angle-bracket value before running the gates. `cover` and
`coverAlt` must either both be present or both be absent. Keep `draft: true`
until the text, dates, links, and optional image description are ready to be
public.

### Moment entries

A Moment entry is Markdown and requires at least one real local image:

```yaml
---
locale: <en | zh | fr>
translationKey: <lowercase-kebab-case-key>
publishedAt: <ISO-8601 date or timestamp>
draft: true
caption: <real localized caption>
takenAt: <real ISO-8601 date or timestamp>
location: <optional real localized location>
images:
  - src: ../../../assets/<web-ready-image>
    alt: <localized factual alt text>
---
```

Add further `src` and `alt` pairs under `images` when the Moment contains more
than one photograph. `publishedAt` controls cross-collection chronology;
`takenAt` describes the photograph and is shown as Moment metadata.

### Translation behavior

- Core navigation and the Home, Journal, Moments, and Hello pages exist in all
  three locales.
- A Journal or Moment may have only some translations. Translations share one
  `translationKey` and differ by `locale` and localized text.
- On an entry, the language switcher links directly to translations that
  exist. A missing translation falls back to that locale's Journal or Moments
  index instead of generating a broken entry route.
- Entry `hreflang` metadata contains only published translations. Core pages
  advertise all three locales and English as `x-default`.
- Alt text, captions, titles, summaries, and body copy must be authored in the
  entry's declared locale; do not copy untranslated text merely to fill a
  field.

### Local images and alt text

1. Export a curated, web-ready copy into `src/assets/`. Keep private originals
   and full-resolution archives outside Git.
2. Reference the file relative to the entry. The paths above are correct for
   the recommended `<translation-key>/<locale>` layout.
3. Describe the meaningful visual information in `coverAlt` or each image's
   `alt`. Localize that description for every translated entry.
4. Do not repeat a caption word-for-word as alt text. A caption supplies
   context; alt text communicates what the image shows.
5. Do not tint, stretch, or manually pre-crop an image to simulate the layout.
   Astro reserves the configured ratios and generates the responsive output.

After adding or changing content, run `npm test`, `npm run check`, and
`npm run build`. Inspect `dist/` before publication: draft copy, private source
images, `.vercel` metadata, and environment files must not be present.

## GitHub workflow

The expected remote and default branch are
`git@github.com:FrankieeW/me-frankie-wang.git` and `main`:

```sh
git remote get-url origin
gh repo view FrankieeW/me-frankie-wang
git status --short
```

Commit only reviewed source changes. After all local gates pass, publish the
current branch explicitly:

```sh
git push origin main
```

Do not force-push `main`. Do not commit `.vercel/`, `.env*`, `dist/`, `.astro/`,
or private image originals. Branch pushes may create Vercel previews; the
Git-connected `main` branch is the production source.

## Vercel project and deployment

Confirm the authenticated account and the existing independent project before
any deployment:

```sh
npx --yes vercel@latest whoami
npx --yes vercel@latest link --yes --project me-frankie-wang
npx --yes vercel@latest project inspect me-frankie-wang
```

`vercel link` creates `.vercel/project.json`; that directory is local metadata
and is ignored by Git. Never copy its IDs or any `.vercel/.env*` values into an
issue, commit, README, or shell transcript.

The normal production path is Git-based: pass the local gates, commit, and push
`main`. For an intentional CLI preview deployment, run:

```sh
npx --yes vercel@latest
```

For an intentional CLI production deployment, run one of these complete flows:

```sh
npx --yes vercel@latest --prod
```

or, when deploying a locally produced Vercel build:

```sh
npx --yes vercel@latest build --prod
npx --yes vercel@latest deploy --prebuilt --prod
```

Do not run `deploy` without `--prebuilt` after `vercel build`; otherwise Vercel
ignores the local build output. Do not place an access token in a command-line
flag. Automation must provide it through the protected `VERCEL_TOKEN`
environment variable.

Inspect a deployment without changing production state:

```sh
npx --yes vercel@latest list --status READY
npx --yes vercel@latest inspect <deployment-url>
npx --yes vercel@latest curl / --deployment <deployment-url>
```

`vercel curl` is the correct way to inspect a protected preview; do not disable
deployment protection for testing.

## Custom domain: `me.frankie.wang`

The domain is attached only to the `me-frankie-wang` Vercel project. The
`frankie.wang` apex and the sibling academic site are outside this repository's
deployment scope.

One-time project attachment:

```sh
npx --yes vercel@latest domains add me.frankie.wang me-frankie-wang
npx --yes vercel@latest domains inspect me.frankie.wang
```

In the Cloudflare `frankie.wang` zone, create or update only the `me` record:

- Type: `CNAME`
- Name: `me`
- Target: the current value shown by Vercel for `me.frankie.wang`
- Proxy status: preserve the working project setting; if Vercel cannot verify a
  new record, use DNS-only until verification succeeds, then re-test before
  enabling the proxy

Do not add competing A, AAAA, or CNAME records for `me`, and do not change apex,
mail, or sibling-site records. Never use a resolver's synthetic or Fake-IP
answer as proof of public DNS. Query the current authoritative nameservers:

```sh
dig +short NS frankie.wang
dig +short CNAME me.frankie.wang @<authoritative-nameserver>
dig +short A me.frankie.wang @<authoritative-nameserver>
dig +short AAAA me.frankie.wang @<authoritative-nameserver>
```

When Cloudflare proxying is enabled, authoritative queries return Cloudflare
A/AAAA addresses rather than exposing the CNAME target; Vercel's domain status
must still report a valid configuration.

After DNS and a production deployment settle, verify TLS, the platform redirect,
and the localized destination:

```sh
curl -sS -I https://me.frankie.wang/
curl -sS -I https://me.frankie.wang/en/
npx --yes vercel@latest domains inspect me.frankie.wang
```

The first response must be an HTTP `302` with `Location: /en/`; the English
route must return `200` over HTTPS. Also open the site in a real browser and
verify all locale links, missing routes, keyboard navigation, responsive
layouts, and reduced-motion behavior before declaring the deployment complete.

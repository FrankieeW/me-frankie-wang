# Content Discovery and Personal Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add localized RSS, finite topics, Journal tables of contents, privacy-safe places and friends, conditional full-text search, accessible local media, and truthful site history to the existing static multilingual personal site.

**Architecture:** Keep authored content in Astro content collections and explicit personal facts in typed data files. Perform feed, topic, table-of-contents, media-preview, and search-document transformations at build time; only filtering an already-rendered index uses a small progressive-enhancement script. Reuse the current locale, canonical-path, entry-preview, and static-route boundaries without adding a backend, CMS, top-level route, remote embed, or fabricated content.

**Tech Stack:** Astro 7.1.1 static output, TypeScript 6.0.3, Astro content collections and MDX, `@astrojs/rss`, native HTML media/details/search controls, Node test runner, CSS.

## Global Constraints

- Preserve the approved light-only, white, system-sans, living-grid design in `DESIGN.md`; do not add a new color, typeface, primary navigation item, or route segment.
- Core locales remain exactly `en`, `zh`, and `fr`; `/` continues to redirect to `/en/`.
- Public routes remain static. Add only `/[locale]/feed.xml` and generated `/[locale]/topics/[topic]/` discovery routes.
- Draft content must not enter pages, feeds, topic indexes, or search indexes.
- Topic keys are exactly `daily`, `travel`, and `reading` in this release; each entry may contain at most three unique known keys.
- Search appears only at exactly ten or more public entries for a locale/section and must leave every preview visible when JavaScript is absent or fails.
- A Journal table of contents appears only at three or more H2/H3 headings; it uses native links/details and no scroll tracking.
- Place data is city-level only: no latitude, longitude, address, visit date, current-location flag, geolocation API, or device input.
- Friends require an HTTPS URL and literal `consentConfirmed: true`; empty Places and Friends sections do not render.
- Video and audio sources, caption tracks, and transcript links are same-origin `/media/…` paths; native controls are mandatory and `autoplay` is never emitted.
- The footer says localized `Since 2026`; Hello records only the verified 2026 independent static Astro-site launch.
- No synthetic entry, personal fact, remote avatar, third-party iframe, tracking embed, comments, newsletter, interactive map, CMS, or backend may ship.
- Production code is introduced through a focused failing test, then the smallest implementation, then passing focused and regression tests.

---

## File Responsibility Map

- `src/data/topics.ts`: finite topic keys, localized labels, and topic URL metadata.
- `src/data/personal.ts`: validated public places, consented friends, start year, and localized verified site-history records; initial place/friend arrays stay empty.
- `src/lib/authoring.ts`: reusable Zod schema factories for content metadata, topics, and local media.
- `src/lib/content.ts`: public-entry selection plus pure feed, topic, search-document, search matching, and Moment preview helpers.
- `src/lib/toc.ts`: H2/H3 filtering and the exact three-heading visibility rule.
- `src/components/TopicLinks.astro`: localized compact topic anchors.
- `src/components/TableOfContents.astro`: desktop rail and mobile/tablet native disclosure over the same ordered headings.
- `src/components/ContentSearch.astro`: native field, live result count, no-results text, and progressive filter script.
- `src/components/PlaceIndex.astro`: city list and optional decorative schematic plot.
- `src/components/FriendsList.astro`: consented same-tab friend links with optional local avatars.
- `src/components/EntryMedia.astro`: native accessible video/audio output with no autoplay.
- `src/components/SiteHistory.astro`: localized verified timeline.
- `src/pages/[lang]/feed.xml.ts`: three prerendered RSS endpoints.
- `src/pages/[lang]/topics/[topic]/index.astro`: only public locale/topic combinations.
- Existing layouts, index routes, detail routes, previews, translations, styles, and tests compose and verify these units.

The eight capabilities remain one implementation plan because they share one content-schema, locale, entry-layout, and discovery boundary; splitting them would duplicate authoring types and leave intermediate production states that cannot satisfy the approved contract.

### Task 1: Authoring Models and Localized Topic Foundation

**Files:**
- Create: `src/data/topics.ts`
- Create: `src/lib/authoring.ts`
- Modify: `src/content.config.ts`
- Modify: `src/i18n/config.ts`
- Modify: `src/i18n/translations.ts`
- Modify: `DESIGN.md`
- Modify: `src/lib/content.test.ts`

**Interfaces:**
- Consumes: `LOCALES`, `Locale`, and existing collection loaders.
- Produces: `TOPIC_KEYS`, `TopicKey`, `TOPICS`, `getTopicPath(locale, topic)`, `createJournalSchema(imageSchema)`, `createMomentSchema(imageSchema)`, and validated `topics`, `leadMedia`, and `video` content fields.

- [ ] **Step 1: Lock the visual and authoring contract before component work**

Add exact component rules to `DESIGN.md`: topic chips use 12px metadata type and ordinary underlined anchors; search uses a real `<input type="search">` with a 44px minimum target; the ToC reading rail begins only above 820px; media controls stay native; Places/Friends/History reuse the Hello reading width and existing line/border tokens. Add the privacy and empty-state rules from Global Constraints verbatim so later CSS cannot invent a map, card, color, or navigation treatment.

- [ ] **Step 2: Write focused failing schema and topic tests**

Append tests that import the missing interfaces and assert the exact contract:

```ts
import { z } from "astro/zod";
import { TOPIC_KEYS, TOPICS } from "../data/topics.ts";
import {
  createJournalSchema,
  createMomentSchema,
} from "./authoring.ts";

const testImage = z.string().min(1);

test("publishes the finite localized topic catalog", () => {
  assert.deepEqual(TOPIC_KEYS, ["daily", "travel", "reading"]);
  assert.deepEqual(TOPICS.travel.label, {
    en: "Travel",
    zh: "旅行",
    fr: "Voyage",
  });
});

test("rejects unknown, duplicate, and excessive topics", () => {
  const schema = createJournalSchema(testImage);
  const base = {
    locale: "en",
    translationKey: "entry",
    publishedAt: "2026-07-20",
    draft: false,
    title: "Entry",
    summary: "Summary",
  };
  assert.equal(schema.safeParse({ ...base, topics: ["unknown"] }).success, false);
  assert.equal(schema.safeParse({ ...base, topics: ["daily", "daily"] }).success, false);
  assert.equal(
    schema.safeParse({ ...base, topics: ["daily", "travel", "reading", "daily"] }).success,
    false,
  );
});

test("requires a Moment image or accessible local video", () => {
  const schema = createMomentSchema(testImage);
  const base = {
    locale: "en",
    translationKey: "moment",
    publishedAt: "2026-07-20",
    draft: false,
    caption: "Moment",
    takenAt: "2026-07-20",
  };
  assert.equal(schema.safeParse(base).success, false);
  assert.equal(
    schema.safeParse({
      ...base,
      video: {
        src: "https://video.example/clip.mp4",
        poster: "poster.jpg",
        posterAlt: "Poster",
        title: "Clip",
        captions: "/media/clip.vtt",
      },
    }).success,
    false,
  );
  assert.equal(
    schema.safeParse({
      ...base,
      video: {
        src: "/media/clip.mp4",
        poster: "poster.jpg",
        posterAlt: "Poster",
        title: "Clip",
        captions: "/media/clip.vtt",
      },
    }).success,
    true,
  );
  assert.equal(
    schema.safeParse({
      ...base,
      video: {
        src: "/media/clip.mp4",
        poster: "poster.jpg",
        posterAlt: "Poster",
        title: "Clip",
      },
    }).success,
    false,
  );
});

test("requires Journal video alternatives and audio transcripts", () => {
  const schema = createJournalSchema(testImage);
  const base = {
    locale: "en",
    translationKey: "entry",
    publishedAt: "2026-07-20",
    draft: false,
    title: "Entry",
    summary: "Summary",
  };
  assert.equal(
    schema.safeParse({
      ...base,
      leadMedia: {
        type: "video",
        src: "/media/clip.mp4",
        poster: "poster.jpg",
        title: "Clip",
        captions: "/media/clip.vtt",
      },
    }).success,
    false,
  );
  assert.equal(
    schema.safeParse({
      ...base,
      leadMedia: {
        type: "audio",
        src: "/media/voice.mp3",
        title: "Voice note",
      },
    }).success,
    false,
  );
});
```

- [ ] **Step 3: Run the focused test and verify the missing modules fail**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/topics.ts` or `src/lib/authoring.ts`.

- [ ] **Step 4: Add the finite catalog and schema factories**

Create the catalog with these exact public types and values:

```ts
export const TOPIC_KEYS = ["daily", "travel", "reading"] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];
export type LocalizedText = Readonly<Record<Locale, string>>;
export const TOPICS: Readonly<
  Record<TopicKey, { readonly label: LocalizedText }>
> = {
  daily: { label: { en: "Daily life", zh: "日常", fr: "Quotidien" } },
  travel: { label: { en: "Travel", zh: "旅行", fr: "Voyage" } },
  reading: { label: { en: "Reading", zh: "阅读", fr: "Lecture" } },
};
```

In `src/lib/authoring.ts`, export `createJournalSchema<TImage>(imageSchema: z.ZodType<TImage>)` and `createMomentSchema<TImage>(imageSchema: z.ZodType<TImage>)`. Use one shared metadata schema, `z.enum(TOPIC_KEYS).array().max(3).default([])` plus `superRefine` for duplicates, the existing cover/coverAlt pairing rule, and these path rules:

```ts
const localPath = (extensions: readonly string[]) =>
  z.string().trim().refine((value) => {
    if (!value.startsWith("/media/") || value.includes("..") || /[?#]/u.test(value)) return false;
    return extensions.some((extension) => value.toLowerCase().endsWith(extension));
  }, "Use a same-origin /media/ path with an allowed extension.");

const videoPath = localPath([".mp4", ".webm"]);
const audioPath = localPath([".mp3", ".m4a", ".ogg", ".wav"]);
const captionPath = localPath([".vtt"]);
const transcriptPath = localPath([".html", ".pdf", ".txt", ".md"]);
```

The Moment schema has `images: z.array(z.object({ src: imageSchema, alt: requiredText })).default([])`, optional `video: { src, poster, posterAlt, title, captions }`, and rejects an empty image array without video. Journal has optional discriminated `leadMedia` with `type: "video"` using the same fields or `type: "audio"` using `{ src, title, transcript }`.

Replace inline schemas in `src/content.config.ts` with these factories. Add `getTopicPath(locale: Locale, topic: TopicKey): string` returning `/${locale}/topics/${topic}/`. Extend translation types and all three locale objects with exact labels for topics, search, ToC, places, friends, history, and media so no later component has hard-coded visible English.

- [ ] **Step 5: Run focused and type/build checks**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: PASS, including finite-catalog and authoring-schema tests.

Run: `npm run check`

Expected: `0 errors`.

- [ ] **Step 6: Commit the authoring foundation**

```bash
git add DESIGN.md src/data/topics.ts src/lib/authoring.ts src/content.config.ts src/i18n/config.ts src/i18n/translations.ts src/lib/content.test.ts
git commit -m "feat: define discovery authoring models"
```

### Task 2: Locale-Specific RSS and Discovery Links

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/pages/[lang]/feed.xml.ts`
- Modify: `src/data/site.ts`
- Modify: `src/components/SocialLinks.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`
- Modify: `src/lib/quality.test.ts`

**Interfaces:**
- Consumes: `getPublishedEntries`, `getEntryPath`, `SITE`, `SITE_COPY`, `LOCALES`.
- Produces: `getFeedPath(locale): string`, `SiteFeedItem`, `getLocaleFeedItems(journals, moments, locale)`, three XML routes, RSS autodiscovery, and a locale-resolved RSS social link.

- [ ] **Step 1: Write failing pure feed and built-page discovery tests**

Test `getLocaleFeedItems` with one public Journal entry, one public Moment entry, one draft, and one other-locale entry. Assert descending `publishedAt`, canonical paths, Journal summary, Moment caption plus location, and no draft/foreign locale. In `quality.test.ts`, add assertions for each of `en`, `zh`, and `fr` that `dist/<locale>/feed.xml` exists, contains `<rss`, contains zero `<item>` nodes in the current empty repository, and each locale home has exactly one RSS alternate link whose `href` is `https://me.frankie.wang/<locale>/feed.xml`; assert the RSS social anchor uses `/<locale>/feed.xml`.

- [ ] **Step 2: Run tests and verify the missing helper/feeds fail**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: FAIL because `getLocaleFeedItems` is not exported.

Run: `npm test`

Expected after the pure helper exists but before the endpoint: FAIL because `dist/en/feed.xml` does not exist.

- [ ] **Step 3: Install RSS support and implement pure feed mapping**

Run: `npm install @astrojs/rss`

Expected: `@astrojs/rss` appears in dependencies and the lockfile changes.

Add `getFeedPath(locale)` returning `/${locale}/feed.xml`. Add a `SiteFeedItem` with `{ title, description, link, pubDate }`. `getLocaleFeedItems` must call `getPublishedEntries` for both collections, filter by locale, map Journal title/summary and Moment caption/location, concatenate, and sort by `pubDate` descending.

- [ ] **Step 4: Implement the three static endpoints and discovery links**

`src/pages/[lang]/feed.xml.ts` exports `getStaticPaths()` returning one path per `LOCALES` item and `GET(context)` returning:

```ts
return rss({
  title: `${SITE.name} — ${SITE_COPY[locale].title}`,
  description: SITE_COPY[locale].introduction,
  site: context.site,
  items: getLocaleFeedItems(journal, moments, locale),
  customData: `<language>${locale}</language>`,
});
```

Add an RSS record to `SOCIAL_LINKS` whose `href` is the locale map `{ en: "/en/feed.xml", zh: "/zh/feed.xml", fr: "/fr/feed.xml" }`. Change `SocialLink.href` to `string | Readonly<Record<Locale, string>>` and export `getSocialLinks(locale)` to resolve a string directly or select the locale-map value; sort the resolved records through the existing `SOCIAL_SERVICE_ORDER`, keeping RSS last. In `SiteLayout.astro`, emit one absolute `<link rel="alternate" type="application/rss+xml" title={SITE.name + " — RSS"} href={getCanonicalUrl(getFeedPath(locale))}>` for the current locale.

- [ ] **Step 5: Run focused and full tests**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: PASS with feed ordering and exclusion assertions.

Run: `npm test`

Expected: PASS with valid empty feeds and per-locale discovery/social links.

- [ ] **Step 6: Commit RSS**

```bash
git add package.json package-lock.json src/pages/'[lang]'/feed.xml.ts src/data/site.ts src/components/SocialLinks.astro src/layouts/SiteLayout.astro src/lib/content.ts src/lib/content.test.ts src/lib/quality.test.ts
git commit -m "feat: add localized RSS feeds"
```

### Task 3: Topics on Previews, Entries, and Generated Discovery Pages

**Files:**
- Create: `src/components/TopicLinks.astro`
- Create: `src/pages/[lang]/topics/[topic]/index.astro`
- Modify: `src/components/JournalPreview.astro`
- Modify: `src/components/MomentPreview.astro`
- Modify: `src/layouts/EntryLayout.astro`
- Modify: `src/pages/[lang]/journal/[...slug].astro`
- Modify: `src/pages/[lang]/moments/[...slug].astro`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`
- Modify: `src/lib/quality.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `TopicKey`, `TOPICS`, `getTopicPath`, entry `data.topics`, current entry/path helpers.
- Produces: `getTopicEntries(entries, locale, topic)`, `getTopicRouteMatrix(journal, moments)`, reusable localized links, and public-only combined topic pages.

- [ ] **Step 1: Write failing topic transformation tests**

Create mixed fake Journal/Moment entries and assert:

```ts
assert.deepEqual(
  getTopicEntries(entries, "zh", "travel").map((entry) => entry.id),
  ["newer-zh", "older-zh"],
);
assert.deepEqual(getTopicRouteMatrix(entries, []).map(({ locale, topic }) => [locale, topic]), [
  ["zh", "travel"],
]);
```

Include draft, different-topic, and different-locale entries and assert all are absent. Add quality assertions that the current empty build contains no `/topics/` HTML pages and core header links are unchanged.

- [ ] **Step 2: Run focused tests and confirm missing exports fail**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: FAIL because topic helpers are not exported.

- [ ] **Step 3: Implement topic helpers and localized link component**

`getTopicEntries<T>` accepts a shared topic-aware entry array, filters through `getPublishedEntries`, matches locale and topic, then preserves descending `publishedAt`. `getTopicRouteMatrix` checks `LOCALES` then `TOPIC_KEYS` order and returns only nonempty combinations.

`TopicLinks.astro` accepts `{ locale: Locale; topics: readonly TopicKey[] }`, returns no wrapper for an empty array, and otherwise renders a labelled `<ul class="topic-links">` of normal anchors using `TOPICS[topic].label[locale]` and `getTopicPath(locale, topic)`.

- [ ] **Step 4: Compose topics into existing previews and entries**

Add `TopicLinks` after preview metadata and after entry metadata. Pass `topics={entry.data.topics}` from both detail routes. `EntryLayout` accepts `topics: readonly TopicKey[]` and renders no topic region when empty. Preserve the existing title, dates, location, cover/image, and prose order.

- [ ] **Step 5: Add generated combined topic pages**

The topic page calls both collections, uses `getTopicRouteMatrix` in `getStaticPaths`, and receives already-filtered combined entries. Render Journal entries with `JournalPreview` and Moments with `MomentPreview` in descending publication order. Set canonical path to `getTopicPath(locale, topic)`. Build alternate paths only for locales where that topic exists; set each missing switch path to `getLocalizedPath(targetLocale, "home")`. Pass `route={undefined}` so no new primary navigation item appears.

- [ ] **Step 6: Style and verify topic surfaces**

Use existing `--color-muted`, `--color-accent-ink`, `--color-line`, spacing tokens, and 12px metadata type. Keep links underlined and keyboard focus visible; do not create filled pills.

Run: `npm test`

Expected: PASS; no topic routes are generated for empty content, helper tests prove public-only combinations, and core navigation is unchanged.

Run: `npm run check`

Expected: `0 errors`.

- [ ] **Step 7: Commit topics**

```bash
git add src/components/TopicLinks.astro src/pages/'[lang]'/topics/'[topic]'/index.astro src/components/JournalPreview.astro src/components/MomentPreview.astro src/layouts/EntryLayout.astro src/pages/'[lang]'/journal/'[...slug]'.astro src/pages/'[lang]'/moments/'[...slug]'.astro src/lib/content.ts src/lib/content.test.ts src/lib/quality.test.ts src/styles/global.css
git commit -m "feat: add localized topic discovery"
```

### Task 4: Conditional Journal Table of Contents

**Files:**
- Create: `src/lib/toc.ts`
- Create: `src/lib/toc.test.ts`
- Create: `src/components/TableOfContents.astro`
- Modify: `src/layouts/EntryLayout.astro`
- Modify: `src/pages/[lang]/journal/[...slug].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: Astro `MarkdownHeading[]` from `render(entry).headings`, localized ToC copy.
- Produces: `TOC_HEADING_THRESHOLD = 3`, `getTableOfContentsHeadings(headings)`, `shouldShowTableOfContents(headings)`, and a named `toc` layout slot.

- [ ] **Step 1: Write failing ToC filtering tests**

```ts
import {
  getTableOfContentsHeadings,
  shouldShowTableOfContents,
} from "./toc.ts";

const headings = [
  { depth: 1, slug: "title", text: "Title" },
  { depth: 2, slug: "one", text: "One" },
  { depth: 3, slug: "detail", text: "Detail" },
  { depth: 4, slug: "deep", text: "Deep" },
  { depth: 2, slug: "two", text: "Two" },
];

test("keeps H2 and H3 in document order", () => {
  assert.deepEqual(getTableOfContentsHeadings(headings).map(({ slug }) => slug), [
    "one",
    "detail",
    "two",
  ]);
});

test("shows only at three eligible headings", () => {
  assert.equal(shouldShowTableOfContents(headings.slice(0, 3)), false);
  assert.equal(shouldShowTableOfContents(headings), true);
});
```

- [ ] **Step 2: Run and verify the module is missing**

Run: `node --experimental-strip-types --test src/lib/toc.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/toc.ts`.

- [ ] **Step 3: Implement the pure threshold boundary**

Define a readonly heading shape `{ depth: number; slug: string; text: string }`; filter only depths 2 and 3; expose threshold constant `3`; return true only when the filtered length is greater than or equal to it.

- [ ] **Step 4: Build one semantic component with two responsive views**

`TableOfContents.astro` accepts the already-filtered heading list and locale. It renders a desktop `<nav aria-label>` and a tablet/mobile `<details><summary>…</summary>`; both contain the same ordered hash anchors, and H3 list items receive `table-of-contents__item--nested`. Render no component when the threshold helper is false.

- [ ] **Step 5: Compose headings without changing Moment entries**

In the Journal detail route, destructure `{ Content, headings } = await render(entry)`, filter once, and conditionally pass `<TableOfContents slot="toc">` to `EntryLayout`. Add a named `toc` slot between metadata and prose on mobile/tablet and in an outside sticky rail above 820px. Keep the reading column at 680px.

- [ ] **Step 6: Verify pure and integrated behavior**

Run: `node --experimental-strip-types --test src/lib/toc.test.ts`

Expected: 2 tests PASS.

Run: `npm run check && npm test`

Expected: `0 errors` and all regression tests PASS.

- [ ] **Step 7: Commit the ToC**

```bash
git add src/lib/toc.ts src/lib/toc.test.ts src/components/TableOfContents.astro src/layouts/EntryLayout.astro src/pages/'[lang]'/journal/'[...slug]'.astro src/styles/global.css
git commit -m "feat: add journal table of contents"
```

### Task 5: Privacy-Safe Hello Context and Site History

**Files:**
- Create: `src/data/personal.ts`
- Create: `src/lib/personal.test.ts`
- Create: `src/components/PlaceIndex.astro`
- Create: `src/components/FriendsList.astro`
- Create: `src/components/SiteHistory.astro`
- Modify: `src/pages/[lang]/hello/index.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/lib/quality.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Locale`, existing Hello copy/layout, `ImageMetadata` for optional local avatars.
- Produces: `LocalizedText`, `Place`, `Friend`, `SiteHistoryRecord`, `definePlaces`, `defineFriends`, `PLACES = []`, `FRIENDS = []`, `SITE_START_YEAR = 2026`, and one localized verified history record.

- [ ] **Step 1: Write failing validation and empty-state tests**

Test that `definePlaces` accepts city/country plus paired x/y values from 0 through 100, rejects a lone coordinate, out-of-range values, and unknown precision-bearing keys such as `latitude`. Test `defineFriends` accepts only HTTPS plus `consentConfirmed: true`, rejects HTTP and false/missing consent, and requires avatar and localized avatar alt together. In `quality.test.ts`, assert built Hello pages omit `.place-index` and `.friends-list`, include localized `.site-history`, contain no latitude/longitude/geolocation strings, and all footers contain localized `Since 2026` copy.

- [ ] **Step 2: Run tests and verify the personal module is missing**

Run: `node --experimental-strip-types --test src/lib/personal.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/personal.ts`.

- [ ] **Step 3: Implement validated explicit data**

Define `LocalizedText = Readonly<Record<Locale, string>>`. `Place` contains only `{ id, kind: "lived" | "visited", city, country, x?, y? }`; use strict parsing to reject unknown keys and validate kebab-case ID, nonblank localized records, paired coordinates, and inclusive 0–100 range. `Friend` contains `{ name, url, description, consentConfirmed: true, avatar?, avatarAlt? }`; use strict parsing to reject unknown keys and validate `new URL(url).protocol === "https:"`, literal consent, and avatar pairing. Export empty `PLACES` and `FRIENDS` through those validators.

Export:

```ts
export const SITE_START_YEAR = 2026;
export const SITE_HISTORY = [
  {
    year: 2026,
    description: {
      en: "me.frankie.wang launched as an independent static Astro site.",
      zh: "me.frankie.wang 于 2026 年作为独立的 Astro 静态网站上线。",
      fr: "me.frankie.wang a été lancé comme site Astro statique indépendant.",
    },
  },
] as const satisfies readonly SiteHistoryRecord[];
```

- [ ] **Step 4: Implement focused Hello components**

`PlaceIndex` renders nothing for an empty list. Otherwise render an accessible city/country list with localized lived/visited text. Render a separately `aria-hidden="true"` schematic plot only when every place has x and y; use CSS percentages and textual point labels, with no map API or geographic claim.

`FriendsList` renders nothing for an empty list. Otherwise render same-tab `<a rel="friend">`, localized description, and optional `Image` only when local avatar plus localized alt exist.

`SiteHistory` always renders a heading and ordered year/description list. Compose all three after the existing introduction/social links in the specified Hello order.

- [ ] **Step 5: Add localized running-time footer**

Render one localized footer phrase using `SITE_START_YEAR`; English is `Since 2026`, Chinese is `始于 2026`, and French is `Depuis 2026`. Do not calculate days, elapsed time, or current location.

- [ ] **Step 6: Verify validation and empty production state**

Run: `node --experimental-strip-types --test src/lib/personal.test.ts`

Expected: all place/friend validation tests PASS.

Run: `npm test && npm run check`

Expected: all tests PASS, all three Hello pages contain history, and Places/Friends remain absent while arrays are empty.

- [ ] **Step 7: Commit personal context**

```bash
git add src/data/personal.ts src/lib/personal.test.ts src/components/PlaceIndex.astro src/components/FriendsList.astro src/components/SiteHistory.astro src/pages/'[lang]'/hello/index.astro src/components/Footer.astro src/lib/quality.test.ts src/styles/global.css
git commit -m "feat: add privacy-safe hello context"
```

### Task 6: Conditional Section-Local Full-Text Search

**Files:**
- Create: `src/components/ContentSearch.astro`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`
- Modify: `src/pages/[lang]/journal/index.astro`
- Modify: `src/pages/[lang]/moments/index.astro`
- Modify: `src/components/JournalPreview.astro`
- Modify: `src/components/MomentPreview.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: public localized entries, entry bodies, canonical entry URLs, localized topic labels, optional Moment location.
- Produces: `SEARCH_ENTRY_THRESHOLD = 10`, `SearchDocument`, `normalizeSearchText`, `matchesSearchQuery`, `shouldEnableSearch`, `createJournalSearchDocuments`, and `createMomentSearchDocuments`.

- [ ] **Step 1: Write failing threshold, indexing, and matching tests**

Use public/draft fake entries and assert threshold false at 9 and true at 10. Assert Journal documents include ID, URL, title, summary, body, and localized topic labels; Moment documents include caption, body, localized topic labels, and location. Assert drafts never appear. Assert `matchesSearchQuery` handles `CAFÉ` with query `cafe`, requires every term in `travel london`, matches direct Chinese substring `旅行`, returns all documents for whitespace-only input, and does not match absent terms.

- [ ] **Step 2: Run and verify search exports fail**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: FAIL because `SEARCH_ENTRY_THRESHOLD` and search helpers are not exported.

- [ ] **Step 3: Implement pure build-time documents and matching**

Define:

```ts
export type SearchDocument = {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly summary: string | undefined;
  readonly body: string;
  readonly topics: readonly string[];
  readonly location: string | undefined;
  readonly searchText: string;
};

export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
}
```

Join title, summary, body, localized topic labels, and location with spaces for `searchText`, replacing undefined values with empty strings. Keep those source fields separately in each document as declared above. Normalize each space-separated query term and require `terms.every(term => normalizedDocument.includes(term))`. Build documents only from `getPublishedEntries(entries).filter(locale)` and use localized `TOPICS` labels.

- [ ] **Step 4: Implement progressive enhancement without generated result HTML**

`ContentSearch.astro` accepts `{ locale, section, documents }`; it returns nothing below ten documents. At ten or more, render a labelled `<input type="search">`, `<output aria-live="polite">`, and hidden no-results paragraph. Serialize the exact `SearchDocument` fields into a safe `application/json` element, escaping `<` as `\u003c`.

The local script listens to `input`, reads terms, and resolves each existing preview before toggling its `hidden` property:

```js
const preview = document.querySelector(
  `[data-search-entry="${CSS.escape(searchDocument.id)}"]`,
);
```

It updates the localized count and shows no-results only for a nonempty query with zero matches. Catch malformed/missing JSON by returning without changing the DOM.

- [ ] **Step 5: Compose exact section boundaries**

Journal and Moments indexes build documents after locale/public filtering and place `ContentSearch` between the page title and preview collection. Add stable `data-search-entry={entry.id}` to each preview’s existing outer element; do not add layout-breaking wrappers. Keep empty states and all previews server-rendered.

- [ ] **Step 6: Verify search behavior and regressions**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: threshold, field contract, draft exclusion, diacritic, multi-term, and CJK tests PASS.

Run: `npm run check && npm test`

Expected: `0 errors`; the empty production repository has no search control and unchanged empty states.

- [ ] **Step 7: Commit search**

```bash
git add src/components/ContentSearch.astro src/lib/content.ts src/lib/content.test.ts src/pages/'[lang]'/journal/index.astro src/pages/'[lang]'/moments/index.astro src/components/JournalPreview.astro src/components/MomentPreview.astro src/styles/global.css
git commit -m "feat: add conditional content search"
```

### Task 7: Accessible Local Video and Audio Composition

**Files:**
- Create: `src/components/EntryMedia.astro`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/content.test.ts`
- Modify: `src/components/MomentPreview.astro`
- Modify: `src/pages/[lang]/journal/[...slug].astro`
- Modify: `src/pages/[lang]/moments/[...slug].astro`
- Modify: `src/lib/quality.test.ts`
- Modify: `src/styles/global.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: validated `leadMedia` and `video` frontmatter from Task 1, Astro local poster metadata, and localized media labels.
- Produces: `getMomentPreviewVisual(data)`, native video/audio rendering, video-only poster previews, and exact authoring examples.

- [ ] **Step 1: Write failing preview and rendered-markup tests**

Assert `getMomentPreviewVisual` returns the first authored image when present, returns `{ src: video.poster, alt: video.posterAlt }` for a video-only Moment, and returns undefined only for an invalid empty object that the schema would reject. Extend quality rules to scan built HTML and fail if any `video` or `audio` tag has `autoplay`, if a video lacks `controls`, `playsinline`, `preload="metadata"`, or a captions track, or if audio lacks `controls` and `preload="metadata"`.

- [ ] **Step 2: Run focused tests and verify the preview helper fails**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: FAIL because `getMomentPreviewVisual` is not exported.

- [ ] **Step 3: Implement preview selection and native media component**

Implement the generic helper over `{ images, video }`, preferring the first image and otherwise returning the local poster/alt pair.

`EntryMedia.astro` accepts a discriminated union. For video, optimize the local poster using Astro assets and render:

```astro
<figure class="entry-media entry-media--video">
  <video controls playsinline preload="metadata" poster={posterUrl} aria-label={media.title}>
    <source src={media.src} />
    <track kind="captions" src={media.captions} srclang={locale} label={media.title} default />
  </video>
  <figcaption>{media.title}</figcaption>
</figure>
```

For audio, render a localized heading/title, `<audio controls preload="metadata" src={media.src}>`, and a normal same-tab transcript anchor. Do not add `autoplay`, iframe, provider SDK, playlist, background behavior, or remote URL.

- [ ] **Step 4: Compose media in the specified order**

Journal order is cover, TopicLinks/ToC placement, optional `leadMedia`, then prose; the lead media itself appears after cover and before prose. Moment detail renders every image and its optional one video before prose. Moment previews use `getMomentPreviewVisual`, so video-only entries render the processed poster with its authored alt.

- [ ] **Step 5: Document exact authoring syntax**

Add complete Journal video, Journal audio, Moment video-only, and Moment image-plus-video frontmatter examples to `README.md`, using `/media/example.mp4`, `/media/example.vtt`, `/media/example.mp3`, and `/media/example-transcript.html`. State that actual files go in `public/media/`, posters stay local Astro assets, captions/transcripts are mandatory, topics allow only the three catalog keys, and drafts do not publish.

- [ ] **Step 6: Verify schema, preview, markup, and build**

Run: `node --experimental-strip-types --test src/lib/content.test.ts`

Expected: schema and preview-selection tests PASS.

Run: `npm test && npm run check && npm run build`

Expected: all tests PASS, `0 errors`, and static build succeeds.

- [ ] **Step 7: Commit media**

```bash
git add src/components/EntryMedia.astro src/lib/content.ts src/lib/content.test.ts src/components/MomentPreview.astro src/pages/'[lang]'/journal/'[...slug]'.astro src/pages/'[lang]'/moments/'[...slug]'.astro src/lib/quality.test.ts src/styles/global.css README.md
git commit -m "feat: add accessible local media"
```

### Task 8: Integrated Regression and Real-Browser QA

**Files:**
- Temporarily create and remove without committing: `src/pages/[lang]/__qa.astro`
- Temporarily create and remove without committing: `src/assets/qa-poster.svg`
- Temporarily create and remove without committing: `public/media/qa-captions.vtt`
- Temporarily create and remove without committing: `public/media/qa-transcript.html`
- Modify if a verified defect is found: the exact owning source/test file from Tasks 1–7
- Verify: all production files, generated `dist/`, and Git working tree

**Interfaces:**
- Consumes: all production components and pure helpers.
- Produces: automated gate evidence and populated/empty browser evidence at 375px, 768px, and 1280px in English, Chinese, and French.

- [ ] **Step 1: Run the complete automated gate from a clean snapshot**

Run: `git status --short --branch`

Expected: only the planned commits are present and no unrelated worktree change exists.

Run: `npm test`

Expected: all Node and built-output tests PASS.

Run: `npm run check`

Expected: `0 errors`.

Run: `npm run build`

Expected: static build succeeds with three feed endpoints and no empty topic routes.

- [ ] **Step 2: Create one temporary, non-shipping QA route**

Use `apply_patch` to add `src/pages/[lang]/__qa.astro` with `getStaticPaths()` for all three locales, `src/assets/qa-poster.svg` as a simple local 16:9 black/white test card, `public/media/qa-captions.vtt` containing `WEBVTT` plus one `00:00.000 --> 00:01.000` cue, and `public/media/qa-transcript.html` containing a one-sentence test transcript. Import the real `ContentSearch`, `TopicLinks`, `TableOfContents`, `PlaceIndex`, `FriendsList`, `EntryMedia`, and `SiteHistory` components. Supply exactly ten in-memory search documents, three H2/H3 headings, one approximate city-level place, one HTTPS consented friend without avatar, a video object using `/media/qa-video.mp4`, the imported QA poster, and `/media/qa-captions.vtt`, and an audio object using `/media/qa-audio.mp3` plus `/media/qa-transcript.html`; the binary sources may intentionally 404 because QA verifies native control/accessibility behavior rather than playback. Use the real history record. Render through `SiteLayout` with `robots="noindex, follow"`. Do not add these values to content collections or personal data.

- [ ] **Step 3: Serve and exercise all required widths/locales**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Astro reports a local URL.

At 375px, 768px, and 1280px for `/en/__qa/`, `/zh/__qa/`, and `/fr/__qa/`, verify: no horizontal overflow; localized labels fit; search appears at ten, filters on multi-term/diacritic/CJK input, reports the count, shows no-results, and clearing restores ten; ToC hash links work; mobile/tablet disclosure and desktop sticky rail switch at 820px; topic links are keyboard reachable; place list remains semantic while the plot is decorative; friend link is same-tab with `rel=friend`; video/audio show controls and do not autoplay; focus remains visible; reduced-motion mode removes no content.

Also inspect production `/en/hello/`, `/zh/hello/`, and `/fr/hello/` at the three widths to confirm empty Places/Friends are absent, history/footer are present, feed discovery is correct, and no new primary navigation item appears.

- [ ] **Step 4: Remove every temporary QA artifact before final verification**

Use `apply_patch` to delete `src/pages/[lang]/__qa.astro`, `src/assets/qa-poster.svg`, `public/media/qa-captions.vtt`, and `public/media/qa-transcript.html`. Confirm with `git status --short` that no fixture, synthetic fact, media sample, or QA route remains.

- [ ] **Step 5: Re-run final gates after fixture removal**

Run: `npm test && npm run check && npm run build`

Expected: all tests PASS, `0 errors`, static build succeeds, three empty feeds remain valid, and no `dist/__qa/` route exists.

- [ ] **Step 6: Review scope and commit only verified fixes, if any**

Run: `git diff --check && git status --short --branch`

Expected: no whitespace errors and no uncommitted changes. If browser QA required a production correction, first add a focused regression test, make it fail for that defect, implement the correction, rerun the affected test and full gates, then commit only those exact files with `fix: correct content discovery QA defects`.

## Completion Evidence

- All eight approved capability groups have a production owner and focused automated coverage.
- `npm test`, `npm run check`, and `npm run build` pass after temporary QA fixtures are removed.
- Browser QA covers populated and empty states at 375px, 768px, and 1280px across `en`, `zh`, and `fr`.
- Final source and generated output contain no draft leak, synthetic personal content, precise/live location, remote avatar/embed, autoplay, new primary route, or QA artifact.

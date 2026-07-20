# Content Discovery and Personal Context Design

> Status: approved by the user on 2026-07-20 with “全部批准”.

## Goal

Extend `me.frankie.wang` with eight content-discovery and personal-context
capabilities while preserving the approved life-first identity, static Astro
architecture, three-locale contract, and truthful-content boundary:

1. locale-specific RSS feeds;
2. lightweight topics for Journal and Moments;
3. an automatic table of contents for long Journal entries;
4. city-level lived and visited places on Hello;
5. a small, consented friends list on Hello;
6. full-text search after a section has enough public content;
7. short video for Moments and video or audio for Journal;
8. site history on Hello and `Since 2026` in the footer.

## Product Constraints

- The audience remains Frankie and friends. Moments and lived experience stay
  ahead of projects, credentials, and professional positioning.
- The core navigation remains exactly Journal, Moments, and Hello in English,
  Chinese, and French. No Search, Topics, Places, or Friends item is added to
  the header.
- The site remains a statically generated Astro repository. There is no CMS,
  database, authentication, comment system, geolocation API, or runtime
  backend.
- No event, trip, city, relationship, friend, photograph, biography detail,
  or media item may be invented. Unconfigured personal sections do not render.
- Draft content must not enter pages, feeds, topic indexes, or search indexes.
- Existing canonical, `hreflang`, translation-fallback, keyboard, reduced
  motion, and responsive behavior remains intact.
- New surfaces reuse the approved tokens and visual grammar in `DESIGN.md`.
  They do not introduce a new palette, type family, card language, or motion
  system.

## Approaches Considered

### A. Static progressive enhancement — selected

Build every capability into the static content and component architecture,
then render it only when its truthful prerequisites are met. A small inline
script powers search only on indexes with at least ten public entries. This
keeps the default experience fast and preserves the no-backend boundary.

### B. Dedicated discovery routes

Add permanent Search, Topics, Places, and Friends destinations. This makes
features easier to advertise but expands the information architecture before
there is content to justify it and competes with the locked three-route
navigation.

### C. Client-side content explorer

Combine search, filters, an interactive map, and media into a JavaScript-heavy
application. This creates a stronger demo surface but adds runtime state and
failure modes that do not serve a small personal archive.

Approach A is selected because it implements the complete scope without
turning the personal site into a publishing platform or dashboard.

## Architecture

The features are divided into focused static units:

- `src/data/topics.ts` owns the finite topic vocabulary and localized labels.
- `src/data/personal.ts` owns explicitly public places, friends, and site
  history. Places and friends begin empty and are invisible while empty.
- `src/lib/content.ts` remains the boundary for public-entry selection and adds
  pure helpers for topics, search documents, feed items, and Moment preview
  media.
- Static page routes generate locale feeds and only the topic pages backed by
  public entries.
- Reusable Astro components own topic links, the Journal table of contents,
  conditional search, place presentation, friends, and accessible media.
- Existing Journal and Moments index/detail routes compose those units without
  changing the core route names.

Every data transformation is build-time except the final search-filtering
interaction. With JavaScript disabled, every public entry remains visible and
navigable.

## 1. Locale-Specific RSS

### Routes

- `/en/feed.xml`
- `/zh/feed.xml`
- `/fr/feed.xml`

Each feed combines public Journal and Moments entries for that locale, ordered
descending by `publishedAt`. Journal items use their title and summary.
Moment items use their caption and optional location. Item URLs use the
existing canonical entry paths.

An empty locale still produces a valid feed with channel metadata and zero
items. Drafts are excluded by the same public-entry helper used by pages.

### Discovery

- `SiteLayout` adds one `<link rel="alternate" type="application/rss+xml">`
  pointing to the current locale’s feed.
- `SocialLinks` resolves the configured RSS service to the current locale’s
  feed path. RSS remains last in the approved service order.
- The feed title and description use existing localized site copy rather than
  adding fabricated content.

## 2. Lightweight Topics

### Vocabulary

Topics are stable keys from a finite catalog rather than arbitrary free text.
The first catalog contains:

| Key | English | Chinese | French |
| --- | --- | --- | --- |
| `daily` | Daily life | 日常 | Quotidien |
| `travel` | Travel | 旅行 | Voyage |
| `reading` | Reading | 阅读 | Lecture |

The catalog may be extended deliberately in code. A content file may select at
most three unique keys with optional frontmatter `topics`. Unknown or repeated
keys fail the build.

### Presentation and routes

Topic links appear only on entries and previews that configure topics. A
linked topic leads to:

`/[locale]/topics/[topic]/`

The page combines public Journal and Moments entries in chronological order.
Only locale/topic pairs with at least one public entry are generated. Topic
pages are secondary discovery surfaces and never enter the header.

On a topic page, locale switching preserves the topic only when that target
locale has public entries for it; otherwise it falls back to that locale’s
home page. Canonical and alternate metadata list only routes that exist.

## 3. Journal Table of Contents

The rendered Markdown heading metadata is filtered to H2 and H3. A table of
contents appears only when at least three eligible headings remain.

- Desktop above 820px: a sticky, narrow rail sits outside the 680px reading
  column without shrinking it.
- Tablet and mobile: a native `<details>` block appears between entry metadata
  and prose.
- Each item is a normal hash link to the Markdown-generated heading ID.
- H3 items are visually indented but remain in one ordered reading sequence.
- No scroll tracking, smooth scrolling, or active-section JavaScript is added.
- The component has a localized label and summary in all three locales.

Short Journal entries and all Moment entries remain unchanged.

## 4. Life Footprint

Hello receives a conditional `Places` section backed only by
`src/data/personal.ts`. Each configured place contains:

- a stable ID;
- `lived` or `visited` kind;
- localized city and country labels;
- an optional approximate `x`/`y` plotting position from 0 to 100.

The model intentionally has no latitude, longitude, address, visit date,
current-location flag, or device-location input. It cannot express a live or
precise location.

When at least one place exists, the section renders an accessible city list.
If every place has a plotting position, it also renders a decorative schematic
map with labelled points; the city list remains the semantic source of truth.
The map makes no geographic-precision claim. When no place exists, the entire
section is absent rather than replaced by a teaser or invented example.

## 5. Friends

Hello receives a conditional `Friends` section backed only by explicitly
configured entries in `src/data/personal.ts`. Each entry requires:

- a display name;
- an HTTPS URL;
- a localized short description;
- the literal flag `consentConfirmed: true`;
- an optional local avatar with localized alt text.

Remote avatar requests are not allowed. Links use ordinary same-tab navigation
and `rel="friend"`. The list remains small and uses the existing compact-link
grammar rather than a dense directory wall. With zero configured entries the
entire section is absent. Friends is not added to primary navigation.

## 6. Conditional Full-Text Search

Search is section-local:

- Journal search indexes Journal entries.
- Moments search indexes Moment entries.

For a locale/section pair, search appears only when there are at least **10**
public entries. The threshold is exact and is evaluated at build time.

Each search document contains the entry ID, URL, localized title or caption,
summary when present, body text, localized topic labels, and optional location.
Drafts never become search documents. Search uses case-insensitive,
diacritic-insensitive substring matching; space-separated terms all need to
match. This also permits direct CJK substring search without a language-specific
tokenizer.

The page initially renders every public preview. A small local script listens
to the native search input and toggles those existing preview wrappers; it
does not fetch a remote index or generate result HTML. An `aria-live="polite"`
status reports the current result count. A localized no-results message appears
only for a non-empty query with no matches. Clearing the input restores every
entry. If JavaScript fails or is disabled, the unfiltered public index remains
fully usable.

## 7. Video and Audio

### Moments

A Moment may contain images, one short video, or both. It must contain at least
one visual item. A video requires:

- a same-origin `/media/…` source;
- a local Astro-processed poster and localized poster alt text;
- a localized accessible title;
- a same-origin WebVTT caption track.

Video renders with `controls`, `playsinline`, and `preload="metadata"`.
`autoplay` is never emitted. A video-only Moment uses its poster wherever a
preview image is required.

### Journal

A Journal entry may configure one lead media item after its optional cover:

- video uses the same requirements as Moment video;
- audio requires a same-origin `/media/…` source, localized title, and a
  same-origin transcript link.

Audio renders with `controls` and `preload="metadata"`. It never autoplays.
Third-party iframe providers, tracking embeds, playlists, and background media
are outside this version’s scope. Media is an enhancement to authored content,
not synthetic sample content.

## 8. Site History and Running Time

The footer displays localized `Since 2026` copy using a constant start year;
it does not run a live day counter.

Hello always renders a small site-history section sourced from verified
repository facts. The initial record is that `me.frankie.wang` launched in
2026 as an independent static Astro site. Future records must describe real
changes and be localized in all three languages.

This history belongs to the personal site only. It does not import the sibling
academic site’s Git-history visualization or project chronology.

## Page Composition

### Journal index

1. Existing page title.
2. Conditional search when the locale has at least ten public Journal entries.
3. Existing chronological list with optional topic links.
4. Existing truthful empty state when there are no entries.

### Moments index

1. Existing page title.
2. Conditional search when the locale has at least ten public Moments.
3. Existing chronological media grid with optional topic links and video
   posters.
4. Existing truthful empty state when there are no entries.

### Journal entry

1. Existing header, description, dates, and optional cover.
2. Optional topics.
3. Conditional table of contents.
4. Optional accessible lead media.
5. Authored prose.

### Moment entry

1. Existing header, caption, date, and optional location.
2. Optional topics.
3. Authored images and/or accessible short video.
4. Optional authored prose.

### Hello

1. Existing introduction and social links.
2. Conditional life footprint.
3. Conditional friends.
4. Always-visible site history.

The existing core route names and header order do not change.

## Component Boundaries

- `TopicLinks.astro`: compact localized topic links used by previews and
  entries.
- `TableOfContents.astro`: semantic desktop/mobile views over one heading list.
- `ContentSearch.astro`: search field, result status, no-results message, and
  progressive enhancement script.
- `PlaceIndex.astro`: accessible place list and optional schematic map.
- `FriendsList.astro`: consented local friend links.
- `EntryMedia.astro`: native image-independent video/audio rendering with
  required accessibility metadata and no autoplay.
- `SiteHistory.astro`: localized, verified history records.

Patterns used only once may remain in their page, but these named components
have at least two consumers or own a focused validation/accessibility boundary.

## Localization

Every visible interface label, search status, topic name, media label, place
kind, friends heading, history heading, feed title, and table-of-contents label
exists in English, Chinese, and French. Personal descriptions are stored as a
complete locale record; no machine translation runs at build or runtime.

Content translation remains optional. A translated entry uses the same
`translationKey` and topic keys. Missing entry translations keep the existing
section-index fallback behavior.

## Failure and Empty States

- Invalid topic keys, more than three topics, repeated topics, invalid media
  paths, missing captions/transcripts, missing poster alt text, insecure friend
  URLs, or friends without confirmed consent fail the build.
- Empty feeds remain valid XML.
- Empty topic combinations do not generate routes.
- Fewer than ten entries means search is absent, not disabled.
- Fewer than three eligible Journal headings means the table of contents is
  absent.
- Empty places and friends mean their Hello sections are absent.
- Search-script failure leaves the complete static index visible.
- Missing media never produces a remote placeholder or synthetic card.

## Accessibility and Privacy

- All controls meet the existing 44px coarse-pointer target requirement.
- Search has a programmatic label and live result count; its no-results state
  is textual.
- Table-of-contents links follow document order and work without JavaScript.
- The place list communicates every map point without relying on color or map
  geometry.
- Video captions and audio transcripts are authoring requirements, not accepted
  accessibility debt.
- No browser geolocation, analytics event, third-party embed, remote avatar, or
  private original is introduced.
- Reduced-motion users lose no content or function.

## Testing and Verification

Implementation follows test-driven development. Each production behavior is
introduced only after a focused test fails for the expected missing behavior.

Automated coverage must prove:

- each locale emits a discoverable feed containing only its public entries;
- drafts are absent from feed, topic, route, and search data;
- topic validation, ordering, localization, links, and generated routes;
- the exact search threshold of ten and the indexed-field contract;
- table-of-contents filtering and its three-heading threshold;
- empty personal data omits places and friends;
- configured places expose city-level text without precise coordinates;
- friend entries require HTTPS and confirmed consent;
- Moment media requires at least one image or video;
- videos and audio have controls and never have autoplay;
- video captions, poster alternatives, and audio transcripts are required;
- Footer and Hello publish localized, verified site history;
- canonical, alternate-language, draft, and 404 behavior does not regress.

Required commands after implementation:

```sh
npm test
npm run check
npm run build
```

The production build is then served locally and exercised in a real browser at
375px, 768px, and 1280px across English, Chinese, and French. QA covers search
input and clearing, topic navigation, table-of-contents links and disclosure,
keyboard focus, reduced motion, media controls, empty personal sections, and
horizontal overflow. Because the repository initially has no public content,
an ignored QA fixture or state harness may exercise populated states; no
synthetic entry or personal fact is committed or deployed.

## Accepted Deferrals

- Places and Friends ship structurally complete but remain invisible until the
  user supplies explicitly public data.
- Search ships structurally complete but remains invisible on a locale/section
  until it reaches ten public entries.
- No third-party comments, Webmentions, interactive geographic map, remote
  media embed, newsletter, project directory, or additional primary route is
  included.

## Completion Criteria

The feature set is complete only when all eight capabilities are represented in
the production architecture, every conditional visibility rule is proven,
invalid authoring fails early, all automated gates pass, populated and empty
states pass real-browser QA at the three required widths, and no fabricated
personal data or unrelated navigation appears in source or generated output.

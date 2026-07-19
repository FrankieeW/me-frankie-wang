# me.frankie.wang Design System

> Status: approved on 2026-07-19. The user passed the Open design gate by
> directing work to continue. This is the visual and interaction contract for
> Task 1 and the implementation baseline for subsequent tasks.

## 0. Research Log

- **Concrete reference:** `https://diygod.cc/` was inspected in a real browser
  on 2026-07-19 at 1280, 768, and 375 px. Only its rendered visual grammar was
  used: a white canvas, fading grid, disciplined widths, split hero, square
  image, restrained borders, dashed offset layers, and compact link groups.
  Its copy, identity, photographs, assets, and personal facts are excluded.
- **Runtime extraction:** measured reference behavior is recorded in
  `.superpowers/brainstorm/63407-1784495770/evidence/reference-led-v1/reference-runtime-notes.md`.
- **Direction comparison:** the user compared a photo-first living scrapbook,
  a chronological stream, and a quiet editorial index. The approved direction
  is the living scrapbook as the main homepage composition, with the
  chronological stream retained as a quieter second view below it.
- **Translation decision:** navigation and core pages always exist in English,
  Chinese, and French. An individual Journal or Moments entry may exist in only
  some locales. Missing translations fall back to the target locale's relevant
  section index.
- **Taste feedback:** the rejected warm paper, serif, nostalgic scrapbook
  concepts are anti-references. The approved direction is crisp, white,
  sans-serif, graphic, and contemporary.
- **Approved prototype:**
  `.superpowers/brainstorm/63407-1784495770/content/diygod-reference-led-frankie-v1.html`.
  It is throwaway design evidence, not a production page or component.
  Final screenshots and interaction captures are indexed in
  `.superpowers/brainstorm/63407-1784495770/evidence/reference-led-v1/design-gate-evidence.md`.
- **Skipped research lanes:** Lazyweb and Imagen were not used because the user
  supplied a concrete live reference and approved a browser-rendered prototype.
  No additional aesthetic source is allowed to dilute that decision.

## 1. Atmosphere & Identity

The site feels like a bright personal index assembled over time: direct,
unpretentious, photo-led, and alive without becoming noisy. Its signature is a
**living grid scrapbook**: a faint architectural grid holds one strong image,
short writing, and irregular fragments; a quieter chronological stream then
lets visitors browse the same life in order. White space is generous, type is
confident, and orange, blue, and hard black details give the page energy.

### Locked product decisions

- The audience is Frankie and friends, not recruiters or academic readers.
- Personal life, photographs, and recent moments outrank credentials and
  project lists.
- Homepage order is: header, split hero, living scrapbook, chronological
  timeline, footer.
- Moments are visually primary. Journal and Hello remain immediately
  discoverable in the header and hero links.
- The interface routes are exactly `en`, `zh`, and `fr`; `/` redirects to
  `/en/`.
- Core navigation is exactly:
  - `Journal` / `随笔` / `Journal`
  - `Moments` / `片刻` / `Instants`
  - `Hello` / `你好` / `Bonjour`
- Route segments are never translated: home is `/[locale]/`; the core section
  paths are `/[locale]/journal/`, `/[locale]/moments/`, and
  `/[locale]/hello/` for each of `en`, `zh`, and `fr`.
- The locale display labels are `EN / 中 / FR`. `中` is the visible Chinese
  label; `zh` remains the URL and code identifier.
- The sibling academic site's visual system, navigation, generated diffs, and
  post-history treatment are not reused.
- No event, date, trip, relationship, photograph, biography detail, social
  account, or diary entry may be invented. Empty states are first-class.

### Neutral first-deployment copy

Until Frankie supplies additional authored introduction text, the hero uses a
plain factual greeting and the plan's approved neutral description:

| Locale | Hero title | Introduction |
| --- | --- | --- |
| English | `Hi, I’m Frankie.` | `A small place for life, photographs, and notes.` |
| Chinese | `你好，我是 Frankie。` | `记录生活、照片与随笔的一小块地方。` |
| French | `Bonjour, je suis Frankie.` | `Un petit espace pour la vie, les photographies et les notes.` |

This copy claims no event or biography detail beyond the site's owner.

### Primary journeys and inclusive users

- A friend on a phone can see the latest real photograph or a truthful empty
  state, then reach Moments, Journal, Hello, or a configured social profile.
- A returning visitor can scan the chronological stream without deciphering
  the scrapbook layout.
- A keyboard or screen-reader user can reach the same routes and understand
  every image, locale choice, menu state, and external-link purpose.
- A motion-sensitive visitor receives the complete experience without smooth
  scrolling, lifts, or panel animation.
- Chinese and French readers receive the same core information hierarchy even
  when a specific entry has no translation.

### Explicit anti-patterns

- No warm paper texture, vintage ephemera, editorial serif, or faux-handmade
  decoration.
- No academic-site chrome, publication metrics, generated history, CV-first
  hero, or dense project directory.
- No generic three-equal-card feature row, gradient text, neon glow, glassy
  dashboard surface, emoji icon, custom cursor, or decorative scroll prompt.
- No stock photography, remote placeholder photography, or synthetic personal
  content.
- No motion on non-interactive content and no entrance animation copied from
  the reference site.

## 2. Color

The first release is deliberately light-only and declares
`color-scheme: light`. Dark mode is outside the first-release scope.

### Core palette

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `--color-paper` | `#FFFFFF` | Page, cards, tooltip and menu surfaces |
| Soft surface | `--color-soft` | `#F4F5F6` | Hover backing and quiet empty-state regions |
| Primary ink | `--color-ink` | `#0B0C0F` | Headings, borders, active navigation |
| Deep media ink | `--color-ink-panel` | `#11131A` | Abstract empty-state artwork only |
| Body ink | `--color-body` | `#393C43` | Introductory and long-form text |
| Muted ink | `--color-muted` | `#62656D` | Supporting copy |
| Quiet ink | `--color-quiet` | `#6B6F78` | Metadata and resting icons |
| Subtle line | `--color-line` | `#D9DBE0` | Dividers and quiet card borders |
| Strong line | `--color-line-strong` | `#B9BDC5` | Dashed layers and media frames |
| Vivid accent | `--color-accent` | `#FF4D24` | Brand mark, decorative dots, large accents, focus outline |
| Accessible accent ink | `--color-accent-ink` | `#B83216` | Small orange labels and linked text on white |
| Electric blue | `--color-blue` | `#1769FF` | Abstract empty-state artwork only |
| Pale blue | `--color-blue-pale` | `#C7E1FF` | Abstract empty-state artwork only |
| Peach | `--color-peach` | `#FFAD89` | Abstract empty-state artwork only |
| Cream | `--color-cream` | `#FFF0E6` | Abstract empty-state artwork only |

### Social-link state colors

These brand-derived colors are restricted to configured social icons on hover
or focus. They are not additional site accents and must retain at least 3:1
non-text contrast against white.

| Service | Token | Value |
| --- | --- | --- |
| RSS | `--social-rss` | `#B45309` |
| X | `--social-x` | `var(--color-ink)` |
| GitHub | `--social-github` | `var(--color-ink)` |
| Telegram | `--social-telegram` | `#0369A1` |
| Bilibili | `--social-bilibili` | `#0E7490` |
| Email | `--social-email` | `#B91C1C` |
| Douban | `--social-douban` | `#15803D` |

### Color rules

- `--color-accent` is the only site interaction accent. Blue and peach belong
  only to the abstract no-photo artwork.
- Small text never uses vivid orange; it uses `--color-accent-ink`.
- Resting social icons use `--color-quiet`; brand-derived color is a secondary
  state cue, never the only cue.
- Real photographs are not tinted, desaturated, color-graded, or covered by a
  decorative overlay.
- New colors must be added here before implementation uses them.

## 3. Typography

### Font stack

One system sans stack serves all three locales; there is no webfont download,
serif, or separate display family:

```css
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Noto Sans",
  "Helvetica Neue", Arial, sans-serif;
```

The system stack is a deliberate reference-fidelity and multilingual choice,
not a fallback. Dates and counts use `font-variant-numeric: tabular-nums`.

### Scale

| Level | Size | Weight | Line height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | `clamp(44px, 5.2vw, 72px)` | 780 | 0.98 | `-0.058em` | Homepage hero |
| Page title | `clamp(40px, 4.5vw, 60px)` | 780 | 1.02 | `-0.05em` | Journal, Moments, Hello indexes |
| Section title | `clamp(32px, 4vw, 48px)` | 760 | 1.04 | `-0.048em` | Scrapbook and timeline headings |
| Card title | 27px | 740 | 1.08 | `-0.04em` | Featured Journal card |
| Row title | 22px | 720 | 1.2 | `-0.025em` | Timeline and index rows |
| Lead body | 18px | 400 | 1.58 | normal | Desktop hero copy |
| Body | 16px | 400 | 1.6 | normal | Reading and primary UI copy |
| Supporting body | 14px | 400 | 1.6 | normal | Excerpts and secondary information |
| Metadata | 12px | 650 | 1.45 | `0.02em` | Dates and compact metadata |
| Overline | 11px | 760 | 1.3 | `0.16em` | Section labels and card kickers |
| Tooltip | 10px | 700 | 1.2 | normal | Redundant social-link hint only |

### Typography rules

- Essential prose never falls below 14px; 10–12px is reserved for redundant
  labels and metadata.
- Body copy is capped at 65 characters per line; long-form entry text is capped
  at 680px.
- Headings should not exceed three lines at 320px. Use the defined `clamp()`
  scale rather than per-string overrides.
- Chinese copy does not inherit uppercase transformation or exaggerated Latin
  tracking. French labels may wrap; containers must grow rather than clip.
- Page titles use real content only. Bracketed prototype titles, fake dates,
  and filler excerpts never ship.

## 4. Spacing & Layout

### Spacing tokens

Spacing follows a 4px base. Two measured optical exceptions from the approved
prototype are named explicitly rather than repeated as arbitrary values.

| Token | Value | Usage |
| --- | --- | --- |
| `--space-1` | 4px | Tight offset and focus mechanics |
| `--space-2` | 8px | Icon-to-label gaps |
| `--space-3` | 12px | Compact control padding |
| `--space-4` | 16px | Standard inset |
| `--space-card-gap` | 18px | Scrapbook card gap; optical exception |
| `--space-5` | 20px | Inline cluster gap |
| `--gutter-mobile` | 22px | Mobile page gutter; optical exception |
| `--space-6` | 24px | Card padding |
| `--space-7` | 28px | Desktop page gutter |
| `--space-8` | 32px | Group separation |
| `--space-10` | 40px | Compact section separation |
| `--space-12` | 48px | Heading and grid separation |
| `--space-14` | 56px | Desktop content edge total |
| `--space-16` | 64px | Scrapbook row unit |
| `--space-20` | 80px | Header height and broad spacing |
| `--space-24` | 96px | Desktop hero top offset |
| `--space-section-major` | 152px | Scrapbook-to-timeline separation |

Semantic component values such as the 76px desktop hero gap and 86px section
divider breathing room are documented with those components; they are not
general-purpose spacing options.

### Widths and breakpoints

| Token / range | Value | Behavior |
| --- | --- | --- |
| `--content-max` | 960px | Hero, homepage sections, route indexes |
| `--header-max` | 1088px | Header and footer inner width |
| `--reading-max` | 680px | Journal body and prose-heavy Hello content |
| Desktop | above 820px | Full header frame, split hero, 12-column scrapbook |
| Tablet | 681–820px | Full-width header, split hero, stacked section headings |
| Mobile | 680px and below | Disclosure menu, stacked hero and cards |

The three required visual-QA widths are 1280, 768, and 375 px. Primary content
must also remain usable without horizontal scrolling at 320 px and at 200%
zoom.

### Homepage geometry

- **Header:** 80px high on desktop/tablet and 72px on mobile. Desktop width is
  `min(100% - 48px, 1088px)`; mobile/tablet header spans the viewport.
- **Hero:** width `min(100% - 56px, 960px)`, top offset 96px, two columns
  `1.08fr 0.92fr`, 76px gap, and a 382px maximum square visual. Tablet gap is
  42px. Mobile uses `100% - 44px`, one column, a 70px top offset, and a 46px
  gap; the visual follows the copy and social links.
- **Section divider:** full-bleed dashed 1px line, centered compact label, 86px
  vertical margin on desktop/tablet and 82px on mobile.
- **Scrapbook:** 12 columns, 64px row unit, 18px gap. Tablet row unit is 54px.
  Mobile follows DOM order in one column with 18px gaps.
- **Timeline:** begins 152px after the scrapbook on desktop/tablet and 108px on
  mobile. Desktop rows use `150px minmax(0, 1fr) 88px`; mobile uses a two-cell
  metadata row above a full-width title/excerpt.
- **Footer:** begins 140px after the timeline on desktop/tablet and 104px on
  mobile.

### Route compositions

- **Home:** living scrapbook first, interleaved chronological timeline second.
- **Journal index:** page title plus one text-first vertical list. No mandatory
  thumbnail is added merely to fill space.
- **Moments index:** chronological photo grid with alternating 16:10 and 1:1
  cards; two unequal columns on desktop, one column on mobile.
- **Hello:** a restrained split between real authored text and an optional real
  portrait; without either, use the approved neutral introduction in a narrow
  reading column.
- **Journal entry:** 680px prose column, optional real cover allowed to expand
  to 960px, then return to the reading column.
- **Moment entry:** image-led vertical sequence within 960px, with caption and
  metadata in a 680px text column.
- **Empty state:** one bordered, quiet text region. It states that no public
  content exists; it never fabricates a card, date, title, or photograph.

### Photo ratios and crop behavior

- Hero/portrait: 1:1.
- Lead Moment: 16:10 on desktop/tablet; approximately 1.12:1 on mobile.
- Square Moment: 1:1 at every width.
- Secondary Moment: 4:3 on desktop/tablet and 9:10 on mobile.
- Containers reserve their ratio before the image loads. Images use
  `object-fit: cover`, centered by default, and never stretch.
- Source photographs live in `src/assets` and are rendered through Astro image
  processing. No remote placeholder, image CDN, or private original ships.

## 5. Components

Only patterns required by the approved routes are defined. A pattern used once
may remain within its page; one used twice becomes a reusable primitive.

### SiteHeader and BrandMark

- **Structure:** `header` → constrained inner wrapper → homepage brand link →
  primary navigation → `LanguageSwitcher` → mobile disclosure button/panel.
- **Variants:** desktop/tablet horizontal; mobile disclosure at 680px and below.
- **Surface:** translucent white, 1px lower/side border, 14px lower radius on
  desktop, 12px backdrop blur. Mobile/tablet remove side borders and radius.
- **States:** current route uses primary ink; other links use muted ink. Hover
  and focus strengthen the underline/ink without changing layout.
- **Accessibility:** brand has an explicit homepage label; current page uses
  `aria-current="page"`; mobile button is 44×44px with `aria-controls`, dynamic
  `aria-expanded`, and dynamic open/close label.
- **Motion:** menu glyph and panel use 180ms transform/opacity only.

### LanguageSwitcher

- **Structure:** a labelled navigation group with three real anchors in the
  fixed visual order `EN / 中 / FR`.
- **Routing:** on a core page, preserve the equivalent route. On an entry, link
  to the translation when it exists; otherwise link to that locale's Journal
  or Moments index. Never link to a missing route.
- **States:** active locale uses primary ink and `aria-current="page"`; inactive
  locales use muted ink. It is never an inert button or select-shaped control.
- **Accessibility:** each anchor has a full accessible language name and
  `hreflang`; the compact visible labels remain at least 44px high on coarse
  pointers through their containing hit area.

### MobileNavigation

- **Structure:** a native button followed in DOM order by a labelled navigation
  panel containing Journal, Moments, and Hello.
- **Surface:** white panel, 1px ink border, 14px radius, 5px hard offset shadow;
  three equal route cells of at least 44px height.
- **Behavior:** activating the button toggles the panel; Escape closes it and
  returns focus to the button; choosing a link closes it. Tab order follows the
  visual order.
- **Empty/loading/error:** not applicable to static navigation.

### HeroSectionLinks

- **Structure:** three text anchors for Journal, Moments, and Hello, each with a
  small inline SVG arrow.
- **Surface:** text plus a 1px underline; no button fill or large call-to-action.
- **States:** hover/focus uses accessible accent ink and a visible focus ring;
  active press translates the arrow by no more than 1px.

### SocialLinks

- **Structure:** a labelled navigation group of inline anchors with a 20px
  inline SVG or the single text glyph `豆`, plus visually hidden service names.
- **Supported order:** RSS, X, GitHub, Telegram, Bilibili, Email, Douban.
- **Content rule:** render only entries whose real URL or email address is
  configured in `src/data/site.ts`. If none are configured, omit the group.
  Prototype `#social-links` destinations never ship.
- **Link behavior:** normal same-tab navigation; email uses `mailto:`. Apply
  `rel="me"` where semantically valid. Do not surprise visitors with a new tab.
- **States:** resting icon is quiet gray; hover/focus uses its accessible
  brand-derived color, translates upward 2px, and reveals a text tooltip.
  Active returns toward rest.
- **Sizing:** 32×32px on fine pointers. On coarse pointers the transparent hit
  area is at least 44×44px while the icon stays 20px; the seven-item row must
  fit within the 331px content width at 375px. Use a 7px gap on fine pointers
  and a maximum 3px gap on coarse pointers.
- **Tooltip:** appears on hover and keyboard focus, 1px ink border, 5px radius,
  2px hard shadow. The first tooltip is left-aligned to avoid viewport clipping.
  It repeats, but never replaces, the accessible name.

### PhotoFrame

- **Structure:** stable-ratio wrapper → Astro-rendered image. A dashed layer is
  offset 9px down/right behind the hero variant.
- **Variants:** hero 1:1, lead 16:10, square 1:1, secondary responsive 4:3/9:10.
- **Radius:** 24px hero; 18px scrapbook cards; 12px detail thumbnails.
- **States:** no hover motion for a non-linking image. If the entire Moment card
  is a link, its link wrapper owns the focus and hover affordance.
- **Empty state:** a clearly decorative blue/orange/black abstract composition
  may stand in for the hero while no real portrait is supplied. It is
  `aria-hidden`, is never labelled as a photograph, and does not appear as a
  fabricated Moment entry.
- **Accessibility:** meaningful photos require localized alt text; decorative
  images use an empty alt value. Captions do not duplicate alt text verbatim.

### SectionDivider and SectionHeading

- **Divider:** full-width dashed line with a centered uppercase pill label. The
  pill is decorative context and cannot be a fake scroll control.
- **Heading:** overline/index, title, and optional supporting paragraph. It uses
  a two-column alignment on desktop and one column at 820px and below.
- **Localization:** Chinese labels are not forced to uppercase; French support
  copy may wrap without changing the title column's reading order.

### MomentPreview

- **Structure:** linked `article` with reserved-ratio image, optional real
  caption, real date, and accessible link name.
- **Variants:** lead, square, secondary, and compact index card.
- **Selection:** the homepage uses the newest public Moment as lead and may show
  up to two additional Moments. No item is duplicated merely to fill the grid.
- **States:** linked variants use focus outline plus a 4px transform of the
  foreground/dashed layer; image-only decoration does not move independently.
- **Empty state:** zero public Moments renders the localized section empty state
  and no synthetic card.

### JournalPreview

- **Structure:** linked `article` with type label, real title, optional real
  summary, real publication date, and inline SVG arrow.
- **Variants:** featured scrapbook card and compact Journal-index/timeline row.
- **Surface:** white, 1px strong line, 18px radius; the featured card has a
  dashed rear layer.
- **States:** foreground translates `-4px, -4px`; rear layer translates
  `8px, 8px`; both use the same 260ms easing. Focus exposes the same affordance
  plus the global outline. Reduced motion removes the transforms.
- **Empty state:** absent Journal content removes the card; it is not replaced
  with a fake title or excerpt.

### LivingScrapbook

- **Structure:** the DOM order is lead Moment, latest Journal, square Moment,
  real caption fragment, secondary Moment. CSS grid creates the desktop
  asymmetry; mobile preserves this DOM order.
- **Population:** use only available public content. With one item, use a
  full-width lead. With two items, use the 8/4 split. With three or more, use
  the full 12-column pattern. Missing content closes the gap.
- **Priority:** Moment imagery owns more area than Journal text at every width.
- **Loading/error:** the static build has no runtime loading state. Broken or
  invalid content is a build failure, not an in-page spinner.

### ChronologicalTimeline

- **Structure:** one heading followed by anchors interleaving public Moments
  and Journal entries in descending publication order.
- **Row:** real date, title/caption, optional excerpt, and kind label. The newest
  row receives the orange dot; all others use an outlined dot.
- **States:** a soft pseudo-surface fades in while the row's inner content moves
  4px using transform. Do not animate padding, width, or other layout values.
- **Empty state:** one localized row states that no public entries exist.
- **Accessibility:** dates use semantic `time`; each row has one clear link
  purpose and visible keyboard focus.

### EmptyState, SkipLink, and Footer

- **EmptyState:** bordered quiet surface, localized plain language, no icon
  required, no invented date or content preview.
- **SkipLink:** first focusable element; hidden at rest and visible on focus;
  targets the page's `main` landmark.
- **Footer:** site name, localized Hello label, and compact locale summary. It
  repeats no fake biography and contains only configured external links.

## 6. Motion & Interaction

Motion is restrained and only confirms interaction. The page has no cinematic
entrance, parallax, auto-playing loop, custom cursor, or decorative perpetual
animation.

### Timing

| Token | Duration | Easing | Usage |
| --- | --- | --- | --- |
| `--motion-micro` | 150ms | `ease-out` | Tooltip opacity/translate |
| `--motion-control` | 180ms | `ease` | Menu glyph, icon and arrow transforms |
| `--motion-card` | 260ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Linked card foreground/rear movement |

### Rules

- Animated properties are limited to `transform` and `opacity`. State color or
  background changes are immediate or implemented with an opacity layer.
- Journal and linked Moment cards move as one affordance; decorative image
  surfaces never lift on their own.
- Social icons move upward 2px; linked card layers move 4px; no other element
  exceeds that distance.
- The mobile menu uses a small opacity/translate transition and remains
  operable when animation is disabled.
- `prefers-reduced-motion: reduce` disables smooth scrolling and sets
  non-essential transition durations to effectively zero. No content or state
  is withheld.
- Hover is never the only state. Every hover affordance has keyboard focus and
  coarse-pointer behavior.

## 7. Depth & Surface

The depth strategy is **mixed but border-led**. Most hierarchy comes from white
space, 1px lines, and one hard offset layer; soft shadows are rare.

### Surface recipes

| Surface | Recipe |
| --- | --- |
| Header | 70% white, 12px backdrop blur, 1px lower/side line |
| Standard card | White, 1px strong line, 18px radius, no soft shadow |
| Offset card | Standard card plus dashed rear line offset 6px down/right |
| Brand mark | Orange fill, 1px ink border, `3px 3px 0` ink shadow |
| Mobile menu | White, 1px ink border, 14px radius, `5px 5px 0` ink shadow |
| Tooltip | White, 1px ink border, 5px radius, `2px 2px 0` ink shadow |
| Section pill | White, 1px subtle line, full radius, `0 2px 8px rgba(11,12,15,.04)` |

### Grid and media treatment

- The hero grid uses 96px cells on desktop/tablet and 56px cells on mobile,
  1px near-black lines at approximately 9–10% opacity, and a vertical fade into
  white. It is decorative and `aria-hidden`.
- Only labels use full-pill radii. Cards and large surfaces never become pills.
- Real photos carry the visual richness. The interface adds no texture, fake
  film grain, sepia treatment, glossy overlay, or heavy shadow.
- The abstract no-photo artwork uses the defined blue, pale blue, peach,
  orange, cream, and deep ink tokens. It is a truthful empty illustration, not
  a substitute personal photograph.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target **WCAG 2.2 AA**. Normal text must reach 4.5:1 contrast, large text and
  essential non-text UI 3:1.
- Every link and button has a visible 3px `--color-accent` focus outline with a
  4px offset. Focus is never removed or represented by color alone.
- All primary touch controls are at least 44×44px on coarse pointers. The
  compact social-icon row may use 32×32px only on fine pointers.
- Navigation, locale switching, mobile-menu opening/closing, social links,
  cards, timeline rows, and the skip link are fully keyboard reachable.
- Mobile disclosure state is programmatically exposed; Escape closes it and
  restores focus. Content order remains logical with CSS disabled.
- Each page declares its real locale on `html`. Language-switch anchors expose
  `hreflang`, full accessible names, and current state.
- Meaningful images have localized alt text before publication. Decorative
  grid/abstract layers are hidden from assistive technology.
- Text remains legible at 200% zoom, with long French strings, Chinese text,
  empty data, and unbroken external URLs. Primary content never scrolls
  horizontally.
- Reduced-motion users lose only transforms and smooth scrolling, never
  content, affordances, or route access.
- Plain copy is preferred over clever labels. Tooltips repeat accessible names
  and never contain essential information.

### Accepted debt

| Item | Location | Why accepted | Owner / exit condition |
| --- | --- | --- | --- |
| Real personal photography is not yet supplied | Hero and Moments | The plan forbids invention; a truthful abstract hero and localized empty state are safer | Frankie supplies curated web-ready images and localized alt text |
| Social account URLs are not yet supplied | `SocialLinks` data | The user approved the icon set, not fabricated handles | Frankie supplies each desired URL/address; unconfigured icons remain absent |
| Real-photo crop behavior has only been proven with abstract stand-ins | PhotoFrame variants | Task 1 validates geometry, not unknown future photographs | Re-run visual QA when the first real images are added |

No accessibility debt is accepted. Any implementation finding that affects
keyboard access, contrast, localization, motion safety, alt text, or primary
task completion blocks release until fixed or explicitly accepted by the user
with affected users and an exit condition recorded here.

### Required implementation evidence

- Before product pages, exercise the reusable primitives and required states at
  375, 768, and 1280 px in a showcase or equivalent state harness.
- For the finished site, run real-browser visual QA for every route family,
  locale, hover/focus/active state, mobile menu, language fallback, empty state,
  reduced motion, CJK rendering, and horizontal overflow.
- Verify the final implementation against the reference grammar and this
  contract, not against the prototype's fake text or placeholder destinations.
- No UI component may be created until the user explicitly approves this file
  as the Open design gate decision.

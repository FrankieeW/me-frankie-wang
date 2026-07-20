import assert from "node:assert/strict";
import test from "node:test";

import { z } from "astro/zod";

import {
  getSocialLinks,
  SOCIAL_LINKS,
  SOCIAL_SERVICE_ORDER,
} from "../data/site.ts";
import { TOPIC_KEYS, TOPICS } from "../data/topics.ts";
import {
  getFeedPath,
  getLocalizedPath,
  getTopicPath,
  LOCALES,
  parseLocale,
  type Locale,
} from "../i18n/config.ts";
import { UI_TRANSLATIONS } from "../i18n/translations.ts";
import {
  getAvailableTranslations,
  getLocaleFeedItems,
  getPublishedEntries,
} from "./content.ts";
import {
  createJournalSchema,
  createMomentSchema,
} from "./authoring.ts";
import {
  getCanonicalUrl,
  getCoreLocalePaths,
  getEntryLocalePaths,
} from "./seo.ts";

type TestEntry = {
  readonly id: string;
  readonly data: {
    readonly locale: Locale;
    readonly translationKey: string;
    readonly publishedAt: Date;
    readonly draft: boolean;
  };
};

const entries = [
  {
    id: "weekend/en",
    data: {
      locale: "en",
      translationKey: "weekend",
      publishedAt: new Date("2026-07-10T10:00:00Z"),
      draft: false,
    },
  },
  {
    id: "weekend/zh",
    data: {
      locale: "zh",
      translationKey: "weekend",
      publishedAt: new Date("2026-07-10T10:00:00Z"),
      draft: true,
    },
  },
  {
    id: "today/fr",
    data: {
      locale: "fr",
      translationKey: "today",
      publishedAt: new Date("2026-07-18T08:00:00Z"),
      draft: false,
    },
  },
  {
    id: "weekend/fr",
    data: {
      locale: "fr",
      translationKey: "weekend",
      publishedAt: new Date("2026-07-10T10:00:00Z"),
      draft: false,
    },
  },
] as const satisfies readonly TestEntry[];

const testImageSchema = z.string().trim().min(1);

const journalMetadata = {
  locale: "en",
  translationKey: "entry",
  publishedAt: "2026-07-20",
  draft: false,
  title: "Entry",
  summary: "Summary",
} as const;

const momentMetadata = {
  locale: "en",
  translationKey: "moment",
  publishedAt: "2026-07-20",
  draft: false,
  caption: "Moment",
  takenAt: "2026-07-20",
} as const;

const validVideo = {
  src: "/media/clip.mp4",
  poster: "poster.jpg",
  posterAlt: "A still frame from the clip",
  title: "Short clip",
  captions: "/media/clip.vtt",
} as const;

test("publishes the finite localized topic catalog", () => {
  // Given / When
  const keys = TOPIC_KEYS;

  // Then
  assert.deepEqual(keys, ["daily", "travel", "reading"]);
  assert.deepEqual(TOPICS, {
    daily: {
      label: { en: "Daily life", zh: "日常", fr: "Quotidien" },
    },
    travel: {
      label: { en: "Travel", zh: "旅行", fr: "Voyage" },
    },
    reading: {
      label: { en: "Reading", zh: "阅读", fr: "Lecture" },
    },
  });
});

test("builds locale-specific topic paths", () => {
  assert.equal(getTopicPath("fr", "reading"), "/fr/topics/reading/");
});

test("builds locale-specific feed paths", () => {
  assert.equal(getFeedPath("zh"), "/zh/feed.xml");
});

test("provides localized discovery interface copy", () => {
  const discoveryCopy = LOCALES.map((locale) => UI_TRANSLATIONS[locale].discovery);

  assert.deepEqual(discoveryCopy, [
    {
      topics: "Topics",
      topic: "Topic",
      searchJournal: "Search Journal",
      searchMoments: "Search Moments",
      searchPlaceholder: "Search public entries",
      searchResults: "Results: {count}",
      searchNoResults: "No matching entries.",
      tableOfContents: "On this page",
      tableOfContentsSummary: "Show contents",
      places: "Places",
      lived: "Lived",
      visited: "Visited",
      friends: "Friends",
      history: "Site history",
      transcript: "Read transcript",
      since: "Since 2026",
    },
    {
      topics: "主题",
      topic: "主题",
      searchJournal: "搜索随笔",
      searchMoments: "搜索片刻",
      searchPlaceholder: "搜索公开内容",
      searchResults: "结果：{count}",
      searchNoResults: "没有匹配的内容。",
      tableOfContents: "本文目录",
      tableOfContentsSummary: "展开目录",
      places: "去过的地方",
      lived: "居住过",
      visited: "到访过",
      friends: "朋友们",
      history: "网站沿革",
      transcript: "阅读文字稿",
      since: "始于 2026",
    },
    {
      topics: "Sujets",
      topic: "Sujet",
      searchJournal: "Rechercher dans le Journal",
      searchMoments: "Rechercher dans les Instants",
      searchPlaceholder: "Rechercher dans les contenus publics",
      searchResults: "Résultats : {count}",
      searchNoResults: "Aucun contenu correspondant.",
      tableOfContents: "Sur cette page",
      tableOfContentsSummary: "Afficher le sommaire",
      places: "Lieux",
      lived: "Habité",
      visited: "Visité",
      friends: "Amis",
      history: "Histoire du site",
      transcript: "Lire la transcription",
      since: "Depuis 2026",
    },
  ]);
});

test("rejects an unknown topic", () => {
  // Given
  const schema = createJournalSchema(testImageSchema);

  // When
  const result = schema.safeParse({
    ...journalMetadata,
    topics: ["unknown"],
  });

  // Then
  assert.equal(result.success, false);
});

test("rejects a repeated topic", () => {
  // Given
  const schema = createJournalSchema(testImageSchema);

  // When
  const result = schema.safeParse({
    ...journalMetadata,
    topics: ["daily", "daily"],
  });

  // Then
  assert.equal(result.success, false);
});

test("rejects a Moment without an image or video", () => {
  // Given
  const schema = createMomentSchema(testImageSchema);

  // When
  const result = schema.safeParse(momentMetadata);

  // Then
  assert.equal(result.success, false);
});

test("rejects a remote Moment video source", () => {
  // Given
  const schema = createMomentSchema(testImageSchema);

  // When
  const result = schema.safeParse({
    ...momentMetadata,
    video: {
      ...validVideo,
      src: "https://video.example/clip.mp4",
    },
  });

  // Then
  assert.equal(result.success, false);
});

test("accepts a video-only Moment with accessibility metadata", () => {
  // Given
  const schema = createMomentSchema(testImageSchema);

  // When
  const result = schema.safeParse({
    ...momentMetadata,
    video: validVideo,
  });

  // Then
  assert.equal(result.success, true);
});

test("requires Moment video captions", () => {
  // Given
  const schema = createMomentSchema(testImageSchema);
  const { captions: _captions, ...videoWithoutCaptions } = validVideo;

  // When
  const result = schema.safeParse({
    ...momentMetadata,
    video: videoWithoutCaptions,
  });

  // Then
  assert.equal(result.success, false);
});

test("requires a Journal video poster alternative", () => {
  // Given
  const schema = createJournalSchema(testImageSchema);
  const { posterAlt: _posterAlt, ...videoWithoutPosterAlt } = validVideo;

  // When
  const result = schema.safeParse({
    ...journalMetadata,
    leadMedia: {
      type: "video",
      ...videoWithoutPosterAlt,
    },
  });

  // Then
  assert.equal(result.success, false);
});

test("requires a Journal audio transcript", () => {
  // Given
  const schema = createJournalSchema(testImageSchema);

  // When
  const result = schema.safeParse({
    ...journalMetadata,
    leadMedia: {
      type: "audio",
      src: "/media/voice.mp3",
      title: "Voice note",
    },
  });

  // Then
  assert.equal(result.success, false);
});

test("parses each supported locale", () => {
  // Given
  const routeSegments = ["en", "zh", "fr"] as const;

  // When
  const locales = routeSegments.map((segment) => parseLocale(segment));

  // Then
  assert.deepEqual(locales, ["en", "zh", "fr"]);
});

test("rejects unsupported locale route segments", () => {
  // Given
  const routeSegments = ["de", "english", "", undefined] as const;

  // When
  const locales = routeSegments.map((segment) => parseLocale(segment));

  // Then
  assert.deepEqual(locales, [undefined, undefined, undefined, undefined]);
});

test("builds only approved localized paths", () => {
  // Given
  const routes = ["home", "journal", "moments", "hello"] as const;

  // When
  const paths = routes.map((route) => getLocalizedPath("zh", route));

  // Then
  assert.deepEqual(paths, [
    "/zh/",
    "/zh/journal/",
    "/zh/moments/",
    "/zh/hello/",
  ]);
});

test("returns public entries in descending publication order", () => {
  // Given
  const allEntries = entries;

  // When
  const publishedEntries = getPublishedEntries(allEntries);

  // Then
  assert.deepEqual(
    publishedEntries.map((entry) => entry.id),
    ["today/fr", "weekend/en", "weekend/fr"],
  );
});

test("returns public translations in supported locale order", () => {
  // Given
  const allEntries = entries;

  // When
  const translations = getAvailableTranslations(allEntries, "weekend");

  // Then
  assert.deepEqual(
    translations.map((entry) => entry.data.locale),
    ["en", "fr"],
  );
});

test("preserves equivalent routes on core-page language switches", () => {
  // Given
  const route = "journal";

  // When
  const paths = getCoreLocalePaths(route);

  // Then
  assert.deepEqual(paths, {
    en: "/en/journal/",
    zh: "/zh/journal/",
    fr: "/fr/journal/",
  });
});

test("falls back missing entry translations without publishing false alternates", () => {
  // Given
  const availableLocales = ["en", "fr"] as const;

  // When
  const paths = getEntryLocalePaths("moments", "weekend", availableLocales);

  // Then
  assert.deepEqual(paths, {
    switchPaths: {
      en: "/en/moments/weekend/",
      zh: "/zh/moments/",
      fr: "/fr/moments/weekend/",
    },
    alternatePaths: {
      en: "/en/moments/weekend/",
      zh: undefined,
      fr: "/fr/moments/weekend/",
    },
  });
});

test("builds canonical URLs from the configured production origin", () => {
  // Given
  const localizedPath = "/zh/hello/";

  // When
  const canonicalUrl = getCanonicalUrl(localizedPath);

  // Then
  assert.equal(canonicalUrl, "https://me.frankie.wang/zh/hello/");
});

test("provides a localized home purpose for the visible brand label", () => {
  assert.deepEqual(
    LOCALES.map(
      (locale) => UI_TRANSLATIONS[locale].accessibility.homeLink,
    ),
    ["Home", "首页", "Accueil"],
  );
});

test("publishes verified social links in the approved service order", () => {
  // Given
  const approvedOrder = new Map(
    SOCIAL_SERVICE_ORDER.map((service, index) => [service, index]),
  );

  // When
  const links = SOCIAL_LINKS.map((link) => ({
    ...link,
    order: approvedOrder.get(link.service),
  }));

  // Then
  assert.deepEqual(links, [
    {
      service: "website",
      href: "https://frankie.wang/",
      rel: "me",
      order: 0,
    },
    {
      service: "instagram",
      href: "https://www.instagram.com/frankiefcw/",
      rel: "me",
      order: 1,
    },
    {
      service: "x",
      href: "https://x.com/frankiefcw",
      rel: "me",
      order: 2,
    },
    {
      service: "github",
      href: "https://github.com/FrankieeW",
      rel: "me",
      order: 3,
    },
    {
      service: "email",
      href: "mailto:me@frankie.wang",
      rel: "me",
      order: 6,
    },
    {
      service: "rss",
      href: {
        en: "/en/feed.xml",
        zh: "/zh/feed.xml",
        fr: "/fr/feed.xml",
      },
      order: 8,
    },
  ]);
});

test("resolves the RSS social link for the active locale", () => {
  const links = getSocialLinks("zh");

  assert.deepEqual(links.at(-1), {
    service: "rss",
    href: "/zh/feed.xml",
  });
});

test("builds public locale feed items in descending publication order", () => {
  const journalEntries = [
    {
      id: "journal-public",
      data: {
        locale: "en",
        translationKey: "journal-public",
        publishedAt: new Date("2026-07-10T10:00:00Z"),
        draft: false,
        title: "Public journal",
        summary: "A public summary.",
      },
    },
    {
      id: "journal-draft",
      data: {
        locale: "en",
        translationKey: "journal-draft",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: true,
        title: "Draft journal",
        summary: "This must stay private.",
      },
    },
    {
      id: "journal-fr",
      data: {
        locale: "fr",
        translationKey: "journal-fr",
        publishedAt: new Date("2026-07-18T10:00:00Z"),
        draft: false,
        title: "Journal français",
        summary: "Une note publique.",
      },
    },
  ] as const;
  const momentEntries = [
    {
      id: "moment-public",
      data: {
        locale: "en",
        translationKey: "moment-public",
        publishedAt: new Date("2026-07-12T10:00:00Z"),
        draft: false,
        caption: "A public moment.",
        location: "London",
      },
    },
  ] as const;

  const items = getLocaleFeedItems(journalEntries, momentEntries, "en");

  assert.deepEqual(items, [
    {
      title: "A public moment.",
      description: "A public moment. — London",
      link: "/en/moments/moment-public/",
      pubDate: new Date("2026-07-12T10:00:00Z"),
    },
    {
      title: "Public journal",
      description: "A public summary.",
      link: "/en/journal/journal-public/",
      pubDate: new Date("2026-07-10T10:00:00Z"),
    },
  ]);
});

test("provides every localized homepage composition label", () => {
  // Given
  const requiredKeys = [
    "indexLabel",
    "scrapbookLabel",
    "scrapbookIndex",
    "scrapbookTitle",
    "scrapbookDescription",
    "timelineIndex",
    "timelineTitle",
    "timelineDescription",
    "backToTop",
  ];

  // When
  const keysByLocale = LOCALES.map((locale) => {
    const translation = UI_TRANSLATIONS[locale];
    const home =
      "home" in translation &&
      typeof translation.home === "object" &&
      translation.home !== null
        ? translation.home
        : {};
    return Object.keys(home);
  });

  // Then
  assert.deepEqual(keysByLocale, LOCALES.map(() => requiredKeys));
});

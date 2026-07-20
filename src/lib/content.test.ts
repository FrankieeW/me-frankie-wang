import assert from "node:assert/strict";
import test from "node:test";

import {
  SOCIAL_LINKS,
  SOCIAL_SERVICE_ORDER,
} from "../data/site.ts";
import {
  getLocalizedPath,
  LOCALES,
  parseLocale,
  type Locale,
} from "../i18n/config.ts";
import { UI_TRANSLATIONS } from "../i18n/translations.ts";
import {
  getAvailableTranslations,
  getPublishedEntries,
} from "./content.ts";
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

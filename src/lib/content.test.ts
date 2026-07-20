import assert from "node:assert/strict";
import test from "node:test";

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
  const routeSegments = ["en", "zh", "fr"] as const;
  const locales = routeSegments.map((segment) => parseLocale(segment));

  assert.deepEqual(locales, ["en", "zh", "fr"]);
});

test("rejects unsupported locale route segments", () => {
  const routeSegments = ["de", "english", "", undefined] as const;
  const locales = routeSegments.map((segment) => parseLocale(segment));

  assert.deepEqual(locales, [undefined, undefined, undefined, undefined]);
});

test("builds only approved localized paths", () => {
  const routes = ["home", "journal", "moments", "hello"] as const;
  const paths = routes.map((route) => getLocalizedPath("zh", route));

  assert.deepEqual(paths, [
    "/zh/",
    "/zh/journal/",
    "/zh/moments/",
    "/zh/hello/",
  ]);
});

test("returns public entries in descending publication order", () => {
  const publishedEntries = getPublishedEntries(entries);

  assert.deepEqual(
    publishedEntries.map((entry) => entry.id),
    ["today/fr", "weekend/en", "weekend/fr"],
  );
});

test("returns public translations in supported locale order", () => {
  const translations = getAvailableTranslations(entries, "weekend");

  assert.deepEqual(
    translations.map((entry) => entry.data.locale),
    ["en", "fr"],
  );
});

test("preserves equivalent routes on core-page language switches", () => {
  assert.deepEqual(getCoreLocalePaths("journal"), {
    en: "/en/journal/",
    zh: "/zh/journal/",
    fr: "/fr/journal/",
  });
});

test("falls back missing entry translations without publishing false alternates", () => {
  const paths = getEntryLocalePaths("moments", "weekend", ["en", "fr"]);

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
  assert.equal(
    getCanonicalUrl("/zh/hello/"),
    "https://me.frankie.wang/zh/hello/",
  );
});

test("provides a localized home purpose for the visible brand label", () => {
  assert.deepEqual(
    LOCALES.map(
      (locale) => UI_TRANSLATIONS[locale].accessibility.homeLink,
    ),
    ["Home", "首页", "Accueil"],
  );
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  getLocalizedPath,
  parseLocale,
  type Locale,
} from "../i18n/config.ts";
import {
  getAvailableTranslations,
  getPublishedEntries,
} from "./content.ts";

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

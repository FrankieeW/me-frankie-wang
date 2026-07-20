import assert from "node:assert/strict";
import test from "node:test";

import { TOPICS, TOPIC_KEYS } from "../data/topics.ts";
import { getTopicPath } from "../i18n/config.ts";
import {
  getTopicEntries,
  getTopicLinks,
  getTopicRouteMatrix,
} from "./content.ts";

test("publishes the finite localized topic catalog", () => {
  assert.deepEqual(TOPIC_KEYS, ["daily", "travel", "reading"]);
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

test("returns public topic entries in descending publication order", () => {
  const entries = [
    {
      id: "older-zh",
      data: {
        locale: "zh",
        translationKey: "older",
        publishedAt: new Date("2026-07-10T10:00:00Z"),
        draft: false,
        topics: ["travel"],
      },
    },
    {
      id: "newer-zh",
      data: {
        locale: "zh",
        translationKey: "newer",
        publishedAt: new Date("2026-07-18T10:00:00Z"),
        draft: false,
        topics: ["daily", "travel"],
      },
    },
    {
      id: "draft-zh",
      data: {
        locale: "zh",
        translationKey: "draft",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: true,
        topics: ["travel"],
      },
    },
    {
      id: "travel-en",
      data: {
        locale: "en",
        translationKey: "travel-en",
        publishedAt: new Date("2026-07-19T10:00:00Z"),
        draft: false,
        topics: ["travel"],
      },
    },
  ] as const;

  const matchingEntries = getTopicEntries(entries, "zh", "travel");

  assert.deepEqual(
    matchingEntries.map((entry) => entry.id),
    ["newer-zh", "older-zh"],
  );
});

test("generates only public locale-topic route combinations", () => {
  const entries = [
    {
      id: "public-zh",
      data: {
        locale: "zh",
        translationKey: "public",
        publishedAt: new Date("2026-07-18T10:00:00Z"),
        draft: false,
        topics: ["travel"],
      },
    },
    {
      id: "draft-en",
      data: {
        locale: "en",
        translationKey: "draft",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: true,
        topics: ["reading"],
      },
    },
  ] as const;

  assert.deepEqual(getTopicRouteMatrix(entries, []), [
    { locale: "zh", topic: "travel" },
  ]);
});

test("builds localized topic links in author order", () => {
  assert.deepEqual(getTopicLinks("fr", ["travel", "reading"]), [
    {
      topic: "travel",
      label: "Voyage",
      href: "/fr/topics/travel/",
    },
    {
      topic: "reading",
      label: "Lecture",
      href: "/fr/topics/reading/",
    },
  ]);
});

import assert from "node:assert/strict";
import test from "node:test";

import { LOCALES } from "../i18n/config.ts";
import { UI_TRANSLATIONS } from "../i18n/translations.ts";

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
      captions: "Captions",
      since: "Since {year}",
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
      captions: "字幕",
      since: "始于 {year}",
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
      captions: "Sous-titres",
      since: "Depuis {year}",
    },
  ]);
});

test("provides every localized homepage composition label", () => {
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
  const keysByLocale = LOCALES.map((locale) => Object.keys(UI_TRANSLATIONS[locale].home));

  assert.deepEqual(keysByLocale, LOCALES.map(() => requiredKeys));
});

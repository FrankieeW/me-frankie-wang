import assert from "node:assert/strict";
import test from "node:test";

import {
  createJournalSearchDocuments,
  createMomentSearchDocuments,
  matchesSearchQuery,
  normalizeSearchText,
  SEARCH_ENTRY_THRESHOLD,
  shouldEnableSearch,
  type SearchDocument,
} from "./content.ts";

function createSearchDocument(id: string): SearchDocument {
  return {
    id,
    url: `/en/journal/${id}/`,
    title: `Entry ${id}`,
    summary: undefined,
    body: "",
    topics: [],
    location: undefined,
    searchText: normalizeSearchText(`Entry ${id}`),
  };
}

test("enables search at exactly ten public documents", () => {
  const documents = Array.from({ length: 10 }, (_, index) =>
    createSearchDocument(String(index)),
  );

  assert.equal(SEARCH_ENTRY_THRESHOLD, 10);
  assert.equal(shouldEnableSearch(documents.slice(0, 9)), false);
  assert.equal(shouldEnableSearch(documents), true);
});

test("builds Journal documents from every required searchable field", () => {
  const entries = [
    {
      id: "cafe-notes",
      body: "Body text about café walks.",
      data: {
        locale: "en",
        translationKey: "cafe-notes",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: false,
        topics: ["travel"],
        title: "Café notes",
        summary: "Walking around London.",
      },
    },
    {
      id: "draft-notes",
      body: "Private body.",
      data: {
        locale: "en",
        translationKey: "draft-notes",
        publishedAt: new Date("2026-07-21T10:00:00Z"),
        draft: true,
        topics: ["reading"],
        title: "Draft notes",
        summary: "Private summary.",
      },
    },
    {
      id: "notes-fr",
      body: "Texte français.",
      data: {
        locale: "fr",
        translationKey: "notes-fr",
        publishedAt: new Date("2026-07-19T10:00:00Z"),
        draft: false,
        topics: ["travel"],
        title: "Notes françaises",
        summary: "Une promenade.",
      },
    },
  ] as const;

  const documents = createJournalSearchDocuments(entries, "en");

  assert.deepEqual(documents, [
    {
      id: "cafe-notes",
      url: "/en/journal/cafe-notes/",
      title: "Café notes",
      summary: "Walking around London.",
      body: "Body text about café walks.",
      topics: ["Travel"],
      location: undefined,
      searchText:
        "cafe notes walking around london. body text about cafe walks. travel ",
    },
  ]);
});

test("builds Moment documents with caption, body, topic, and location", () => {
  const entries = [
    {
      id: "river-walk",
      body: "A short walk after rain.",
      data: {
        locale: "en",
        translationKey: "river-walk",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: false,
        topics: ["daily"],
        caption: "River walk",
        location: "London",
      },
    },
  ] as const;

  const documents = createMomentSearchDocuments(entries, "en");

  assert.deepEqual(documents, [
    {
      id: "river-walk",
      url: "/en/moments/river-walk/",
      title: "River walk",
      summary: undefined,
      body: "A short walk after rain.",
      topics: ["Daily life"],
      location: "London",
      searchText:
        "river walk  a short walk after rain. daily life london",
    },
  ]);
});

test("matches case and diacritic insensitive substrings", () => {
  const document = {
    ...createSearchDocument("cafe"),
    searchText: normalizeSearchText("A CAFÉ in London"),
  };

  assert.equal(matchesSearchQuery(document, "cafe"), true);
});

test("requires every space-separated query term", () => {
  const document = {
    ...createSearchDocument("travel"),
    searchText: normalizeSearchText("Travel notes from London"),
  };

  assert.equal(matchesSearchQuery(document, "travel london"), true);
  assert.equal(matchesSearchQuery(document, "travel paris"), false);
});

test("matches direct CJK substrings and treats whitespace as no filter", () => {
  const document = {
    ...createSearchDocument("旅行"),
    searchText: normalizeSearchText("伦敦旅行随记"),
  };

  assert.equal(matchesSearchQuery(document, "旅行"), true);
  assert.equal(matchesSearchQuery(document, "   "), true);
});

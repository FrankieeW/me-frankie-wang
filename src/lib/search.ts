import { TOPICS, type TopicKey } from "../data/topics.ts";
import {
  getEntryPath,
  type EntryRoute,
  type Locale,
} from "../i18n/config.ts";

type SearchableEntry = {
  readonly id: string;
  readonly body?: string | undefined;
  readonly data: {
    readonly locale: Locale;
    readonly translationKey: string;
    readonly publishedAt: Date;
    readonly draft: boolean;
    readonly topics: readonly TopicKey[];
  };
};

type SearchableJournalEntry = SearchableEntry & {
  readonly data: SearchableEntry["data"] & {
    readonly title: string;
    readonly summary?: string | undefined;
  };
};

type SearchableMomentEntry = SearchableEntry & {
  readonly data: SearchableEntry["data"] & {
    readonly caption: string;
    readonly location?: string | undefined;
  };
};

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

export const SEARCH_ENTRY_THRESHOLD = 10;

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();
}

export function matchesSearchQuery(
  document: SearchDocument,
  query: string,
): boolean {
  return normalizeSearchText(query)
    .trim()
    .split(/\s+/u)
    .filter((term) => term.length > 0)
    .every((term) => document.searchText.includes(term));
}

export function shouldEnableSearch(
  documents: readonly SearchDocument[],
): boolean {
  return documents.length >= SEARCH_ENTRY_THRESHOLD;
}

function getPublicLocaleEntries<T extends SearchableEntry>(
  entries: readonly T[],
  locale: Locale,
): readonly T[] {
  return entries
    .filter((entry) => !entry.data.draft && entry.data.locale === locale)
    .toSorted(
      (left, right) =>
        right.data.publishedAt.getTime() - left.data.publishedAt.getTime(),
    );
}

function createSearchDocument<T extends SearchableEntry>(
  entry: T,
  locale: Locale,
  route: EntryRoute,
  title: string,
  summary: string | undefined,
  location: string | undefined,
): SearchDocument {
  const topics = entry.data.topics.map((topic) => TOPICS[topic].label[locale]);
  const body = entry.body ?? "";

  return {
    id: entry.id,
    url: getEntryPath(locale, route, entry.data.translationKey),
    title,
    summary,
    body,
    topics,
    location,
    searchText: normalizeSearchText(
      [title, summary ?? "", body, topics.join(" "), location ?? ""].join(" "),
    ),
  };
}

export function createJournalSearchDocuments(
  entries: readonly SearchableJournalEntry[],
  locale: Locale,
): readonly SearchDocument[] {
  return getPublicLocaleEntries(entries, locale).map((entry) =>
    createSearchDocument(
      entry,
      locale,
      "journal",
      entry.data.title,
      entry.data.summary,
      undefined,
    ),
  );
}

export function createMomentSearchDocuments(
  entries: readonly SearchableMomentEntry[],
  locale: Locale,
): readonly SearchDocument[] {
  return getPublicLocaleEntries(entries, locale).map((entry) =>
    createSearchDocument(
      entry,
      locale,
      "moments",
      entry.data.caption,
      undefined,
      entry.data.location,
    ),
  );
}

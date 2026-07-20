import {
  getEntryPath,
  getTopicPath,
  LOCALES,
  type Locale,
} from "../i18n/config.ts";
import {
  TOPICS,
  TOPIC_KEYS,
  type TopicKey,
} from "../data/topics.ts";

type TranslatedEntry = {
  readonly id: string;
  readonly data: {
    readonly locale: Locale;
    readonly translationKey: string;
    readonly publishedAt: Date;
    readonly draft: boolean;
  };
};

export function getPublishedEntries<T extends TranslatedEntry>(
  entries: readonly T[],
): readonly T[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .toSorted(
      (left, right) =>
        right.data.publishedAt.getTime() - left.data.publishedAt.getTime(),
    );
}

export function getAvailableTranslations<T extends TranslatedEntry>(
  entries: readonly T[],
  translationKey: string,
): readonly T[] {
  return getPublishedEntries(entries)
    .filter((entry) => entry.data.translationKey === translationKey)
    .toSorted(
      (left, right) =>
        LOCALES.indexOf(left.data.locale) - LOCALES.indexOf(right.data.locale),
    );
}

type JournalFeedEntry = TranslatedEntry & {
  readonly data: TranslatedEntry["data"] & {
    readonly title: string;
    readonly summary: string;
  };
};

type MomentFeedEntry = TranslatedEntry & {
  readonly data: TranslatedEntry["data"] & {
    readonly caption: string;
    readonly location?: string | undefined;
  };
};

export type SiteFeedItem = {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly pubDate: Date;
};

export function getLocaleFeedItems(
  journalEntries: readonly JournalFeedEntry[],
  momentEntries: readonly MomentFeedEntry[],
  locale: Locale,
): readonly SiteFeedItem[] {
  const journalItems = getPublishedEntries(journalEntries)
    .filter((entry) => entry.data.locale === locale)
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: getEntryPath(locale, "journal", entry.data.translationKey),
      pubDate: entry.data.publishedAt,
    }));
  const momentItems = getPublishedEntries(momentEntries)
    .filter((entry) => entry.data.locale === locale)
    .map((entry) => ({
      title: entry.data.caption,
      description:
        entry.data.location === undefined
          ? entry.data.caption
          : `${entry.data.caption} — ${entry.data.location}`,
      link: getEntryPath(locale, "moments", entry.data.translationKey),
      pubDate: entry.data.publishedAt,
    }));

  return [...journalItems, ...momentItems].toSorted(
    (left, right) => right.pubDate.getTime() - left.pubDate.getTime(),
  );
}

type TopicAwareEntry = TranslatedEntry & {
  readonly data: TranslatedEntry["data"] & {
    readonly topics: readonly TopicKey[];
  };
};

export type TopicRoute = {
  readonly locale: Locale;
  readonly topic: TopicKey;
};

export function getTopicEntries<T extends TopicAwareEntry>(
  entries: readonly T[],
  locale: Locale,
  topic: TopicKey,
): readonly T[] {
  return getPublishedEntries(entries).filter(
    (entry) =>
      entry.data.locale === locale && entry.data.topics.includes(topic),
  );
}

export function getTopicRouteMatrix(
  journalEntries: readonly TopicAwareEntry[],
  momentEntries: readonly TopicAwareEntry[],
): readonly TopicRoute[] {
  const entries = [...journalEntries, ...momentEntries];

  return LOCALES.flatMap((locale) =>
    TOPIC_KEYS.flatMap((topic) =>
      getTopicEntries(entries, locale, topic).length === 0
        ? []
        : [{ locale, topic }],
    ),
  );
}

export type TopicLink = {
  readonly topic: TopicKey;
  readonly label: string;
  readonly href: string;
};

export function getTopicLinks(
  locale: Locale,
  topics: readonly TopicKey[],
): readonly TopicLink[] {
  return topics.map((topic) => ({
    topic,
    label: TOPICS[topic].label[locale],
    href: getTopicPath(locale, topic),
  }));
}

export {
  createJournalSearchDocuments,
  createMomentSearchDocuments,
  matchesSearchQuery,
  normalizeSearchText,
  SEARCH_ENTRY_THRESHOLD,
  shouldEnableSearch,
} from "./search.ts";
export type { SearchDocument } from "./search.ts";

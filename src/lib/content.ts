import {
  getEntryPath,
  LOCALES,
  type Locale,
} from "../i18n/config.ts";

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

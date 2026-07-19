import { LOCALES, type Locale } from "../i18n/config.ts";

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

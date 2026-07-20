import { SITE } from "../data/site.ts";
import {
  getEntryPath,
  getLocalizedPath,
  type EntryRoute,
  type Locale,
  type LocalizedRoute,
} from "../i18n/config.ts";

export type LocalePathMap = Readonly<Record<Locale, string>>;

export type AlternatePathMap = Readonly<
  Record<Locale, string | undefined>
>;

export type EntryLocalePaths = {
  readonly switchPaths: LocalePathMap;
  readonly alternatePaths: AlternatePathMap;
};

export function getCoreLocalePaths(route: LocalizedRoute): LocalePathMap {
  return {
    en: getLocalizedPath("en", route),
    zh: getLocalizedPath("zh", route),
    fr: getLocalizedPath("fr", route),
  };
}

export function getEntryLocalePaths(
  route: EntryRoute,
  translationKey: string,
  availableLocales: readonly Locale[],
): EntryLocalePaths {
  const alternatePaths = {
    en: availableLocales.includes("en")
      ? getEntryPath("en", route, translationKey)
      : undefined,
    zh: availableLocales.includes("zh")
      ? getEntryPath("zh", route, translationKey)
      : undefined,
    fr: availableLocales.includes("fr")
      ? getEntryPath("fr", route, translationKey)
      : undefined,
  } satisfies AlternatePathMap;

  return {
    switchPaths: {
      en: alternatePaths.en ?? getLocalizedPath("en", route),
      zh: alternatePaths.zh ?? getLocalizedPath("zh", route),
      fr: alternatePaths.fr ?? getLocalizedPath("fr", route),
    },
    alternatePaths,
  };
}

export function getCanonicalUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

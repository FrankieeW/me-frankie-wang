export const LOCALES = ["en", "zh", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS = {
  en: "EN",
  zh: "中",
  fr: "FR",
} as const satisfies Record<Locale, string>;

export const LOCALE_NAMES = {
  en: "English",
  zh: "中文",
  fr: "Français",
} as const satisfies Record<Locale, string>;

export type LocalizedRoute = "home" | "journal" | "moments" | "hello";

export type EntryRoute = Extract<LocalizedRoute, "journal" | "moments">;

const ROUTE_SEGMENTS = {
  home: "",
  journal: "journal",
  moments: "moments",
  hello: "hello",
} as const satisfies Record<LocalizedRoute, string>;

export function parseLocale(value: string | undefined): Locale | undefined {
  return LOCALES.find((locale) => locale === value);
}

export function getLocalizedPath(
  locale: Locale,
  route: LocalizedRoute,
): string {
  const segment = ROUTE_SEGMENTS[route];
  return segment === "" ? `/${locale}/` : `/${locale}/${segment}/`;
}

export function getEntryPath(
  locale: Locale,
  route: EntryRoute,
  translationKey: string,
): string {
  return `${getLocalizedPath(locale, route)}${translationKey}/`;
}

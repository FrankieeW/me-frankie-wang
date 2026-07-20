import type { Locale } from "../i18n/config.ts";

type SiteCopy = {
  readonly title: string;
  readonly titleLines: readonly [string, string] | undefined;
  readonly introduction: string;
};

export const SITE = {
  name: "me.frankie.wang",
  url: "https://me.frankie.wang",
} as const;

export const SITE_COPY = {
  en: {
    title: "Hi, I’m Frankie.",
    titleLines: undefined,
    introduction: "A small place for life, photographs, and notes.",
  },
  zh: {
    title: "你好，我是 Frankie。",
    titleLines: ["你好，", "我是 Frankie。"],
    introduction: "记录生活、照片与随笔的一小块地方。",
  },
  fr: {
    title: "Bonjour, je suis Frankie.",
    titleLines: ["Bonjour,", "je suis Frankie."],
    introduction:
      "Un petit espace pour la vie, les photographies et les notes.",
  },
} as const satisfies Record<Locale, SiteCopy>;

export const SOCIAL_SERVICE_ORDER = [
  "website",
  "instagram",
  "x",
  "github",
  "telegram",
  "bilibili",
  "email",
  "douban",
  "rss",
] as const;

export type SocialService = (typeof SOCIAL_SERVICE_ORDER)[number];

type SocialLinkConfiguration = {
  readonly service: SocialService;
  readonly href: string | Readonly<Record<Locale, string>>;
  readonly rel?: "me";
};

export type SocialLink = {
  readonly service: SocialService;
  readonly href: string;
  readonly rel?: "me";
};

export const SOCIAL_LINKS = [
  {
    service: "website",
    href: "https://frankie.wang/",
    rel: "me",
  },
  {
    service: "instagram",
    href: "https://www.instagram.com/frankiefcw/",
    rel: "me",
  },
  {
    service: "x",
    href: "https://x.com/frankiefcw",
    rel: "me",
  },
  {
    service: "github",
    href: "https://github.com/FrankieeW",
    rel: "me",
  },
  {
    service: "email",
    href: "mailto:me@frankie.wang",
    rel: "me",
  },
  {
    service: "rss",
    href: {
      en: "/en/feed.xml",
      zh: "/zh/feed.xml",
      fr: "/fr/feed.xml",
    },
  },
] as const satisfies readonly SocialLinkConfiguration[];

export function getSocialLinks(locale: Locale): readonly SocialLink[] {
  const configuredLinks: readonly SocialLinkConfiguration[] = SOCIAL_LINKS;

  return SOCIAL_SERVICE_ORDER.flatMap((service) =>
    configuredLinks
      .filter((link) => link.service === service)
      .map((link) => ({
        service: link.service,
        href: typeof link.href === "string" ? link.href : link.href[locale],
        ...(link.rel === undefined ? {} : { rel: link.rel }),
      })),
  );
}

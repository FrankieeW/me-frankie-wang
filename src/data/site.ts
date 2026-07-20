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
  "rss",
  "x",
  "github",
  "telegram",
  "bilibili",
  "email",
  "douban",
] as const;

export type SocialService = (typeof SOCIAL_SERVICE_ORDER)[number];

export type SocialLink = {
  readonly service: SocialService;
  readonly href: string;
  readonly rel?: "me";
};

export const SOCIAL_LINKS = [] as const satisfies readonly SocialLink[];

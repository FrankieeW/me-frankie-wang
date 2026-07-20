import type { Locale } from "../i18n/config.ts";

export const TOPIC_KEYS = ["daily", "travel", "reading"] as const;

export type TopicKey = (typeof TOPIC_KEYS)[number];

export type LocalizedText = Readonly<Record<Locale, string>>;

type TopicDefinition = {
  readonly label: LocalizedText;
};

export const TOPICS = {
  daily: {
    label: {
      en: "Daily life",
      zh: "日常",
      fr: "Quotidien",
    },
  },
  travel: {
    label: {
      en: "Travel",
      zh: "旅行",
      fr: "Voyage",
    },
  },
  reading: {
    label: {
      en: "Reading",
      zh: "阅读",
      fr: "Lecture",
    },
  },
} as const satisfies Readonly<Record<TopicKey, TopicDefinition>>;

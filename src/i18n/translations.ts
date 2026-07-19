import type { Locale, LocalizedRoute } from "./config.ts";

type NavigationRoute = Exclude<LocalizedRoute, "home">;

type UiTranslations = {
  readonly navigation: Readonly<Record<NavigationRoute, string>>;
  readonly emptyState: {
    readonly journal: string;
    readonly moments: string;
    readonly timeline: string;
  };
};

export const UI_TRANSLATIONS = {
  en: {
    navigation: {
      journal: "Journal",
      moments: "Moments",
      hello: "Hello",
    },
    emptyState: {
      journal: "No public journal entries yet.",
      moments: "No public moments yet.",
      timeline: "No public entries yet.",
    },
  },
  zh: {
    navigation: {
      journal: "随笔",
      moments: "片刻",
      hello: "你好",
    },
    emptyState: {
      journal: "还没有公开的随笔。",
      moments: "还没有公开的片刻。",
      timeline: "还没有公开内容。",
    },
  },
  fr: {
    navigation: {
      journal: "Journal",
      moments: "Instants",
      hello: "Bonjour",
    },
    emptyState: {
      journal: "Aucun texte public pour le moment.",
      moments: "Aucun instant public pour le moment.",
      timeline: "Aucun contenu public pour le moment.",
    },
  },
} as const satisfies Record<Locale, UiTranslations>;

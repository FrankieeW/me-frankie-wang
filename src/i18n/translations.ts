import type { Locale, LocalizedRoute } from "./config.ts";

type NavigationRoute = Exclude<LocalizedRoute, "home">;

type UiTranslations = {
  readonly navigation: Readonly<Record<NavigationRoute, string>>;
  readonly accessibility: {
    readonly skipToContent: string;
    readonly primaryNavigation: string;
    readonly languageNavigation: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly homeLink: string;
  };
  readonly metadata: {
    readonly published: string;
    readonly updated: string;
    readonly taken: string;
    readonly location: string;
  };
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
    accessibility: {
      skipToContent: "Skip to content",
      primaryNavigation: "Primary navigation",
      languageNavigation: "Choose language",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      homeLink: "Home",
    },
    metadata: {
      published: "Published",
      updated: "Updated",
      taken: "Taken",
      location: "Location",
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
    accessibility: {
      skipToContent: "跳到正文",
      primaryNavigation: "主导航",
      languageNavigation: "选择语言",
      openMenu: "打开导航菜单",
      closeMenu: "关闭导航菜单",
      homeLink: "首页",
    },
    metadata: {
      published: "发布于",
      updated: "更新于",
      taken: "拍摄于",
      location: "地点",
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
    accessibility: {
      skipToContent: "Aller au contenu",
      primaryNavigation: "Navigation principale",
      languageNavigation: "Choisir la langue",
      openMenu: "Ouvrir le menu de navigation",
      closeMenu: "Fermer le menu de navigation",
      homeLink: "Accueil",
    },
    metadata: {
      published: "Publié le",
      updated: "Mis à jour le",
      taken: "Pris le",
      location: "Lieu",
    },
    emptyState: {
      journal: "Aucun texte public pour le moment.",
      moments: "Aucun instant public pour le moment.",
      timeline: "Aucun contenu public pour le moment.",
    },
  },
} as const satisfies Record<Locale, UiTranslations>;

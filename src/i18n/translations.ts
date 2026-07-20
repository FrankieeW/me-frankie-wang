import type { Locale, LocalizedRoute } from "./config.ts";

type NavigationRoute = Exclude<LocalizedRoute, "home">;

type UiTranslations = {
  readonly navigation: Readonly<Record<NavigationRoute, string>>;
  readonly home: {
    readonly indexLabel: string;
    readonly scrapbookLabel: string;
    readonly scrapbookIndex: string;
    readonly scrapbookTitle: string;
    readonly scrapbookDescription: string;
    readonly timelineIndex: string;
    readonly timelineTitle: string;
    readonly timelineDescription: string;
    readonly backToTop: string;
  };
  readonly accessibility: {
    readonly skipToContent: string;
    readonly primaryNavigation: string;
    readonly languageNavigation: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly homeLink: string;
    readonly socialNavigation: string;
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
    home: {
      indexLabel: "Personal index / 001",
      scrapbookLabel: "Living scrapbook",
      scrapbookIndex: "01 / Moments",
      scrapbookTitle: "A living scrapbook.",
      scrapbookDescription:
        "Photographs lead here; notes and smaller fragments follow when there is something real to share.",
      timelineIndex: "02 / In order",
      timelineTitle: "The same life, in time.",
      timelineDescription:
        "A quieter chronological view of public moments and notes.",
      backToTop: "Back to the beginning",
    },
    accessibility: {
      skipToContent: "Skip to content",
      primaryNavigation: "Primary navigation",
      languageNavigation: "Choose language",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      homeLink: "Home",
      socialNavigation: "Social links",
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
    home: {
      indexLabel: "个人索引 / 001",
      scrapbookLabel: "生活拼贴",
      scrapbookIndex: "01 / 片刻",
      scrapbookTitle: "一册生活拼贴。",
      scrapbookDescription:
        "照片在前，随笔与零散片段只在有真实内容时出现。",
      timelineIndex: "02 / 按时间",
      timelineTitle: "同一段生活，按时间展开。",
      timelineDescription: "用更安静的时间顺序浏览公开的片刻与随笔。",
      backToTop: "回到开头",
    },
    accessibility: {
      skipToContent: "跳到正文",
      primaryNavigation: "主导航",
      languageNavigation: "选择语言",
      openMenu: "打开导航菜单",
      closeMenu: "关闭导航菜单",
      homeLink: "首页",
      socialNavigation: "社交链接",
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
    home: {
      indexLabel: "Index personnel / 001",
      scrapbookLabel: "Carnet vivant",
      scrapbookIndex: "01 / Instants",
      scrapbookTitle: "Un carnet vivant.",
      scrapbookDescription:
        "Les photographies ouvrent la voie ; les\u00a0notes et fragments suivent lorsqu’il y a quelque chose de réel à partager.",
      timelineIndex: "02 / Chronologie",
      timelineTitle: "La même vie, dans le temps.",
      timelineDescription:
        "Une vue chronologique plus calme des instants et textes publics.",
      backToTop: "Retour au début",
    },
    accessibility: {
      skipToContent: "Aller au contenu",
      primaryNavigation: "Navigation principale",
      languageNavigation: "Choisir la langue",
      openMenu: "Ouvrir le menu de navigation",
      closeMenu: "Fermer le menu de navigation",
      homeLink: "Accueil",
      socialNavigation: "Liens sociaux",
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

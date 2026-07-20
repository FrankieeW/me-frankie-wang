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
  readonly discovery: {
    readonly topics: string;
    readonly topic: string;
    readonly searchJournal: string;
    readonly searchMoments: string;
    readonly searchPlaceholder: string;
    readonly searchResults: string;
    readonly searchNoResults: string;
    readonly tableOfContents: string;
    readonly tableOfContentsSummary: string;
    readonly places: string;
    readonly lived: string;
    readonly visited: string;
    readonly friends: string;
    readonly history: string;
    readonly transcript: string;
    readonly captions: string;
    readonly since: string;
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
    discovery: {
      topics: "Topics",
      topic: "Topic",
      searchJournal: "Search Journal",
      searchMoments: "Search Moments",
      searchPlaceholder: "Search public entries",
      searchResults: "Results: {count}",
      searchNoResults: "No matching entries.",
      tableOfContents: "On this page",
      tableOfContentsSummary: "Show contents",
      places: "Places",
      lived: "Lived",
      visited: "Visited",
      friends: "Friends",
      history: "Site history",
      transcript: "Read transcript",
      captions: "Captions",
      since: "Since {year}",
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
    discovery: {
      topics: "主题",
      topic: "主题",
      searchJournal: "搜索随笔",
      searchMoments: "搜索片刻",
      searchPlaceholder: "搜索公开内容",
      searchResults: "结果：{count}",
      searchNoResults: "没有匹配的内容。",
      tableOfContents: "本文目录",
      tableOfContentsSummary: "展开目录",
      places: "去过的地方",
      lived: "居住过",
      visited: "到访过",
      friends: "朋友们",
      history: "网站沿革",
      transcript: "阅读文字稿",
      captions: "字幕",
      since: "始于 {year}",
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
    discovery: {
      topics: "Sujets",
      topic: "Sujet",
      searchJournal: "Rechercher dans le Journal",
      searchMoments: "Rechercher dans les Instants",
      searchPlaceholder: "Rechercher dans les contenus publics",
      searchResults: "Résultats : {count}",
      searchNoResults: "Aucun contenu correspondant.",
      tableOfContents: "Sur cette page",
      tableOfContentsSummary: "Afficher le sommaire",
      places: "Lieux",
      lived: "Habité",
      visited: "Visité",
      friends: "Amis",
      history: "Histoire du site",
      transcript: "Lire la transcription",
      captions: "Sous-titres",
      since: "Depuis {year}",
    },
  },
} as const satisfies Record<Locale, UiTranslations>;

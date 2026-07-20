import assert from "node:assert/strict";
import test from "node:test";

import {
  getSocialLinks,
  SOCIAL_LINKS,
  SOCIAL_SERVICE_ORDER,
} from "../data/site.ts";
import { getFeedPath } from "../i18n/config.ts";
import { getLocaleFeedItems } from "./content.ts";

test("builds locale-specific feed paths", () => {
  assert.equal(getFeedPath("zh"), "/zh/feed.xml");
});

test("publishes verified social links in the approved service order", () => {
  const approvedOrder = new Map(
    SOCIAL_SERVICE_ORDER.map((service, index) => [service, index]),
  );
  const links = SOCIAL_LINKS.map((link) => ({
    ...link,
    order: approvedOrder.get(link.service),
  }));

  assert.deepEqual(links, [
    {
      service: "website",
      href: "https://frankie.wang/",
      rel: "me",
      order: 0,
    },
    {
      service: "instagram",
      href: "https://www.instagram.com/frankiefcw/",
      rel: "me",
      order: 1,
    },
    {
      service: "x",
      href: "https://x.com/frankiefcw",
      rel: "me",
      order: 2,
    },
    {
      service: "github",
      href: "https://github.com/FrankieeW",
      rel: "me",
      order: 3,
    },
    {
      service: "email",
      href: "mailto:me@frankie.wang",
      rel: "me",
      order: 6,
    },
    {
      service: "rss",
      href: {
        en: "/en/feed.xml",
        zh: "/zh/feed.xml",
        fr: "/fr/feed.xml",
      },
      order: 8,
    },
  ]);
});

test("resolves the RSS social link for the active locale", () => {
  assert.deepEqual(getSocialLinks("zh").at(-1), {
    service: "rss",
    href: "/zh/feed.xml",
  });
});

test("builds public locale feed items in descending publication order", () => {
  const journalEntries = [
    {
      id: "journal-public",
      data: {
        locale: "en",
        translationKey: "journal-public",
        publishedAt: new Date("2026-07-10T10:00:00Z"),
        draft: false,
        title: "Public journal",
        summary: "A public summary.",
      },
    },
    {
      id: "journal-draft",
      data: {
        locale: "en",
        translationKey: "journal-draft",
        publishedAt: new Date("2026-07-20T10:00:00Z"),
        draft: true,
        title: "Draft journal",
        summary: "This must stay private.",
      },
    },
    {
      id: "journal-fr",
      data: {
        locale: "fr",
        translationKey: "journal-fr",
        publishedAt: new Date("2026-07-18T10:00:00Z"),
        draft: false,
        title: "Journal français",
        summary: "Une note publique.",
      },
    },
  ] as const;
  const momentEntries = [
    {
      id: "moment-public",
      data: {
        locale: "en",
        translationKey: "moment-public",
        publishedAt: new Date("2026-07-12T10:00:00Z"),
        draft: false,
        caption: "A public moment.",
        location: "London",
      },
    },
  ] as const;

  const items = getLocaleFeedItems(journalEntries, momentEntries, "en");

  assert.deepEqual(items, [
    {
      title: "A public moment.",
      description: "A public moment. — London",
      link: "/en/moments/moment-public/",
      pubDate: new Date("2026-07-12T10:00:00Z"),
    },
    {
      title: "Public journal",
      description: "A public summary.",
      link: "/en/journal/journal-public/",
      pubDate: new Date("2026-07-10T10:00:00Z"),
    },
  ]);
});

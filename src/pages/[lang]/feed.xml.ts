import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { SITE, SITE_COPY } from "../../data/site.ts";
import { LOCALES, parseLocale } from "../../i18n/config.ts";
import { getLocaleFeedItems } from "../../lib/content.ts";

export function getStaticPaths() {
  return LOCALES.map((locale) => ({
    params: { lang: locale },
  }));
}

export async function GET(context: APIContext): Promise<Response> {
  const locale = parseLocale(context.params["lang"]);

  if (locale === undefined) {
    return new Response("Not found", { status: 404 });
  }

  const [journalEntries, momentEntries] = await Promise.all([
    getCollection("journal"),
    getCollection("moments"),
  ]);

  return rss({
    title: `${SITE.name} — ${SITE_COPY[locale].title}`,
    description: SITE_COPY[locale].introduction,
    site: context.site ?? SITE.url,
    items: [...getLocaleFeedItems(journalEntries, momentEntries, locale)],
    customData: `<language>${locale}</language>`,
  });
}

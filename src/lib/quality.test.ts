import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { z } from "astro/zod";

const buildOutput = new URL("../../dist/", import.meta.url);

function readBuiltPage(relativePath: string): string {
  return readFileSync(new URL(relativePath, buildOutput), "utf8");
}

function getTags(html: string, tagName: string): readonly string[] {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g"))].map(
    (match) => match[0],
  );
}

function getAttribute(tag: string, name: string): string | undefined {
  const match = tag.match(
    new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`),
  );
  return match?.[1] ?? match?.[2];
}

function hasClass(tag: string, className: string): boolean {
  return getAttribute(tag, "class")?.split(/\\s+/).includes(className) ?? false;
}

test("configures a temporary HTTP redirect from the site root", () => {
  // Given
  const redirectSchema = z.object({
    redirects: z.array(
      z.object({
        source: z.string(),
        destination: z.string(),
        statusCode: z.number().int(),
      }),
    ),
  });

  // When
  const config = redirectSchema.parse(
    JSON.parse(
      readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"),
    ),
  );

  // Then
  assert.deepEqual(
    config.redirects.find((redirect) => redirect.source === "/"),
    {
      source: "/",
      destination: "/en/",
      statusCode: 302,
    },
  );
});

test("builds a noindex recovery page without canonical metadata", () => {
  const notFound = readBuiltPage("404.html");
  const links = getTags(notFound, "link");
  const metas = getTags(notFound, "meta");
  const anchors = getTags(notFound, "a");

  assert.equal(
    links.find((link) => getAttribute(link, "rel") === "canonical"),
    undefined,
  );
  assert.equal(
    metas.find((meta) => getAttribute(meta, "property") === "og:url"),
    undefined,
  );
  assert.equal(
    links.filter((link) => getAttribute(link, "hreflang") !== undefined).length,
    0,
  );
  assert.equal(
    metas.find(
      (meta) =>
        getAttribute(meta, "name") === "robots" &&
        getAttribute(meta, "content") === "noindex, follow",
    ) !== undefined,
    true,
  );

  const languageLinks = anchors.filter((anchor) =>
    hasClass(anchor, "language-switcher__link"),
  );
  assert.deepEqual(
    languageLinks.map((anchor) => getAttribute(anchor, "href")),
    ["/en/", "/zh/", "/fr/"],
  );
  assert.equal(
    languageLinks.every(
      (anchor) => getAttribute(anchor, "aria-current") === undefined,
    ),
    true,
  );

  const homeLink = anchors.find((anchor) => hasClass(anchor, "not-found__home"));
  assert.equal(getAttribute(homeLink ?? "", "href"), "/en/");
});

test("builds programmatically focusable main-content targets", () => {
  for (const relativePath of ["en/index.html", "404.html"]) {
    const main = getTags(readBuiltPage(relativePath), "main").find(
      (tag) => getAttribute(tag, "id") === "main-content",
    );
    assert.equal(getAttribute(main ?? "", "tabindex"), "-1", relativePath);
  }

  const home = readBuiltPage("en/index.html");
  assert.equal(
    getTags(home, "link").some(
      (link) => getAttribute(link, "rel") === "canonical",
    ),
    true,
  );
  assert.equal(
    getTags(home, "meta").some(
      (meta) => getAttribute(meta, "property") === "og:url",
    ),
    true,
  );
});

test("builds one valid empty RSS feed for every locale", () => {
  for (const locale of ["en", "zh", "fr"] as const) {
    const feed = readBuiltPage(`${locale}/feed.xml`);

    assert.match(feed, /<rss\b/u, locale);
    assert.equal((feed.match(/<item\b/gu) ?? []).length, 0, locale);
    assert.match(feed, new RegExp(`<language>${locale}</language>`, "u"), locale);
  }
});

test("discovers the active locale RSS feed from metadata and social links", () => {
  for (const locale of ["en", "zh", "fr"] as const) {
    const home = readBuiltPage(`${locale}/index.html`);
    const rssMetadata = getTags(home, "link").filter(
      (link) =>
        getAttribute(link, "rel") === "alternate" &&
        getAttribute(link, "type") === "application/rss+xml",
    );
    const rssSocialLink = getTags(home, "a").find(
      (anchor) => getAttribute(anchor, "data-social-service") === "rss",
    );

    assert.deepEqual(
      rssMetadata.map((link) => getAttribute(link, "href")),
      [`https://me.frankie.wang/${locale}/feed.xml`],
      locale,
    );
    assert.equal(
      getAttribute(rssSocialLink ?? "", "href"),
      `/${locale}/feed.xml`,
      locale,
    );
  }
});

test("does not generate empty topic routes or change primary navigation", () => {
  for (const locale of ["en", "zh", "fr"] as const) {
    assert.equal(
      existsSync(new URL(`${locale}/topics/`, buildOutput)),
      false,
      locale,
    );

    const home = readBuiltPage(`${locale}/index.html`);
    const primaryNavigation = getTags(home, "nav").find((navigation) =>
      hasClass(navigation, "primary-navigation"),
    );
    const navigationMarkup = primaryNavigation ?? "";
    const navigationStart = home.indexOf(navigationMarkup);
    const navigationEnd = home.indexOf("</nav>", navigationStart);
    const anchors = getTags(home.slice(navigationStart, navigationEnd), "a");

    assert.deepEqual(
      anchors.map((anchor) => getAttribute(anchor, "href")),
      [
        `/${locale}/journal/`,
        `/${locale}/moments/`,
        `/${locale}/hello/`,
      ],
      locale,
    );
  }
});

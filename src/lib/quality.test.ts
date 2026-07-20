import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { z } from "astro/zod";

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

test("provides a branded noindex page for unknown routes", () => {
  const source = readFileSync(
    new URL("../pages/404.astro", import.meta.url),
    "utf8",
  );

  assert.match(source, /<SiteLayout/);
  assert.match(source, /robots="noindex, follow"/);
  assert.match(source, /href="\/en\/"/);
});

test("moves skip-link focus to the main content target", () => {
  const source = readFileSync(
    new URL("../layouts/SiteLayout.astro", import.meta.url),
    "utf8",
  );

  assert.match(source, /<main id="main-content" tabindex="-1">/);
});

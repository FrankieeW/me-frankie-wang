import assert from "node:assert/strict";
import test from "node:test";

import {
  getTableOfContentsHeadings,
  shouldShowTableOfContents,
  TOC_HEADING_THRESHOLD,
} from "./toc.ts";

const headings = [
  { depth: 1, slug: "title", text: "Title" },
  { depth: 2, slug: "one", text: "One" },
  { depth: 3, slug: "detail", text: "Detail" },
  { depth: 4, slug: "deep", text: "Deep" },
  { depth: 2, slug: "two", text: "Two" },
] as const;

test("keeps H2 and H3 headings in document order", () => {
  const tableOfContentsHeadings = getTableOfContentsHeadings(headings);

  assert.deepEqual(tableOfContentsHeadings, [
    { depth: 2, slug: "one", text: "One" },
    { depth: 3, slug: "detail", text: "Detail" },
    { depth: 2, slug: "two", text: "Two" },
  ]);
});

test("shows a table of contents at exactly three eligible headings", () => {
  assert.equal(TOC_HEADING_THRESHOLD, 3);
  assert.equal(
    shouldShowTableOfContents([
      { depth: 2, slug: "one", text: "One" },
      { depth: 3, slug: "two", text: "Two" },
    ]),
    false,
  );
  assert.equal(shouldShowTableOfContents(headings), true);
});

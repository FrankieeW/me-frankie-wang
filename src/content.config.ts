import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import {
  createJournalSchema,
  createMomentSchema,
} from "./lib/authoring.ts";

const journal = defineCollection({
  loader: glob({
    base: "./src/content/journal",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) => createJournalSchema(image()),
});

const moments = defineCollection({
  loader: glob({
    base: "./src/content/moments",
    pattern: "**/*.md",
  }),
  schema: ({ image }) => createMomentSchema(image()),
});

export const collections = { journal, moments };

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { LOCALES } from "./i18n/config.ts";

const requiredText = z.string().trim().min(1);

const sharedMetadata = z.object({
  locale: z.enum(LOCALES),
  translationKey: requiredText,
  publishedAt: z.coerce.date(),
  draft: z.boolean(),
});

const journal = defineCollection({
  loader: glob({
    base: "./src/content/journal",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    sharedMetadata.extend({
      title: requiredText,
      summary: requiredText,
      updatedAt: z.coerce.date().optional(),
      cover: image().optional(),
    }),
});

const moments = defineCollection({
  loader: glob({
    base: "./src/content/moments",
    pattern: "**/*.md",
  }),
  schema: ({ image }) =>
    sharedMetadata.extend({
      caption: requiredText,
      takenAt: z.coerce.date(),
      location: requiredText.optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: requiredText,
          }),
        )
        .min(1),
    }),
});

export const collections = { journal, moments };

import { z } from "astro/zod";

import { LOCALES } from "../i18n/config.ts";
import { TOPIC_KEYS } from "../data/topics.ts";

const requiredText = z.string().trim().min(1);

const translationKey = requiredText.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Use a lowercase kebab-case translation key.",
);

const topics = z
  .array(z.enum(TOPIC_KEYS))
  .max(3, "Select at most three topics.")
  .default([])
  .superRefine((values, context) => {
    if (new Set(values).size !== values.length) {
      context.addIssue({
        code: "custom",
        message: "Topics must be unique.",
      });
    }
  });

const sharedMetadata = z.object({
  locale: z.enum(LOCALES),
  translationKey,
  publishedAt: z.coerce.date(),
  draft: z.boolean(),
  topics,
});

function localMediaPath(extensions: readonly string[]) {
  return requiredText.refine((value) => {
    if (
      !value.startsWith("/media/") ||
      value.includes("..") ||
      /[?#]/u.test(value)
    ) {
      return false;
    }

    const normalizedValue = value.toLocaleLowerCase();
    return extensions.some((extension) =>
      normalizedValue.endsWith(extension),
    );
  }, "Use a same-origin /media/ path with an allowed extension.");
}

const videoPath = localMediaPath([".mp4", ".webm"]);
const audioPath = localMediaPath([".mp3", ".m4a", ".ogg", ".wav"]);
const captionPath = localMediaPath([".vtt"]);
const transcriptPath = localMediaPath([".html", ".pdf", ".txt", ".md"]);

function createVideoSchema<TImage>(imageSchema: z.ZodType<TImage>) {
  return z.object({
    src: videoPath,
    poster: imageSchema,
    posterAlt: requiredText,
    title: requiredText,
    captions: captionPath,
  });
}

export function createJournalSchema<TImage>(
  imageSchema: z.ZodType<TImage>,
) {
  const video = createVideoSchema(imageSchema).extend({
    type: z.literal("video"),
  });
  const audio = z.object({
    type: z.literal("audio"),
    src: audioPath,
    title: requiredText,
    transcript: transcriptPath,
  });

  return sharedMetadata
    .extend({
      title: requiredText,
      summary: requiredText,
      updatedAt: z.coerce.date().optional(),
      cover: imageSchema.optional(),
      coverAlt: requiredText.optional(),
      leadMedia: z.discriminatedUnion("type", [video, audio]).optional(),
    })
    .superRefine((entry, context) => {
      if ((entry.cover === undefined) !== (entry.coverAlt === undefined)) {
        context.addIssue({
          code: "custom",
          message: "Journal cover and coverAlt must be provided together.",
          path: ["coverAlt"],
        });
      }
    });
}

export function createMomentSchema<TImage>(
  imageSchema: z.ZodType<TImage>,
) {
  const image = z.object({
    src: imageSchema,
    alt: requiredText,
  });

  return sharedMetadata
    .extend({
      caption: requiredText,
      takenAt: z.coerce.date(),
      location: requiredText.optional(),
      images: z.array(image).default([]),
      video: createVideoSchema(imageSchema).optional(),
    })
    .superRefine((entry, context) => {
      if (entry.images.length === 0 && entry.video === undefined) {
        context.addIssue({
          code: "custom",
          message: "A Moment requires at least one image or video.",
          path: ["images"],
        });
      }
    });
}

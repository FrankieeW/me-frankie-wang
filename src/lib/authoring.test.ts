import assert from "node:assert/strict";
import test from "node:test";

import { z } from "astro/zod";

import {
  createJournalSchema,
  createMomentSchema,
} from "./authoring.ts";

const testImageSchema = z.string().trim().min(1);

const journalMetadata = {
  locale: "en",
  translationKey: "entry",
  publishedAt: "2026-07-20",
  draft: false,
  title: "Entry",
  summary: "Summary",
} as const;

const momentMetadata = {
  locale: "en",
  translationKey: "moment",
  publishedAt: "2026-07-20",
  draft: false,
  caption: "Moment",
  takenAt: "2026-07-20",
} as const;

const validVideo = {
  src: "/media/clip.mp4",
  poster: "poster.jpg",
  posterAlt: "A still frame from the clip",
  title: "Short clip",
  captions: "/media/clip.vtt",
} as const;

test("rejects an unknown topic", () => {
  const schema = createJournalSchema(testImageSchema);
  const result = schema.safeParse({
    ...journalMetadata,
    topics: ["unknown"],
  });

  assert.equal(result.success, false);
});

test("rejects a repeated topic", () => {
  const schema = createJournalSchema(testImageSchema);
  const result = schema.safeParse({
    ...journalMetadata,
    topics: ["daily", "daily"],
  });

  assert.equal(result.success, false);
});

test("rejects a Moment without an image or video", () => {
  const schema = createMomentSchema(testImageSchema);
  const result = schema.safeParse(momentMetadata);

  assert.equal(result.success, false);
});

test("rejects a remote Moment video source", () => {
  const schema = createMomentSchema(testImageSchema);
  const result = schema.safeParse({
    ...momentMetadata,
    video: {
      ...validVideo,
      src: "https://video.example/clip.mp4",
    },
  });

  assert.equal(result.success, false);
});

test("accepts a video-only Moment with accessibility metadata", () => {
  const schema = createMomentSchema(testImageSchema);
  const result = schema.safeParse({
    ...momentMetadata,
    video: validVideo,
  });

  assert.equal(result.success, true);
});

test("requires Moment video captions", () => {
  const schema = createMomentSchema(testImageSchema);
  const { captions: _captions, ...videoWithoutCaptions } = validVideo;
  const result = schema.safeParse({
    ...momentMetadata,
    video: videoWithoutCaptions,
  });

  assert.equal(result.success, false);
});

test("requires a Journal video poster alternative", () => {
  const schema = createJournalSchema(testImageSchema);
  const { posterAlt: _posterAlt, ...videoWithoutPosterAlt } = validVideo;
  const result = schema.safeParse({
    ...journalMetadata,
    leadMedia: {
      type: "video",
      ...videoWithoutPosterAlt,
    },
  });

  assert.equal(result.success, false);
});

test("requires a Journal audio transcript", () => {
  const schema = createJournalSchema(testImageSchema);
  const result = schema.safeParse({
    ...journalMetadata,
    leadMedia: {
      type: "audio",
      src: "/media/voice.mp3",
      title: "Voice note",
    },
  });

  assert.equal(result.success, false);
});

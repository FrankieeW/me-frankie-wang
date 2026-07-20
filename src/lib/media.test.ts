import assert from "node:assert/strict";
import test from "node:test";

import { getMomentPreviewVisual } from "./media.ts";

test("prefers the first Moment image over a video poster", () => {
  const firstImage = { src: "first-image", alt: "First image" };

  assert.deepEqual(
    getMomentPreviewVisual({
      images: [firstImage],
      video: {
        poster: "video-poster",
        posterAlt: "Video poster",
      },
    }),
    firstImage,
  );
});

test("uses the video poster for a video-only Moment", () => {
  assert.deepEqual(
    getMomentPreviewVisual({
      images: [],
      video: {
        poster: "video-poster",
        posterAlt: "Video poster",
      },
    }),
    { src: "video-poster", alt: "Video poster" },
  );
});

test("returns no visual when a Moment has no image or video", () => {
  assert.equal(getMomentPreviewVisual({ images: [] }), undefined);
});

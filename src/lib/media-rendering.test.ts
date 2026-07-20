import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const buildOutput = new URL("../../dist/", import.meta.url);

function getBuiltHtml(): readonly string[] {
  return readdirSync(buildOutput, { encoding: "utf8", recursive: true })
    .filter((path) => path.endsWith(".html"))
    .map((path) => readFileSync(new URL(path, buildOutput), "utf8"));
}

function getAttribute(tag: string, name: string): string | undefined {
  const match = tag.match(
    new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "u"),
  );

  return match?.[1] ?? match?.[2];
}

function hasBooleanAttribute(tag: string, name: string): boolean {
  return new RegExp(`(?:^|\\s)${name}(?=\\s|=|/?>)`, "u").test(tag);
}

test("builds authored native media with accessible static defaults", () => {
  const html = getBuiltHtml().join("\n");
  const videos = [...html.matchAll(/<video\b[^>]*>[\s\S]*?<\/video>/gu)];
  const audios = [...html.matchAll(/<audio\b[^>]*>[\s\S]*?<\/audio>/gu)];

  for (const video of videos) {
    const openingTag = video[0].match(/^<video\b[^>]*>/u)?.[0] ?? "";

    assert.equal(hasBooleanAttribute(openingTag, "autoplay"), false);
    assert.equal(hasBooleanAttribute(openingTag, "controls"), true);
    assert.equal(hasBooleanAttribute(openingTag, "playsinline"), true);
    assert.equal(getAttribute(openingTag, "preload"), "metadata");
    assert.match(video[0], /<track\b[^>]*\bkind=(?:"captions"|'captions')[^>]*>/u);
  }

  for (const audio of audios) {
    const openingTag = audio[0].match(/^<audio\b[^>]*>/u)?.[0] ?? "";

    assert.equal(hasBooleanAttribute(openingTag, "autoplay"), false);
    assert.equal(hasBooleanAttribute(openingTag, "controls"), true);
    assert.equal(getAttribute(openingTag, "preload"), "metadata");
  }
});

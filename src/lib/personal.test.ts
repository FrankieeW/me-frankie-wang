import assert from "node:assert/strict";
import test from "node:test";

import {
  defineFriends,
  definePlaces,
  FRIENDS,
  PLACES,
  SITE_HISTORY,
  SITE_START_YEAR,
} from "../data/personal.ts";

const localizedCity = {
  en: "London",
  zh: "伦敦",
  fr: "Londres",
} as const;

const localizedCountry = {
  en: "United Kingdom",
  zh: "英国",
  fr: "Royaume-Uni",
} as const;

const localizedDescription = {
  en: "A friend from London.",
  zh: "一位来自伦敦的朋友。",
  fr: "Un ami de Londres.",
} as const;

test("accepts city-level places with paired approximate plot positions", () => {
  const places = definePlaces([
    {
      id: "london",
      kind: "lived",
      city: localizedCity,
      country: localizedCountry,
      x: 0,
      y: 100,
    },
  ]);

  assert.deepEqual(places, [
    {
      id: "london",
      kind: "lived",
      city: localizedCity,
      country: localizedCountry,
      x: 0,
      y: 100,
    },
  ]);
});

test("rejects incomplete or out-of-range place positions", () => {
  assert.throws(() =>
    definePlaces([
      {
        id: "london",
        kind: "visited",
        city: localizedCity,
        country: localizedCountry,
        x: 50,
      },
    ]),
  );
  assert.throws(() =>
    definePlaces([
      {
        id: "london",
        kind: "visited",
        city: localizedCity,
        country: localizedCountry,
        x: 101,
        y: 50,
      },
    ]),
  );
});

test("rejects precise location fields", () => {
  assert.throws(() =>
    definePlaces([
      {
        id: "london",
        kind: "visited",
        city: localizedCity,
        country: localizedCountry,
        latitude: 51.5072,
      },
    ]),
  );
});

test("accepts an HTTPS friend with confirmed consent", () => {
  const friends = defineFriends([
    {
      name: "Alex",
      url: "https://example.com/",
      description: localizedDescription,
      consentConfirmed: true,
    },
  ]);

  assert.equal(friends[0]?.url, "https://example.com/");
});

test("rejects insecure friend links or unconfirmed consent", () => {
  assert.throws(() =>
    defineFriends([
      {
        name: "Alex",
        url: "http://example.com/",
        description: localizedDescription,
        consentConfirmed: true,
      },
    ]),
  );
  assert.throws(() =>
    defineFriends([
      {
        name: "Alex",
        url: "https://example.com/",
        description: localizedDescription,
        consentConfirmed: false,
      },
    ]),
  );
});

test("requires a localized alternative with a local friend avatar", () => {
  assert.throws(() =>
    defineFriends([
      {
        name: "Alex",
        url: "https://example.com/",
        description: localizedDescription,
        consentConfirmed: true,
        avatar: {
          src: "/avatar.png",
          width: 100,
          height: 100,
          format: "png",
        },
      },
    ]),
  );
});

test("starts with empty private sections and verified 2026 history", () => {
  assert.deepEqual(PLACES, []);
  assert.deepEqual(FRIENDS, []);
  assert.equal(SITE_START_YEAR, 2026);
  assert.deepEqual(SITE_HISTORY, [
    {
      year: 2026,
      description: {
        en: "me.frankie.wang launched as an independent static Astro site.",
        zh: "me.frankie.wang 于 2026 年作为独立的 Astro 静态网站上线。",
        fr: "me.frankie.wang a été lancé comme site Astro statique indépendant.",
      },
    },
  ]);
});

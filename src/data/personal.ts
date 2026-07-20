import type { ImageMetadata } from "astro";
import { z } from "astro/zod";

import type { Locale } from "../i18n/config.ts";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type Place = {
  readonly id: string;
  readonly kind: "lived" | "visited";
  readonly city: LocalizedText;
  readonly country: LocalizedText;
  readonly x?: number | undefined;
  readonly y?: number | undefined;
};

export type Friend = {
  readonly name: string;
  readonly url: string;
  readonly description: LocalizedText;
  readonly consentConfirmed: true;
  readonly avatar?: ImageMetadata | undefined;
  readonly avatarAlt?: LocalizedText | undefined;
};

export type SiteHistoryRecord = {
  readonly year: number;
  readonly description: LocalizedText;
};

const requiredText = z.string().trim().min(1);
const localizedText = z
  .object({
    en: requiredText,
    zh: requiredText,
    fr: requiredText,
  })
  .strict();
const coordinate = z.number().min(0).max(100);
const imageMetadataShape = z
  .object({
    src: requiredText,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    format: requiredText,
  });
const avatar = z.custom<ImageMetadata>(
  (value) => imageMetadataShape.safeParse(value).success,
  "Use a local Astro image asset.",
);

const place = z
  .object({
    id: requiredText.regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use a lowercase kebab-case place ID.",
    ),
    kind: z.enum(["lived", "visited"]),
    city: localizedText,
    country: localizedText,
    x: coordinate.optional(),
    y: coordinate.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if ((value.x === undefined) !== (value.y === undefined)) {
      context.addIssue({
        code: "custom",
        message: "Place plot positions require both x and y.",
        path: [value.x === undefined ? "x" : "y"],
      });
    }
  });

const friend = z
  .object({
    name: requiredText,
    url: z.url().trim().refine(
      (value) => value.startsWith("https://"),
      "Friend URLs must use HTTPS.",
    ),
    description: localizedText,
    consentConfirmed: z.literal(true),
    avatar: avatar.optional(),
    avatarAlt: localizedText.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if ((value.avatar === undefined) !== (value.avatarAlt === undefined)) {
      context.addIssue({
        code: "custom",
        message: "Friend avatar and avatarAlt must be provided together.",
        path: ["avatarAlt"],
      });
    }
  });

export function definePlaces(values: readonly unknown[]): readonly Place[] {
  return z.array(place).parse(values);
}

export function defineFriends(values: readonly unknown[]): readonly Friend[] {
  return z.array(friend).parse(values);
}

export const PLACES = definePlaces([]);

export const FRIENDS = defineFriends([]);

export const SITE_START_YEAR = 2026;

export const SITE_HISTORY = [
  {
    year: 2026,
    description: {
      en: "me.frankie.wang launched as an independent static Astro site.",
      zh: "me.frankie.wang 于 2026 年作为独立的 Astro 静态网站上线。",
      fr: "me.frankie.wang a été lancé comme site Astro statique indépendant.",
    },
  },
] as const satisfies readonly SiteHistoryRecord[];

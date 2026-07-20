type MomentImage<TImage> = {
  readonly src: TImage;
  readonly alt: string;
};

type MomentVideo<TImage> = {
  readonly poster: TImage;
  readonly posterAlt: string;
};

export type MomentPreviewVisual<TImage> = MomentImage<TImage>;

export function getMomentPreviewVisual<TImage>(entry: {
  readonly images: readonly MomentImage<TImage>[];
  readonly video?: MomentVideo<TImage> | undefined;
}): MomentPreviewVisual<TImage> | undefined {
  const image = entry.images[0];

  if (image !== undefined) {
    return image;
  }

  if (entry.video === undefined) {
    return undefined;
  }

  return {
    src: entry.video.poster,
    alt: entry.video.posterAlt,
  };
}

export const TOC_HEADING_THRESHOLD = 3;

export type ContentHeading = {
  readonly depth: number;
  readonly slug: string;
  readonly text: string;
};

export type TableOfContentsHeading = ContentHeading & {
  readonly depth: 2 | 3;
};

function isTableOfContentsHeading(
  heading: ContentHeading,
): heading is TableOfContentsHeading {
  return heading.depth === 2 || heading.depth === 3;
}

export function getTableOfContentsHeadings(
  headings: readonly ContentHeading[],
): readonly TableOfContentsHeading[] {
  return headings.filter(isTableOfContentsHeading);
}

export function shouldShowTableOfContents(
  headings: readonly ContentHeading[],
): boolean {
  return getTableOfContentsHeadings(headings).length >= TOC_HEADING_THRESHOLD;
}

export type ElsewhereLink = {
  label: string;
  href: string;
};

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "blog";

export const siteByline = process.env.NEXT_PUBLIC_SITE_BYLINE ?? "";

export const siteTagline =
  process.env.NEXT_PUBLIC_SITE_TAGLINE ??
  "A personal blog powered by this CMS template.";

export const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? siteTagline;

export const authorLabel = process.env.NEXT_PUBLIC_AUTHOR_LABEL ?? "";

function parseCsv(value: string | undefined, fallback: string[]): string[] {
  if (!value?.trim()) return fallback;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const homeTopics = parseCsv(
  process.env.NEXT_PUBLIC_HOME_TOPICS,
  ["Writing", "Notes"]
);

function linkIfSet(label: string, href: string | undefined): ElsewhereLink | null {
  if (!href?.trim()) return null;
  return { label, href: href.trim() };
}

export const elsewhereLinks: ElsewhereLink[] = [
  linkIfSet("mfajardo.com", process.env.NEXT_PUBLIC_MFAJARDO_URL),
  linkIfSet("weekly", process.env.NEXT_PUBLIC_WEEKLY_URL),
  linkIfSet("focus", process.env.NEXT_PUBLIC_FOCUS_URL),
].filter((l): l is ElsewhereLink => l !== null);

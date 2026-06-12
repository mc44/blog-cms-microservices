import { authorLabel } from "@/lib/site";

export function formatPostDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function postExcerpt(content: string, maxLen = 160): string {
  const flat = content.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLen) return flat;
  return `${flat.slice(0, maxLen).trimEnd()}…`;
}

export function formatAuthorLabel(authorId: string): string {
  if (authorLabel) return authorLabel;
  if (authorId.length <= 12) return authorId;
  return authorId.slice(0, 8);
}

export function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function sortPostsByPublished<T extends { publishedAt?: string; createdAt: string }>(
  posts: T[]
): T[] {
  return [...posts].sort((a, b) => {
    const aTime = new Date(a.publishedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.publishedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
}

"use client";

import { useCallback, useMemo } from "react";
import type { PostEditorValues } from "@/lib/post-editor-types";

export interface CachedDraft extends PostEditorValues {
  cachedAt: string;
  serverUpdatedAt?: string;
}

function cacheKey(postId: string | null): string {
  return `blog-draft:v1:${postId ?? "new"}`;
}

function readCache(postId: string | null): CachedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(cacheKey(postId));
    if (!raw) return null;
    return JSON.parse(raw) as CachedDraft;
  } catch {
    return null;
  }
}

export function usePostDraftCache(postId: string | null) {
  const key = useMemo(() => cacheKey(postId), [postId]);

  const writeCache = useCallback(
    (draft: PostEditorValues, serverUpdatedAt?: string) => {
      if (typeof window === "undefined") return;
      const entry: CachedDraft = {
        ...draft,
        cachedAt: new Date().toISOString(),
        serverUpdatedAt,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    },
    [key]
  );

  const clearCache = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }, [key]);

  const loadCache = useCallback(() => readCache(postId), [postId]);

  const isCacheNewerThanServer = useCallback(
    (serverUpdatedAt: string) => {
      const cached = readCache(postId);
      if (!cached) return false;
      return new Date(cached.cachedAt).getTime() > new Date(serverUpdatedAt).getTime();
    },
    [postId]
  );

  return { writeCache, clearCache, loadCache, isCacheNewerThanServer };
}

export function migrateDraftCache(fromPostId: string | null, toPostId: string) {
  if (typeof window === "undefined") return;
  const from = readCache(fromPostId);
  if (!from) return;
  localStorage.setItem(cacheKey(toPostId), JSON.stringify(from));
  localStorage.removeItem(cacheKey(fromPostId));
}

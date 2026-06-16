"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PostEditorValues } from "@/lib/post-editor-types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { createPost, updatePost, type Post } from "@/lib/api";

export type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DEBOUNCE_MS = 1500;

interface UseAutosavePostOptions {
  postId: string | null;
  draft: PostEditorValues;
  baseline: PostEditorValues;
  enabled: boolean;
  onPostCreated: (post: Post) => void;
  onSaved: (post: Post) => void;
  onError: (message: string) => void;
}

function valuesEqual(a: PostEditorValues, b: PostEditorValues): boolean {
  return (
    a.title === b.title &&
    a.content === b.content &&
    a.status === b.status &&
    JSON.stringify(a.mediaRefs) === JSON.stringify(b.mediaRefs)
  );
}

export function useAutosavePost({
  postId,
  draft,
  baseline,
  enabled,
  onPostCreated,
  onSaved,
  onError,
}: UseAutosavePostOptions) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debouncedDraft = useDebouncedValue(draft, AUTOSAVE_DEBOUNCE_MS);
  const savingRef = useRef(false);

  const isDirty = !valuesEqual(draft, baseline);

  const persist = useCallback(async () => {
    if (!enabled || savingRef.current) return;
    if (!debouncedDraft.title.trim() && !debouncedDraft.content.trim()) return;
    if (valuesEqual(debouncedDraft, baseline)) return;

    savingRef.current = true;
    setSaveState("saving");
    try {
      const autosaveBody = {
        title: debouncedDraft.title.trim() || "Untitled draft",
        content: debouncedDraft.content,
        status: "DRAFT" as const,
        mediaRefs: debouncedDraft.mediaRefs,
      };

      if (postId) {
        const saved = await updatePost(postId, autosaveBody, { autosave: true });
        onSaved(saved);
      } else {
        const created = await createPost(autosaveBody);
        onPostCreated(created);
        onSaved(created);
      }
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      onError(err instanceof Error ? err.message : "Autosave failed");
    } finally {
      savingRef.current = false;
    }
  }, [enabled, debouncedDraft, baseline, postId, onPostCreated, onSaved, onError]);

  useEffect(() => {
    void persist();
  }, [persist]);

  return { saveState, isDirty, setSaveState };
}

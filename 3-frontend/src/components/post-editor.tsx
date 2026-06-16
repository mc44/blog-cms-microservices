"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/markdown-editor";
import { useUnsavedChanges } from "@/context/unsaved-changes-context";
import { useAutosavePost } from "@/hooks/use-autosave-post";
import { migrateDraftCache, usePostDraftCache } from "@/hooks/use-post-draft-cache";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import { uploadMedia, type Post, type PostStatus } from "@/lib/api";
import type { PostEditorValues } from "@/lib/post-editor-types";

export type { PostEditorValues };

interface PostEditorProps {
  postId?: string | null;
  initial: PostEditorValues;
  serverUpdatedAt?: string;
  submitLabel: string;
  onSubmit: (values: PostEditorValues) => Promise<void>;
  onPostCreated?: (post: Post) => void;
}

function valuesEqual(a: PostEditorValues, b: PostEditorValues): boolean {
  return (
    a.title === b.title &&
    a.content === b.content &&
    a.status === b.status &&
    JSON.stringify(a.mediaRefs) === JSON.stringify(b.mediaRefs)
  );
}

function saveStatusLabel(
  saveState: "idle" | "saving" | "saved" | "error",
  isDirty: boolean
): string {
  if (saveState === "saving") return "Saving…";
  if (saveState === "error") return "Save failed — cached locally";
  if (isDirty) return "Unsaved changes";
  if (saveState === "saved") return "All changes saved";
  return "";
}

export function PostEditor({
  postId = null,
  initial,
  serverUpdatedAt,
  submitLabel,
  onSubmit,
  onPostCreated,
}: PostEditorProps) {
  const router = useRouter();
  const { setIsDirty } = useUnsavedChanges();
  const [resolvedPostId, setResolvedPostId] = useState<string | null>(postId ?? null);
  const { writeCache, clearCache, loadCache, isCacheNewerThanServer } =
    usePostDraftCache(resolvedPostId);

  const [baseline, setBaseline] = useState(initial);
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [status, setStatus] = useState<PostStatus>(initial.status);
  const [mediaRefs, setMediaRefs] = useState(initial.mediaRefs);
  const [secureUrl, setSecureUrl] = useState(initial.mediaRefs[0]?.secureUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [pendingCache, setPendingCache] = useState<PostEditorValues | null>(null);

  useEffect(() => {
    setResolvedPostId(postId ?? null);
  }, [postId]);

  const draft: PostEditorValues = { title, content, status, mediaRefs };
  const isDirty = !valuesEqual(draft, baseline);

  useUnsavedGuard(isDirty);

  useEffect(() => {
    setIsDirty(isDirty);
    return () => setIsDirty(false);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (serverUpdatedAt && isCacheNewerThanServer(serverUpdatedAt)) {
      const cached = loadCache();
      if (cached) {
        setPendingCache({
          title: cached.title,
          content: cached.content,
          status: cached.status,
          mediaRefs: cached.mediaRefs,
        });
        setShowRestoreBanner(true);
      }
    }
  }, [serverUpdatedAt, isCacheNewerThanServer, loadCache]);

  useEffect(() => {
    writeCache(draft, serverUpdatedAt);
  }, [draft, serverUpdatedAt, writeCache]);

  const handleSaved = useCallback(
    (post: Post) => {
      const saved: PostEditorValues = {
        title: post.title,
        content: post.content,
        status: post.status,
        mediaRefs: post.mediaRefs ?? [],
      };
      setBaseline(saved);
      writeCache(saved, post.updatedAt);
    },
    [writeCache]
  );

  const handlePostCreated = useCallback(
    (post: Post) => {
      migrateDraftCache(null, post.id);
      setResolvedPostId(post.id);
      onPostCreated?.(post);
      router.replace(`/posts/${post.id}/edit`, { scroll: false });
    },
    [onPostCreated, router]
  );

  const { saveState } = useAutosavePost({
    postId: resolvedPostId,
    draft,
    baseline,
    enabled: true,
    onPostCreated: handlePostCreated,
    onSaved: handleSaved,
    onError: (msg) => setError(msg),
  });

  function restoreFromCache() {
    if (!pendingCache) return;
    setTitle(pendingCache.title);
    setContent(pendingCache.content);
    setStatus(pendingCache.status);
    setMediaRefs(pendingCache.mediaRefs);
    setSecureUrl(pendingCache.mediaRefs[0]?.secureUrl ?? null);
    setShowRestoreBanner(false);
  }

  function dismissRestoreBanner() {
    setShowRestoreBanner(false);
    clearCache();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const asset = await uploadMedia(file);
      const refs = [{ cloudinaryPublicId: asset.publicId, secureUrl: asset.secureUrl }];
      setMediaRefs(refs);
      setSecureUrl(asset.secureUrl);
    } catch {
      setError("Upload failed. Sign in and ensure media-service is running.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ title, content, status, mediaRefs });
      const saved = { title, content, status, mediaRefs };
      setBaseline(saved);
      clearCache();
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  const statusText = saveStatusLabel(saveState, isDirty);

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {showRestoreBanner && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm">
          <span>A newer local draft was found. Restore it?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={restoreFromCache}
              className="rounded-md bg-primary px-3 py-1 text-primary-foreground"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={dismissRestoreBanner}
              className="rounded-md border border-border px-3 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Article</h2>
          {statusText && (
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {statusText}
            </span>
          )}
        </div>
        <label className="block text-sm font-medium">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Content
          <div className="mt-1.5">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Publishing</h2>
        <label className="block text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2"
          >
            <option value="DRAFT">Draft — visible only to you</option>
            <option value="PUBLISHED">Published — visible on the blog</option>
          </select>
        </label>
        <p className="text-xs text-muted-foreground">
          Autosave keeps your work as a draft. Choose Published when you are ready for readers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Cover image</h2>
        <label className="block text-sm font-medium">
          Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="mt-1.5 block text-sm" />
        </label>
        {secureUrl && (
          <img src={secureUrl} alt="Cover preview" className="max-h-48 rounded-md border border-border" />
        )}
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-6 py-2.5 font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

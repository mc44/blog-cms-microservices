"use client";

import { useState } from "react";
import { uploadMedia, type PostStatus } from "@/lib/api";

export interface PostEditorValues {
  title: string;
  content: string;
  status: PostStatus;
  mediaRefs: { cloudinaryPublicId: string; secureUrl?: string }[];
}

interface PostEditorProps {
  initial: PostEditorValues;
  submitLabel: string;
  onSubmit: (values: PostEditorValues) => Promise<void>;
}

export function PostEditor({ initial, submitLabel, onSubmit }: PostEditorProps) {
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [status, setStatus] = useState<PostStatus>(initial.status);
  const [mediaRefs, setMediaRefs] = useState(initial.mediaRefs);
  const [secureUrl, setSecureUrl] = useState(initial.mediaRefs[0]?.secureUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Article</h2>
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
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 leading-relaxed"
            required
          />
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
          Choose Published when you are ready for readers to see this article.
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

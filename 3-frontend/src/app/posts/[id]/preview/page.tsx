"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MarkdownContent } from "@/components/markdown-content";
import { getPostAuthorized } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import {
  formatAuthorLabel,
  formatPostDate,
  readingTimeMinutes,
} from "@/lib/format";

export default function PostPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Awaited<ReturnType<typeof getPostAuthorized>> | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    getPostAuthorized(id)
      .then(setPost)
      .catch(() => setError("Post not found or access denied."))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <p className="text-muted-foreground">Loading preview…</p>;
  }

  if (error || !post) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{error ?? "Post not found."}</p>
        <Link href="/me/posts" className="text-sm text-primary hover:underline">
          ← My posts
        </Link>
      </div>
    );
  }

  const cover = post.mediaRefs?.[0]?.secureUrl;
  const date = formatPostDate(post.publishedAt ?? post.createdAt);
  const author = formatAuthorLabel(post.authorId);
  const readMins = readingTimeMinutes(post.content);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Link href={`/posts/${id}/edit`} className="text-primary hover:underline">
          ← Back to editor
        </Link>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Preview · {post.status}
        </span>
      </div>
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium">{author}</span>
          {date && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt ?? post.createdAt}>{date}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{readMins} min read</span>
        </div>
      </header>
      {cover && (
        <img
          src={cover}
          alt=""
          className="w-full rounded-lg border border-border object-cover"
        />
      )}
      <MarkdownContent content={post.content} />
    </article>
  );
}

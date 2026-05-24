"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost, listPosts, type Post } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { getUserIdFromToken } from "@/lib/jwt";

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    const authorId = getUserIdFromToken();
    if (!authorId) {
      setError("Could not read user id from token.");
      return;
    }
    listPosts({ authorId })
      .then(setPosts)
      .catch(() => setError("Failed to load your posts."));
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My posts</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New post
        </Link>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <Link href={`/posts/${post.id}/edit`} className="font-medium hover:underline">
                {post.title}
              </Link>
              <p className="text-xs text-muted-foreground">{post.status}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(post.id)}
              className="text-sm text-destructive hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { deletePost, listPosts, type Post } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { formatPostDate } from "@/lib/format";
import { getUserIdFromToken } from "@/lib/jwt";

function StatusBadge({ status }: { status: Post["status"] }) {
  const styles =
    status === "PUBLISHED"
      ? "bg-primary/15 text-primary"
      : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    const authorId = getUserIdFromToken();
    if (!authorId) {
      setError("Could not read user id from token.");
      setLoading(false);
      return;
    }
    listPosts({ authorId, cache: "no-store" })
      .then(setPosts)
      .catch(() => setError("Failed to load your posts."))
      .finally(() => setLoading(false));
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
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Drafts and published articles</p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          New post
        </Link>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && <TableSkeleton rows={5} />}
      {!loading && posts.length === 0 && !error && (
        <p className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
          No posts yet.{" "}
          <Link href="/posts/new" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      )}
      {!loading && posts.length > 0 && (
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Updated</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/posts/${post.id}/edit`} className="font-medium hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {formatPostDate(post.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/posts/${post.id}`}
                      className="mr-3 text-primary hover:underline"
                    >
                      View
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

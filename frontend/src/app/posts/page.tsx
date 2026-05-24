import Link from "next/link";
import { listPosts } from "@/lib/api";

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;
  try {
    posts = await listPosts({ status: "PUBLISHED" });
  } catch {
    error = "Could not reach the gateway. Start the stack and try again.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Published posts</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          New post
        </Link>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {posts.length === 0 && !error && (
          <li className="px-4 py-6 text-sm text-muted-foreground">No published posts yet.</li>
        )}
        {posts.map((post) => (
          <li key={post.id} className="px-4 py-4">
            <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
              {post.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {post.slug} · author {post.authorId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

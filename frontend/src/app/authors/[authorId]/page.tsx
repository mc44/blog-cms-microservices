import Link from "next/link";
import { listPosts } from "@/lib/api";

export default async function AuthorPostsPage({
  params,
}: {
  params: Promise<{ authorId: string }>;
}) {
  const { authorId } = await params;
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;
  try {
    posts = await listPosts({ authorId, status: "PUBLISHED" });
  } catch {
    error = "Could not load posts.";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Posts by {authorId}</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {posts.length === 0 && !error && (
          <li className="px-4 py-6 text-sm text-muted-foreground">No published posts.</li>
        )}
        {posts.map((post) => (
          <li key={post.id} className="px-4 py-4">
            <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

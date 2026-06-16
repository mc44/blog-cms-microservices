import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { listPosts } from "@/lib/api";
import { sortPostsByPublished } from "@/lib/format";

export async function RecentPosts() {
  let recent: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;

  try {
    const posts = await listPosts({ status: "PUBLISHED" });
    recent = sortPostsByPublished(posts).slice(0, 6);
  } catch {
    error = "Could not load articles. Make sure the gateway is running.";
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (recent.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
        No published articles yet. Sign in and publish your first post.
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
        <h2 className="text-2xl font-semibold">Recent articles</h2>
        <Link href="/posts" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

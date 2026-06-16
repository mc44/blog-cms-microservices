import { PostCard } from "@/components/post-card";
import { listPosts } from "@/lib/api";
import { sortPostsByPublished } from "@/lib/format";

export async function PostsList() {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;

  try {
    const raw = await listPosts({ status: "PUBLISHED" });
    posts = sortPostsByPublished(raw);
  } catch {
    error = "Could not reach the gateway. Start the stack and try again.";
  }

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
        No published articles yet.
      </p>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

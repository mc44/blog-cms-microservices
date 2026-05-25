import { PostCard } from "@/components/post-card";
import { listPosts } from "@/lib/api";
import { sortPostsByPublished } from "@/lib/format";

export default async function PostsPage() {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;
  try {
    const raw = await listPosts({ status: "PUBLISHED" });
    posts = sortPostsByPublished(raw);
  } catch {
    error = "Could not reach the gateway. Start the stack and try again.";
  }

  return (
    <div className="space-y-10">
      <header className="mx-auto max-w-2xl space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground">Published posts from this site.</p>
      </header>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
      {!error && posts.length === 0 && (
        <p className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
          No published articles yet.
        </p>
      )}
      {posts.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

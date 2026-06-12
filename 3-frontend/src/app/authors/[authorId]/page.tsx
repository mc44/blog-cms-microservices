import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { listPosts } from "@/lib/api";
import { formatAuthorLabel, sortPostsByPublished } from "@/lib/format";

export default async function AuthorPostsPage({
  params,
}: {
  params: Promise<{ authorId: string }>;
}) {
  const { authorId } = await params;
  const label = formatAuthorLabel(authorId);
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;
  try {
    const raw = await listPosts({ authorId, status: "PUBLISHED" });
    posts = sortPostsByPublished(raw);
  } catch {
    error = "Could not load articles.";
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground">
          ← All articles
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">
          Articles by {label}
        </h1>
      </header>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error && posts.length === 0 && (
        <p className="text-muted-foreground">No published articles from this author.</p>
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

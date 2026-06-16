import { PostCard } from "@/components/post-card";
import { listPosts } from "@/lib/api";
import { sortPostsByPublished } from "@/lib/format";

interface AuthorPostsListProps {
  authorId: string;
}

export async function AuthorPostsList({ authorId }: AuthorPostsListProps) {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error: string | null = null;

  try {
    const raw = await listPosts({ authorId, status: "PUBLISHED" });
    posts = sortPostsByPublished(raw);
  } catch {
    error = "Could not load articles.";
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground">No published articles from this author.</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

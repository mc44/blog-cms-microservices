import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post;
  try {
    post = await getPost(id);
  } catch {
    notFound();
  }

  if (post.status !== "PUBLISHED") {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">This post is not published.</p>
        <Link href="/posts" className="text-sm text-primary hover:underline">
          Back to posts
        </Link>
      </div>
    );
  }

  const cover = post.mediaRefs?.[0]?.secureUrl;

  return (
    <article className="space-y-6">
      <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground">
        ← All posts
      </Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          By {post.authorId} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>
      </header>
      {cover && (
        <img src={cover} alt="" className="max-h-80 w-full rounded-lg border border-border object-cover" />
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
        {post.content}
      </div>
      <p>
        <Link href={`/authors/${post.authorId}`} className="text-sm text-primary hover:underline">
          More by this author
        </Link>
      </p>
    </article>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";
import {
  formatAuthorLabel,
  formatPostDate,
  readingTimeMinutes,
} from "@/lib/format";

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
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-muted-foreground">This article is not published.</p>
        <Link href="/posts" className="text-sm text-primary hover:underline">
          ← Back to articles
        </Link>
      </div>
    );
  }

  const cover = post.mediaRefs?.[0]?.secureUrl;
  const date = formatPostDate(post.publishedAt ?? post.createdAt);
  const author = formatAuthorLabel(post.authorId);
  const readMins = readingTimeMinutes(post.content);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/posts"
        className="inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← All articles
      </Link>
      <header className="space-y-4 border-b border-border pb-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <Link href={`/authors/${post.authorId}`} className="font-medium hover:text-foreground hover:underline">
            {author}
          </Link>
          {date && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt ?? post.createdAt}>{date}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{readMins} min read</span>
        </div>
      </header>
      {cover && (
        <img
          src={cover}
          alt=""
          className="w-full rounded-lg border border-border object-cover"
        />
      )}
      <div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-p:whitespace-pre-wrap">
        <p>{post.content}</p>
      </div>
      <footer className="border-t border-border pt-8">
        <Link href={`/authors/${post.authorId}`} className="text-sm font-medium text-primary hover:underline">
          More by {author} →
        </Link>
      </footer>
    </article>
  );
}

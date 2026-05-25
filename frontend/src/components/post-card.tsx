import Link from "next/link";
import type { Post } from "@/lib/api";
import { formatAuthorLabel, formatPostDate, postExcerpt } from "@/lib/format";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const cover = post.mediaRefs?.[0]?.secureUrl;
  const date = formatPostDate(post.publishedAt ?? post.createdAt);
  const author = formatAuthorLabel(post.authorId);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="block">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="aspect-[16/9] w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[16/9] w-full bg-muted" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {date && <time dateTime={post.publishedAt ?? post.createdAt}>{date}</time>}
          {date && <span aria-hidden>·</span>}
          <Link
            href={`/authors/${post.authorId}`}
            className="hover:text-foreground hover:underline"
          >
            {author}
          </Link>
        </div>
        <h2 className="text-xl font-semibold leading-snug tracking-tight">
          <Link href={`/posts/${post.id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {postExcerpt(post.content)}
        </p>
        <Link
          href={`/posts/${post.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}

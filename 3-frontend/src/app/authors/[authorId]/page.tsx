import Link from "next/link";
import { Suspense } from "react";
import { AuthorPostsList } from "@/components/posts/author-posts-list";
import { PostGridSkeleton } from "@/components/skeletons/post-grid-skeleton";
import { formatAuthorLabel } from "@/lib/format";

export default async function AuthorPostsPage({
  params,
}: {
  params: Promise<{ authorId: string }>;
}) {
  const { authorId } = await params;
  const label = formatAuthorLabel(authorId);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground">
          ← All articles
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Articles by {label}</h1>
      </header>
      <Suspense fallback={<PostGridSkeleton count={4} columns="list" />}>
        <AuthorPostsList authorId={authorId} />
      </Suspense>
    </div>
  );
}

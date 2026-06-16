import { Suspense } from "react";
import { PostsList } from "@/components/posts/posts-list";
import { PostGridSkeleton } from "@/components/skeletons/post-grid-skeleton";

export default function PostsPage() {
  return (
    <div className="space-y-10">
      <header className="mx-auto max-w-2xl space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground">Published posts from this site.</p>
      </header>
      <Suspense fallback={<PostGridSkeleton count={4} columns="list" />}>
        <PostsList />
      </Suspense>
    </div>
  );
}

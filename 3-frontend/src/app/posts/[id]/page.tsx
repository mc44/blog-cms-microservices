import { Suspense } from "react";
import { PostArticle } from "@/components/posts/post-article";
import { ArticleSkeleton } from "@/components/skeletons/article-skeleton";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <PostArticle id={id} />
    </Suspense>
  );
}

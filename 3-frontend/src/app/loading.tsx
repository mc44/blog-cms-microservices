import { PostGridSkeleton } from "@/components/skeletons/post-grid-skeleton";

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-5 w-64 animate-pulse rounded bg-muted" />
      </div>
      <PostGridSkeleton count={4} columns="list" />
    </div>
  );
}

interface PostGridSkeletonProps {
  count?: number;
  columns?: "home" | "list";
}

function PostCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 6, columns = "home" }: PostGridSkeletonProps) {
  const gridClass =
    columns === "home"
      ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-8 md:grid-cols-2";

  return (
    <div className={gridClass} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

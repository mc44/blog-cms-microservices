interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card" aria-hidden>
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex gap-8">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="hidden h-4 w-20 animate-pulse rounded bg-muted sm:block" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-muted sm:block" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8" aria-hidden>
      <div className="space-y-4">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-28 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

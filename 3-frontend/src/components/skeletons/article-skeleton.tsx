export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-8" aria-hidden>
      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      <header className="space-y-4 border-b border-border pb-8">
        <div className="h-10 w-full animate-pulse rounded bg-muted sm:h-12" />
        <div className="flex gap-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </header>
      <div className="aspect-[16/9] w-full animate-pulse rounded-lg bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-muted"
            style={{ width: i % 3 === 2 ? "70%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

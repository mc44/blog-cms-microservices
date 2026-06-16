import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function MyPostsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

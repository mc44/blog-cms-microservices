import { PostGridSkeleton } from "@/components/skeletons/post-grid-skeleton";

export default function PostsLoading() {
  return <PostGridSkeleton count={4} columns="list" />;
}

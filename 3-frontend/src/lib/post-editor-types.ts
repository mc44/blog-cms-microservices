import type { PostStatus } from "@/lib/api";

export interface PostEditorValues {
  title: string;
  content: string;
  status: PostStatus;
  mediaRefs: { cloudinaryPublicId: string; secureUrl?: string }[];
}

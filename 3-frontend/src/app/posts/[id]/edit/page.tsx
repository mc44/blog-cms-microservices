"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditorSkeleton } from "@/components/skeletons/table-skeleton";
import { PostEditor } from "@/components/post-editor";
import { getPostAuthorized, updatePost } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<{
    title: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    mediaRefs: { cloudinaryPublicId: string; secureUrl?: string }[];
  } | null>(null);
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | undefined>();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    getPostAuthorized(id)
      .then((post) => {
        setInitial({
          title: post.title,
          content: post.content,
          status: post.status,
          mediaRefs: post.mediaRefs ?? [],
        });
        setServerUpdatedAt(post.updatedAt);
      })
      .catch(() => router.replace("/me/posts"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading || !initial) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-40 animate-pulse rounded bg-muted" />
        <EditorSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Edit post</h1>
        <Link
          href={`/posts/${id}/preview`}
          className="text-sm text-primary hover:underline"
        >
          Preview
        </Link>
      </div>
      <PostEditor
        postId={id}
        initial={initial}
        serverUpdatedAt={serverUpdatedAt}
        submitLabel="Update post"
        onSubmit={async (values) => {
          await updatePost(id, values);
          router.push("/me/posts");
        }}
      />
    </div>
  );
}

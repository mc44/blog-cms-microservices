"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostEditor } from "@/components/post-editor";
import { getPost, updatePost } from "@/lib/api";
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

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    getPost(id)
      .then((post) =>
        setInitial({
          title: post.title,
          content: post.content,
          status: post.status,
          mediaRefs: post.mediaRefs ?? [],
        })
      )
      .catch(() => router.replace("/me/posts"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading || !initial) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit post</h1>
      <PostEditor
        initial={initial}
        submitLabel="Update post"
        onSubmit={async (values) => {
          await updatePost(id, values);
          router.push("/me/posts");
        }}
      />
    </div>
  );
}

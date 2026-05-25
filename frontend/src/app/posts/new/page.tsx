"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PostEditor } from "@/components/post-editor";
import { createPost } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function NewPostPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAccessToken()) router.replace("/login");
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New post</h1>
      <PostEditor
        initial={{ title: "", content: "", status: "DRAFT", mediaRefs: [] }}
        submitLabel="Save post"
        onSubmit={async (values) => {
          await createPost(values);
          router.push("/me/posts");
        }}
      />
    </div>
  );
}

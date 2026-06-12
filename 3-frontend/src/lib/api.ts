import { authHeaders, getAccessToken } from "./auth";

const GATEWAY =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8080";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ?? "blog-cms";

export type PostStatus = "DRAFT" | "PUBLISHED";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  authorId: string;
  mediaRefs: { cloudinaryPublicId: string; secureUrl?: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  accessTokenExpiresInSeconds: number;
  refreshToken: string;
  refreshTokenExpiresInSeconds: number;
  roles: string[];
}

export interface MediaAsset {
  publicId: string;
  secureUrl: string;
}

function postsUrl(params?: { status?: PostStatus; authorId?: string }) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.authorId) search.set("authorId", params.authorId);
  const q = search.toString();
  return `${GATEWAY}/blog/posts${q ? `?${q}` : ""}`;
}

export async function login(
  email: string,
  password: string
): Promise<AuthTokenResponse> {
  const res = await fetch(`${GATEWAY}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenantId: TENANT_ID, email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function listPosts(options?: {
  status?: PostStatus;
  authorId?: string;
}): Promise<Post[]> {
  const res = await fetch(postsUrl(options), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${GATEWAY}/blog/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function createPost(body: {
  title: string;
  content: string;
  status: PostStatus;
  mediaRefs?: { cloudinaryPublicId: string; secureUrl?: string }[];
}): Promise<Post> {
  const res = await fetch(`${GATEWAY}/blog/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      title: body.title,
      content: body.content,
      status: body.status,
      categoryIds: [],
      tagIds: [],
      mediaRefs: body.mediaRefs ?? [],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to create post");
  }
  return res.json();
}

export async function updatePost(
  id: string,
  body: {
    title: string;
    content: string;
    status: PostStatus;
    mediaRefs?: { cloudinaryPublicId: string; secureUrl?: string }[];
  }
): Promise<Post> {
  const res = await fetch(`${GATEWAY}/blog/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      title: body.title,
      content: body.content,
      status: body.status,
      categoryIds: [],
      tagIds: [],
      mediaRefs: body.mediaRefs ?? [],
    }),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${GATEWAY}/blog/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete post");
}

export async function uploadMedia(file: File): Promise<MediaAsset> {
  const token = getAccessToken();
  if (!token) throw new Error("Login required to upload media");

  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${GATEWAY}/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { publicId: data.publicId, secureUrl: data.secureUrl };
}

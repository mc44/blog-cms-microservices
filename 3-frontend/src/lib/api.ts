import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ?? "blog-cms";

function gatewayBaseUrl(): string {
  if (typeof window === "undefined" && process.env.GATEWAY_INTERNAL_URL) {
    return process.env.GATEWAY_INTERNAL_URL;
  }
  return process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8080";
}

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
  return `${gatewayBaseUrl()}/blog/posts${q ? `?${q}` : ""}`;
}

let refreshInFlight: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Session expired");
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(`${gatewayBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        throw new Error("Session expired");
      }
      const tokens: AuthTokenResponse = await res.json();
      setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

async function authorizedFetch(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Login required");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(url, { ...init, headers });
  if (res.status !== 401) {
    return res;
  }

  const newToken = await refreshAccessToken();
  headers.set("Authorization", `Bearer ${newToken}`);
  res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    clearTokens();
    throw new Error("Session expired");
  }
  return res;
}

export async function login(
  email: string,
  password: string
): Promise<AuthTokenResponse> {
  const res = await fetch(`${gatewayBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenantId: TENANT_ID, email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await fetch(`${gatewayBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Best effort; clear local session regardless.
    }
  }
  clearTokens();
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
  const res = await fetch(`${gatewayBaseUrl()}/blog/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function createPost(body: {
  title: string;
  content: string;
  status: PostStatus;
  mediaRefs?: { cloudinaryPublicId: string; secureUrl?: string }[];
}): Promise<Post> {
  const res = await authorizedFetch(`${gatewayBaseUrl()}/blog/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const res = await authorizedFetch(`${gatewayBaseUrl()}/blog/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
  const res = await authorizedFetch(`${gatewayBaseUrl()}/blog/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete post");
}

export async function uploadMedia(file: File): Promise<MediaAsset> {
  const form = new FormData();
  form.append("file", file);
  const res = await authorizedFetch(`${gatewayBaseUrl()}/media/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return { publicId: data.publicId, secureUrl: data.secureUrl };
}

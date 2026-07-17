"use client";

export class AdminAuthError extends Error {}

export async function adminFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const isFormData = init?.body instanceof FormData;

  if (!isFormData && init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    throw new AdminAuthError("Session expired or invalid.");
  }

  return res;
}

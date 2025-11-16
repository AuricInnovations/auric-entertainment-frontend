// src/lib/api.ts

// In dev we always go through the Vite proxy at /api
const BASE = "/api";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("auric_jwt");
  const headers = new Headers(init.headers || {});

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // path should start with "/", e.g. "/events"
  return fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: "omit",
  });
}

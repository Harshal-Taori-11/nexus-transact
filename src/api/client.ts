export const API_BASE = "http://localhost:8080";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T = any>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    token?: string | null;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": body instanceof FormData ? undefined as any : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    } as any,
    body: body instanceof FormData ? (body as any) : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : (await res.text() as any);

  if (!res.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

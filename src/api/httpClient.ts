import { API_BASE_URL, type HttpHeaders, type RequestOptions } from "./config";

// Simple HTTP client for public APIs (no authentication)
export class SimpleHttpClient {
  async request<T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: HttpHeaders = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    // Return text for non-JSON responses
    return (await response.text()) as unknown as T;
  }
}

export const simpleHttp = new SimpleHttpClient();

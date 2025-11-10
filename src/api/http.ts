import {
  API_BASE_URL,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  type HttpHeaders,
  type RequestOptions,
} from "./config";

type RefreshFunction = (
  refreshToken: string
) => Promise<{ accessToken: string; refreshToken?: string } | null>;

class AuthHttpClient {
  private isRefreshing: boolean = false;
  private pendingQueue: Array<(token: string | null) => void> = [];
  private doRefresh: RefreshFunction;

  constructor(refreshFn: RefreshFunction) {
    this.doRefresh = refreshFn;
  }

  private getAccessToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  }

  private getRefreshToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;
  }

  private setTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private async refreshTokenIfNeeded(): Promise<string | null> {
    const currentToken = this.getAccessToken();
    if (currentToken) return currentToken;

    if (this.isRefreshing) {
      return new Promise<string | null>((resolve) =>
        this.pendingQueue.push(resolve)
      );
    }

    this.isRefreshing = true;
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearTokens();
        this.flushQueue(null);
        return null;
      }
      const res = await this.doRefresh(refreshToken);
      if (res?.accessToken) {
        this.setTokens(res.accessToken, res.refreshToken);
        this.flushQueue(res.accessToken);
        return res.accessToken;
      }
      this.clearTokens();
      this.flushQueue(null);
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  private flushQueue(token: string | null) {
    this.pendingQueue.forEach((resolve) => resolve(token));
    this.pendingQueue = [];
  }

  async request<T = any>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: HttpHeaders = { ...(options.headers || {}) };

    // Don't set Content-Type for FormData, let browser handle it
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    let token = this.getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const doFetch = async (): Promise<Response> => {
      return fetch(`${API_BASE_URL}${path}`, {
        method: options.method || "GET",
        headers,
        body:
          options.body instanceof FormData
            ? options.body
            : options.body
            ? JSON.stringify(options.body)
            : undefined,
        signal: options.signal,
      });
    };

    let response = await doFetch();

    if (response.status === 401) {
      token = await this.refreshTokenIfNeeded();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        response = await doFetch();
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    // allow non-json occasionally
    return (await response.text()) as T;
  }
}

export default AuthHttpClient;

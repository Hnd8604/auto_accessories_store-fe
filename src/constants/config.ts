export const API_BASE_URL: string =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export type HttpHeaders = Record<string, string>;

export interface RequestOptions {
  method?: string;
  headers?: HttpHeaders;
  body?: any;
  signal?: AbortSignal;
}

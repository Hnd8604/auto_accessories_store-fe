export const API_BASE_URL: string =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// Google OAuth2 Configuration
export const GOOGLE_CLIENT_ID: string =
  (import.meta as any)?.env?.VITE_GOOGLE_CLIENT_ID || "990160635393-f6kevb8bg75jpi62lj429sjum10so4fq.apps.googleusercontent.com";
export const GOOGLE_REDIRECT_URI: string =
  (import.meta as any)?.env?.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

// Cloudinary Configuration
// Note: These should be moved to environment variables in production
export const CLOUDINARY_CONFIG = {
  cloudName: "dsgftzhzt",
  apiKey: "363524259282383",
  apiSecret: "Fgg6RVnlQNtIe1cfAgg5sKORENw",
  uploadPreset: "ml_default", // You need to create an unsigned upload preset in Cloudinary dashboard
  // Alternative: use signed upload via backend API for better security
};

export type HttpHeaders = Record<string, string>;

export interface RequestOptions {
  method?: string;
  headers?: HttpHeaders;
  body?: any;
  signal?: AbortSignal;
}

import type { UserResponse } from './user';

// Authentication Types
export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  authenticated: boolean;
}

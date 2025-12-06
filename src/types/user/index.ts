// User & Role Response Types
export interface PermissionResponse {
  name: string;
  description?: string;
}

export interface RoleResponse {
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roles?: RoleResponse[];
}

// User Request Types
export interface UserCreationRequest {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface UserUpdateRequest extends Partial<UserCreationRequest> {
  roles?: string[];
}

export interface RoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface PermissionRequest {
  name: string;
  description?: string;
}

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

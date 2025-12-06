import { UserResponse } from "@/types/api";

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Check if user has a specific role
 */
export const hasRole = (
  user: UserResponse | null | undefined,
  roleName: string
): boolean => {
  if (!user?.role?.name) return false;
  return user.role.name.toUpperCase() === roleName.toUpperCase();
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: UserResponse | null | undefined): boolean => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Check if user is regular user
 */
export const isUser = (user: UserResponse | null | undefined): boolean => {
  return hasRole(user, ROLES.USER);
};

/**
 * Get user role name
 */
export const getUserRole = (
  user: UserResponse | null | undefined
): string | null => {
  return user?.role?.name || null;
};

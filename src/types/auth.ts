/**
 * Authentication types for WICGATE
 */

export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

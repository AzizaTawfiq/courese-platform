export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

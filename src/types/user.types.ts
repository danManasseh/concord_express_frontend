export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  station?: Station;
  is_active: boolean;
  created_at: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  address: string;
  contact_phone: string | null;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}
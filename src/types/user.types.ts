export type UserRole = 'user' | 'admin' | 'superadmin';

export interface Station {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: number;  // backend uses integers
  name: string;
  email: string | null;
  phone: string;

  role: "user" | "admin" | "superadmin";
  is_active: boolean;

  // normalized station structure
  station: Station | null;

  // timestamps returned by backend
  created_at: string;
  updated_at: string;
}


export interface Station {
  id: number;
  code: string;
  name: string;
  address: string;
  contact_phone: string | null;
  is_active: boolean;
}

export interface LoginRequest {
  phone: string;  // Changed from email to phone
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email?: string;  // Email is optional
  phone: string;
  password: string;
}
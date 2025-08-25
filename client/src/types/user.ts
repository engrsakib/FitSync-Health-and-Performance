export type Role = "ADMIN" | "TRAINER" | "TRAINEE"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  is_authenticated: boolean
  is_loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: Role
  avatar?: string
}

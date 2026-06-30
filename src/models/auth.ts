export interface AuthUser {
  userId: string;
  username: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RefreshResponse {
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  ok: boolean;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface ApiErrorResponse {
  error: string;
}

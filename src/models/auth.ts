export interface AuthUser {
  id: string;
  username: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RefreshResponse {
  user: AuthUser;
}

export interface CurrentAuthUser {
  userId: string;
  username: string;
}

export interface MeResponse {
  user: CurrentAuthUser;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface ApiErrorResponse {
  error: string;
}

import { apiFetch, RequestMethod } from './client';
import type {
  LoginRequestBody,
  LoginResponse,
  MeResponse,
  RefreshResponse,
} from '../models/auth';

/**
 * Authenticates a user and stores auth cookies through the browser.
 *
 * @param username Username to authenticate.
 * @param password Password to authenticate.
 * @returns Authenticated user response.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const body: LoginRequestBody = {
    username,
    password,
  };

  return await apiFetch<LoginResponse>('/auth/login', {
    method: RequestMethod.Post,
    body,
  });
}

/**
 * Rotates auth cookies with the refresh token cookie.
 *
 * @returns Refreshed authenticated user response.
 */
export async function refresh(): Promise<RefreshResponse> {
  return await apiFetch<RefreshResponse>('/auth/refresh', {
    method: RequestMethod.Post,
  });
}

/**
 * Gets the current authenticated user from the access token cookie.
 *
 * @returns Current authenticated user response.
 */
export async function me(): Promise<MeResponse> {
  return await apiFetch<MeResponse>('/me', {
    method: RequestMethod.Get,
  });
}

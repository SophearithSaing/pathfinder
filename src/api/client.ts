import type { ApiErrorResponse } from '../models/auth';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export enum RequestMethod {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

interface ApiFetchOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: RequestMethod;
  body?: unknown;
}

/**
 * Sends a request to the API with shared credentials and error handling.
 *
 * @param path API path beginning with a slash.
 * @param options Fetch options for the request.
 * @returns Parsed JSON response body.
 */
export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(options),
    credentials: 'include',
    body: getBody(options.body),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return (await response.json()) as TResponse;
}

/**
 * Builds request headers for an API call.
 *
 * @param options Fetch options for the request.
 * @returns Headers for the request.
 */
function getHeaders(options: ApiFetchOptions): HeadersInit {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

/**
 * Builds the request body for an API call.
 *
 * @param body Request body value.
 * @returns Serialized request body.
 */
function getBody(body: unknown): BodyInit | null | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === 'string' || body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

/**
 * Parses a failed API response into a readable error.
 *
 * @param response Failed fetch response.
 * @returns Error with a readable message.
 */
async function parseErrorResponse(response: Response): Promise<Error> {
  const fallbackMessage = getFallbackErrorMessage(response.status);

  try {
    const body = (await response.json()) as unknown;

    if (isApiErrorResponse(body)) {
      return new Error(body.error);
    }
  } catch {
    return new Error(fallbackMessage);
  }

  return new Error(fallbackMessage);
}

/**
 * Checks whether a value matches the common API error response.
 *
 * @param value Value to inspect.
 * @returns Whether the value is an API error response.
 */
function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  );
}

/**
 * Gets a readable fallback error message for a failed status code.
 *
 * @param status HTTP status code.
 * @returns Fallback error message.
 */
function getFallbackErrorMessage(status: number): string {
  if (status === 400) {
    return 'Valid request data is required.';
  }

  if (status === 401) {
    return 'Authentication is required.';
  }

  return 'Unable to complete the request. Please try again.';
}

/**
 * Gets a readable error message from an unknown error value.
 *
 * @param error Unknown error value.
 * @param fallbackMessage Message to use when the error is not an Error.
 * @returns Error message.
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred.',
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

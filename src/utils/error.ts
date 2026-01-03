export function getErrorMessage(
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred',
): string {
  const errorMessage =
    error instanceof Error && error.message ? error.message : undefined

  return errorMessage || fallbackMessage
}

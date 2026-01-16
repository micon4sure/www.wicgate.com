/**
 * Error Type Hierarchy
 *
 * Provides type-safe error handling across the application.
 * Replaces generic `any` types in catch blocks with specific error classes
 * that include context and enable proper error handling.
 *
 * @example
 * ```typescript
 * try {
 *   await fetch('/api/data');
 * } catch (error: unknown) {
 *   if (isApiError(error)) {
 *     console.error(`API Error (${error.statusCode}): ${error.message}`);
 *     AnalyticsEvents.apiError(error.endpoint);
 *   } else if (isNetworkError(error)) {
 *     console.error('Network error:', error.message);
 *   } else {
 *     console.error('Unknown error:', error);
 *   }
 * }
 * ```
 */

/**
 * API-specific error with endpoint and status code context
 */
export class ApiError extends Error {
  /**
   * @param message - Human-readable error message
   * @param endpoint - API endpoint that failed (e.g., '/api/data')
   * @param statusCode - HTTP status code if available
   */
  constructor(
    message: string,
    public readonly endpoint: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Network-related error (no response received)
 */
export class NetworkError extends Error {
  /**
   * @param message - Human-readable error message
   * @param cause - Original error that caused this network error
   */
  constructor(
    message: string,
    public override readonly cause?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

/**
 * Data validation error with optional field context
 */
export class ValidationError extends Error {
  /**
   * @param message - Human-readable error message
   * @param field - Field name that failed validation (optional)
   * @param value - Invalid value that was provided (optional)
   */
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Storage-related error (localStorage, sessionStorage)
 */
export class StorageError extends Error {
  /**
   * @param message - Human-readable error message
   * @param key - Storage key that caused the error
   * @param operation - Operation that failed ('get', 'set', 'remove')
   */
  constructor(
    message: string,
    public readonly key: string,
    public readonly operation: 'get' | 'set' | 'remove'
  ) {
    super(message);
    this.name = 'StorageError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }
}

/**
 * Union type of all application errors
 */
export type AppError = ApiError | NetworkError | ValidationError | StorageError;

/**
 * Type guard to check if error is an ApiError
 * @param error - Error to check
 * @returns True if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if error is a NetworkError
 * @param error - Error to check
 * @returns True if error is NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard to check if error is a ValidationError
 * @param error - Error to check
 * @returns True if error is ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a StorageError
 * @param error - Error to check
 * @returns True if error is StorageError
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Type guard to check if error is any AppError type
 * @param error - Error to check
 * @returns True if error is one of the AppError types
 */
export function isAppError(error: unknown): error is AppError {
  return (
    isApiError(error) || isNetworkError(error) || isValidationError(error) || isStorageError(error)
  );
}

/**
 * Extract a user-friendly error message from any error type
 * @param error - Error to extract message from
 * @returns Human-readable error message
 *
 * @example
 * ```typescript
 * catch (error: unknown) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return `API Error (${error.statusCode || 'unknown'}): ${error.message}`;
  }

  if (isNetworkError(error)) {
    return `Network Error: ${error.message}`;
  }

  if (isValidationError(error)) {
    const field = error.field ? ` (field: ${error.field})` : '';
    return `Validation Error${field}: ${error.message}`;
  }

  if (isStorageError(error)) {
    return `Storage Error (${error.operation} '${error.key}'): ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

/**
 * Create an ApiError from a fetch Response
 * @param response - Fetch Response object
 * @param endpoint - API endpoint that was called
 * @returns ApiError with status code and response details
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/data');
 * if (!response.ok) {
 *   throw await apiErrorFromResponse(response, '/api/data');
 * }
 * ```
 */
export async function apiErrorFromResponse(
  response: Response,
  endpoint: string
): Promise<ApiError> {
  let message = `HTTP ${response.status} ${response.statusText}`;

  try {
    // Try to extract error message from response body
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const body = await response.json();
      if (body.error || body.message) {
        message = body.error || body.message;
      }
    } else {
      const text = await response.text();
      if (text) {
        message = text.slice(0, 200); // Limit message length
      }
    }
  } catch {
    // If parsing fails, use default message
  }

  return new ApiError(message, endpoint, response.status);
}

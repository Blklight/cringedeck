/**
 * API - TypeScript Types
 *
 * Base, shared types for the API contract plus a small example resource.
 * Replace the example types with your own domain types and keep this file in
 * sync with the backend.
 *
 * No runtime dependencies - this file is 100% pure TypeScript.
 *
 * Note on Dates: all date fields are ISO 8601 strings
 * (e.g., "2024-01-15T10:30:00.000Z").
 */

// =============================================================================
// SHARED BASE TYPES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  message: string;
}

/**
 * API error details
 */
export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

/**
 * Validation error response
 */
export interface ApiValidationError extends ApiError {
  code: "VALIDATION_ERROR";
  fields: Record<string, string>;
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
}

// =============================================================================
// AUTH TYPES
// =============================================================================

/**
 * POST /api/v1/auth/register
 */
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

/**
 * POST /api/v1/auth/login
 */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshResponse {
  accessToken: string;
  user?: User | null;
}

// =============================================================================
// USER TYPES
// =============================================================================

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  role: "user" | "admin";
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt?: string;
}

// =============================================================================
// EXAMPLE RESOURCE (replace with your own domain types)
// =============================================================================

export interface Item {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  title: string;
  description?: string | null;
}

export interface UpdateItemRequest {
  title?: string;
  description?: string | null;
}

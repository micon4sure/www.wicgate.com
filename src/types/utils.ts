/**
 * Common utility types for improved type safety and developer experience
 * @module types/utils
 */

// ============================================================================
// Basic Utility Types
// ============================================================================

/**
 * Makes a type nullable (T | null)
 * @example
 * ```typescript
 * type MaybeString = Nullable<string>; // string | null
 * const value: MaybeString = null; // ✅ valid
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Makes a type optional (T | undefined)
 * @example
 * ```typescript
 * type MaybeNumber = Optional<number>; // number | undefined
 * const value: MaybeNumber = undefined; // ✅ valid
 * ```
 */
export type Optional<T> = T | undefined;

/**
 * Makes a type nullable or undefined (T | null | undefined)
 * @example
 * ```typescript
 * type MaybeBoolean = Maybe<boolean>; // boolean | null | undefined
 * ```
 */
export type Maybe<T> = T | null | undefined;

/**
 * Makes all properties of T deeply readonly
 * Recursively applies readonly to all nested objects and arrays
 * @example
 * ```typescript
 * type Config = ReadonlyDeep<{
 *   settings: {
 *     theme: string;
 *     options: string[];
 *   }
 * }>;
 * // All nested properties are readonly
 * ```
 */
export type ReadonlyDeep<T> = T extends (infer R)[]
  ? ReadonlyArray<ReadonlyDeep<R>>
  : T extends Function
    ? T
    : T extends object
      ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> }
      : T;

/**
 * Makes all properties of T deeply mutable (opposite of ReadonlyDeep)
 * Useful when you need to modify a deeply readonly type
 * @example
 * ```typescript
 * const config: ReadonlyDeep<Config> = getConfig();
 * const mutable: Mutable<typeof config> = structuredClone(config);
 * mutable.settings.theme = 'dark'; // ✅ valid
 * ```
 */
export type Mutable<T> =
  T extends ReadonlyArray<infer R>
    ? Array<Mutable<R>>
    : T extends Function
      ? T
      : T extends object
        ? { -readonly [K in keyof T]: Mutable<T[K]> }
        : T;

/**
 * Extracts the value type from a Promise
 * @example
 * ```typescript
 * type User = Awaited<Promise<{ id: number; name: string }>>; // { id: number; name: string }
 * ```
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Makes specific keys of T required
 * @example
 * ```typescript
 * interface User {
 *   id?: number;
 *   name?: string;
 *   email?: string;
 * }
 * type UserWithId = RequireKeys<User, 'id'>; // { id: number; name?: string; email?: string }
 * ```
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specific keys of T optional
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * type UserPartial = OptionalKeys<User, 'email'>; // { id: number; name: string; email?: string }
 * ```
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper with success state
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: 1, name: 'John' }
 * };
 * ```
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    timestamp?: number;
    duration?: number;
    [key: string]: any;
  };
}

/**
 * Paginated API response wrapper
 * @example
 * ```typescript
 * const response: PaginatedResponse<User> = {
 *   data: [...],
 *   pagination: {
 *     page: 1,
 *     pageSize: 20,
 *     total: 100
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore?: boolean;
  };
}

/**
 * Type-safe fetch response handler result
 * Either contains data or error, never both
 * @example
 * ```typescript
 * const result: FetchResult<User> = await safeFetch('/api/user');
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data);
 * }
 * ```
 */
export type FetchResult<T> = { data: T; error: null } | { data: null; error: Error };

// ============================================================================
// Function Utility Types
// ============================================================================

/**
 * Extracts the return type of an async function
 * @example
 * ```typescript
 * async function getUser() {
 *   return { id: 1, name: 'John' };
 * }
 * type User = AsyncReturnType<typeof getUser>; // { id: number; name: string }
 * ```
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>;

/**
 * Makes a function's parameters optional
 * @example
 * ```typescript
 * type Fn = (a: string, b: number) => void;
 * type OptionalFn = OptionalParameters<Fn>; // (a?: string, b?: number) => void
 * ```
 */
export type OptionalParameters<T extends (...args: any[]) => any> = (
  ...args: Partial<Parameters<T>>
) => ReturnType<T>;

// ============================================================================
// Object Utility Types
// ============================================================================

/**
 * Ensures an object has at least one property defined
 * @example
 * ```typescript
 * type Filter = AtLeastOne<{
 *   name?: string;
 *   email?: string;
 *   age?: number;
 * }>;
 * const valid: Filter = { name: 'John' }; // ✅ valid
 * const invalid: Filter = {}; // ❌ error
 * ```
 */
export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

/**
 * Ensures an object has exactly one property defined
 * @example
 * ```typescript
 * type Action = ExactlyOne<{
 *   create?: boolean;
 *   update?: boolean;
 *   delete?: boolean;
 * }>;
 * const valid: Action = { create: true }; // ✅ valid
 * const invalid: Action = { create: true, update: true }; // ❌ error
 * ```
 */
export type ExactlyOne<T> = {
  [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

/**
 * Deep partial - makes all properties optional recursively
 * @example
 * ```typescript
 * type Config = DeepPartial<{
 *   settings: {
 *     theme: string;
 *     fontSize: number;
 *   }
 * }>;
 * const partial: Config = { settings: { theme: 'dark' } }; // ✅ valid
 * ```
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Extracts keys of T where value type matches V
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 * type NumberKeys = KeysOfType<User, number>; // 'id' | 'age'
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// ============================================================================
// String Utility Types
// ============================================================================

/**
 * Extracts string literal types from a union
 * @example
 * ```typescript
 * type Status = 'pending' | 'active' | 'completed' | number;
 * type StatusStrings = ExtractStrings<Status>; // 'pending' | 'active' | 'completed'
 * ```
 */
export type ExtractStrings<T> = T extends string ? T : never;

/**
 * Excludes string literal types from a union
 * @example
 * ```typescript
 * type Mixed = 'foo' | 'bar' | number | boolean;
 * type NonStrings = ExcludeStrings<Mixed>; // number | boolean
 * ```
 */
export type ExcludeStrings<T> = T extends string ? never : T;

// ============================================================================
// Validation Guards
// ============================================================================

/**
 * Type guard to check if value is not null or undefined
 * @example
 * ```typescript
 * const values: (string | null | undefined)[] = ['a', null, 'b', undefined];
 * const filtered = values.filter(isDefined); // string[]
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is null or undefined
 * @example
 * ```typescript
 * if (isNullish(value)) {
 *   console.log('Value is null or undefined');
 * }
 * ```
 */
export function isNullish<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard to check if value is a string
 * @example
 * ```typescript
 * const values: (string | number)[] = ['a', 1, 'b', 2];
 * const strings = values.filter(isString); // string[]
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if value is a number (excluding NaN)
 * @example
 * ```typescript
 * if (isNumber(value)) {
 *   console.log(value.toFixed(2));
 * }
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Type guard to check if value is a boolean
 * @example
 * ```typescript
 * if (isBoolean(value)) {
 *   console.log(!value);
 * }
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if value is an object (excluding null and arrays)
 * @example
 * ```typescript
 * if (isObject(value)) {
 *   console.log(Object.keys(value));
 * }
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is an array
 * @example
 * ```typescript
 * if (isArray(value)) {
 *   console.log(value.length);
 * }
 * ```
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is a function
 * @example
 * ```typescript
 * if (isFunction(value)) {
 *   value();
 * }
 * ```
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Supabase stores section content as a JSON string (TEXT column).
 * This utility safely parses it back to an object/array regardless of whether
 * it arrives as a string or already-parsed value.
 */
export function parseContent<T = unknown>(raw: unknown): T | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }
  return raw as T
}

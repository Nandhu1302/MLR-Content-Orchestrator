import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Note: Removed 'type ClassValue' import as it's a TypeScript-only type.
// The remaining code functions identically in JavaScript.

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize a string by removing invalid Unicode surrogate characters
 * that can cause "Empty or invalid json" errors in Supabase
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  // Remove lone surrogates and other invalid Unicode characters
  // This handles corrupted emoji characters like \udcc8
  return str.replace(/[\uD800-\uDFFF]/g, '').trim();
}

/**
 * Recursively sanitize all strings in an object/array
 */
export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeObject(value);
      }
    }
    return cleaned;
  }
  return obj;
}

/**
 * Sanitize data before sending to Supabase database
 * Use this wrapper for all database insert/update operations
 */
export function sanitizeForDatabase(data) {
  return sanitizeObject(data);
}
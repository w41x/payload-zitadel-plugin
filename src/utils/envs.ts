import {readFileSync} from 'fs'

/**
 * Retrieves the content of an environment variable with support for file-based secrets (Docker secrets pattern).
 *
 * This function provides three modes of operation:
 * 1. Direct read: Returns the environment variable value as-is
 * 2. File read: Reads the content from a file path specified in the environment variable
 * 3. Fallback: Automatically tries the _FILE variant if the direct variable doesn't exist
 *
 * @param key - Name of environment variable name to retrieve content from
 * @param useFileCheck - Whether to enable file checking and _FILE fallback behavior (default: false)
 *
 * @returns The environment variable value, file contents, or undefined if not found
 *
 * @example
 * // Direct read (fileCheck = false)
 * getEnvContent('API_KEY') // Returns process.env.API_KEY
 *
 * @example
 * // Read from file (when name ends with _FILE)
 * // If PASSWORD_FILE=/run/secrets/password
 * getEnvContent('PASSWORD_FILE', true) // Returns contents of /run/secrets/password
 *
 * @example
 * // Automatic fallback (when name doesn't end with _FILE)
 * // If PASSWORD is not set but PASSWORD_FILE=/run/secrets/password exists
 * getEnvContent('PASSWORD', true) // Returns contents of /run/secrets/password
 *
 * @example
 * // Direct value takes precedence
 * // If PASSWORD=mysecret and PASSWORD_FILE also exists
 * getEnvContent('PASSWORD', true) // Returns "mysecret" (not the file contents)
 */
const getEnvContent = (key: string, useFileCheck = false): string | undefined => useFileCheck ?
    (key.toUpperCase().endsWith('_FILE') ?
            (process.env[key] ? readFileSync(process.env[key], 'utf8') : undefined) :
            (process.env[key] ? process.env[key] : getEnvContent(`${key}_FILE`, useFileCheck))
    ) : process.env[key]

/**
 * Loads multiple environment variables into a typed object.
 *
 * This is a convenience function that reads multiple environment variables at once
 * and returns them as a typed object. It supports the same file-based secrets pattern
 * as getEnvContent() when fileCheck is enabled.
 *
 * @template T - String literal union type representing the environment variable names
 * @param keys - Array of environment variable names to load
 * @param useFileCheck - Whether to enable file checking and _FILE fallback behavior (default: true)
 *
 * @returns A partial record mapping variable names to their values (undefined if not found)
 *
 * @example
 * // Basic usage with string array
 * const config = loadEnv(['API_KEY', 'DATABASE_URL'])
 * // Returns: { API_KEY?: string, DATABASE_URL?: string }
 *
 * @example
 * // Disable file checking for direct env var access only
 * const config = loadEnv(['NODE_ENV', 'PORT'], false)
 *
 * @example
 * // With Docker secrets (fileCheck = true)
 * // If DATABASE_PASSWORD_FILE=/run/secrets/db_password exists
 * const config = loadEnv(['DATABASE_PASSWORD'])
 * // Automatically reads from DATABASE_PASSWORD or DATABASE_PASSWORD_FILE
 *
 * @see getEnvContent for details on file checking behavior
 */
export const loadEnv = <T extends string>(
    keys: T[],
    useFileCheck = true
) => Object.fromEntries(keys.map(key => [key, getEnvContent(key as string, useFileCheck)])) as Partial<Record<T, string>>
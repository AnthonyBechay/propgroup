/**
 * Smart URL detection utility
 * Automatically detects the correct base URL in all environments
 * No configuration needed!
 */

/**
 * Gets the base URL for the application
 * Works automatically in all environments without configuration
 */
export function getBaseUrl(): string {
  // In the browser, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // On Vercel, use the automatic VERCEL_URL
  if (process.env.VERCEL_URL) {
    // Vercel automatically provides this for all deployments
    // Including preview deployments!
    return `https://${process.env.VERCEL_URL}`
  }
  
  // In development, use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

/**
 * Gets the full URL for a given path
 * @param path - The path to append to the base URL
 */
export function getUrl(path: string): string {
  const base = getBaseUrl()
  // Ensure proper URL joining
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

/**
 * Checks if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Checks if we're on Vercel
 */
export function isVercel(): boolean {
  return !!process.env.VERCEL
}

/**
 * Gets the environment name
 * Useful for debugging and logging
 */
export function getEnvironment(): 'production' | 'preview' | 'development' {
  if (process.env.VERCEL_ENV === 'production') {
    return 'production'
  }
  if (process.env.VERCEL_ENV === 'preview') {
    return 'preview'
  }
  return 'development'
}

/**
 * Example usage:
 * 
 * // In a component
 * const baseUrl = getBaseUrl()
 * const callbackUrl = getUrl('/auth/callback')
 * 
 * // In an API route
 * const environment = getEnvironment()
 * console.log(`Running in ${environment} mode`)
 * 
 * // For debugging
 * if (!isProduction()) {
 *   console.log('Debug info...')
 * }
 */

// Auth helper functions for JWT authentication

export function isTokenExpiredError(error: unknown): boolean {
  if (!error) return false
  
  const errorMessage = 
    (error as Error)?.message || 
    String(error)
  
  return (
    errorMessage.includes('Token expired') ||
    errorMessage.includes('jwt expired') ||
    errorMessage.includes('Invalid token') ||
    errorMessage.includes('Unauthorized')
  )
}

export function handleAuthError(error: unknown): { shouldSignOut: boolean; message: string } {
  if (isTokenExpiredError(error)) {
    return {
      shouldSignOut: true,
      message: 'Your session has expired. Please sign in again.'
    }
  }
  
  const errorMessage = (error as Error)?.message || 'An authentication error occurred'
  
  return {
    shouldSignOut: false,
    message: errorMessage
  }
}
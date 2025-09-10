import { AuthError } from '@supabase/supabase-js'

export function isRefreshTokenError(error: unknown): boolean {
  if (!error) return false
  
  const errorMessage = 
    (error as AuthError)?.message || 
    (error as Error)?.message || 
    String(error)
  
  return (
    errorMessage.includes('refresh_token_not_found') ||
    errorMessage.includes('Invalid Refresh Token') ||
    errorMessage.includes('Refresh Token Not Found') ||
    errorMessage.includes('JWT expired')
  )
}

export function handleAuthError(error: unknown): { shouldSignOut: boolean; message: string } {
  if (isRefreshTokenError(error)) {
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

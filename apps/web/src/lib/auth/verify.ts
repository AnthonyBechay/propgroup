import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export interface AuthUser {
  id: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isActive: boolean
  bannedAt?: Date | null
}

export interface AuthResult {
  authenticated: boolean
  user: AuthUser | null
}

/**
 * Verify authentication for API routes
 * Reads token from cookies and validates with backend
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return { authenticated: false, user: null }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    const backendUrl = apiUrl.startsWith('http') ? apiUrl : `https://propgroup.onrender.com/api`

    const response = await fetch(`${backendUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return { authenticated: false, user: null }
    }

    const data = await response.json()
    return {
      authenticated: true,
      user: data.user,
    }
  } catch (error) {
    console.error('[verifyAuth] Error:', error)
    return { authenticated: false, user: null }
  }
}

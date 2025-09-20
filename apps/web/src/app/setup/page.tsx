'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react'

export default function SetupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    type: 'success' | 'error'
    message: string
    details?: string[]
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setResult({
        type: 'error',
        message: 'Please enter an email address'
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/setup/create-super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NODE_ENV === 'development' ? 'dev-setup-only' : 'setup-secret'}`
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message,
          details: data.nextSteps
        })
      } else {
        setResult({
          type: 'error',
          message: data.error || 'Failed to create super admin'
        })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Network error. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Only show this page in development or if no super admin exists
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Setup Not Available
            </CardTitle>
            <CardDescription>
              This setup page is only available in development mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              In production, use the setup script or contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Super Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your first super admin user to manage the system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Super Admin Setup</CardTitle>
            <CardDescription>
              This will create the initial super admin user who can manage all other users and system settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This email will be used to log in as the super admin
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Super Admin...
                  </>
                ) : (
                  'Create Super Admin'
                )}
              </Button>
            </form>

            {result && (
              <Alert className={`mt-4 ${result.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                {result.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="font-medium">
                    {result.message}
                  </div>
                  {result.details && (
                    <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                      {result.details.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This setup page is only available in development mode.
            <br />
            In production, use the setup script or contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { ShieldOff, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <ShieldOff className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Access Denied
          </h1>
          
          <p className="mt-4 text-gray-600">
            You don&apos;t have permission to access this page. 
            This area is restricted to authorized personnel only.
          </p>
          
          <div className="mt-8 space-y-4">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            If you believe you should have access to this page, 
            please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

import { Ban, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <Ban className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Account Banned
          </h1>
          
          <p className="mt-4 text-gray-600">
            Your account has been suspended due to a violation of our terms of service.
            If you believe this is an error, please contact our support team.
          </p>
          
          <div className="mt-8 space-y-4">
            <Link href="mailto:support@propgroup.com">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't verify your authentication code. This might happen if:
          </p>
          <ul className="mt-4 text-left text-sm text-gray-600 space-y-2">
            <li>• The verification link has expired</li>
            <li>• The link has already been used</li>
            <li>• There was a network error</li>
          </ul>
        </div>
        <div className="mt-8 space-y-4">
          <Link href="/" className="block">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
          <p className="text-center text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

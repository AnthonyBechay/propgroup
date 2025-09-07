import { AuthSection } from '@/components/AuthSection'

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Investment Portal
          </h1>
          <AuthSection />
        </header>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to your Investment Portal
          </h2>
          <p className="text-gray-600 mb-6">
            This is a protected page that only authenticated users can access.
            If you can see this page, the authentication and middleware are working correctly!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">My Properties</h3>
              <p className="text-sm text-gray-600">View and manage your property investments</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Investment Calculator</h3>
              <p className="text-sm text-gray-600">Calculate potential returns on investments</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-sm text-gray-600">Access market insights and trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

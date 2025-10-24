import { Suspense } from 'react'
import AgentDashboardClient from './AgentDashboardClient'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Agent Dashboard | PropGroup',
  description: 'Manage your properties and client inquiries',
}

export default function AgentDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <AgentDashboardClient />
      </Suspense>
    </div>
  )
}

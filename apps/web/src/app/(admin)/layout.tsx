import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and role
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

  // Check if user has admin role
  try {
    const userProfile = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true }
    })

    if (!userProfile || userProfile.role !== 'ADMIN') {
      redirect('/portal/dashboard')
    }
  } catch (error) {
    console.error('Error checking user role:', error)
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

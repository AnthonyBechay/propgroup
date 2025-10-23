import { PortalLayoutClient } from '@/components/portal/PortalLayoutClient'

// Force dynamic rendering for all portal pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalLayoutClient>{children}</PortalLayoutClient>
}

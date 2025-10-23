import { prisma } from '@/lib/prisma'
import { PropertyTable } from '@/components/admin/PropertyTable'
import { CreatePropertyModal } from '@/components/admin/CreatePropertyModal'
import { Button } from '@/components/ui/button'
import { Plus, Building2 } from 'lucide-react'

export default async function AdminPropertiesPage() {
  // Layout already handles authentication, no need to check again
  let properties = []
  let developers = []
  let locationGuides = []

  try {
    // Fetch all properties with related data
    properties = await prisma.property.findMany({
      include: {
        developer: true,
        investmentData: true,
        locationGuide: true,
        _count: {
          select: {
            favoriteProperties: true,
            propertyInquiries: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch developers and location guides for the form
    const results = await Promise.all([
      prisma.developer.findMany({
        select: { id: true, name: true, country: true }
      }),
      prisma.locationGuide.findMany({
        select: { id: true, title: true, country: true }
      })
    ])
    developers = results[0]
    locationGuides = results[1]
  } catch (error) {
    console.error('Error fetching properties data:', error)
    // Return empty arrays if database query fails
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Properties
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all properties in your platform. Create, edit, and delete property listings.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <CreatePropertyModal 
            developers={developers}
            locationGuides={locationGuides}
          >
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </CreatePropertyModal>
        </div>
      </div>

      <div className="mt-8">
        <PropertyTable properties={properties} />
      </div>
    </div>
  )
}

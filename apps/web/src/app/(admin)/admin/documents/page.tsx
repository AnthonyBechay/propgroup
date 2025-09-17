import { getCurrentUser } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { 
  FileText, 
  Download, 
  Upload,
  File,
  Folder,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function DocumentsPage() {
  // Check if user is admin
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized')
  }

  // Mock documents data (in production, this would come from database)
  const documents = [
    {
      id: '1',
      name: 'Investment Guide - Georgia.pdf',
      type: 'PDF',
      size: '2.4 MB',
      category: 'Guides',
      uploadedBy: 'Admin',
      uploadedAt: new Date('2024-01-15'),
      downloads: 145
    },
    {
      id: '2',
      name: 'Golden Visa Requirements.docx',
      type: 'DOCX',
      size: '1.2 MB',
      category: 'Legal',
      uploadedBy: 'Admin',
      uploadedAt: new Date('2024-01-10'),
      downloads: 230
    },
    {
      id: '3',
      name: 'Property Purchase Agreement Template.pdf',
      type: 'PDF',
      size: '845 KB',
      category: 'Templates',
      uploadedBy: 'Super Admin',
      uploadedAt: new Date('2024-01-08'),
      downloads: 89
    },
    {
      id: '4',
      name: 'Market Analysis Q1 2024.xlsx',
      type: 'XLSX',
      size: '3.1 MB',
      category: 'Reports',
      uploadedBy: 'Admin',
      uploadedAt: new Date('2024-01-05'),
      downloads: 67
    },
    {
      id: '5',
      name: 'Tax Guidelines for Foreign Investors.pdf',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Legal',
      uploadedBy: 'Admin',
      uploadedAt: new Date('2024-01-03'),
      downloads: 198
    }
  ]

  const categories = ['All', 'Guides', 'Legal', 'Templates', 'Reports']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Document Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and organize all platform documents, templates, and guides.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Documents
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {documents.length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Downloads
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Categories
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {categories.length - 1}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Storage Used
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              12.5 GB
            </dd>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Folder className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <File className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doc.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.downloads}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{doc.uploadedAt.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">by {doc.uploadedBy}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Button variant="outline" className="justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
          <Button variant="outline" className="justify-start">
            <Folder className="h-4 w-4 mr-2" />
            Organize Categories
          </Button>
          <Button variant="outline" className="justify-start">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
        </div>
      </div>
    </div>
  )
}

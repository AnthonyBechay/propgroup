import { getCurrentUser } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Key,
  Palette,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default async function SettingsPage() {
  // Check if user is admin
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized')
  }

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your platform settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <button className="bg-blue-50 text-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
              <User className="text-blue-600 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
              <span className="truncate">Profile</span>
            </button>
            <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
              <Bell className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
              <span className="truncate">Notifications</span>
            </button>
            {isSuperAdmin && (
              <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                <Shield className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                <span className="truncate">Security</span>
              </button>
            )}
            <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
              <Mail className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
              <span className="truncate">Email Templates</span>
            </button>
            {isSuperAdmin && (
              <>
                <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                  <Database className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                  <span className="truncate">Database</span>
                </button>
                <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                  <Key className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                  <span className="truncate">API Keys</span>
                </button>
              </>
            )}
            <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
              <Globe className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
              <span className="truncate">Localization</span>
            </button>
            <button className="text-gray-900 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
              <Palette className="text-gray-400 flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
              <span className="truncate">Appearance</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal information and account details.
              </p>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    defaultValue={currentUser.email.split('@')[0]}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    defaultValue={currentUser.email}
                    className="mt-1"
                    disabled
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Write a short bio..."
                    className="mt-1"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label>Role</Label>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${currentUser.role === 'SUPER_ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'}`}>
                      <Shield className="h-4 w-4 mr-1" />
                      {currentUser.role.replace('_', ' ')}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">
                      Your role determines your access level across the platform.
                    </span>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500">
                        Get notified about new inquiries, user registrations, and system updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {isSuperAdmin && (
            <div className="mt-6 bg-yellow-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Super Admin Access
              </h3>
              <p className="text-sm text-yellow-700">
                You have full system access. Additional settings for database management, 
                API keys, and security configurations are available in the sidebar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Check
} from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  country: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { user } = useAuth()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const supabase = createClient()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true)
    setProfileSuccess(false)

    try {
      // Update user profile in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          country: data.country,
        }
      })

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true)
    setPasswordSuccess(false)
    setPasswordError(null)

    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) {
        console.error('Error updating password:', error)
        setPasswordError(error.message)
        return
      }

      setPasswordSuccess(true)
      passwordForm.reset()
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating password:', error)
      setPasswordError('An unexpected error occurred')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access your settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register('firstName')}
                      placeholder="Enter your first name"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register('lastName')}
                      placeholder="Enter your last name"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...profileForm.register('phone')}
                    placeholder="Enter your phone number"
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => profileForm.setValue('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="georgia">Georgia</SelectItem>
                      <SelectItem value="cyprus">Cyprus</SelectItem>
                      <SelectItem value="greece">Greece</SelectItem>
                      <SelectItem value="lebanon">Lebanon</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {profileForm.formState.errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.country.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex items-center"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : profileSuccess ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Updated!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    placeholder="Enter your current password"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    placeholder="Enter your new password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    placeholder="Confirm your new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {passwordError}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex items-center"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : passwordSuccess ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Updated!
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

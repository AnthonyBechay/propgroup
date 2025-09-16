'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Trash2, 
  Eye, 
  Shield,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type User = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  country?: string | null
  role: string
  createdAt: string
  _count: {
    favoriteProperties: number
    propertyInquiries: number
    ownedProperties: number
  }
}

type UserTableProps = {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'USER':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user.id)
  }

  const handleDelete = (user: User) => {
    // TODO: Implement delete functionality
    console.log('Delete user:', user.id)
  }

  const handleView = (user: User) => {
    // TODO: Implement view functionality
    console.log('View user:', user.id)
  }

  const handleRoleChange = (user: User, newRole: string) => {
    // TODO: Implement role change functionality
    console.log('Change role for user:', user.id, 'to', newRole)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : 'No name provided'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    {user.role === 'ADMIN' && (
                      <Shield className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.country ? (
                    <span className="capitalize text-sm text-gray-600">
                      {user.country.toLowerCase()}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="text-blue-600">
                      {user._count.favoriteProperties} favorites
                    </div>
                    <div className="text-green-600">
                      {user._count.propertyInquiries} inquiries
                    </div>
                    <div className="text-purple-600">
                      {user._count.ownedProperties} owned
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      {user.role === 'USER' && (
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user, 'ADMIN')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {user.role === 'ADMIN' && (
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(user, 'USER')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

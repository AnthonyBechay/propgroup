'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  Download, 
  File, 
  Folder, 
  Trash2, 
  Plus,
  AlertCircle 
} from 'lucide-react'

type DocumentFile = {
  name: string
  size: number
  lastModified: string
  url: string
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Document storage is not yet implemented in the backend
  // This is a placeholder UI that will be connected once backend storage is ready

  const handleFileUpload = async () => {
    setError('Document upload feature is coming soon!')
  }

  const handleFileDelete = async (fileName: string) => {
    setError('Document management feature is coming soon!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access your documents.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Document Vault
          </h1>
          <p className="text-xl text-gray-600">
            Securely store and manage your investment documents.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="file-upload">Choose File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleFileUpload}
                disabled={!uploadFile || uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Documents ({files.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading documents...</p>
            </div>
          ) : files.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <File className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileDelete(file.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No documents yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first document to get started with secure storage.
              </p>
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

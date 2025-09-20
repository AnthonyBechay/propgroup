'use client'

import { useState } from 'react'
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSeeded, setIsSeeded] = useState(false)

  const handleSeedData = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok) {
        setIsSeeded(true)
        toast({
          title: 'Database Seeded Successfully!',
          description: `Created ${result.data.developers} developers, ${result.data.locationGuides} location guides, and ${result.data.properties} properties.`,
        })
        
        // Reset the seeded state after 3 seconds
        setTimeout(() => setIsSeeded(false), 3000)
      } else {
        throw new Error(result.error || 'Failed to seed database')
      }
    } catch (error) {
      console.error('Seed error:', error)
      toast({
        title: 'Seed Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSeedData}
      disabled={isLoading || isSeeded}
      variant={isSeeded ? 'default' : 'outline'}
      className={`flex items-center gap-2 ${
        isSeeded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'border-gray-300 hover:bg-gray-50'
      }`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : isSeeded ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Seeded!
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Seed Data
        </>
      )}
    </Button>
  )
}

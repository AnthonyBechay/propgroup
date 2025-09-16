// React hooks for Supabase
import { useEffect, useState, useCallback } from 'react'
import { RealtimeChannel, User, Session } from '@supabase/supabase-js'
import { supabase } from './index'
import type { 
  Property, 
  PropertyWithAnalytics, 
  Profile, 
  Notification,
  PropertyFilters,
  PaginationParams,
  PaginatedResponse
} from './types/tables'

// Auth hooks
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, error }
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}

// Profile hooks
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (!userId && !user) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId || user!.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, user])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile) return { error: new Error('No profile to update') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }, [profile])

  return { profile, loading, error, updateProfile }
}

// Properties hooks
export function useProperties(filters?: PropertyFilters, pagination?: PaginationParams) {
  const [properties, setProperties] = useState<PropertyWithAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_analytics (
            views_count,
            favorites_count,
            inquiries_count
          )
        `, { count: 'exact' })
        .eq('is_active', true)

      // Apply filters
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters?.city) {
        query = query.ilike('address->city', `%${filters.city}%`)
      }

      // Apply sorting
      const sortBy = pagination?.sortBy || 'created_at'
      const sortOrder = pagination?.sortOrder === 'asc'
      query = query.order(sortBy, { ascending: sortOrder })

      // Apply pagination
      if (pagination) {
        const page = pagination.page || 1
        const limit = pagination.limit || 12
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) throw error

      setProperties(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { properties, loading, error, totalCount, refetch: fetchProperties }
}

export function useProperty(propertyId: string) {
  const [property, setProperty] = useState<PropertyWithAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_analytics (
              views_count,
              favorites_count,
              inquiries_count
            ),
            agent:profiles!properties_agent_id_fkey (
              id,
              full_name,
              email,
              phone,
              avatar_url,
              company_name
            )
          `)
          .eq('id', propertyId)
          .single()

        if (error) throw error
        setProperty(data)

        // Track view
        await supabase.functions.invoke('analytics-track', {
          body: {
            eventType: 'view',
            propertyId
          }
        })
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  return { property, loading, error }
}

// Favorites hook
export function useFavorites() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            property:properties (*)
          `)
          .eq('user_id', user.id)

        if (error) throw error
        setFavorites(data?.map((f: any) => f.property).filter(Boolean) as Property[] || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (!user) return { error: new Error('Must be logged in') }

    const isFavorited = favorites.some(p => p.id === propertyId)

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)

      if (!error) {
        setFavorites(prev => prev.filter(p => p.id !== propertyId))
        await supabase.functions.invoke('analytics-track', {
          body: { eventType: 'unfavorite', propertyId }
        })
      }

      return { error }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          property_id: propertyId
        })

      if (!error) {
        const { data: property } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (property) {
          setFavorites(prev => [...prev, property])
        }

        await supabase.functions.invoke('analytics-track', {
          body: { eventType: 'favorite', propertyId }
        })
      }

      return { error }
    }
  }, [user, favorites])

  return { favorites, loading, error, toggleFavorite }
}

// Notifications hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useUser()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications(data || [])
        setUnreadCount(data?.filter((n: any) => !n.is_read).length || 0)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const markAsRead = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }

    return { error }
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user) return { error: new Error('Must be logged in') }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    }

    return { error }
  }, [user])

  return { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  }
}

// Realtime subscription hook
export function useRealtimeSubscription(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const newChannel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        callback
      )
      .subscribe()

    setChannel(newChannel)

    return () => {
      newChannel.unsubscribe()
    }
  }, [table, filter, callback])

  return channel
}

// Search properties hook
export function usePropertySearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const searchProperties = useCallback(async (
    filters: PropertyFilters,
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<PropertyWithAnalytics> | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('property-search', {
        body: {
          ...filters,
          ...pagination
        }
      })

      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { searchProperties, loading, error }
}

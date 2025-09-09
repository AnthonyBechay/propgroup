// Property Search Edge Function
// Handles advanced property search with filters and pagination

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    const {
      propertyType,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minSize,
      maxSize,
      amenities,
      status,
      city,
      state,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      lat,
      lng,
      radius
    } = await req.json()

    let query = supabaseClient
      .from('properties')
      .select(`
        *,
        property_analytics (
          views_count,
          favorites_count,
          inquiries_count
        ),
        favorites!left (
          id,
          user_id
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    if (propertyType) {
      query = query.eq('property_type', propertyType)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (minPrice) {
      query = query.gte('price', minPrice)
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice)
    }
    if (minBedrooms) {
      query = query.gte('bedrooms', minBedrooms)
    }
    if (maxBedrooms) {
      query = query.lte('bedrooms', maxBedrooms)
    }
    if (minBathrooms) {
      query = query.gte('bathrooms', minBathrooms)
    }
    if (maxBathrooms) {
      query = query.lte('bathrooms', maxBathrooms)
    }
    if (minSize) {
      query = query.gte('size_sqft', minSize)
    }
    if (maxSize) {
      query = query.lte('size_sqft', maxSize)
    }
    if (city) {
      query = query.ilike('address->city', `%${city}%`)
    }
    if (state) {
      query = query.eq('address->state', state)
    }
    if (amenities && amenities.length > 0) {
      query = query.contains('amenities', amenities)
    }

    // Handle location-based search
    if (lat && lng && radius) {
      const { data: nearbyProperties } = await supabaseClient
        .rpc('search_properties_nearby', {
          lat,
          lng,
          radius_km: radius
        })

      if (nearbyProperties) {
        const propertyIds = nearbyProperties.map(p => p.property_id)
        query = query.in('id', propertyIds)
      }
    }

    // Apply sorting
    const validSortColumns = ['price', 'created_at', 'size_sqft', 'bedrooms', 'bathrooms']
    if (validSortColumns.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    query = query.range(startIndex, startIndex + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Process data to include user-specific information
    const processedData = data?.map(property => ({
      ...property,
      is_favorited: user ? property.favorites?.some(f => f.user_id === user.id) : false,
      favorites: undefined // Remove raw favorites data from response
    }))

    // Save search to history if user is authenticated
    if (user) {
      await supabaseClient
        .from('search_history')
        .insert({
          user_id: user.id,
          search_query: {
            propertyType,
            minPrice,
            maxPrice,
            minBedrooms,
            city,
            state
          },
          results_count: count
        })
    }

    return new Response(
      JSON.stringify({
        properties: processedData,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

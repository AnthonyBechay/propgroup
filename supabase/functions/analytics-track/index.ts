// Analytics Tracking Edge Function
// Tracks user interactions with properties

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: { user } } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    )

    const {
      eventType,
      propertyId,
      metadata = {}
    } = await req.json()

    // Validate event type
    const validEventTypes = ['view', 'inquiry', 'favorite', 'unfavorite', 'share', 'contact_agent']
    if (!validEventTypes.includes(eventType)) {
      throw new Error('Invalid event type')
    }

    // Validate property exists
    const { data: property, error: propertyError } = await supabaseClient
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      throw new Error('Property not found')
    }

    // Handle different event types
    switch (eventType) {
      case 'view':
        // Increment view count
        await supabaseClient.rpc('increment_property_view', {
          property_uuid: propertyId
        })

        // Track time on page if provided
        if (metadata.timeOnPage) {
          const { data: analytics } = await supabaseClient
            .from('property_analytics')
            .select('average_time_on_page, views_count')
            .eq('property_id', propertyId)
            .eq('date', new Date().toISOString().split('T')[0])
            .single()

          if (analytics) {
            const newAverage = (
              (analytics.average_time_on_page * (analytics.views_count - 1) + metadata.timeOnPage) /
              analytics.views_count
            )

            await supabaseClient
              .from('property_analytics')
              .update({ average_time_on_page: Math.round(newAverage) })
              .eq('property_id', propertyId)
              .eq('date', new Date().toISOString().split('T')[0])
          }
        }
        break

      case 'inquiry':
        // Update inquiry count
        await supabaseClient
          .from('property_analytics')
          .upsert({
            property_id: propertyId,
            date: new Date().toISOString().split('T')[0],
            inquiries_count: 1
          }, {
            onConflict: 'property_id,date',
            count: 'exact'
          })
        break

      case 'favorite':
        if (!user) {
          throw new Error('Authentication required')
        }

        // Add to favorites
        await supabaseClient
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId
          })

        // Update favorite count
        await supabaseClient
          .from('property_analytics')
          .upsert({
            property_id: propertyId,
            date: new Date().toISOString().split('T')[0],
            favorites_count: 1
          }, {
            onConflict: 'property_id,date',
            count: 'exact'
          })
        break

      case 'unfavorite':
        if (!user) {
          throw new Error('Authentication required')
        }

        // Remove from favorites
        await supabaseClient
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId)

        // Decrement favorite count
        const { data: currentAnalytics } = await supabaseClient
          .from('property_analytics')
          .select('favorites_count')
          .eq('property_id', propertyId)
          .eq('date', new Date().toISOString().split('T')[0])
          .single()

        if (currentAnalytics && currentAnalytics.favorites_count > 0) {
          await supabaseClient
            .from('property_analytics')
            .update({ favorites_count: currentAnalytics.favorites_count - 1 })
            .eq('property_id', propertyId)
            .eq('date', new Date().toISOString().split('T')[0])
        }
        break

      case 'share':
        // Update share count
        await supabaseClient
          .from('property_analytics')
          .upsert({
            property_id: propertyId,
            date: new Date().toISOString().split('T')[0],
            shares_count: 1
          }, {
            onConflict: 'property_id,date',
            count: 'exact'
          })
        break

      case 'contact_agent':
        // Track agent contact
        if (user && metadata.agentId) {
          await supabaseClient
            .from('inquiries')
            .insert({
              property_id: propertyId,
              user_id: user.id,
              agent_id: metadata.agentId,
              message: metadata.message || 'User requested contact',
              phone: metadata.phone,
              email: metadata.email,
              preferred_contact_method: metadata.preferredContactMethod
            })
        }
        break
    }

    // Update clicked results in search history if user is authenticated
    if (user && eventType === 'view') {
      const { data: latestSearch } = await supabaseClient
        .from('search_history')
        .select('id, clicked_results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (latestSearch) {
        const clickedResults = latestSearch.clicked_results || []
        if (!clickedResults.includes(propertyId)) {
          clickedResults.push(propertyId)
          await supabaseClient
            .from('search_history')
            .update({ clicked_results: clickedResults })
            .eq('id', latestSearch.id)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, event: eventType }),
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

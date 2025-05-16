
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse query parameters (from request body for post requests in edge functions)
    const { page = 1, limit = 10, related_client_id, related_vehicle_id, search_type } = await req.json()
    
    // Calculate pagination offsets
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Start building query
    let query = supabaseClient
      .from('search_history')
      .select('*, related_client:related_client_id(name, cpf_cnpj), related_vehicle:related_vehicle_id(plate, brand, model)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (related_client_id) {
      query = query.eq('related_client_id', related_client_id)
    }
    
    if (related_vehicle_id) {
      query = query.eq('related_vehicle_id', related_vehicle_id)
    }

    if (search_type) {
      query = query.eq('search_type', search_type)
    }

    // Get total count for pagination
    const { count, error: countError } = await supabaseClient
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Error getting search history count:', countError)
      
      return new Response(
        JSON.stringify({ error: countError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Apply pagination to query
    query = query.range(from, to)
    
    // Execute the query
    const { data: history, error } = await query

    if (error) {
      console.error('Error fetching search history:', error)
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = {
      data: history || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

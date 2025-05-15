
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

    // Parse query parameters for pagination and filtering
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const clientId = url.searchParams.get('client_id')
    const status = url.searchParams.get('status')
    const processType = url.searchParams.get('process_type')

    // Start building the query
    let query = supabaseClient
      .from('processes')
      .select(`
        *,
        client:clients(id, name, cpf_cnpj),
        vehicle:vehicles(id, plate, brand, model)
      `)
      .order('created_at', { ascending: false })
    
    // Apply filters if provided
    if (clientId) {
      query = query.eq('client_id', clientId)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (processType) {
      query = query.eq('process_type', processType)
    }
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    // Execute the query
    const { data: processes, error, count } = await query

    if (error) {
      console.error('Error fetching processes:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseClient
      .from('processes')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error getting total count:', countError)
    }

    return new Response(
      JSON.stringify({
        data: processes,
        pagination: {
          page,
          limit,
          total: totalCount
        }
      }),
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

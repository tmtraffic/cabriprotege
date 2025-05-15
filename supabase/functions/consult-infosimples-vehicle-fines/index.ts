
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

    // Get the request body
    const requestData = await req.json()
    const { plate, renavam, stateCode = 'rj' } = requestData

    if (!plate && !renavam) {
      return new Response(
        JSON.stringify({ error: 'Either plate or renavam is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API token from environment variables
    const apiToken = Deno.env.get('INFOSIMPLES_API_TOKEN')
    if (!apiToken) {
      console.error('INFOSIMPLES_API_TOKEN is not set')
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare the request parameters
    const params = new URLSearchParams()
    if (plate) params.append('placa', plate)
    if (renavam) params.append('renavam', renavam)

    // Make the API request to Infosimples
    const response = await fetch(
      `https://api.infosimples.com/api/v2/consultas/detran/${stateCode}/debitos_veiculares?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': apiToken,
        },
      }
    )

    const apiResponse = await response.json()

    // Log search to search_history table
    try {
      await supabaseClient.from('search_history').insert({
        user_id: user.id,
        search_query: plate || renavam,
        search_type: 'infosimples_vehicle_fines',
        result_data: apiResponse
      })
    } catch (error) {
      console.error('Error logging search history:', error)
      // Continue with the response even if logging fails
    }

    return new Response(
      JSON.stringify(apiResponse),
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

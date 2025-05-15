
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
    const { plate, renavam, driver_cpf } = requestData

    if (!plate && !renavam && !driver_cpf) {
      return new Response(
        JSON.stringify({ error: 'Either plate, renavam, or driver_cpf is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API key from environment variables
    const apiKey = Deno.env.get('HELENA_APP_API_KEY')
    if (!apiKey) {
      console.error('HELENA_APP_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare query parameters
    const params = new URLSearchParams()
    if (plate) params.append('plate', plate)
    if (renavam) params.append('renavam', renavam)
    if (driver_cpf) params.append('driver_cpf', driver_cpf)

    // Make the API request to Helena.app
    const response = await fetch(
      `https://api.helena.app/v1/fines?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
      }
    )

    const apiResponse = await response.json()

    // Log search to search_history table
    try {
      await supabaseClient.from('search_history').insert({
        user_id: user.id,
        search_query: plate || renavam || driver_cpf,
        search_type: 'helena_app_fines',
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

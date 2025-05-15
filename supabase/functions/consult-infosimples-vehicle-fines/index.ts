
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
    const { plate, renavam, stateCode = 'rj', client_id, vehicle_id } = requestData

    if (!plate && !renavam) {
      return new Response(
        JSON.stringify({ error: 'Either plate or renavam is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API credentials from environment variables
    const apiToken = Deno.env.get('INFOSIMPLES_API_TOKEN')
    const apiEmail = Deno.env.get('INFOSIMPLES_EMAIL')
    
    if (!apiToken || !apiEmail) {
      console.error('INFOSIMPLES_API_TOKEN or INFOSIMPLES_EMAIL is not set')
      return new Response(
        JSON.stringify({ error: 'API configuration error', details: 'Infosimples API credentials not fully configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine search type and query
    let searchType = plate ? 'vehicle_plate' : 'vehicle_renavam'
    let searchQuery = plate || renavam

    // Prepare the request parameters
    const params = new URLSearchParams()
    if (plate) params.append('placa', plate)
    if (renavam) params.append('renavam', renavam)
    params.append('email', apiEmail)

    let apiResponse = null
    let errorDetails = null
    
    try {
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

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Infosimples API responded with status ${response.status}: ${errorText}`)
      }

      apiResponse = await response.json()
      
      // Check if the API returned an error code
      if (apiResponse.code !== 'ok' && apiResponse.errors && apiResponse.errors.length > 0) {
        throw new Error(`Infosimples API error: ${apiResponse.errors.join(', ')}`)
      }
    } catch (apiError) {
      console.error('Infosimples API error:', apiError)
      errorDetails = apiError.message || String(apiError)
      apiResponse = { error: true, message: errorDetails }
    }

    // Log search to search_history table
    try {
      await supabaseClient.from('search_history').insert({
        user_id: user.id,
        search_query: searchQuery,
        search_type: searchType,
        api_source: 'infosimples_vehicle_fines',
        raw_result_data: apiResponse,
        related_client_id: client_id || null,
        related_vehicle_id: vehicle_id || null
      })
    } catch (error) {
      console.error('Error logging search history:', error)
      // Continue with the response even if logging fails
    }

    // If we had an API error, return a structured error response
    if (errorDetails) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API request failed', 
          details: errorDetails,
          source: 'infosimples' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the standardized successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: apiResponse,
        error: null,
        source: 'infosimples'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal Server Error', 
        details: error.message || String(error),
        source: 'infosimples' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


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

    // Parse the request to get process_id 
    const { process_id } = await req.json()

    if (!process_id) {
      return new Response(
        JSON.stringify({ error: 'Process ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the process to find the linked infraction_id
    const { data: process, error: processError } = await supabaseClient
      .from('processes')
      .select('infraction_id')
      .eq('id', process_id)
      .maybeSingle()
    
    if (processError) {
      console.error('Error fetching process:', processError)
      return new Response(
        JSON.stringify({ error: processError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If there is no linked infraction, return an empty array
    if (!process || !process.infraction_id) {
      return new Response(
        JSON.stringify([]),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the infraction related to this process
    const { data: infraction, error: infractionError } = await supabaseClient
      .from('infractions')
      .select('*')
      .eq('id', process.infraction_id)
      .maybeSingle()

    if (infractionError) {
      console.error('Error fetching infraction:', infractionError)
      return new Response(
        JSON.stringify({ error: infractionError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the infraction as an array (even if it's just one)
    const infractions = infraction ? [infraction] : []
    
    return new Response(
      JSON.stringify(infractions),
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

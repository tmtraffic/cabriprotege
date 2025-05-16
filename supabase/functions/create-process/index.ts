
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateProcessRequest {
  client_id: string;
  vehicle_id?: string;
  process_type: string;
  status: string;
  description?: string;
  assigned_to_user_id?: string;
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

    // Parse request body
    const processData: CreateProcessRequest = await req.json()

    // Validate required fields
    if (!processData.client_id) {
      return new Response(
        JSON.stringify({ error: 'Client ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!processData.process_type) {
      return new Response(
        JSON.stringify({ error: 'Process type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify client exists
    const { data: clientExists, error: clientError } = await supabaseClient
      .from('clients')
      .select('id')
      .eq('id', processData.client_id)
      .maybeSingle()

    if (clientError || !clientExists) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify vehicle belongs to client (if provided)
    if (processData.vehicle_id) {
      const { data: vehicleExists, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('id')
        .eq('id', processData.vehicle_id)
        .eq('client_id', processData.client_id) // Make sure vehicle belongs to client
        .maybeSingle()

      if (vehicleError || !vehicleExists) {
        return new Response(
          JSON.stringify({ error: 'Vehicle not found or does not belong to the specified client' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Insert the new process
    const { data: newProcess, error } = await supabaseClient
      .from('processes')
      .insert({
        client_id: processData.client_id,
        vehicle_id: processData.vehicle_id,
        process_type: processData.process_type,
        status: processData.status || 'new',
        description: processData.description,
        assigned_to_user_id: processData.assigned_to_user_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating process:', error)
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(newProcess),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

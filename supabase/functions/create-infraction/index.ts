
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateInfractionRequest {
  vehicle_id: string;
  process_id?: string;
  auto_number?: string;
  description?: string;
  date: string;
  value: number;
  points?: number;
  status?: string;
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
    const infractionData: CreateInfractionRequest = await req.json()

    // Validate required fields
    if (!infractionData.vehicle_id) {
      return new Response(
        JSON.stringify({ error: 'Vehicle ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!infractionData.date) {
      return new Response(
        JSON.stringify({ error: 'Infraction date is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!infractionData.value || isNaN(Number(infractionData.value))) {
      return new Response(
        JSON.stringify({ error: 'Valid infraction value is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify vehicle exists
    const { data: vehicleExists, error: vehicleError } = await supabaseClient
      .from('vehicles')
      .select('id')
      .eq('id', infractionData.vehicle_id)
      .maybeSingle()

    if (vehicleError || !vehicleExists) {
      return new Response(
        JSON.stringify({ error: 'Vehicle not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify process exists if process_id is provided
    if (infractionData.process_id) {
      const { data: processExists, error: processError } = await supabaseClient
        .from('processes')
        .select('id')
        .eq('id', infractionData.process_id)
        .maybeSingle()

      if (processError || !processExists) {
        return new Response(
          JSON.stringify({ error: 'Process not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Insert the new infraction
    const insertData = {
      vehicle_id: infractionData.vehicle_id,
      process_id: infractionData.process_id, // Include process_id directly
      auto_number: infractionData.auto_number,
      description: infractionData.description,
      date: infractionData.date,
      value: infractionData.value,
      points: infractionData.points || 0,
      status: infractionData.status || 'pending'
    }
    
    // Create the infraction record
    const { data: newInfraction, error } = await supabaseClient
      .from('infractions')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating infraction:', error)
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify(newInfraction),
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateProcessRequest {
  process_id: string;
  status?: string;
  description?: string;
  process_type?: string;
  assigned_to_user_id?: string | null;
  vehicle_id?: string | null;
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
    const updateData: UpdateProcessRequest = await req.json()

    // Validate required fields
    if (!updateData.process_id) {
      return new Response(
        JSON.stringify({ error: 'Process ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Make sure the process exists
    const { data: existingProcess, error: fetchError } = await supabaseClient
      .from('processes')
      .select('id, client_id')
      .eq('id', updateData.process_id)
      .maybeSingle()

    if (fetchError || !existingProcess) {
      return new Response(
        JSON.stringify({ error: 'Process not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare update data (remove process_id)
    const { process_id, ...updateFields } = updateData

    // Verify vehicle belongs to the same client (if provided)
    if (updateFields.vehicle_id) {
      const { data: vehicleData, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('client_id')
        .eq('id', updateFields.vehicle_id)
        .maybeSingle()
      
      if (vehicleError || !vehicleData) {
        return new Response(
          JSON.stringify({ error: 'Vehicle not found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Make sure the vehicle belongs to the same client as the process
      if (vehicleData.client_id !== existingProcess.client_id) {
        return new Response(
          JSON.stringify({ error: 'Vehicle does not belong to the same client as the process' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update the process
    const { data: updatedProcess, error: updateError } = await supabaseClient
      .from('processes')
      .update(updateFields)
      .eq('id', process_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating process:', updateError)
      
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(updatedProcess),
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

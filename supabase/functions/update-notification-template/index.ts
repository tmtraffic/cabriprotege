
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateTemplateRequest {
  id: string;
  name?: string;
  type?: string;
  subject_template?: string;
  body_template?: string;
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

    // Check if the user has admin role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const updateData: UpdateTemplateRequest = await req.json();

    // Validate ID is provided
    if (!updateData.id) {
      return new Response(
        JSON.stringify({ error: 'Template ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the existing template to check its type
    const { data: existingTemplate, error: fetchError } = await supabaseClient
      .from('notification_templates')
      .select('*')
      .eq('id', updateData.id)
      .maybeSingle()

    if (fetchError || !existingTemplate) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare data for update
    const { id, ...updateFields } = updateData;

    // If type is email (either from existing or being updated to), ensure subject_template exists
    const finalType = updateFields.type || existingTemplate.type;
    const finalSubject = updateFields.subject_template !== undefined ? 
      updateFields.subject_template : 
      existingTemplate.subject_template;
    
    if (finalType === 'email' && !finalSubject) {
      return new Response(
        JSON.stringify({ error: 'Email templates require a subject_template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If name is being updated, check for duplicates
    if (updateFields.name && updateFields.name !== existingTemplate.name) {
      const { data: nameExists, error: nameError } = await supabaseClient
        .from('notification_templates')
        .select('id')
        .eq('name', updateFields.name)
        .maybeSingle()

      if (nameExists) {
        return new Response(
          JSON.stringify({ error: 'A template with this name already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update the template
    const { data: updatedTemplate, error } = await supabaseClient
      .from('notification_templates')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification template:', error)
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(updatedTemplate),
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


import { supabase } from "@/integrations/supabase/client";

export async function runPlateSearch(plate: string, userId: string) {
  console.log('runPlateSearch called:', { plate, userId });
  
  // Check if user is authenticated in Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('Supabase auth check:', { user: !!user, error: authError });
  
  if (authError) {
    console.error('Supabase auth error:', authError);
    throw new Error(`Erro de autenticação: ${authError.message}`);
  }
  
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('Usuário não autenticado no sistema');
  }
  
  if (user.id !== userId) {
    console.error('User ID mismatch:', { sessionUserId: user.id, providedUserId: userId });
    throw new Error('ID do usuário não confere com a sessão');
  }

  try {
    // Save request to database
    const { data: request, error: dbError } = await supabase
      .from("infosimples_requests")
      .insert({ 
        user_id: userId, 
        search_type: "plate", 
        search_query: plate,
        status: "pending"
      })
      .select("id")
      .single();
      
    if (dbError) throw dbError;

    // Call the simplified Edge Function
    console.log('Calling Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('infosimples-api', {
      body: { 
        searchType: 'vehicle',
        searchQuery: plate,
        placa: plate  // Send both formats to be sure
      }
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Edge Function error: ${error.message}`);
    }

    console.log('Edge Function response:', data);
    
    if (data?.success) {
      // Save the result
      await supabase.from("infosimples_results").insert({
        request_id: request.id,
        result_data: data.data,
      });
      
      // Update request status
      await supabase
        .from("infosimples_requests")
        .update({ 
          status: "completed",
          protocol: data.protocolo || `${Date.now()}`
        })
        .eq("id", request.id);
      
      return { 
        requestId: request.id,
        completed: true,
        data: data.data,
        site_receipts: data.site_receipts
      };
    } else {
      throw new Error(data?.error || 'Failed to get vehicle data');
    }
    
  } catch (error) {
    console.error('runPlateSearch error:', error);
    throw error;
  }
}

export async function runMultasSearch(renavam: string, cpf: string, userId: string) {
  console.log('runMultasSearch called:', { renavam, cpf, userId });
  
  try {
    console.log('Calling consult-detran-rj-multas...');
    const { data, error } = await supabase.functions.invoke('consult-detran-rj-multas', {
      body: { 
        renavam: renavam,
        cpf: cpf
      }
    });

    if (error) {
      console.error('Multas search error:', error);
      throw new Error(`Erro na consulta de multas: ${error.message}`);
    }

    console.log('Multas data received:', data);

    if (data?.success) {
      // Save to database
      const { error: saveError } = await supabase
        .from("infosimples_requests")
        .insert({ 
          user_id: userId, 
          search_type: "multas", 
          search_query: renavam,
          status: "completed",
          protocol: data.protocolo || `multas_${Date.now()}`
        });

      if (saveError) {
        console.error('Database save error:', saveError);
      }

      return data.data;
    }

    throw new Error('Falha ao obter dados de multas');
    
  } catch (error) {
    console.error('runMultasSearch error:', error);
    throw error;
  }
}

// Simplified polling - Edge Function returns immediately
export async function pollResult(requestId: string) {
  const { data } = await supabase
    .from("infosimples_results")
    .select("result_data")
    .eq("request_id", requestId)
    .single();
    
  return data?.result_data || { status: "completed" };
}

// Temporarily disable other searches
export async function runRenavamSearch(renavam: string, userId: string) {
  throw new Error('Use a busca por placa para consultar o veículo');
}

export async function runCNHSearch(cnh: string, birthDate: string, userId: string) {
  throw new Error('Consulta de CNH será implementada em breve');
}

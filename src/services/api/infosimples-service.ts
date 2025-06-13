
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
    // Call the Edge Function for vehicle data
    console.log('Calling infosimples-api for vehicle data...');
    const { data, error } = await supabase.functions.invoke('infosimples-api', {
      body: { 
        searchType: 'vehicle',
        placa: plate
      }
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Erro na consulta: ${error.message}`);
    }

    console.log('Vehicle data received:', data);

    if (data?.success) {
      // Save to our database
      const { data: saved, error: saveError } = await supabase
        .from("infosimples_requests")
        .insert({ 
          user_id: userId, 
          search_type: "vehicle", 
          search_query: plate,
          status: "completed",
          protocol: data.protocolo || `vehicle_${Date.now()}`
        })
        .select("id")
        .single();

      if (saveError) {
        console.error('Database save error:', saveError);
      }

      return { 
        requestId: saved?.id,
        completed: true,
        vehicleData: data.data
      };
    }

    throw new Error('Falha ao obter dados do veículo');
    
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

export async function runRenavamSearch(renavam: string, userId: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Usuário não autenticado no sistema');
  }

  try {
    const { data: request, error: dbError } = await supabase
      .from("infosimples_requests")
      .insert({ 
        user_id: userId, 
        search_type: "renavam", 
        search_query: renavam,
        status: "pending"
      })
      .select("id")
      .single();

    if (dbError || !request) {
      throw new Error(dbError?.message || "Falha ao criar solicitação de busca");
    }

    const { data, error } = await supabase.functions.invoke('infosimples-api', {
      body: { 
        service: 'detran/veiculo',
        token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',
        parameters: {
          renavam: renavam
        }
      }
    });

    if (error) {
      throw new Error(`Erro na função: ${error.message}`);
    }

    const protocol = data?.protocolo || data?.protocol;
    
    if (protocol) {
      await supabase
        .from("infosimples_requests")
        .update({ protocol, status: "running" })
        .eq("id", request.id);
    }

    return { requestId: request.id, protocol };
  } catch (error) {
    console.error('runRenavamSearch error:', error);
    throw error;
  }
}

export async function runCNHSearch(cnh: string, birthDate: string, userId: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Usuário não autenticado no sistema');
  }

  try {
    const { data: request, error: dbError } = await supabase
      .from("infosimples_requests")
      .insert({ 
        user_id: userId, 
        search_type: "cnh", 
        search_query: cnh,
        status: "pending"
      })
      .select("id")
      .single();

    if (dbError || !request) {
      throw new Error(dbError?.message || "Falha ao criar solicitação de busca");
    }

    const { data, error } = await supabase.functions.invoke('infosimples-api', {
      body: { 
        service: 'detran/cnh',
        token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',
        parameters: {
          cnh: cnh,
          data_nascimento: birthDate
        }
      }
    });

    if (error) {
      throw new Error(`Erro na função: ${error.message}`);
    }

    const protocol = data?.protocolo || data?.protocol;
    
    if (protocol) {
      await supabase
        .from("infosimples_requests")
        .update({ protocol, status: "running" })
        .eq("id", request.id);
    }

    return { requestId: request.id, protocol };
  } catch (error) {
    console.error('runCNHSearch error:', error);
    throw error;
  }
}

// Simplified - no polling needed since InfoSimples returns immediately for new structure
export async function pollResult(requestId: string, protocol: string) {
  try {
    console.log('Polling for result:', { requestId, protocol });
    
    // Try to get the status from Edge Function
    const { data: statusData, error: statusError } = await supabase.functions.invoke('infosimples-api', {
      body: {
        action: 'getStatus',
        protocol: protocol,
        token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF'
      }
    });

    if (!statusError && statusData?.status === 'concluido') {
      // Get the full result
      const { data: resultData } = await supabase.functions.invoke('infosimples-api', {
        body: {
          action: 'getResult',
          protocol: protocol,
          token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF'
        }
      });

      if (resultData) {
        // Save to database
        await supabase.from("infosimples_results").insert({
          request_id: requestId,
          result_data: resultData,
        });
        
        await supabase
          .from("infosimples_requests")
          .update({ status: "completed" })
          .eq("id", requestId);

        return resultData;
      }
    }

    // If not ready, return status
    return statusData || { status: 'processing' };
    
  } catch (error) {
    console.error('pollResult error:', error);
    // Marcar como erro
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", requestId);
    
    return { status: 'error', error: error.message };
  }
}


import { supabase } from "@/integrations/supabase/client";
import { getConsultationStatus, getConsultationResult } from "./infosimples-api";

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
    // 1. Save request to database
    console.log('Creating infosimples_requests record...');
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
      
    if (dbError || !request) {
      console.error('Database insert error:', dbError);
      throw new Error(dbError?.message || "Falha ao criar solicitação de busca");
    }

    console.log('Database record created:', request);

    // The Edge Function expects specific parameters
    console.log('Calling Edge Function with corrected parameters...');
    
    // Try the main vehicle fines function first
    let response = await supabase.functions.invoke('consult-infosimples-vehicle-fines', {
      body: { 
        placa: plate,
        plate: plate,
        licensePlate: plate,
        vehiclePlate: plate
      }
    });

    // If that fails, try the generic infosimples-api with correct format
    if (response.error) {
      console.log('Vehicle fines function failed, trying generic API...');
      
      // Based on the documentation, the API expects specific format
      response = await supabase.functions.invoke('infosimples-api', {
        body: {
          service: 'detran/multas',  // Generic service name
          token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',  // Your token
          parameters: {
            placa: plate
          }
        }
      });
    }

    if (response.error) {
      console.error('Edge Function error:', response.error);
      throw new Error(`Edge Function error: ${response.error.message}`);
    }

    console.log('Edge Function success:', response.data);
    
    // 3. Update request with protocol
    const protocol = response.data?.protocolo || response.data?.protocol;
    console.log('Protocol extracted:', protocol);

    if (protocol) {
      console.log('Updating database with protocol...');
      const { error: updateError } = await supabase
        .from("infosimples_requests")
        .update({ protocol, status: "running" })
        .eq("id", request.id);

      if (updateError) {
        console.error('Database update error:', updateError);
      }
    }

    return { requestId: request.id, protocol };
    
  } catch (error) {
    console.error('runPlateSearch error:', error);
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

// Update the polling to handle Edge Function responses
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

// Add this temporary function to test direct API format
export async function testDirectInfosimples(plate: string) {
  console.log('Testing direct Infosimples format...');
  
  const testFormats = [
    // Format 1: Based on documentation
    {
      service: 'senatran/infracoes',
      token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',
      placa: plate
    },
    // Format 2: Alternative
    {
      servico: 'detran/sp/multas-extrato',
      token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',
      placa: plate
    },
    // Format 3: Generic
    {
      token: 'VztDoZpEHnuoUZdXH9A1pQEpzJmAZvJ6v_bMsFiF',
      tipo: 'veiculo',
      valor: plate
    }
  ];

  for (const [index, format] of testFormats.entries()) {
    console.log(`Testing format ${index + 1}:`, format);
    
    const { data, error } = await supabase.functions.invoke('infosimples-api', {
      body: format
    });
    
    if (!error) {
      console.log('Success with format:', format);
      return data;
    } else {
      console.log(`Format ${index + 1} failed:`, error.message);
    }
  }
  
  return null;
}

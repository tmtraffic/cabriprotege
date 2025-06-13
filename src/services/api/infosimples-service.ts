
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

    console.log('Testing different Edge Function formats...');
    
    // First, try the specific vehicle fines function
    console.log('Trying consult-infosimples-vehicle-fines function...');
    
    const vehicleFinesFormats = [
      { plate: plate },
      { placa: plate },
      { vehicle_plate: plate },
      { licensePlate: plate },
      { query: plate, type: 'plate' },
      { searchQuery: plate, searchType: 'plate' }
    ];
    
    let successResponse = null;
    let usedFunction = null;
    
    for (const [index, format] of vehicleFinesFormats.entries()) {
      console.log(`Trying vehicle fines format ${index + 1}:`, format);
      
      const { data, error } = await supabase.functions.invoke('consult-infosimples-vehicle-fines', {
        body: format
      });
      
      if (!error && data) {
        console.log('Success with vehicle fines format:', format);
        console.log('Response:', data);
        successResponse = data;
        usedFunction = 'consult-infosimples-vehicle-fines';
        break;
      } else {
        console.log(`Vehicle fines format ${index + 1} failed:`, error?.message || 'No data returned');
      }
    }
    
    // If vehicle fines function didn't work, try the generic infosimples-api function
    if (!successResponse) {
      console.log('Trying generic infosimples-api function...');
      
      const genericFormats = [
        { action: 'searchVehicleByPlate', plate: plate },
        { action: 'searchVehicleByPlate', placa: plate },
        { method: 'searchVehicleByPlate', params: { plate } },
        { method: 'searchVehicleByPlate', params: { placa: plate } },
        { placa: plate },
        { plate: plate },
        { query: plate, type: 'placa' },
        { action: 'placa', value: plate },
        { consultaPlaca: plate },
        { vehiclePlate: plate },
        { searchType: 'plate', searchValue: plate },
        { tipo: 'placa', valor: plate }
      ];
      
      for (const [index, format] of genericFormats.entries()) {
        console.log(`Trying generic format ${index + 1}:`, format);
        
        const { data, error } = await supabase.functions.invoke('infosimples-api', {
          body: format
        });
        
        if (!error && data) {
          console.log('Success with generic format:', format);
          console.log('Response:', data);
          successResponse = data;
          usedFunction = 'infosimples-api';
          break;
        } else {
          console.log(`Generic format ${index + 1} failed:`, error?.message || 'No data returned');
        }
      }
    }
    
    if (!successResponse) {
      console.error('All format attempts failed');
      throw new Error('Todos os formatos de requisição falharam. Verifique os logs da Edge Function.');
    }

    console.log(`Successful function: ${usedFunction}`);
    console.log('Final response:', successResponse);
    
    // 3. Update request with protocol
    const protocol = successResponse?.protocolo || successResponse?.protocol;
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
        action: 'searchVehicleByRenavam', 
        renavam 
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
        action: 'searchDriverByCNH', 
        cnh, 
        birthDate 
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

export async function pollResult(requestId: string, protocol: string) {
  try {
    console.log('Polling for result:', { requestId, protocol });
    
    // Verificar status da consulta
    const status = await getConsultationStatus(protocol);
    console.log('Status check result:', status);
    
    if ((status as any).status !== "concluido") {
      return status;
    }

    // Se concluído, buscar resultado
    const result = await getConsultationResult(protocol);
    console.log('Final result:', result);

    // Salvar resultado no banco
    await supabase.from("infosimples_results").insert({
      request_id: requestId,
      result_data: result as any,
    });

    // Atualizar status da request
    await supabase
      .from("infosimples_requests")
      .update({ status: "completed" })
      .eq("id", requestId);

    return result;
  } catch (error) {
    console.error('Poll result error:', error);
    // Marcar como erro
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", requestId);
    throw error;
  }
}

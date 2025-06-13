
import { supabase } from "@/integrations/supabase/client";
import {
  searchVehicleByPlate,
  searchVehicleByRenavam,
  searchDriverByCNH,
  getConsultationStatus,
  getConsultationResult,
} from "./infosimples-api";

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

  // Criar registro na tabela de requests
  console.log('Creating infosimples_requests record...');
  const { data, error } = await supabase
    .from("infosimples_requests")
    .insert({
      user_id: userId,
      search_type: "plate",
      search_query: plate,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error('Database insert error:', error);
    throw new Error(error?.message || "Falha ao criar solicitação de busca");
  }

  console.log('Database record created:', data);

  try {
    // Executar busca via API
    console.log('Executing API search...');
    const response = await searchVehicleByPlate(plate);
    console.log('API response received:', response);
    
    const protocol = (response as any).protocolo || (response as any).protocol;
    console.log('Protocol extracted:', protocol);

    // Atualizar com o protocolo
    console.log('Updating database with protocol...');
    const { error: updateError } = await supabase
      .from("infosimples_requests")
      .update({ protocol, status: "running" })
      .eq("id", data.id);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

    return { requestId: data.id, protocol };
  } catch (error) {
    console.error('API search error:', error);
    // Marcar como erro se falhar
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", data.id);
    throw error;
  }
}

export async function runRenavamSearch(renavam: string, userId: string) {
  const { data, error } = await supabase
    .from("infosimples_requests")
    .insert({
      user_id: userId,
      search_type: "renavam",
      search_query: renavam,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Falha ao criar solicitação de busca");
  }

  try {
    const response = await searchVehicleByRenavam(renavam);
    const protocol = (response as any).protocolo || (response as any).protocol;

    await supabase
      .from("infosimples_requests")
      .update({ protocol, status: "running" })
      .eq("id", data.id);

    return { requestId: data.id, protocol };
  } catch (error) {
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", data.id);
    throw error;
  }
}

export async function runCNHSearch(cnh: string, birthDate: string, userId: string) {
  const { data, error } = await supabase
    .from("infosimples_requests")
    .insert({
      user_id: userId,
      search_type: "cnh",
      search_query: cnh,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Falha ao criar solicitação de busca");
  }

  try {
    const response = await searchDriverByCNH(cnh, birthDate);
    const protocol = (response as any).protocolo || (response as any).protocol;

    await supabase
      .from("infosimples_requests")
      .update({ protocol, status: "running" })
      .eq("id", data.id);

    return { requestId: data.id, protocol };
  } catch (error) {
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", data.id);
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

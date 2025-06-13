
import { supabase } from "@/integrations/supabase/client";
import {
  searchVehicleByPlate,
  searchVehicleByRenavam,
  searchDriverByCNH,
  getConsultationStatus,
  getConsultationResult,
} from "./infosimples-api";

export async function runPlateSearch(plate: string, userId: string) {
  // Criar registro na tabela de requests
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
    throw new Error(error?.message || "Falha ao criar solicitação de busca");
  }

  try {
    // Executar busca via API
    const response = await searchVehicleByPlate(plate);
    const protocol = (response as any).protocolo || (response as any).protocol;

    // Atualizar com o protocolo
    await supabase
      .from("infosimples_requests")
      .update({ protocol, status: "running" })
      .eq("id", data.id);

    return { requestId: data.id, protocol };
  } catch (error) {
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
    // Verificar status da consulta
    const status = await getConsultationStatus(protocol);
    
    if ((status as any).status !== "concluido") {
      return status;
    }

    // Se concluído, buscar resultado
    const result = await getConsultationResult(protocol);

    // Salvar resultado no banco
    await supabase.from("infosimples_results").insert({
      request_id: requestId,
      result_data: result,
    });

    // Atualizar status da request
    await supabase
      .from("infosimples_requests")
      .update({ status: "completed" })
      .eq("id", requestId);

    return result;
  } catch (error) {
    // Marcar como erro
    await supabase
      .from("infosimples_requests")
      .update({ status: "error" })
      .eq("id", requestId);
    throw error;
  }
}

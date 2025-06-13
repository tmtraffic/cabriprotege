import { supabase } from "@/integrations/supabase/client";
import {
  searchVehicleByPlate,
  searchVehicleByRenavam,
  searchDriverByCNH,
  getConsultationStatus,
  getConsultationResult,
} from "./infosimples-api";

export async function runPlateSearch(plate: string, userId: string) {
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
    throw new Error(error?.message || "Failed to create request");
  }

  const response = await searchVehicleByPlate(plate);
  const protocol = (response as any).protocolo || (response as any).protocol;

  await supabase
    .from("infosimples_requests")
    .update({ protocol, status: "running" })
    .eq("id", data.id);

  return { requestId: data.id, protocol };
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
    throw new Error(error?.message || "Failed to create request");
  }

  const response = await searchVehicleByRenavam(renavam);
  const protocol = (response as any).protocolo || (response as any).protocol;

  await supabase
    .from("infosimples_requests")
    .update({ protocol, status: "running" })
    .eq("id", data.id);

  return { requestId: data.id, protocol };
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
    throw new Error(error?.message || "Failed to create request");
  }

  const response = await searchDriverByCNH(cnh, birthDate);
  const protocol = (response as any).protocolo || (response as any).protocol;

  await supabase
    .from("infosimples_requests")
    .update({ protocol, status: "running" })
    .eq("id", data.id);

  return { requestId: data.id, protocol };
}

export async function pollResult(requestId: string, protocol: string) {
  const status = await getConsultationStatus(protocol);
  if ((status as any).status !== "concluido") {
    return status;
  }

  const result = await getConsultationResult(protocol);

  await supabase.from("infosimples_results").insert({
    request_id: requestId,
    result_data: result,
  });

  await supabase
    .from("infosimples_requests")
    .update({ status: "completed" })
    .eq("id", requestId);

  return result;
}

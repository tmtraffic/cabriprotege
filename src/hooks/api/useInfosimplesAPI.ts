
import { useQuery, useMutation } from '@tanstack/react-query';
import * as InfosimplesAPI from '@/services/api/infosimples-api';
import { useToast } from '@/hooks/use-toast';

export function useVehicleByPlate(plate: string | null) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (plateNumber: string) => InfosimplesAPI.searchVehicleByPlate(plateNumber),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search for vehicle",
        variant: "destructive",
      });
    },
  });
}

export function useVehicleByRenavam(renavam: string | null) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (renavamNumber: string) => InfosimplesAPI.searchVehicleByRenavam(renavamNumber),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search for vehicle",
        variant: "destructive",
      });
    },
  });
}

export function useDriverByCNH(cnh: string | null, birthDate: string | null) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ cnh, birthDate }: { cnh: string, birthDate: string }) => 
      InfosimplesAPI.searchDriverByCNH(cnh, birthDate),
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to search for driver",
        variant: "destructive",
      });
    },
  });
}

export function useConsultationStatus(protocol: string | null) {
  return useQuery({
    queryKey: ['consultation', 'status', protocol],
    queryFn: () => InfosimplesAPI.getConsultationStatus(protocol!),
    enabled: !!protocol,
    refetchInterval: (query) => {
      // Poll more frequently if the consultation is not completed
      const data = query.state.data as any;
      if (data?.status === 'concluido' || data?.status === 'erro') {
        return false; // Stop polling
      }
      return 5000; // Poll every 5 seconds
    },
  });
}

export function useConsultationResult(protocol: string | null) {
  return useQuery({
    queryKey: ['consultation', 'result', protocol],
    queryFn: () => InfosimplesAPI.getConsultationResult(protocol!),
    enabled: !!protocol,
  });
}

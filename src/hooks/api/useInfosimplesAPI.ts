
import { useQuery, useMutation } from '@tanstack/react-query';
import * as InfosimplesAPI from '@/services/api/infosimples-api';
import { useToast } from '@/components/ui/use-toast';

export function useVehicleByPlate(plate: string | null) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (plateNumber: string) => {
      if (!plateNumber || plateNumber.trim().length < 5) {
        throw new Error('Valid plate number is required');
      }
      return InfosimplesAPI.searchVehicleByPlate(plateNumber);
    },
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
    mutationFn: (renavamNumber: string) => {
      if (!renavamNumber || renavamNumber.trim().length < 9) {
        throw new Error('Valid RENAVAM number is required');
      }
      return InfosimplesAPI.searchVehicleByRenavam(renavamNumber);
    },
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
    mutationFn: ({ cnh, birthDate }: { cnh: string, birthDate: string }) => {
      if (!cnh || cnh.trim().length < 9) {
        throw new Error('Valid CNH number is required');
      }
      if (!birthDate) {
        throw new Error('Birth date is required');
      }
      return InfosimplesAPI.searchDriverByCNH(cnh, birthDate);
    },
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
    queryFn: () => {
      if (!protocol) {
        throw new Error('Protocol is required');
      }
      return InfosimplesAPI.getConsultationStatus(protocol);
    },
    enabled: !!protocol,
    refetchInterval: (data: any) => {
      // Poll more frequently if the consultation is not completed
      if (data && (data.status === 'concluido' || data.status === 'erro')) {
        return false; // Stop polling
      }
      return 5000; // Poll every 5 seconds
    },
    retry: 3,
  });
}

export function useConsultationResult(protocol: string | null) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['consultation', 'result', protocol],
    queryFn: () => {
      if (!protocol) {
        throw new Error('Protocol is required');
      }
      return InfosimplesAPI.getConsultationResult(protocol);
    },
    enabled: !!protocol,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error retrieving results",
          description: error instanceof Error ? error.message : "Failed to retrieve consultation results",
          variant: "destructive",
        });
      }
    }
  });
}

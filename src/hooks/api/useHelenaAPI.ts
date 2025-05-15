import { useQuery, useMutation } from '@tanstack/react-query';
import * as HelenaAPI from '@/services/api/helena-api';
import { useToast } from '@/components/ui/use-toast';

export function useCreateConsult() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: HelenaAPI.createConsult,
    onSuccess: (data) => {
      toast({
        title: "Consultation Created",
        description: `Consultation ID: ${data.id}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create consultation",
        variant: "destructive",
      });
    },
  });
}

export function useConsultStatus(consultId: string | null) {
  return useQuery({
    queryKey: ['consult', 'status', consultId],
    queryFn: () => HelenaAPI.getConsultStatus(consultId!),
    enabled: !!consultId,
    refetchInterval: (data) => {
      // Poll more frequently if the status is not completed
      if (data && (data.status === 'completed' || data.status === 'failed')) {
        return false; // Stop polling
      }
      return 5000; // Poll every 5 seconds
    },
  });
}

export function useConsultResults(consultId: string | null) {
  return useQuery({
    queryKey: ['consult', 'results', consultId],
    queryFn: () => HelenaAPI.getConsultResults(consultId!),
    enabled: !!consultId,
  });
}

export function useConsultsList(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ['consults', 'list', page, perPage],
    queryFn: () => HelenaAPI.listConsults(page, perPage),
    placeholderData: (previousData) => previousData,
  });
}

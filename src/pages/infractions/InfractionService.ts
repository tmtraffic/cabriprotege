
// InfractionService.ts - Service for handling infraction data

// Sample types for infractions
export interface Infraction {
  id: string;
  auto_number: string;
  date: string;
  description: string;
  vehicle_id: string;
  value: number;
  points: number;
  status: 'pending' | 'appealed' | 'paid' | 'cancelled' | string;
}

// Sample function to fetch infractions
export const getInfractions = async (): Promise<Infraction[]> => {
  // In a real implementation, this would call a Supabase function or API
  // For now, return mock data
  return [
    {
      id: '1',
      auto_number: 'E1234567',
      date: '2023-11-15',
      description: 'Excesso de velocidade',
      vehicle_id: 'v1',
      value: 293.47,
      points: 7,
      status: 'pending'
    },
    {
      id: '2',
      auto_number: 'E7654321',
      date: '2023-10-05',
      description: 'Estacionamento proibido',
      vehicle_id: 'v2',
      value: 195.23,
      points: 4,
      status: 'appealed'
    },
    {
      id: '3',
      auto_number: 'E9876543',
      date: '2023-09-20',
      description: 'Semáforo vermelho',
      vehicle_id: 'v1',
      value: 293.47,
      points: 7,
      status: 'paid'
    }
  ];
};

// Function to get infraction statistics
export const getInfractionStats = async () => {
  const infractions = await getInfractions();
  
  // Calculate total amount
  const totalAmount = infractions.reduce((sum, infraction) => sum + infraction.value, 0);
  
  // Calculate total points
  const totalPoints = infractions.reduce((sum, infraction) => sum + infraction.points, 0);
  
  // Count by status
  const countByStatus = infractions.reduce((acc, infraction) => {
    const status = infraction.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCount: infractions.length,
    totalAmount,
    totalPoints,
    countByStatus,
    averageAmount: infractions.length ? totalAmount / infractions.length : 0,
    averagePoints: infractions.length ? totalPoints / infractions.length : 0
  };
};

// Function to get infractions by vehicle
export const getInfractionsByVehicle = async (vehicleId: string): Promise<Infraction[]> => {
  const infractions = await getInfractions();
  return infractions.filter(infraction => infraction.vehicle_id === vehicleId);
};

// Function to get infractions by status
export const getInfractionsByStatus = async (status: string): Promise<Infraction[]> => {
  const infractions = await getInfractions();
  return infractions.filter(infraction => infraction.status === status);
};

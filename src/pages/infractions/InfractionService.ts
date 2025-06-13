
export interface Infraction {
  id: string;
  vehicle_id: string;
  date: string;
  value: number;
  points: number;
  auto_number?: string;
  description?: string;
  status: 'pending' | 'processed' | 'notified' | 'closed' | 'contested';
  created_at: string;
  updated_at: string;
}

export const InfractionService = {
  // Add service methods here as needed
};

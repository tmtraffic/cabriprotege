
export interface Infraction {
  id: string;
  auto_number: string;
  date: string;
  description: string;
  value: number;
  points: number;
  status: string;
  vehicle_id: string;
  created_at: string;
  updated_at: string;
}

export class InfractionService {
  static async getInfractions(): Promise<Infraction[]> {
    // Mock implementation - will be replaced with real API calls
    return [];
  }
}

export default InfractionService;

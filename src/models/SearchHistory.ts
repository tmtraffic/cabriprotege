
export interface SearchHistory {
  id: string;
  search_type: 'cnh' | 'vehicle';
  search_query: string;
  user_id: string;
  result_data: any;
  created_at: string;
  updated_at: string;
  related_client_id?: string;
  related_vehicle_id?: string;
}

export interface SearchResultCNH {
  name: string;
  cnh: string;
  category: string;
  status: string;
  expirationDate: string;
  points: number;
  fines: SearchResultFine[];
}

export interface SearchResultVehicle {
  plate: string;
  renavam: string;
  model: string;
  year: string;
  owner: string;
  fines: SearchResultFine[];
}

export interface SearchResultFine {
  id: string;
  autoNumber: string;
  date: string;
  agency: string;
  plate: string;
  owner: string;
  respPoints: string;
  situation: string;
  infraction: string;
  location: string;
  frame: string;
  points: number;
  dueDate: string;
  value: number;
  discountValue: number;
  process: string;
}

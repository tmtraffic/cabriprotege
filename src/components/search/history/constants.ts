
import { UfOption } from '@/models/SearchHistory';

export const UF_OPTIONS: { value: UfOption; label: string }[] = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'DF', label: 'Distrito Federal' },
];

export const INITIAL_FILTERS = {
  searchType: '',
  uf: '',
  startDate: '',
  endDate: ''
};


import { supabase } from '@/integrations/supabase/client'

interface CNHRequest {
  cpf: string
  data_nascimento: string // formato: YYYY-MM-DD
  user_id?: string
  client_id?: string
}

interface VehicleRequest {
  placa?: string
  renavam?: string
  user_id?: string
  client_id?: string
}

interface InfractionsRequest {
  placa?: string
  renavam?: string
  cpf?: string
  user_id?: string
  vehicle_id?: string
  client_id?: string
}

export class InfosimplesService {
  // Consultar CNH no RJ
  static async consultarCNH(data: CNHRequest) {
    try {
      const { data: result, error } = await supabase.functions.invoke('consultar-cnh-rj', {
        body: data
      })

      if (error) throw error

      return {
        success: true,
        data: result.data,
        result_id: result.result_id
      }
    } catch (error: any) {
      console.error('Erro ao consultar CNH:', error)
      return {
        success: false,
        error: error.message || 'Erro ao consultar CNH'
      }
    }
  }

  // Consultar Veículo no RJ
  static async consultarVeiculo(data: VehicleRequest) {
    try {
      const { data: result, error } = await supabase.functions.invoke('consultar-veiculo-rj', {
        body: data
      })

      if (error) throw error

      return {
        success: true,
        data: result.data,
        vehicle_id: result.data.vehicle_id
      }
    } catch (error: any) {
      console.error('Erro ao consultar veículo:', error)
      return {
        success: false,
        error: error.message || 'Erro ao consultar veículo'
      }
    }
  }

  // Consultar Infrações no RJ
  static async consultarInfracoes(data: InfractionsRequest) {
    try {
      const { data: result, error } = await supabase.functions.invoke('consultar-infracoes-rj', {
        body: data
      })

      if (error) throw error

      return {
        success: true,
        data: result.data
      }
    } catch (error: any) {
      console.error('Erro ao consultar infrações:', error)
      return {
        success: false,
        error: error.message || 'Erro ao consultar infrações'
      }
    }
  }

  // Formatar CPF
  static formatCPF(cpf: string): string {
    return cpf.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Formatar Placa
  static formatPlaca(placa: string): string {
    return placa.toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/^([A-Z]{3})([0-9A-Z]{1})([0-9A-Z]{1})([0-9]{2})$/, '$1-$2$3$4')
  }

  // Validar CPF
  static isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '')
    
    if (cpf.length !== 11) return false
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    // Validar dígitos verificadores
    let sum = 0
    let remainder
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(9, 10))) return false
    
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.substring(10, 11))) return false
    
    return true
  }

  // Métodos de compatibilidade com o código existente
  static async runPlateSearch(plate: string, userId: string) {
    return this.consultarVeiculo({ placa: plate, user_id: userId })
  }

  static async runMultasSearch(renavam: string, cpf: string, userId: string) {
    return this.consultarInfracoes({ renavam, cpf, user_id: userId })
  }

  static async runRenavamSearch(renavam: string, userId: string) {
    return this.consultarVeiculo({ renavam, user_id: userId })
  }

  static async runCNHSearch(cnh: string, birthDate: string, userId: string) {
    // Assumindo que CNH é o CPF para compatibilidade
    return this.consultarCNH({ cpf: cnh, data_nascimento: birthDate, user_id: userId })
  }

  static async pollResult(requestId: string) {
    // Implementação simplificada para compatibilidade
    return { status: "completed" }
  }
}

// Exportar como default para compatibilidade
export default InfosimplesService

// Exportar também os métodos individuais para compatibilidade
export const runPlateSearch = InfosimplesService.runPlateSearch.bind(InfosimplesService)
export const runMultasSearch = InfosimplesService.runMultasSearch.bind(InfosimplesService)
export const runRenavamSearch = InfosimplesService.runRenavamSearch.bind(InfosimplesService)
export const runCNHSearch = InfosimplesService.runCNHSearch.bind(InfosimplesService)
export const pollResult = InfosimplesService.pollResult.bind(InfosimplesService)

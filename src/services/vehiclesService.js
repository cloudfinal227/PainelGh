import { supabase } from '../lib/supabase'

export const vehiclesService = {
  // Buscar todos os veículos
  async getAllVehicles() {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('id')

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar veículo por ID
  async getVehicleById(id) {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar veículo:', error)
      return { success: false, error: error.message }
    }
  }
}
import { supabase } from '../lib/supabase'

export const materialService = {
  // Buscar todos os materiais
  async getMaterials() {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('nome', { ascending: true })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar materiais por nome (para autocomplete)
  async searchMaterials(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .or(`nome.ilike.%${searchTerm}%,nome_curto.ilike.%${searchTerm}%`)
        .order('nome', { ascending: true })
        .limit(10)

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar todos os veículos
  async getVehicles() {
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
      return { success: false, error: error.message }
    }
  },

  // Adicionar novo material
  async addMaterial(materialData) {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .insert([materialData])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao adicionar material:', error)
      return { success: false, error: error.message }
    }
  }
}
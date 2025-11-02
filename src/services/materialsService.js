import { supabase } from '../lib/supabase'

export const materialsService = {
  // Buscar materiais para autocomplete
  async searchMaterials(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('id, nome, nome_curto, tipo_medida')
        .or(`nome.ilike.%${searchTerm}%,nome_curto.ilike.%${searchTerm}%`)
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

  // Buscar material por ID
  async getMaterialById(id) {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar material:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar todos os materiais
  async getAllMaterials() {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('nome')

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      return { success: false, error: error.message }
    }
  }
}
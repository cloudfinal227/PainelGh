import { supabase } from '../lib/supabase'

export const comprovanteService = {
  // Buscar comprovante por pedido_id
  async getComprovanteByPedidoId(pedidoId) {
    try {
      const { data, error } = await supabase
        .from('comprovantes_entrega')
        .select(`
          *,
          pedidos (
            id,
            cliente_nome,
            telefone,
            cidade,
            rua,
            numero,
            bairro
          )
        `)
        .eq('pedido_id', pedidoId)
        .single()

      if (error) {
        // Se não encontrou, retornar null ao invés de erro
        if (error.code === 'PGRST116') {
          return { success: true, data: null }
        }
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar comprovante:', error)
      return { success: false, error: error.message }
    }
  },

  // Verificar se existe comprovante para um pedido
  async hasComprovante(pedidoId) {
    try {
      const { data, error } = await supabase
        .from('comprovantes_entrega')
        .select('id')
        .eq('pedido_id', pedidoId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, hasComprovante: false }
        }
        throw error
      }

      return { success: true, hasComprovante: !!data }
    } catch (error) {
      console.error('Erro ao verificar comprovante:', error)
      return { success: false, error: error.message }
    }
  },

  // Criar comprovante de entrega
  async createComprovante(comprovanteData) {
    try {
      const { data, error } = await supabase
        .from('comprovantes_entrega')
        .insert([
          {
            pedido_id: comprovanteData.pedidoId,
            nome_recebedor: comprovanteData.nomeRecebedor,
            assinatura_base64: comprovanteData.assinaturaBase64,
            foto_comprovante: comprovanteData.fotoComprovante || null,
            observacoes: comprovanteData.observacoes || null,
            latitude: comprovanteData.latitude || null,
            longitude: comprovanteData.longitude || null
          }
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar comprovante:', error)
      return { success: false, error: error.message }
    }
  }
}

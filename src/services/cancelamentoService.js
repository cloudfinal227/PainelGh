import { supabase } from '../lib/supabase'

export const cancelamentoService = {
  // Buscar cancelamento por pedido_id
  async getCancelamentoByPedidoId(pedidoId) {
    try {
      const { data, error } = await supabase
        .from('cancelamentos')
        .select('*')
        .eq('pedido_id', pedidoId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null }
        }
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar cancelamento:', error)
      return { success: false, error: error.message }
    }
  },

  // Criar cancelamento
  async createCancelamento(cancelamentoData) {
    try {
      const { data, error } = await supabase
        .from('cancelamentos')
        .insert([
          {
            pedido_id: cancelamentoData.pedidoId,
            motivo: cancelamentoData.motivo,
            observacoes: cancelamentoData.observacoes || null,
            entregador_id: cancelamentoData.entregadorId || null
          }
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar cancelamento:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar todos os cancelamentos com dados do pedido
  async getAllCancelamentos() {
    try {
      const { data, error } = await supabase
        .from('cancelamentos')
        .select(`
          *,
          pedidos (
            id,
            cliente_nome,
            telefone,
            cidade,
            total_pedido,
            created_at
          )
        `)
        .order('data_cancelamento', { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar cancelamentos:', error)
      return { success: false, error: error.message }
    }
  },

  // Estatísticas de cancelamentos
  async getEstatisticasCancelamentos() {
    try {
      // Buscar todos os cancelamentos
      const { data, error } = await supabase
        .from('cancelamentos')
        .select('motivo, pedido_id, entregador_id')

      if (error) {
        throw error
      }

      // Processar estatísticas
      const motivosCount = {}
      const entregadoresCount = {}

      data.forEach(cancelamento => {
        // Contar motivos
        motivosCount[cancelamento.motivo] = (motivosCount[cancelamento.motivo] || 0) + 1
        
        // Contar por entregador
        if (cancelamento.entregador_id) {
          entregadoresCount[cancelamento.entregador_id] = 
            (entregadoresCount[cancelamento.entregador_id] || 0) + 1
        }
      })

      return {
        success: true,
        data: {
          total: data.length,
          porMotivo: motivosCount,
          porEntregador: entregadoresCount
        }
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return { success: false, error: error.message }
    }
  }
}

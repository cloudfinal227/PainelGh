import { supabase } from '../lib/supabase'

export const orderService = {
  // Criar um novo pedido
  async createOrder(orderData) {
    try {
      // Primeiro, inserir o pedido principal
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert([
          {
            cliente_nome: orderData.customer.name,
            telefone: orderData.customer.phone,
            cidade: orderData.customer.address.city,
            rua: orderData.customer.address.street,
            numero: orderData.customer.address.number,
            bairro: orderData.customer.address.neighborhood,
            observacoes: orderData.customer.notes,
            total_pedido: orderData.total,
            status: 'pendente'
          }
        ])
        .select()
        .single()

      if (pedidoError) {
        throw pedidoError
      }

      // Depois, inserir os itens do pedido
      const pedidoItens = orderData.items.map(item => ({
        pedido_id: pedido.id,
        material_id: item.materialId,
        veiculo_id: item.vehicleId,
        quantidade: item.quantity,
        preco_unitario: item.unitPrice,
        total_item: item.totalPrice,
        tipo_medida_usado: item.measureType || 'quantidade',
        unidade_final: item.unit || 'unidade'
      }))

      const { error: itensError } = await supabase
        .from('pedido_itens')
        .insert(pedidoItens)

      if (itensError) {
        throw itensError
      }

      return { success: true, order: pedido }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar todos os pedidos com joins
  async getOrders() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_itens (
            *,
            materiais (nome, tipo_medida),
            veiculos (nome, capacidade)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar pedidos pendentes
  async getPendingOrders() {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_itens (
            *,
            materiais (nome, tipo_medida),
            veiculos (nome, capacidade)
          )
        `)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar itens por veículo (para entregadores)
  async getItemsByVehicle(vehicleId) {
    try {
      const { data, error } = await supabase
        .from('pedido_itens')
        .select(`
          *,
          pedidos!inner (
            id, cliente_nome, telefone, cidade, rua, numero, bairro, observacoes, status
          ),
          materiais (nome, tipo_medida),
          veiculos (nome, capacidade)
        `)
        .eq('veiculo_id', vehicleId)
        .eq('pedidos.status', 'pendente')
        .order('pedidos.created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar itens por veículo:', error)
      return { success: false, error: error.message }
    }
  },

  // Atualizar status do pedido
  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar pedido por ID
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_itens (
            *,
            materiais (nome, tipo_medida),
            veiculos (nome, capacidade)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error)
      return { success: false, error: error.message }
    }
  }
}
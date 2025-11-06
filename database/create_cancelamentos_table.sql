-- ========================================
-- SCRIPT: Criar Tabela de Cancelamentos
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- para criar a tabela de cancelamentos

-- ❌ TABELA: cancelamentos
CREATE TABLE IF NOT EXISTS cancelamentos (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  motivo VARCHAR(255) NOT NULL,
  observacoes TEXT,
  entregador_id INTEGER,
  data_cancelamento TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cancelamentos_pedido_id ON cancelamentos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_cancelamentos_motivo ON cancelamentos(motivo);

-- Habilitar RLS (Row Level Security)
ALTER TABLE cancelamentos ENABLE ROW LEVEL SECURITY;

-- Política de acesso (permitir todas operações)
CREATE POLICY "Enable all operations for authenticated users" 
ON cancelamentos 
FOR ALL 
USING (true);

-- Comentários para documentação
COMMENT ON TABLE cancelamentos IS 'Armazena motivos de cancelamento de pedidos';
COMMENT ON COLUMN cancelamentos.pedido_id IS 'ID do pedido cancelado';
COMMENT ON COLUMN cancelamentos.motivo IS 'Motivo do cancelamento';
COMMENT ON COLUMN cancelamentos.observacoes IS 'Observações adicionais sobre o cancelamento';
COMMENT ON COLUMN cancelamentos.entregador_id IS 'ID do entregador (se aplicável)';
COMMENT ON COLUMN cancelamentos.data_cancelamento IS 'Data e hora do cancelamento';

-- ========================================
-- MOTIVOS PADRÃO
-- ========================================
-- Motivos comuns de cancelamento:
-- - nao-estava-em-casa: Cliente não estava em casa
-- - endereco-incorreto: Endereço incorreto ou não encontrado
-- - cliente-desistiu: Cliente desistiu da compra
-- - falta-de-material: Material em falta no estoque
-- - problema-pagamento: Problema com pagamento
-- - outro: Outro motivo

-- ========================================
-- TESTE: Inserir cancelamento de exemplo
-- ========================================
-- Descomente as linhas abaixo para testar
-- (substitua o pedido_id por um ID válido)

/*
-- 1. Atualizar pedido para cancelado
UPDATE pedidos 
SET status = 'cancelado' 
WHERE id = 1;

-- 2. Inserir motivo de cancelamento
INSERT INTO cancelamentos (
  pedido_id,
  motivo,
  observacoes,
  entregador_id
) VALUES (
  1, -- Substitua pelo ID de um pedido existente
  'nao-estava-em-casa',
  'Cliente não atendeu após 3 tentativas de contato',
  NULL
);
*/

-- ========================================
-- CONSULTAS ÚTEIS
-- ========================================

-- Ver todos os cancelamentos
-- SELECT 
--   c.*,
--   p.cliente_nome,
--   p.telefone,
--   p.cidade
-- FROM cancelamentos c
-- JOIN pedidos p ON c.pedido_id = p.id
-- ORDER BY c.data_cancelamento DESC;

-- Contar cancelamentos por motivo
-- SELECT 
--   motivo,
--   COUNT(*) as total
-- FROM cancelamentos
-- GROUP BY motivo
-- ORDER BY total DESC;

-- Pedidos cancelados sem motivo registrado
-- SELECT 
--   p.id,
--   p.cliente_nome,
--   p.status
-- FROM pedidos p
-- LEFT JOIN cancelamentos c ON p.id = c.pedido_id
-- WHERE p.status = 'cancelado'
--   AND c.id IS NULL;

-- ========================================
-- FIM DO SCRIPT
-- ========================================

-- ========================================
-- SCRIPT: Criar Tabela de Comprovantes
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- para criar a tabela de comprovantes de entrega

-- ✍️ TABELA: comprovantes_entrega
CREATE TABLE IF NOT EXISTS comprovantes_entrega (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT REFERENCES pedidos(id) ON DELETE CASCADE,
  nome_recebedor VARCHAR(255) NOT NULL,
  assinatura_base64 TEXT NOT NULL,
  foto_comprovante TEXT,
  observacoes TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_comprovantes_pedido_id ON comprovantes_entrega(pedido_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comprovantes_entrega ENABLE ROW LEVEL SECURITY;

-- Política de acesso (permitir todas operações)
CREATE POLICY "Enable all operations for authenticated users" 
ON comprovantes_entrega 
FOR ALL 
USING (true);

-- Comentários para documentação
COMMENT ON TABLE comprovantes_entrega IS 'Armazena comprovantes de entrega com assinatura digital';
COMMENT ON COLUMN comprovantes_entrega.pedido_id IS 'ID do pedido relacionado';
COMMENT ON COLUMN comprovantes_entrega.nome_recebedor IS 'Nome de quem recebeu a entrega';
COMMENT ON COLUMN comprovantes_entrega.assinatura_base64 IS 'Assinatura digital em formato Base64';
COMMENT ON COLUMN comprovantes_entrega.foto_comprovante IS 'Foto opcional do comprovante em Base64';
COMMENT ON COLUMN comprovantes_entrega.observacoes IS 'Observações sobre a entrega';
COMMENT ON COLUMN comprovantes_entrega.latitude IS 'Latitude da localização da entrega';
COMMENT ON COLUMN comprovantes_entrega.longitude IS 'Longitude da localização da entrega';

-- ========================================
-- TESTE: Inserir comprovante de exemplo
-- ========================================
-- Descomente as linhas abaixo para testar
-- (substitua o pedido_id por um ID válido)

/*
INSERT INTO comprovantes_entrega (
  pedido_id,
  nome_recebedor,
  assinatura_base64,
  foto_comprovante,
  observacoes,
  latitude,
  longitude
) VALUES (
  1, -- Substitua pelo ID de um pedido existente
  'João Silva',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA==',
  'Entregue no portão principal',
  -7.0654321,
  -35.8765432
);
*/

-- ========================================
-- CONSULTA: Ver comprovantes
-- ========================================
-- SELECT * FROM comprovantes_entrega ORDER BY created_at DESC;

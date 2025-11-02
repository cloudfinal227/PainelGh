-- Script para adicionar colunas que faltam nas tabelas existentes

-- Adicionar colunas na tabela pedido_itens
ALTER TABLE pedido_itens 
ADD COLUMN IF NOT EXISTS tipo_medida_usado VARCHAR(50),
ADD COLUMN IF NOT EXISTS unidade_final VARCHAR(50);

-- Adicionar coluna na tabela pedidos (se não existir)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();

-- Adicionar coluna na tabela veiculos (se não existir)
ALTER TABLE veiculos 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW();

-- Adicionar coluna na tabela materiais (se não existir - tipo_medida já existe mas pode estar NULL)
UPDATE materiais SET tipo_medida = 'unidade' WHERE tipo_medida IS NULL;

-- Criar função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at (se não existir)
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
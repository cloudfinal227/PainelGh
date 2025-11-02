# 🚀 INSTRUÇÕES PARA CONFIGURAR O SUPABASE

## ⚠️ IMPORTANTE: Execute estes comandos no SQL Editor do Supabase

### 1️⃣ **PRIMEIRO: Adicionar colunas que faltam**

Execute este SQL para adicionar as colunas necessárias nas tabelas existentes:

```sql
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

-- Garantir que tipo_medida não seja NULL
UPDATE materiais SET tipo_medida = 'unidade' WHERE tipo_medida IS NULL;
```

### 2️⃣ **SEGUNDO: Criar função e trigger para updated_at**

```sql
-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3️⃣ **TERCEIRO: Verificar se os dados iniciais existem**

```sql
-- Inserir veículos se não existirem
INSERT INTO veiculos (nome, capacidade) VALUES 
('Moto', 'Itens pequenos e leves'),
('Carro Baixo', 'Itens pequenos, médios e grandes (pouca quantidade)'),
('Caminhão', 'Itens grandes e grandes quantidades')
ON CONFLICT DO NOTHING;

-- Inserir alguns materiais básicos se não existirem
INSERT INTO materiais (nome, nome_curto, tipo_medida) VALUES 
('Areia Fina', 'areia_fina', 'saco'),
('Areia Grossa', 'areia_grossa', 'saco'),
('Cano PVC 20mm', 'cano20', 'metro'),
('Cano PVC 25mm', 'cano25', 'metro'),
('Cano PVC 32mm', 'cano32', 'metro'),
('Joelho 20mm', 'joelho20', 'unidade'),
('Joelho 25mm', 'joelho25', 'unidade'),
('Cimento CP II', 'cimento_cp2', 'saco')
ON CONFLICT DO NOTHING;
```

### 4️⃣ **QUARTO: Verificar se tudo está funcionando**

```sql
-- Verificar estrutura das tabelas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedido_itens' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
ORDER BY ordinal_position;

-- Verificar se há dados
SELECT COUNT(*) as total_materiais FROM materiais;
SELECT COUNT(*) as total_veiculos FROM veiculos;
```

## ✅ **APÓS EXECUTAR ESTES COMANDOS:**

1. O sistema estará alinhado com as colunas existentes
2. As novas colunas `tipo_medida_usado` e `unidade_final` estarão disponíveis
3. Os dados iniciais de materiais e veículos estarão inseridos
4. O sistema funcionará sem erros de colunas inexistentes

## 🎯 **ESTRUTURA FINAL DAS TABELAS:**

**pedidos:** id, cliente_nome, telefone, cidade, rua, numero, bairro, observacoes, status, total_pedido, created_at, updated_at

**pedido_itens:** id, pedido_id, material_id, veiculo_id, quantidade, preco_unitario, total_item, tipo_medida_usado, unidade_final, created_at

**materiais:** id, nome, nome_curto, tipo_medida, created_at

**veiculos:** id, nome, capacidade, created_at
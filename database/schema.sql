-- 📦 TABELA: materiais
CREATE TABLE IF NOT EXISTS materiais (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  nome_curto VARCHAR(100) NOT NULL,
  tipo_medida VARCHAR(50) NOT NULL, -- 'unidade', 'metro', 'saco', 'litro', 'kg', 'kit', 'pacote'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🚚 TABELA: veiculos
CREATE TABLE IF NOT EXISTS veiculos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL, -- 'Moto', 'Carro Baixo', 'Caminhão'
  capacidade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📋 TABELA: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  cliente_nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  rua VARCHAR(255) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  observacoes TEXT,
  status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'entregue', 'cancelado'
  total_pedido DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📝 TABELA: pedido_itens
CREATE TABLE IF NOT EXISTS pedido_itens (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT REFERENCES pedidos(id) ON DELETE CASCADE,
  material_id BIGINT REFERENCES materiais(id),
  veiculo_id BIGINT REFERENCES veiculos(id),
  quantidade DECIMAL(10,2) NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  total_item DECIMAL(10,2) NOT NULL,
  tipo_medida_usado VARCHAR(50), -- 'metro' ou 'quantidade'
  unidade_final VARCHAR(50), -- unidade final usada na venda
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_materiais_nome ON materiais(nome);
CREATE INDEX IF NOT EXISTS idx_materiais_nome_curto ON materiais(nome_curto);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON pedido_itens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_material_id ON pedido_itens(material_id);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_veiculo_id ON pedido_itens(veiculo_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS - Row Level Security)
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_itens ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados
CREATE POLICY "Enable all operations for authenticated users" ON materiais FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON veiculos FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON pedidos FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON pedido_itens FOR ALL USING (true);

-- 🎯 DADOS INICIAIS - VEÍCULOS
INSERT INTO veiculos (nome, capacidade) VALUES 
('Moto', 'Itens pequenos e leves'),
('Carro Baixo', 'Itens pequenos, médios e grandes (pouca quantidade)'),
('Caminhão', 'Itens grandes e grandes quantidades')
ON CONFLICT DO NOTHING;

-- 🎯 DADOS INICIAIS - MATERIAIS
INSERT INTO materiais (nome, nome_curto, tipo_medida) VALUES 
-- Areias e Britas
('Areia Fina', 'areia_fina', 'saco'),
('Areia Grossa', 'areia_grossa', 'saco'),
('Areia Lavada', 'areia_lavada', 'metro'),
('Brita 0', 'brita0', 'saco'),
('Brita 1', 'brita1', 'saco'),
('Brita 2', 'brita2', 'metro'),
('Brita Corrida', 'brita_corrida', 'metro'),

-- Cimentos e Argamassas
('Cimento CP II', 'cimento_cp2', 'saco'),
('Cimento CP III', 'cimento_cp3', 'saco'),
('Argamassa AC I', 'argamassa_ac1', 'saco'),
('Argamassa AC II', 'argamassa_ac2', 'saco'),

-- Canos PVC
('Cano PVC 20mm', 'cano20', 'metro'),
('Cano PVC 25mm', 'cano25', 'metro'),
('Cano PVC 32mm', 'cano32', 'metro'),
('Cano PVC 40mm', 'cano40', 'metro'),
('Cano PVC 50mm', 'cano50', 'metro'),
('Cano PVC 75mm', 'cano75', 'metro'),
('Cano PVC 100mm', 'cano100', 'metro'),

-- Conexões
('Joelho 20mm', 'joelho20', 'unidade'),
('Joelho 25mm', 'joelho25', 'unidade'),
('Joelho 32mm', 'joelho32', 'unidade'),
('Joelho 40mm', 'joelho40', 'unidade'),
('Joelho 50mm', 'joelho50', 'unidade'),
('Tê 20mm', 'te20', 'unidade'),
('Tê 25mm', 'te25', 'unidade'),
('Tê 32mm', 'te32', 'unidade'),
('Tê 40mm', 'te40', 'unidade'),
('Tê 50mm', 'te50', 'unidade'),
('Luva 20mm', 'luva20', 'unidade'),
('Luva 25mm', 'luva25', 'unidade'),
('Luva 32mm', 'luva32', 'unidade'),
('Luva 40mm', 'luva40', 'unidade'),
('Luva 50mm', 'luva50', 'unidade'),
('Redução 32x25mm', 'reducao32x25', 'unidade'),
('Redução 40x32mm', 'reducao40x32', 'unidade'),
('Redução 50x40mm', 'reducao50x40', 'unidade'),

-- Tijolos e Blocos
('Tijolo Comum', 'tijolo_comum', 'unidade'),
('Tijolo Furado', 'tijolo_furado', 'unidade'),
('Bloco de Concreto 14x19x39', 'bloco14', 'unidade'),
('Bloco de Concreto 19x19x39', 'bloco19', 'unidade'),

-- Telhas
('Telha Cerâmica', 'telha_ceramica', 'unidade'),
('Telha Fibrocimento', 'telha_fibro', 'unidade'),
('Telha Metálica', 'telha_metalica', 'metro')
ON CONFLICT DO NOTHING;
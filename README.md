# GH Construção - Painel de Entregas

Sistema de gerenciamento de entregas para materiais de construção.

## Funcionalidades

- ✅ Cadastro de clientes com endereço detalhado
- ✅ Autocompletar de materiais em tempo real (busca no banco)
- ✅ Sistema de materiais com nome curto para busca rápida
- ✅ Seleção de veículos do banco de dados
- ✅ Cálculo automático de preços
- ✅ Integração completa com Supabase
- ✅ Visualização de pedidos salvos com joins
- ✅ Controle de status de entregas
- ✅ **NOVO**: Separação de entregas por veículo
- ✅ **NOVO**: Painel do entregador com itens filtrados por veículo

## Configuração do Banco de Dados (Supabase)

### 1. Criar as Tabelas

Execute o SQL do arquivo `database/schema.sql` no editor SQL do Supabase. Este arquivo contém:

- **Tabela materiais**: Catálogo de materiais com nome curto para busca
- **Tabela veiculos**: Cadastro de veículos disponíveis  
- **Tabela pedidos**: Pedidos com endereço separado por campos
- **Tabela pedido_itens**: Itens com referências para material e veículo
- **Dados iniciais**: Materiais e veículos pré-cadastrados
- **Índices**: Para performance nas buscas e joins

```sql
-- Tabela de pedidos principais
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address JSONB NOT NULL,
  customer_notes TEXT,
  total_value DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  material_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  measure_type VARCHAR(50) NOT NULL,
  vehicle VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS - Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados
CREATE POLICY "Enable all operations for authenticated users" ON orders
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON order_items
    FOR ALL USING (true);
```

### 2. Configuração das Credenciais

As credenciais do Supabase já estão configuradas no arquivo `src/lib/supabase.js`:

- **URL**: https://rnkdxncmajpdlxwdlswz.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── AutoComplete.js  # Campo de autocompletar
│   ├── CustomerForm.js  # Formulário do cliente
│   ├── ItemForm.js      # Formulário de itens
│   ├── ItemsList.js     # Lista de itens do pedido
│   ├── DeliverySummary.js # Resumo da entrega
│   └── OrdersList.js    # Lista de pedidos salvos
├── data/
│   └── materials.js     # Dados dos materiais
├── lib/
│   └── supabase.js      # Configuração do Supabase
├── services/
│   └── orderService.js  # Serviços de API
└── App.js              # Componente principal
```

## Materiais Pré-cadastrados

- **Areias e Britas**: Fina, Grossa, Lavada, Brita 0/1/2, Corrida
- **Cimentos**: CP II, CP III
- **Argamassas**: AC I, AC II
- **Canos PVC**: 20mm a 100mm
- **Conexões**: Joelhos, Tês, Luvas, Reduções
- **Tijolos e Blocos**: Comum, Furado, Concreto
- **Telhas**: Cerâmica, Fibrocimento, Metálica

## Cidades Atendidas

- Guarabira
- Pirpirituba
- Pilõezinhos
- Pirpiri
- Cuitegi
- Araçagi

## Veículos Disponíveis

- **Moto**: Para itens pequenos
- **Carro Baixo**: Para itens pequenos, médios e grandes (pouca quantidade)
- **Caminhão**: Para itens grandes e grandes quantidades

## Status dos Pedidos

- **Pendente**: Pedido criado, aguardando entrega
- **Entregue**: Pedido finalizado com sucesso
- **Cancelado**: Pedido cancelado

## Tecnologias Utilizadas

- React 18
- Supabase (PostgreSQL)
- Lucide React (Ícones)
- CSS3 (Estilização responsiva)
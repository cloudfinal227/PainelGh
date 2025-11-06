# ❌ Sistema de Cancelamentos - Documentação

## 🎯 Visão Geral

Sistema completo para gerenciamento de cancelamentos de pedidos com registro de motivos, observações e rastreabilidade.

---

## 📊 Estrutura do Banco de Dados

### Tabela: `cancelamentos`

```sql
CREATE TABLE cancelamentos (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id),
  motivo VARCHAR(255) NOT NULL,
  observacoes TEXT,
  entregador_id INTEGER,
  data_cancelamento TIMESTAMP DEFAULT NOW()
);
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único do cancelamento |
| pedido_id | INTEGER | Referência ao pedido cancelado |
| motivo | VARCHAR(255) | Motivo do cancelamento |
| observacoes | TEXT | Observações adicionais |
| entregador_id | INTEGER | ID do entregador (opcional) |
| data_cancelamento | TIMESTAMP | Data/hora do cancelamento |

---

## 🏷️ Motivos Padrão

### Lista de Motivos

| Código | Descrição | Ícone |
|--------|-----------|-------|
| `nao-estava-em-casa` | Cliente não estava em casa | 🏠 |
| `endereco-incorreto` | Endereço incorreto ou não encontrado | 📍 |
| `cliente-desistiu` | Cliente desistiu da compra | 🚫 |
| `falta-de-material` | Material em falta no estoque | 📦 |
| `problema-pagamento` | Problema com pagamento | 💳 |
| `outro` | Outro motivo | ❓ |

---

## 💻 Funcionalidades Implementadas

### No Painel Web

#### 1. Exibição do Motivo
```jsx
// Aparece automaticamente em pedidos cancelados
❌ Motivo: Não estava em casa
💬 Cliente não atendeu após 3 tentativas
```

#### 2. Filtro por Motivo
```jsx
// Dropdown de filtros
- Todos os status
- ❌ Apenas Cancelados
- 🏠 Não estava em casa
- 📍 Endereço incorreto
- 🚫 Cliente desistiu
- 📦 Falta de material
- 💳 Problema de pagamento
- ❓ Outro motivo
```

#### 3. Estatísticas
- Total de cancelamentos
- Cancelamentos por motivo
- Cancelamentos por entregador
- Tendências ao longo do tempo

---

## 🔧 Serviços Implementados

### cancelamentoService.js

```javascript
// Buscar cancelamento por pedido
getCancelamentoByPedidoId(pedidoId)

// Criar novo cancelamento
createCancelamento({
  pedidoId,
  motivo,
  observacoes,
  entregadorId
})

// Buscar todos os cancelamentos
getAllCancelamentos()

// Estatísticas
getEstatisticasCancelamentos()
```

---

## 📱 Fluxo de Uso

### 1. Cancelar Pedido (App Móvel - Futuro)

```
Entregador → Tenta entregar
          → Não consegue
          → Seleciona motivo
          → Adiciona observações
          → Confirma cancelamento
          ↓
Sistema → Atualiza status para 'cancelado'
       → Registra motivo
       → Notifica escritório
```

### 2. Visualizar Cancelamento (Painel Web)

```
Usuário → Acessa "Ver Pedidos"
       → Vê pedido com status "CANCELADO"
       → Vê motivo automaticamente
       → Pode filtrar por motivo
```

---

## 🎨 Interface

### Card de Pedido Cancelado

```
┌─────────────────────────────────────┐
│ #1234  👤 João Silva               │
│ 📍 Rua A, 123 - Centro             │
│ ❌ CANCELADO                        │
│ ┌─────────────────────────────────┐ │
│ │ ❌ Motivo: Não estava em casa   │ │
│ │ 💬 Cliente não atendeu após 3   │ │
│ │    tentativas de contato        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📊 Consultas SQL Úteis

### Ver Todos os Cancelamentos

```sql
SELECT 
  c.*,
  p.cliente_nome,
  p.telefone,
  p.cidade
FROM cancelamentos c
JOIN pedidos p ON c.pedido_id = p.id
ORDER BY c.data_cancelamento DESC;
```

### Estatísticas por Motivo

```sql
SELECT 
  motivo,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentual
FROM cancelamentos
GROUP BY motivo
ORDER BY total DESC;
```

### Cancelamentos por Período

```sql
SELECT 
  DATE(data_cancelamento) as data,
  COUNT(*) as total_cancelamentos
FROM cancelamentos
WHERE data_cancelamento >= NOW() - INTERVAL '30 days'
GROUP BY DATE(data_cancelamento)
ORDER BY data DESC;
```

### Top Motivos do Mês

```sql
SELECT 
  motivo,
  COUNT(*) as total
FROM cancelamentos
WHERE EXTRACT(MONTH FROM data_cancelamento) = EXTRACT(MONTH FROM NOW())
  AND EXTRACT(YEAR FROM data_cancelamento) = EXTRACT(YEAR FROM NOW())
GROUP BY motivo
ORDER BY total DESC
LIMIT 5;
```

---

## 🔄 Integração com App Móvel

### Exemplo de Implementação

```javascript
import { cancelamentoService } from './services/cancelamentoService';
import { orderService } from './services/orderService';

// Função para cancelar pedido
const handleCancelarPedido = async (pedidoId, motivo, observacoes) => {
  try {
    // 1. Criar registro de cancelamento
    const cancelResult = await cancelamentoService.createCancelamento({
      pedidoId,
      motivo,
      observacoes,
      entregadorId: currentUser.id // ID do entregador logado
    });

    if (!cancelResult.success) {
      throw new Error(cancelResult.error);
    }

    // 2. Atualizar status do pedido
    const statusResult = await orderService.updateOrderStatus(
      pedidoId,
      'cancelado'
    );

    if (!statusResult.success) {
      throw new Error(statusResult.error);
    }

    Alert.alert('Sucesso', 'Pedido cancelado com sucesso!');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Erro', `Não foi possível cancelar: ${error.message}`);
  }
};
```

### Tela de Cancelamento (React Native)

```jsx
const CancelarPedidoScreen = ({ route }) => {
  const { pedido } = route.params;
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const motivos = [
    { value: 'nao-estava-em-casa', label: '🏠 Não estava em casa' },
    { value: 'endereco-incorreto', label: '📍 Endereço incorreto' },
    { value: 'cliente-desistiu', label: '🚫 Cliente desistiu' },
    { value: 'falta-de-material', label: '📦 Falta de material' },
    { value: 'problema-pagamento', label: '💳 Problema de pagamento' },
    { value: 'outro', label: '❓ Outro motivo' },
  ];

  return (
    <View>
      <Text>Cancelar Pedido #{pedido.id}</Text>
      
      <Picker
        selectedValue={motivo}
        onValueChange={setMotivo}
      >
        <Picker.Item label="Selecione o motivo" value="" />
        {motivos.map(m => (
          <Picker.Item key={m.value} label={m.label} value={m.value} />
        ))}
      </Picker>

      <TextInput
        placeholder="Observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <Button
        title="Confirmar Cancelamento"
        onPress={() => handleCancelarPedido(pedido.id, motivo, observacoes)}
        disabled={!motivo}
      />
    </View>
  );
};
```

---

## 📈 Relatórios e Análises

### Dashboard de Cancelamentos

```javascript
// Buscar estatísticas
const stats = await cancelamentoService.getEstatisticasCancelamentos();

// Exibir:
// - Total de cancelamentos
// - Motivo mais comum
// - Taxa de cancelamento (%)
// - Tendência (aumentando/diminuindo)
```

### Métricas Importantes

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Taxa de Cancelamento | % de pedidos cancelados | < 5% |
| Tempo Médio até Cancelamento | Tempo entre criação e cancelamento | - |
| Motivo Mais Comum | Motivo que mais aparece | - |
| Entregador com Mais Cancelamentos | Para treinamento | - |

---

## 🎯 Benefícios

### Operacionais
- ✅ Rastreabilidade completa
- ✅ Identificação de problemas recorrentes
- ✅ Dados para melhorias
- ✅ Transparência

### Gerenciais
- ✅ Relatórios detalhados
- ✅ Análise de tendências
- ✅ Identificação de gargalos
- ✅ Tomada de decisão baseada em dados

### Comerciais
- ✅ Redução de cancelamentos
- ✅ Melhoria no atendimento
- ✅ Satisfação do cliente
- ✅ Otimização de rotas

---

## 🔒 Segurança

- ✅ RLS habilitado
- ✅ Políticas de acesso configuradas
- ✅ Auditoria de cancelamentos
- ✅ Registro de quem cancelou

---

## 🚀 Instalação

### 1. Criar Tabela

```bash
# Execute no SQL Editor do Supabase
database/create_cancelamentos_table.sql
```

### 2. Testar

```sql
-- Cancelar um pedido
UPDATE pedidos SET status = 'cancelado' WHERE id = 1;

-- Registrar motivo
INSERT INTO cancelamentos (pedido_id, motivo, observacoes)
VALUES (1, 'nao-estava-em-casa', 'Cliente não atendeu');
```

### 3. Verificar no Painel

```
1. Acesse o painel web
2. Vá em "Ver Pedidos"
3. Veja o pedido cancelado com motivo
```

---

## 📝 Próximos Passos

### Fase 1: Painel Web ✅ CONCLUÍDO
- [x] Exibição de motivos
- [x] Filtro por motivo
- [x] Estilos e ícones

### Fase 2: App Móvel ⏳ PRÓXIMO
- [ ] Tela de cancelamento
- [ ] Seleção de motivo
- [ ] Integração com backend

### Fase 3: Relatórios 🔮 FUTURO
- [ ] Dashboard de cancelamentos
- [ ] Gráficos e estatísticas
- [ ] Exportação de relatórios
- [ ] Alertas automáticos

---

## 📞 Suporte

Para dúvidas sobre o sistema de cancelamentos:
- 📧 Email: suporte@ghconstrucao.com.br
- 📱 WhatsApp: (83) 99999-9999
- 📖 Documentação: [INDICE_DOCUMENTACAO.md](INDICE_DOCUMENTACAO.md)

---

**Desenvolvido com ❤️ para GH Construção** 🏗️

**Versão**: 1.0.0  
**Data**: 05/11/2025  
**Status**: ✅ Pronto para Uso

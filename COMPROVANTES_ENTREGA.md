# 📝 Sistema de Comprovantes de Entrega

## 🎯 Visão Geral

Sistema completo para visualização de comprovantes de entrega com assinatura digital e foto opcional.

## 📊 Estrutura do Banco de Dados

### Tabela: `comprovantes_entrega`

```sql
CREATE TABLE comprovantes_entrega (
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
```

## 🔧 Componentes Criados

### 1. **comprovanteService.js**
Serviço para gerenciar comprovantes:
- `getComprovanteByPedidoId(pedidoId)` - Busca comprovante por ID do pedido
- `hasComprovante(pedidoId)` - Verifica se existe comprovante
- `createComprovante(comprovanteData)` - Cria novo comprovante

### 2. **ComprovanteModal.jsx**
Modal React para exibir comprovantes com:
- Informações do pedido e cliente
- Dados da entrega (recebedor, data/hora)
- Assinatura digital em Base64
- Foto opcional do comprovante
- Tratamento de erros de carregamento

### 3. **Estilos CSS**
Estilos completos para:
- Modal responsivo
- Animações suaves
- Layout de comprovante
- Botão "Ver Assinatura"

## 📱 Fluxo de Uso

### No Painel Web:

1. **Lista de Pedidos**
   - Pedidos com status "entregue" mostram botão "📝 Ver Comprovante"
   - Botão só aparece se existe comprovante no banco

2. **Visualização**
   - Clique no botão abre modal
   - Modal carrega dados do comprovante
   - Exibe todas as informações da entrega

3. **Informações Exibidas**
   - Número do pedido
   - Nome do cliente e endereço
   - Quem recebeu a entrega
   - Data e hora da entrega
   - Assinatura digital
   - Foto (se disponível)
   - Observações (se houver)

## 🔄 Integração com App Móvel

Para criar comprovantes via app móvel, use:

```javascript
import { comprovanteService } from './services/comprovanteService';

// Criar comprovante após entrega
const resultado = await comprovanteService.createComprovante({
  pedidoId: 123,
  nomeRecebedor: "João Silva",
  assinaturaBase64: "data:image/png;base64,iVBORw0KG...",
  fotoComprovante: "data:image/jpeg;base64,/9j/4AAQ...", // opcional
  observacoes: "Entregue no portão", // opcional
  latitude: -7.0123456, // opcional
  longitude: -35.1234567 // opcional
});

if (resultado.success) {
  // Atualizar status do pedido para 'entregue'
  await orderService.updateOrderStatus(123, 'entregue');
}
```

## ✅ Funcionalidades Implementadas

- ✅ Tabela de comprovantes no banco
- ✅ Serviço de gerenciamento de comprovantes
- ✅ Modal de visualização responsivo
- ✅ Botão condicional nos cards (só para entregues)
- ✅ Verificação automática de comprovantes
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Suporte a assinatura Base64
- ✅ Suporte a foto opcional
- ✅ Animações suaves
- ✅ Design responsivo

## 🎨 Customização

### Alterar cores do botão:
```css
.btn-view-signature {
  background: linear-gradient(135deg, #10b981, #059669);
  /* Altere para suas cores */
}
```

### Alterar tamanho do modal:
```css
.modal-content {
  max-width: 700px; /* Ajuste conforme necessário */
}
```

## 🚀 Próximos Passos

Para implementar no app móvel:

1. Criar tela de assinatura digital
2. Adicionar captura de foto
3. Converter assinatura/foto para Base64
4. Enviar para `comprovanteService.createComprovante()`
5. Atualizar status do pedido

## 📝 Exemplo de Dados

```javascript
{
  pedidoId: 123,
  nomeRecebedor: "Maria Santos",
  assinaturaBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  fotoComprovante: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
  observacoes: "Entregue às 14:30, portão principal",
  latitude: -7.0654321,
  longitude: -35.8765432
}
```

## 🔒 Segurança

- RLS (Row Level Security) habilitado
- Políticas de acesso configuradas
- Validação de dados no serviço
- Tratamento de erros robusto

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme que a tabela foi criada no Supabase
3. Verifique as políticas RLS
4. Teste a conexão com o banco

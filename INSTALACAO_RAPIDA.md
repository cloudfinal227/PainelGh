# ⚡ Instalação Rápida - Sistema de Comprovantes

## 🚀 3 Passos para Começar

### 1️⃣ Criar Tabela no Supabase (2 minutos)

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (ícone de banco de dados)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `database/create_comprovantes_table.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. ✅ Pronto! Tabela criada

### 2️⃣ Testar no Painel Web (1 minuto)

```bash
# Se ainda não estiver rodando
npm run dev
```

1. Acesse http://localhost:5173
2. Vá em **Ver Pedidos**
3. Procure pedidos com status **ENTREGUE**
4. O botão **📝 Ver Comprovante** aparecerá (se houver comprovante)

### 3️⃣ Criar Comprovante de Teste (1 minuto)

Execute no SQL Editor do Supabase:

```sql
-- Primeiro, atualize um pedido para 'entregue'
UPDATE pedidos 
SET status = 'entregue' 
WHERE id = 1; -- Substitua pelo ID de um pedido existente

-- Depois, crie um comprovante de teste
INSERT INTO comprovantes_entrega (
  pedido_id,
  nome_recebedor,
  assinatura_base64,
  observacoes
) VALUES (
  1, -- Mesmo ID do pedido acima
  'João Silva',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'Comprovante de teste'
);
```

Agora volte ao painel web e clique em **Ver Comprovante**! 🎉

## 🎯 Resultado Esperado

Você verá um modal com:
- ✅ Informações do pedido
- ✅ Nome do recebedor
- ✅ Data e hora da entrega
- ✅ Assinatura digital
- ✅ Observações

## 🔧 Troubleshooting

### Botão não aparece?
```sql
-- Verifique se o pedido está entregue
SELECT id, cliente_nome, status FROM pedidos WHERE id = 1;

-- Verifique se existe comprovante
SELECT * FROM comprovantes_entrega WHERE pedido_id = 1;
```

### Erro de permissão?
```sql
-- Verifique as políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'comprovantes_entrega';

-- Se necessário, recrie a política
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON comprovantes_entrega;
CREATE POLICY "Enable all operations for authenticated users" ON comprovantes_entrega FOR ALL USING (true);
```

### Modal não abre?
1. Abra o Console do navegador (F12)
2. Veja se há erros em vermelho
3. Verifique se o Supabase está conectado

## 📱 Próximo Passo: App Móvel

Depois de testar no painel web, siga o guia completo em:
- `INTEGRACAO_APP_MOBILE.md` - Para implementar no app móvel

## 📚 Documentação Completa

- `COMPROVANTES_ENTREGA.md` - Documentação técnica completa
- `RESUMO_IMPLEMENTACAO.md` - Visão geral da implementação
- `database/schema.sql` - Schema completo do banco

## ✅ Checklist

- [ ] Tabela criada no Supabase
- [ ] Pedido de teste com status 'entregue'
- [ ] Comprovante de teste criado
- [ ] Botão aparecendo no painel
- [ ] Modal abrindo corretamente
- [ ] Pronto para usar! 🎉

## 🆘 Precisa de Ajuda?

1. Verifique os logs do console (F12)
2. Confirme que está usando o Supabase correto
3. Teste a conexão com o banco
4. Revise as políticas RLS

---

**Tempo total de instalação: ~5 minutos** ⚡

-- ========================================
-- QUERIES ÚTEIS - Sistema de Comprovantes
-- ========================================

-- 📊 CONSULTAS BÁSICAS
-- ========================================

-- Ver todos os comprovantes
SELECT 
  c.*,
  p.cliente_nome,
  p.telefone,
  p.cidade
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
ORDER BY c.created_at DESC;

-- Ver comprovantes de hoje
SELECT 
  c.*,
  p.cliente_nome
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
WHERE DATE(c.created_at) = CURRENT_DATE
ORDER BY c.created_at DESC;

-- Contar comprovantes por dia
SELECT 
  DATE(created_at) as data,
  COUNT(*) as total_comprovantes
FROM comprovantes_entrega
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- 🔍 CONSULTAS AVANÇADAS
-- ========================================

-- Pedidos entregues SEM comprovante
SELECT 
  p.id,
  p.cliente_nome,
  p.telefone,
  p.created_at
FROM pedidos p
LEFT JOIN comprovantes_entrega c ON p.id = c.pedido_id
WHERE p.status = 'entregue'
  AND c.id IS NULL
ORDER BY p.created_at DESC;

-- Pedidos entregues COM comprovante
SELECT 
  p.id,
  p.cliente_nome,
  p.telefone,
  c.nome_recebedor,
  c.created_at as data_entrega
FROM pedidos p
INNER JOIN comprovantes_entrega c ON p.id = c.pedido_id
WHERE p.status = 'entregue'
ORDER BY c.created_at DESC;

-- Comprovantes com foto
SELECT 
  c.id,
  c.pedido_id,
  p.cliente_nome,
  c.nome_recebedor,
  CASE 
    WHEN c.foto_comprovante IS NOT NULL THEN 'Sim'
    ELSE 'Não'
  END as tem_foto
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
ORDER BY c.created_at DESC;

-- Comprovantes com geolocalização
SELECT 
  c.id,
  c.pedido_id,
  p.cliente_nome,
  c.latitude,
  c.longitude,
  c.created_at
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
WHERE c.latitude IS NOT NULL 
  AND c.longitude IS NOT NULL
ORDER BY c.created_at DESC;

-- 📈 RELATÓRIOS
-- ========================================

-- Relatório mensal de entregas
SELECT 
  TO_CHAR(c.created_at, 'YYYY-MM') as mes,
  COUNT(*) as total_entregas,
  COUNT(c.foto_comprovante) as entregas_com_foto,
  ROUND(COUNT(c.foto_comprovante)::numeric / COUNT(*)::numeric * 100, 2) as percentual_com_foto
FROM comprovantes_entrega c
GROUP BY TO_CHAR(c.created_at, 'YYYY-MM')
ORDER BY mes DESC;

-- Top 10 recebedores
SELECT 
  nome_recebedor,
  COUNT(*) as total_recebimentos
FROM comprovantes_entrega
GROUP BY nome_recebedor
ORDER BY total_recebimentos DESC
LIMIT 10;

-- Entregas por cidade
SELECT 
  p.cidade,
  COUNT(c.id) as total_entregas
FROM pedidos p
LEFT JOIN comprovantes_entrega c ON p.id = c.pedido_id
WHERE p.status = 'entregue'
GROUP BY p.cidade
ORDER BY total_entregas DESC;

-- 🔧 MANUTENÇÃO
-- ========================================

-- Verificar integridade dos dados
SELECT 
  'Total de pedidos' as metrica,
  COUNT(*) as valor
FROM pedidos
UNION ALL
SELECT 
  'Pedidos entregues',
  COUNT(*)
FROM pedidos
WHERE status = 'entregue'
UNION ALL
SELECT 
  'Comprovantes criados',
  COUNT(*)
FROM comprovantes_entrega
UNION ALL
SELECT 
  'Comprovantes com foto',
  COUNT(*)
FROM comprovantes_entrega
WHERE foto_comprovante IS NOT NULL;

-- Verificar comprovantes órfãos (sem pedido)
SELECT c.*
FROM comprovantes_entrega c
LEFT JOIN pedidos p ON c.pedido_id = p.id
WHERE p.id IS NULL;

-- Verificar tamanho dos dados
SELECT 
  pg_size_pretty(pg_total_relation_size('comprovantes_entrega')) as tamanho_tabela,
  COUNT(*) as total_registros,
  pg_size_pretty(AVG(LENGTH(assinatura_base64))::bigint) as tamanho_medio_assinatura,
  pg_size_pretty(AVG(LENGTH(foto_comprovante))::bigint) as tamanho_medio_foto
FROM comprovantes_entrega;

-- 🗑️ LIMPEZA
-- ========================================

-- Deletar comprovantes de teste (CUIDADO!)
-- DELETE FROM comprovantes_entrega WHERE nome_recebedor LIKE '%Teste%';

-- Deletar comprovantes antigos (mais de 1 ano)
-- DELETE FROM comprovantes_entrega WHERE created_at < NOW() - INTERVAL '1 year';

-- Deletar comprovantes órfãos
-- DELETE FROM comprovantes_entrega c
-- WHERE NOT EXISTS (
--   SELECT 1 FROM pedidos p WHERE p.id = c.pedido_id
-- );

-- 🔄 ATUALIZAÇÕES
-- ========================================

-- Atualizar observações de um comprovante
-- UPDATE comprovantes_entrega
-- SET observacoes = 'Nova observação'
-- WHERE id = 1;

-- Adicionar foto a um comprovante existente
-- UPDATE comprovantes_entrega
-- SET foto_comprovante = 'data:image/jpeg;base64,...'
-- WHERE id = 1;

-- 📊 ESTATÍSTICAS
-- ========================================

-- Tempo médio entre pedido e entrega
SELECT 
  AVG(c.created_at - p.created_at) as tempo_medio_entrega
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id;

-- Entregas por dia da semana
SELECT 
  TO_CHAR(created_at, 'Day') as dia_semana,
  COUNT(*) as total_entregas
FROM comprovantes_entrega
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY EXTRACT(DOW FROM created_at);

-- Entregas por hora do dia
SELECT 
  EXTRACT(HOUR FROM created_at) as hora,
  COUNT(*) as total_entregas
FROM comprovantes_entrega
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hora;

-- 🔍 BUSCA E FILTROS
-- ========================================

-- Buscar comprovante por nome do cliente
SELECT 
  c.*,
  p.cliente_nome,
  p.telefone
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
WHERE p.cliente_nome ILIKE '%João%'
ORDER BY c.created_at DESC;

-- Buscar comprovante por nome do recebedor
SELECT 
  c.*,
  p.cliente_nome
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
WHERE c.nome_recebedor ILIKE '%Maria%'
ORDER BY c.created_at DESC;

-- Buscar comprovantes por período
SELECT 
  c.*,
  p.cliente_nome
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id
WHERE c.created_at BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY c.created_at DESC;

-- 🎯 VIEWS ÚTEIS
-- ========================================

-- Criar view de comprovantes completos
CREATE OR REPLACE VIEW vw_comprovantes_completos AS
SELECT 
  c.id as comprovante_id,
  c.pedido_id,
  p.cliente_nome,
  p.telefone,
  p.cidade,
  p.rua,
  p.numero,
  p.bairro,
  c.nome_recebedor,
  c.created_at as data_entrega,
  CASE 
    WHEN c.foto_comprovante IS NOT NULL THEN true
    ELSE false
  END as tem_foto,
  CASE 
    WHEN c.latitude IS NOT NULL AND c.longitude IS NOT NULL THEN true
    ELSE false
  END as tem_localizacao,
  c.observacoes
FROM comprovantes_entrega c
JOIN pedidos p ON c.pedido_id = p.id;

-- Usar a view
-- SELECT * FROM vw_comprovantes_completos ORDER BY data_entrega DESC;

-- 📝 BACKUP
-- ========================================

-- Exportar comprovantes para JSON (use no código)
-- SELECT json_agg(row_to_json(c)) FROM comprovantes_entrega c;

-- Criar tabela de backup
-- CREATE TABLE comprovantes_entrega_backup AS 
-- SELECT * FROM comprovantes_entrega;

-- ========================================
-- FIM DAS QUERIES ÚTEIS
-- ========================================

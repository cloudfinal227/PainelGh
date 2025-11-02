// Configurações para atualizações em tempo real

export const REALTIME_CONFIG = {
  // Intervalo de auto-refresh em milissegundos (30 segundos)
  AUTO_REFRESH_INTERVAL: 30000,
  
  // Intervalo de auto-refresh rápido quando há atividade (10 segundos)
  FAST_REFRESH_INTERVAL: 10000,
  
  // Tempo para voltar ao intervalo normal após atividade (2 minutos)
  ACTIVITY_TIMEOUT: 120000,
  
  // Configurações do Supabase Realtime
  SUPABASE_CHANNEL: 'pedidos-changes',
  
  // Tabelas para monitorar
  TABLES_TO_WATCH: ['pedidos', 'pedido_itens']
};

export const REFRESH_MESSAGES = {
  ACTIVE: '✅ Auto-refresh ativo',
  UPDATING: '🔄 Atualizando...',
  PAUSED: '⏸️ Auto-refresh pausado',
  ERROR: '❌ Erro na atualização',
  REALTIME_CONNECTED: '🔗 Tempo real conectado',
  REALTIME_DISCONNECTED: '📡 Usando auto-refresh'
};
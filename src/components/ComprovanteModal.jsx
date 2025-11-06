import React from 'react';

const ComprovanteModal = ({ isOpen, onClose, comprovante, pedido }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Comprovante de Entrega</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!comprovante && pedido ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 20px' }}></div>
              <p>Carregando comprovante...</p>
            </div>
          ) : comprovante ? (
            <>
              {/* Informações do Pedido */}
              <div className="comprovante-section">
                <h3>📦 Pedido #{pedido?.id?.toString().slice(-4)}</h3>
                <div className="comprovante-info">
                  <div className="info-row">
                    <span className="info-label">Cliente:</span>
                    <span className="info-value">{comprovante.pedidos?.cliente_nome || pedido?.cliente_nome}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Endereço:</span>
                    <span className="info-value">
                      {comprovante.pedidos?.rua || pedido?.rua}, {comprovante.pedidos?.numero || pedido?.numero} - {comprovante.pedidos?.bairro || pedido?.bairro}, {comprovante.pedidos?.cidade || pedido?.cidade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações da Entrega */}
              <div className="comprovante-section">
                <h3>✅ Dados da Entrega</h3>
                <div className="comprovante-info">
                  <div className="info-row">
                    <span className="info-label">Recebido por:</span>
                    <span className="info-value">{comprovante.nome_recebedor}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Data/Hora:</span>
                    <span className="info-value">{formatDate(comprovante.created_at)}</span>
                  </div>
                  {comprovante.observacoes && (
                    <div className="info-row">
                      <span className="info-label">Observações:</span>
                      <span className="info-value">{comprovante.observacoes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assinatura */}
              <div className="comprovante-section">
                <h3>✍️ Assinatura Digital</h3>
                <div className="assinatura-container">
                  {comprovante.assinatura_base64 ? (
                    <img 
                      src={comprovante.assinatura_base64} 
                      alt="Assinatura" 
                      className="assinatura-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <p className="no-data">Assinatura não disponível</p>
                  )}
                  <p className="error-message" style={{ display: 'none', color: '#dc2626' }}>
                    ⚠️ Erro ao carregar assinatura
                  </p>
                </div>
              </div>

              {/* Foto do Comprovante (opcional) */}
              {comprovante.foto_comprovante && (
                <div className="comprovante-section">
                  <h3>📸 Foto do Comprovante</h3>
                  <div className="foto-container">
                    <img 
                      src={comprovante.foto_comprovante} 
                      alt="Foto do comprovante" 
                      className="foto-comprovante"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p className="error-message" style={{ display: 'none', color: '#dc2626' }}>
                      ⚠️ Erro ao carregar foto
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-comprovante">
              <p>⚠️ Comprovante não encontrado para este pedido.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprovanteModal;

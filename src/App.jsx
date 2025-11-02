import React, { useState } from 'react';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('new-order');
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: {
      city: '',
      street: '',
      number: '',
      neighborhood: ''
    },
    notes: ''
  });

  const cities = [
    'Guarabira',
    'Pirpirituba', 
    'Pilõezinhos',
    'Pirpiri',
    'Cuitegi',
    'Araçagi'
  ];

  const handleInputChange = (field, value) => {
    setCustomer({
      ...customer,
      [field]: value
    });
  };

  const handleAddressChange = (field, value) => {
    const updatedAddress = {
      ...customer.address,
      [field]: value
    };
    
    setCustomer({
      ...customer,
      address: updatedAddress
    });
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px' }}>🏗️ GH Construção</h1>
              <p style={{ margin: 0, opacity: 0.9 }}>Painel de Entregas</p>
            </div>
          </div>
          
          {/* Navegação */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${currentView === 'new-order' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('new-order')}
            >
              ➕ Novo Pedido
            </button>
            <button 
              className={`btn ${currentView === 'orders-list' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('orders-list')}
            >
              📋 Ver Pedidos
            </button>
            <button 
              className={`btn ${currentView === 'delivery-by-vehicle' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('delivery-by-vehicle')}
            >
              🚚 Entregas
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {currentView === 'new-order' && (
        <div className="form-section">
          <h3>Dados do Cliente</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nome do Cliente *</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome completo do cliente"
              />
            </div>

            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label>Cidade *</label>
              <select
                value={customer.address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              >
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rua *</label>
              <input
                type="text"
                value={customer.address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="Nome da rua"
              />
            </div>

            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                value={customer.address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="Número da casa"
              />
            </div>

            <div className="form-group">
              <label>Bairro *</label>
              <input
                type="text"
                value={customer.address?.neighborhood || ''}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                placeholder="Nome do bairro"
              />
            </div>

            <div className="form-group">
              <label>Observações</label>
              <input
                type="text"
                value={customer.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informações adicionais sobre a entrega"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <h4>Preview dos Dados:</h4>
            <p><strong>Nome:</strong> {customer.name || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {customer.phone || 'Não informado'}</p>
            <p><strong>Endereço:</strong> {
              [customer.address?.street, customer.address?.number, customer.address?.neighborhood, customer.address?.city]
                .filter(Boolean)
                .join(', ') || 'Não informado'
            }</p>
            <p><strong>Observações:</strong> {customer.notes || 'Nenhuma'}</p>
          </div>
        </div>
      )}

      {currentView === 'orders-list' && (
        <div className="form-section">
          <h3>Lista de Pedidos</h3>
          <p>✅ Vite funcionando</p>
          <p>✅ React funcionando</p>
          <p>✅ Navegação funcionando</p>
          <p>🔄 Componentes em desenvolvimento...</p>
        </div>
      )}

      {currentView === 'delivery-by-vehicle' && (
        <div className="form-section">
          <h3>Entregas por Veículo</h3>
          <p>✅ Sistema base funcionando</p>
          <p>🔄 Integração com Supabase em desenvolvimento...</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#666', 
        fontSize: '14px',
        marginTop: '30px'
      }}>
        📦 Sistema de Entregas - GH Construção © 2024
      </div>
    </div>
  );
}

export default App;
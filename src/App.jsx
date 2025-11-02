import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm.jsx';
import './index.css';

function App() {
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

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('new-order'); // 'new-order', 'orders-list', 'delivery-by-vehicle'

  const handleAddItem = (item) => {
    setItems(prevItems => [...prevItems, item]);
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
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              ➕ Novo Pedido
            </button>
            <button 
              className={`btn ${currentView === 'orders-list' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('orders-list')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              📋 Ver Pedidos
            </button>
            <button 
              className={`btn ${currentView === 'delivery-by-vehicle' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('delivery-by-vehicle')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              🚚 Entregas
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo baseado na view atual */}
      {currentView === 'new-order' && (
        <>
          {/* Formulário do Cliente */}
          <CustomerForm 
            customer={customer} 
            onChange={setCustomer} 
          />

          <div className="form-section">
            <h3>Outros Componentes</h3>
            <p>Em desenvolvimento... Formulário do cliente funcionando!</p>
            <p>Items: {items.length}</p>
          </div>
        </>
      )}

      {currentView === 'orders-list' && (
        <div className="form-section">
          <h3>Lista de Pedidos</h3>
          <p>Em desenvolvimento...</p>
        </div>
      )}

      {currentView === 'delivery-by-vehicle' && (
        <div className="form-section">
          <h3>Entregas por Veículo</h3>
          <p>Em desenvolvimento...</p>
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
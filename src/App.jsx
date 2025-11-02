import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import ItemForm from './components/ItemForm';
import ItemsList from './components/ItemsList';
import DeliverySummary from './components/DeliverySummary';
import OrdersList from './components/OrdersList';
import DeliveryByVehicle from './components/DeliveryByVehicle';
import { Building2, Package, Plus, List, Truck } from 'lucide-react';
import { orderService } from './services/orderService';
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

  const handleRemoveItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleFinalize = async () => {
    setIsLoading(true);
    
    const orderData = {
      customer,
      items,
      total: items.reduce((sum, item) => sum + item.totalPrice, 0),
      createdAt: new Date().toISOString(),
      id: Date.now()
    };

    // Formatar endereço para exibição
    const formatAddress = (address) => {
      if (!address) return '';
      if (typeof address === 'string') return address;
      
      const { street, number, neighborhood, city } = address;
      const parts = [];
      
      if (street) parts.push(street);
      if (number) parts.push(`nº ${number}`);
      if (neighborhood) parts.push(neighborhood);
      if (city) parts.push(city);
      
      return parts.join(', ');
    };

    try {
      // Salvar no Supabase
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        alert(`Pedido finalizado com sucesso!\n\nCliente: ${customer.name}\nEndereço: ${formatAddress(customer.address)}\nItens: ${items.length}\nTotal: R$ ${orderData.total.toFixed(2)}\n\nPedido #${result.order.id} salvo no sistema.`);
        
        // Limpar formulário após finalizar
        handleClear();
      } else {
        alert(`Erro ao salvar pedido: ${result.error}\n\nTente novamente ou contate o suporte.`);
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert(`Erro inesperado ao salvar pedido.\n\nVerifique sua conexão e tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCustomer({
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
    setItems([]);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '28px' }}>GH Construção</h1>
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
              <Plus size={16} />
              Novo Pedido
            </button>
            <button 
              className={`btn ${currentView === 'orders-list' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('orders-list')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <List size={16} />
              Ver Pedidos
            </button>
            <button 
              className={`btn ${currentView === 'delivery-by-vehicle' ? 'btn-success' : 'btn-primary'}`}
              onClick={() => setCurrentView('delivery-by-vehicle')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Truck size={16} />
              Entregas
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

          {/* Formulário de Itens */}
          <ItemForm onAddItem={handleAddItem} />

          {/* Lista de Itens */}
          <ItemsList 
            items={items} 
            onRemoveItem={handleRemoveItem} 
          />

          {/* Resumo da Entrega */}
          <DeliverySummary 
            customer={customer}
            items={items}
            onFinalize={handleFinalize}
            onClear={handleClear}
            isLoading={isLoading}
          />
        </>
      )}

      {currentView === 'orders-list' && (
        <OrdersList />
      )}

      {currentView === 'delivery-by-vehicle' && (
        <DeliveryByVehicle />
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#666', 
        fontSize: '14px',
        marginTop: '30px'
      }}>
        <Package size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Sistema de Entregas - GH Construção © 2024
      </div>
    </div>
  );
}

export default App;
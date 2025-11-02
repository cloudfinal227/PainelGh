import React from 'react';
import { Package, Truck, User, MapPin, Phone } from 'lucide-react';

const DeliverySummary = ({ customer, items, onFinalize, onClear, isLoading }) => {
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getVehiclesSummary = () => {
    const vehicleCount = {};
    items.forEach(item => {
      const vehicleName = item.vehicleName;
      vehicleCount[vehicleName] = (vehicleCount[vehicleName] || 0) + 1;
    });
    
    return Object.entries(vehicleCount).map(([vehicleName, count]) => ({
      vehicleName,
      count
    }));
  };

  const formatAddress = (address) => {
    if (!address || typeof address === 'string') return address || '';
    
    const { street, number, neighborhood, city } = address;
    const parts = [];
    
    if (street) parts.push(street);
    if (number) parts.push(`nº ${number}`);
    if (neighborhood) parts.push(neighborhood);
    if (city) parts.push(city);
    
    return parts.join(', ');
  };

  const isFormValid = () => {
    const hasAddress = customer.address && (
      typeof customer.address === 'string' ? 
        customer.address.trim() : 
        (customer.address.city && customer.address.street && customer.address.number && customer.address.neighborhood)
    );
    
    return customer.name && customer.phone && hasAddress && items.length > 0;
  };

  if (!isFormValid()) {
    return (
      <div className="delivery-summary">
        <h3>Resumo da Entrega</h3>
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          Complete os dados do cliente e adicione pelo menos um item para ver o resumo.
        </p>
      </div>
    );
  }

  return (
    <div className="delivery-summary">
      <h3>Resumo da Entrega</h3>
      
      <div style={{ display: 'grid', gap: '20px', marginBottom: '25px' }}>
        {/* Dados do Cliente */}
        <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} />
            Dados do Cliente
          </h4>
          <div style={{ display: 'grid', gap: '5px', fontSize: '14px' }}>
            <div><strong>Nome:</strong> {customer.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={14} />
              <strong>Telefone:</strong> {customer.phone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} />
              <strong>Endereço:</strong> {formatAddress(customer.address)}
            </div>
            {customer.notes && (
              <div><strong>Observações:</strong> {customer.notes}</div>
            )}
          </div>
        </div>

        {/* Resumo dos Itens */}
        <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} />
            Itens ({items.length})
          </h4>
          <div style={{ fontSize: '14px' }}>
            {items.map((item, index) => (
              <div key={item.id} style={{ 
                padding: '8px 0', 
                borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{item.materialName}</strong> ({item.quantity} {item.unit})
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {item.measureType === 'metro' ? 'Por metro' : 'Por quantidade'} - {item.vehicleName}
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Veículos Necessários */}
        <div style={{ padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} />
            Veículos Necessários
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {getVehiclesSummary().map(({ vehicleName, count }) => (
              <span 
                key={vehicleName}
                style={{ 
                  padding: '6px 12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {vehicleName} ({count} {count === 1 ? 'item' : 'itens'})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Total e Ações */}
      <div style={{ 
        borderTop: '2px solid #e5e7eb', 
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div className="total-value">
          Total: {formatCurrency(totalValue)}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-danger"
            onClick={onClear}
            disabled={isLoading}
          >
            Limpar Pedido
          </button>
          <button 
            className="btn btn-success"
            onClick={onFinalize}
            disabled={isLoading}
            style={{ fontSize: '16px', padding: '12px 24px' }}
          >
            {isLoading ? 'Salvando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummary;
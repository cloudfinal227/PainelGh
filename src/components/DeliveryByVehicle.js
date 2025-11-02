import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { vehiclesService } from '../services/vehiclesService';
import { Truck, Package, User, MapPin, Phone } from 'lucide-react';

const DeliveryByVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const result = await vehiclesService.getAllVehicles();
      if (result.success) {
        setVehicles(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  };

  const loadDeliveryItems = async (vehicleId) => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const result = await orderService.getItemsByVehicle(vehicleId);
      if (result.success) {
        setDeliveryItems(result.data);
      } else {
        setDeliveryItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setDeliveryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    loadDeliveryItems(vehicleId);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatAddress = (item) => {
    const pedido = item.pedidos;
    return `${pedido.rua}, nº ${pedido.numero}, ${pedido.bairro}, ${pedido.cidade}`;
  };

  const groupItemsByOrder = (items) => {
    const grouped = {};
    items.forEach(item => {
      const orderId = item.pedidos.id;
      if (!grouped[orderId]) {
        grouped[orderId] = {
          pedido: item.pedidos,
          items: []
        };
      }
      grouped[orderId].items.push(item);
    });
    return Object.values(grouped);
  };

  const selectedVehicleData = vehicles.find(v => v.id === parseInt(selectedVehicle));
  const groupedOrders = groupItemsByOrder(deliveryItems);

  return (
    <div className="form-section">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Truck size={24} />
        Entregas por Veículo
      </h3>

      {/* Seletor de Veículo */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label>Selecione o Veículo</label>
        <select
          value={selectedVehicle}
          onChange={(e) => handleVehicleChange(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          <option value="">Escolha um veículo</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.nome} - {vehicle.capacidade}
            </option>
          ))}
        </select>
      </div>

      {/* Informações do Veículo Selecionado */}
      {selectedVehicleData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#dbeafe', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '2px solid #3b82f6'
        }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#1e40af' }}>
            🚚 {selectedVehicleData.nome}
          </h4>
          <p style={{ margin: 0, color: '#1e40af' }}>
            {selectedVehicleData.capacidade}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: 'center', padding: '20px' }}>
          Carregando entregas...
        </p>
      )}

      {/* Lista de Entregas */}
      {!loading && selectedVehicle && (
        <>
          {groupedOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Nenhuma entrega pendente para este veículo.
            </p>
          ) : (
            <div>
              <h4 style={{ marginBottom: '15px' }}>
                📦 {groupedOrders.length} {groupedOrders.length === 1 ? 'Pedido' : 'Pedidos'} para Entrega
              </h4>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                {groupedOrders.map((order, index) => (
                  <div key={order.pedido.id} style={{ 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '15px',
                    backgroundColor: '#fff'
                  }}>
                    {/* Cabeçalho do Pedido */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '15px',
                      paddingBottom: '10px',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <h5 style={{ margin: 0 }}>
                        Pedido #{order.pedido.id}
                      </h5>
                      <span style={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#fef3c7', 
                        color: '#92400e',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                      {/* Dados do Cliente */}
                      <div>
                        <h6 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={16} />
                          Cliente
                        </h6>
                        <div style={{ fontSize: '14px' }}>
                          <div><strong>{order.pedido.cliente_nome}</strong></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Phone size={12} />
                            {order.pedido.telefone}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MapPin size={12} />
                            {formatAddress(order.items[0])}
                          </div>
                          {order.pedido.observacoes && (
                            <div style={{ marginTop: '5px', fontStyle: 'italic', color: '#666' }}>
                              "{order.pedido.observacoes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Itens para este Veículo */}
                      <div>
                        <h6 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Package size={16} />
                          Itens para {selectedVehicleData.nome}
                        </h6>
                        <div style={{ fontSize: '14px' }}>
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} style={{ 
                              padding: '8px 0', 
                              borderBottom: itemIndex < order.items.length - 1 ? '1px solid #f3f4f6' : 'none'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>{item.materiais.nome}</strong></span>
                                <span>{formatCurrency(item.total_item)}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {item.quantidade} {item.materiais.tipo_medida}
                              </div>
                            </div>
                          ))}
                          <div style={{ 
                            marginTop: '10px', 
                            paddingTop: '10px', 
                            borderTop: '1px solid #e5e7eb',
                            fontWeight: 'bold'
                          }}>
                            Total: {formatCurrency(order.items.reduce((sum, item) => sum + item.total_item, 0))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo Total */}
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 10px 0' }}>
                  📊 Resumo da Rota - {selectedVehicleData.nome}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Pedidos:</strong> {groupedOrders.length}
                  </div>
                  <div>
                    <strong>Itens:</strong> {deliveryItems.length}
                  </div>
                  <div>
                    <strong>Valor Total:</strong> {formatCurrency(
                      deliveryItems.reduce((sum, item) => sum + item.total_item, 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryByVehicle;
import React, { useState, useEffect } from 'react';
import './index.css';
import { materialService } from './services/materialService.js';
import { orderService } from './services/orderService.js';
import { comprovanteService } from './services/comprovanteService.js';
import ComprovanteModal from './components/ComprovanteModal.jsx';

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

  const [orderItems, setOrderItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    material: '',
    measureType: 'quantidade',
    vehicle: '',
    unitPrice: '',
    quantity: '',
    materialId: null
  });

  const [orders, setOrders] = useState([]);
  const [materialSuggestions, setMaterialSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMotivo, setFilterMotivo] = useState(''); // Filtro por motivo de cancelamento
  
  // Estados para o modal de comprovante
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComprovante, setSelectedComprovante] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [loadingComprovante, setLoadingComprovante] = useState(false);
  const [comprovantesMap, setComprovantesMap] = useState({});

  const cities = [
    'Guarabira',
    'Pirpirituba', 
    'Pilõezinhos',
    'Pirpiri',
    'Cuitegi',
    'Araçagi'
  ];



  // Carregar dados iniciais do Supabase
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carregar materiais
      const materialsResult = await materialService.getMaterials();
      if (materialsResult.success) {
        setMaterials(materialsResult.data);
      }

      // Carregar veículos
      const vehiclesResult = await materialService.getVehicles();
      if (vehiclesResult.success) {
        setVehicles(vehiclesResult.data);
      }

      // Carregar pedidos
      const ordersResult = await orderService.getOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };



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

  const handleItemChange = (field, value) => {
    const updatedItem = {
      ...currentItem,
      [field]: value
    };

    // Se mudou o material, buscar sugestões
    if (field === 'material') {
      const suggestions = materials.filter(material => 
        material.nome.toLowerCase().includes(value.toLowerCase())
      );
      setMaterialSuggestions(suggestions);
      setShowSuggestions(value.length > 0 && suggestions.length > 0);
    }

    setCurrentItem(updatedItem);
  };

  const selectMaterial = (material) => {
    setCurrentItem({
      ...currentItem,
      material: material.nome,
      materialId: material.id
    });
    setShowSuggestions(false);
    setMaterialSuggestions([]);
  };

  const addItemToOrder = () => {
    const quantity = parseFloat(currentItem.quantity) || 0;
    const unitPrice = parseFloat(currentItem.unitPrice) || 0;
    
    if (!currentItem.material || !currentItem.vehicle || unitPrice <= 0 || quantity <= 0) {
      alert('Por favor, preencha todos os campos do item');
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === parseInt(currentItem.vehicle));
    const selectedMaterial = materials.find(m => m.id === currentItem.materialId);

    const newItem = {
      id: Date.now(),
      ...currentItem,
      quantity: quantity,
      unitPrice: unitPrice,
      vehicleId: parseInt(currentItem.vehicle),
      vehicleName: selectedVehicle?.nome || '',
      materialId: currentItem.materialId,
      unit: currentItem.measureType === 'metro' ? 'metro' : 'unidade',
      total: unitPrice * quantity
    };

    setOrderItems([...orderItems, newItem]);
    setCurrentItem({
      material: '',
      measureType: 'quantidade',
      vehicle: '',
      unitPrice: '',
      quantity: '',
      materialId: null
    });
  };

  const removeItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const saveOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address.city || orderItems.length === 0) {
      alert('Por favor, preencha todos os dados obrigatórios e adicione pelo menos um item');
      return;
    }

    const orderData = {
      customer,
      items: orderItems.map(item => ({
        materialId: item.materialId,
        vehicleId: item.vehicleId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.total,
        measureType: item.measureType,
        unit: item.unit
      })),
      total: calculateTotal()
    };

    const result = await orderService.createOrder(orderData);
    
    if (result.success) {
      // Limpar formulário
      setCustomer({
        name: '',
        phone: '',
        address: { city: '', street: '', number: '', neighborhood: '' },
        notes: ''
      });
      setOrderItems([]);
      
      // Recarregar pedidos
      const ordersResult = await orderService.getOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.data);
      }
      
      alert('Pedido salvo com sucesso!');
      setCurrentView('orders-list');
    } else {
      alert('Erro ao salvar pedido: ' + result.error);
    }
  };





  const getOrdersByVehicle = () => {
    const pendingOrders = orders.filter(order => order.status === 'pendente');
    const ordersByVehicle = {};

    pendingOrders.forEach(order => {
      if (order.pedido_itens) {
        order.pedido_itens.forEach(item => {
          const vehicleName = item.veiculos?.nome || 'Veículo não definido';
          if (!ordersByVehicle[vehicleName]) {
            ordersByVehicle[vehicleName] = [];
          }
          ordersByVehicle[vehicleName].push({
            orderId: order.id,
            customer: {
              name: order.cliente_nome,
              phone: order.telefone,
              address: {
                city: order.cidade,
                street: order.rua,
                number: order.numero,
                neighborhood: order.bairro
              }
            },
            item: {
              material: item.materiais?.nome || 'Material não definido',
              quantity: item.quantidade,
              unitPrice: item.preco_unitario,
              total: item.total_item
            },
            orderTotal: order.total_pedido
          });
        });
      }
    });

    return ordersByVehicle;
  };

  // Verificar comprovantes para pedidos entregues
  useEffect(() => {
    const checkComprovantes = async () => {
      const entregues = orders.filter(order => order.status === 'entregue');
      const map = {};
      
      for (const order of entregues) {
        const result = await comprovanteService.hasComprovante(order.id);
        if (result.success) {
          map[order.id] = result.hasComprovante;
        }
      }
      
      setComprovantesMap(map);
    };

    if (orders.length > 0) {
      checkComprovantes();
    }
  }, [orders]);

  // Abrir modal de comprovante
  const handleViewComprovante = async (pedido) => {
    setLoadingComprovante(true);
    setIsModalOpen(true);
    setSelectedPedido(pedido);
    
    const result = await comprovanteService.getComprovanteByPedidoId(pedido.id);
    
    if (result.success) {
      setSelectedComprovante(result.data);
    } else {
      alert('Erro ao carregar comprovante: ' + result.error);
      setIsModalOpen(false);
    }
    
    setLoadingComprovante(false);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComprovante(null);
    setSelectedPedido(null);
  };

  // Formatar motivo de cancelamento
  const formatarMotivo = (motivo) => {
    const motivos = {
      'nao-estava-em-casa': '🏠 Não estava em casa',
      'endereco-incorreto': '📍 Endereço incorreto',
      'cliente-desistiu': '🚫 Cliente desistiu',
      'falta-de-material': '📦 Falta de material',
      'problema-pagamento': '💳 Problema de pagamento',
      'outro': '❓ Outro motivo'
    };
    return motivos[motivo] || motivo;
  };

  // Filtrar pedidos por nome do cliente e status
  const filteredOrders = orders.filter(order => {
    // Filtro por nome
    const matchesName = order.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    let matchesStatus = true;
    if (filterMotivo) {
      matchesStatus = order.status === filterMotivo;
    }
    
    return matchesName && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>🔄 Carregando dados...</h2>
          <p>Conectando com o banco de dados</p>
        </div>
      </div>
    );
  }

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
        <>
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
          </div>

          <div className="form-section">
            <h3>Adicionar Item ao Pedido</h3>
            
            {/* Primeira linha: Material */}
            <div className="form-grid-single">
              <div className="form-group">
                <label>Material *</label>
                <div className="autocomplete-container">
                  <input
                    type="text"
                    value={currentItem.material}
                    onChange={(e) => handleItemChange('material', e.target.value)}
                    placeholder="Digite o nome do material (ex: Areia)"
                  />
                  {showSuggestions && (
                    <div className="autocomplete-suggestions">
                      {materialSuggestions.map((material, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => selectMaterial(material)}
                        >
                          <strong>{material.nome}</strong> - {material.tipo_medida}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Segunda linha: Medida, Quantidade/Metro, Veículo */}
            <div className="form-grid-three">
              <div className="form-group">
                <label>Medida *</label>
                <select
                  value={currentItem.measureType}
                  onChange={(e) => handleItemChange('measureType', e.target.value)}
                >
                  <option value="quantidade">Quantidade</option>
                  <option value="metro">Metro</option>
                </select>
              </div>

              <div className="form-group">
                <label>{currentItem.measureType === 'metro' ? 'Metros *' : 'Quantidade *'}</label>
                <input
                  type="number"
                  min="0.1"
                  step={currentItem.measureType === 'metro' ? '0.1' : '1'}
                  value={currentItem.quantity}
                  onChange={(e) => handleItemChange('quantity', e.target.value)}
                  placeholder={currentItem.measureType === 'metro' ? '0.0' : '1'}
                />
              </div>

              <div className="form-group">
                <label>Veículo *</label>
                <select
                  value={currentItem.vehicle}
                  onChange={(e) => handleItemChange('vehicle', e.target.value)}
                >
                  <option value="">Selecione o veículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terceira linha: Preço Unitário */}
            <div className="form-grid-price">
              <div className="form-group">
                <label>Preço Unitário (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => handleItemChange('unitPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <button className="btn btn-primary" onClick={addItemToOrder}>
              Adicionar ao Pedido
            </button>
          </div>

          {orderItems.length > 0 && (
            <div className="form-section">
              <h3>Itens do Pedido</h3>
              
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Veículo</th>
                    <th>Preço Unit.</th>
                    <th>Qtd</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.material}</td>
                      <td>
                        <span className={`vehicle-badge`}>
                          {item.vehicleName}
                        </span>
                      </td>
                      <td>R$ {item.unitPrice.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>R$ {item.total.toFixed(2)}</td>
                      <td>
                        <button 
                          className="btn btn-danger"
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="total-section">
                <div className="total-value">
                  Total do Pedido: R$ {calculateTotal().toFixed(2)}
                </div>
                <button className="btn btn-success" onClick={saveOrder} style={{ marginTop: '10px' }}>
                  💾 Salvar Pedido
                </button>
              </div>
            </div>
          )}

          {orderItems.length === 0 && (
            <div className="form-section">
              <h3>Itens do Pedido</h3>
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Nenhum item adicionado ainda. Use o formulário acima para adicionar materiais.
              </p>
            </div>
          )}
        </>
      )}

      {currentView === 'orders-list' && (
        <div>
          <div className="form-section">
            <div className="orders-header">
              <h3>Lista de Pedidos ({filteredOrders.length}{searchTerm && ` de ${orders.length}`})</h3>
              
              {/* Barra de Busca e Filtros */}
              <div className="search-container">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por nome do cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchTerm('')}
                      title="Limpar busca"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Filtro por Status */}
                <div className="filter-wrapper">
                  <select
                    value={filterMotivo}
                    onChange={(e) => setFilterMotivo(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">⏳ Pendentes</option>
                    <option value="preparando">🔄 Preparando</option>
                    <option value="saiu-entrega">🚚 Saiu para Entrega</option>
                    <option value="entregue">✅ Entregues</option>
                    <option value="cancelado">❌ Cancelados</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="no-results">
                {searchTerm ? (
                  <p>🔍 Nenhum pedido encontrado para "{searchTerm}"</p>
                ) : (
                  <p>📋 Nenhum pedido cadastrado ainda.</p>
                )}
              </div>
            ) : (
              <div className="orders-list-compact">
                {filteredOrders.map(order => {
                  const getStatusInfo = (status) => {
                    switch(status) {
                      case 'pendente':
                        return { icon: '⏳', text: 'Pendente', color: '#f59e0b', bgColor: '#fef3c7' };
                      case 'preparando':
                        return { icon: '🔄', text: 'Preparando', color: '#3b82f6', bgColor: '#dbeafe' };
                      case 'saiu-entrega':
                        return { icon: '🚚', text: 'Saiu para Entrega', color: '#8b5cf6', bgColor: '#e9d5ff' };
                      case 'entregue':
                        return { icon: '✅', text: 'Entregue', color: '#10b981', bgColor: '#d1fae5' };
                      case 'cancelado':
                        return { icon: '❌', text: 'Cancelado', color: '#dc2626', bgColor: '#fee2e2' };
                      default:
                        return { icon: '❓', text: 'Indefinido', color: '#6b7280', bgColor: '#f3f4f6' };
                    }
                  };

                  const statusInfo = getStatusInfo(order.status);

                  return (
                    <div key={order.id} className="order-item-compact">
                      {/* Linha Principal */}
                      <div className="order-main-row">
                        <div className="order-basic-info">
                          <span className="order-id-compact">#{order.id.toString().slice(-4)}</span>
                          <span className="customer-name-compact">👤 {order.cliente_nome}</span>
                          <span className="customer-phone-compact">📞 {order.telefone}</span>
                        </div>
                        
                        <div className="order-summary">
                          <span className="items-count">{order.pedido_itens?.length || 0} itens</span>
                          <span className="order-total-compact">R$ {parseFloat(order.total_pedido).toFixed(2)}</span>
                          <span 
                            className="status-badge-compact"
                            style={{ 
                              backgroundColor: statusInfo.bgColor, 
                              color: statusInfo.color 
                            }}
                          >
                            {statusInfo.icon} {statusInfo.text}
                          </span>
                        </div>
                      </div>

                      {/* Linha de Endereço */}
                      <div className="order-address-row">
                        <span className="address-compact">
                          📍 {order.rua}, {order.numero} - {order.bairro}, {order.cidade}
                        </span>
                        <span className="order-date-compact">
                          📅 {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Linha de Itens (resumida) */}
                      <div className="order-items-row">
                        <div className="items-summary">
                          📦 {order.pedido_itens && order.pedido_itens.length > 0 ? (
                            order.pedido_itens.map((item, index) => (
                              <span key={index} className="item-summary">
                                {item.materiais?.nome || 'Material'} ({parseFloat(item.quantidade)} {item.materiais?.tipo_medida || 'un'})
                                {index < order.pedido_itens.length - 1 && ', '}
                              </span>
                            ))
                          ) : (
                            <span className="no-items-compact">Nenhum item</span>
                          )}
                        </div>
                      </div>

                      {/* Observações (se houver) */}
                      {order.observacoes && (
                        <div className="order-notes-row">
                          <span className="notes-compact">📝 {order.observacoes}</span>
                        </div>
                      )}

                      {/* Motivo de Cancelamento (se cancelado) */}
                      {order.status === 'cancelado' && order.cancelamentos && order.cancelamentos.length > 0 && (
                        <div className="order-cancelamento-row">
                          <span className="cancelamento-motivo">
                            {formatarMotivo(order.cancelamentos[0].motivo)}
                          </span>
                          {order.cancelamentos[0].observacoes && (
                            <span className="cancelamento-obs">
                              💬 {order.cancelamentos[0].observacoes}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Botão Ver Assinatura (apenas para pedidos entregues com comprovante) */}
                      {order.status === 'entregue' && comprovantesMap[order.id] && (
                        <div className="order-actions-row" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                          <button 
                            className="btn-view-signature"
                            onClick={() => handleViewComprovante(order)}
                          >
                            📝 Ver Comprovante
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'delivery-by-vehicle' && (
        <div className="delivery-summary">
          <h3>Entregas por Veículo</h3>
          
          {Object.entries(getOrdersByVehicle()).map(([vehicleName, deliveries]) => (
            <div key={vehicleName} className="form-section">
              <h4>
                🚚 {vehicleName}
                <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                  ({deliveries.length} entrega(s))
                </span>
              </h4>
              
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Endereço</th>
                    <th>Material</th>
                    <th>Quantidade</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery, index) => (
                    <tr key={index}>
                      <td>#{delivery.orderId.toString().slice(-4)}</td>
                      <td>{delivery.customer.name}</td>
                      <td>
                        {delivery.customer.address.street}, {delivery.customer.address.number}<br/>
                        {delivery.customer.address.neighborhood} - {delivery.customer.address.city}
                      </td>
                      <td>{delivery.item.material}</td>
                      <td>{delivery.item.quantity}</td>
                      <td>{delivery.customer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {Object.keys(getOrdersByVehicle()).length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Nenhuma entrega pendente no momento.
            </p>
          )}
        </div>
      )}

      {/* Modal de Comprovante */}
      <ComprovanteModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        comprovante={loadingComprovante ? null : selectedComprovante}
        pedido={selectedPedido}
      />

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
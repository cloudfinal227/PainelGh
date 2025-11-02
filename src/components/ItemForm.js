import React, { useState, useEffect } from 'react';
import AutoComplete from './AutoComplete';
import { vehiclesService } from '../services/vehiclesService';

const ItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [measureType, setMeasureType] = useState(''); // 'metro' ou 'quantidade'
  const [quantity, setQuantity] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Carregar veículos ao montar o componente
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
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setMeasureType(''); // Resetar para o usuário escolher
    setQuantity('');
    setVehicle('');
  };

  const handleAddItem = () => {
    if (!selectedMaterial || !measureType || !quantity || !vehicle || !unitPrice) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === parseInt(vehicle));
    
    // Determinar a unidade baseada no tipo de medida escolhido
    let unit = measureType === 'metro' ? 'metro' : selectedMaterial.tipo_medida;
    
    const item = {
      id: Date.now(),
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.nome,
      quantity: parseFloat(quantity),
      unit: unit,
      measureType: measureType,
      vehicleId: parseInt(vehicle),
      vehicleName: selectedVehicle?.nome,
      unitPrice: parseFloat(unitPrice),
      totalPrice: parseFloat(quantity) * parseFloat(unitPrice)
    };

    onAddItem(item);
    
    // Reset form
    setItemName('');
    setSelectedMaterial(null);
    setMeasureType('');
    setQuantity('');
    setVehicle('');
    setUnitPrice('');
  };

  // Remover função getAvailableVehicles - agora usamos todos os veículos do banco

  return (
    <div className="form-section">
      <h3>Adicionar Item ao Pedido</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Material *</label>
          <AutoComplete
            value={itemName}
            onChange={setItemName}
            placeholder="Digite o nome do material (ex: areia, cano20, joelho25...)"
            onSelect={handleMaterialSelect}
          />
          {selectedMaterial && (
            <small style={{ color: '#666', marginTop: '4px' }}>
              {selectedMaterial.nome} - Unidade padrão: {selectedMaterial.tipo_medida}
            </small>
          )}
        </div>

        {/* Tipo de Medida - Selecionável */}
        {selectedMaterial && (
          <div className="form-group">
            <label>Medida *</label>
            <select
              value={measureType}
              onChange={(e) => setMeasureType(e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              <option value="metro">Metro</option>
              <option value="quantidade">Quantidade ({selectedMaterial.tipo_medida})</option>
            </select>
          </div>
        )}

        {/* Campo Quantidade */}
        {measureType && (
          <div className="form-group">
            <label>
              {measureType === 'metro' ? 'Metros *' : 'Quantidade *'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={measureType === 'metro' ? "Ex: 2.5, 10, 0.5" : "Ex: 5, 10, 20"}
              step="0.1"
              min="0"
            />
            <small style={{ color: '#666', marginTop: '4px' }}>
              Unidade: {measureType === 'metro' ? 'metro' : selectedMaterial.tipo_medida}
            </small>
          </div>
        )}

        <div className="form-group">
          <label>Veículo *</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            disabled={loadingVehicles}
          >
            <option value="">
              {loadingVehicles ? 'Carregando veículos...' : 'Selecione o veículo'}
            </option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.nome} - {v.capacidade}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Preço Unitário (R$) *</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {selectedMaterial && measureType && (
            <small style={{ color: '#666', marginTop: '4px' }}>
              Preço por {measureType === 'metro' ? 'metro' : selectedMaterial.tipo_medida}
            </small>
          )}
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleAddItem}
        disabled={
          !selectedMaterial || 
          !measureType ||
          !quantity ||
          !vehicle || 
          !unitPrice ||
          loadingVehicles
        }
      >
        Adicionar ao Pedido
      </button>
    </div>
  );
};

export default ItemForm;
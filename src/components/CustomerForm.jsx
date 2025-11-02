import React from 'react';

const CustomerForm = ({ customer, onChange }) => {
  const cities = [
    'Guarabira',
    'Pirpirituba', 
    'Pilõezinhos',
    'Pirpiri',
    'Cuitegi',
    'Araçagi'
  ];

  const handleInputChange = (field, value) => {
    onChange({
      ...customer,
      [field]: value
    });
  };

  const handleAddressChange = (field, value) => {
    const updatedAddress = {
      ...customer.address,
      [field]: value
    };
    
    onChange({
      ...customer,
      address: updatedAddress
    });
  };

  return (
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
  );
};

export default CustomerForm;
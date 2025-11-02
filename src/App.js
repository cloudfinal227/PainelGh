import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [message, setMessage] = useState('Sistema carregando...');

  useEffect(() => {
    setMessage('GH Construção - Sistema Online!');
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>GH Construção</h1>
        <p>Painel de Entregas</p>
      </div>
      
      <div className="form-section">
        <h3>Status do Sistema</h3>
        <p>{message}</p>
        <p>✅ React funcionando</p>
        <p>✅ CSS carregado</p>
        <p>✅ Deploy realizado com sucesso</p>
        
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={() => setMessage('Botão funcionando!')}>
            Testar Interação
          </button>
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#666', 
        fontSize: '14px',
        marginTop: '30px'
      }}>
        Sistema de Entregas - GH Construção © 2024
      </div>
    </div>
  );
}

export default App;
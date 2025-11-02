import React, { useState, useEffect, useRef } from 'react';
import { materialsService } from '../services/materialsService';

const AutoComplete = ({ 
  value, 
  onChange, 
  placeholder, 
  onSelect,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchMaterials = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const result = await materialsService.searchMaterials(searchTerm);
      if (result.success) {
        setSuggestions(result.data);
        setIsOpen(result.data.length > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce da busca
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchMaterials(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.nome);
    setIsOpen(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleFocus = () => {
    if (value && value.length >= 2) {
      searchMaterials(value);
    }
  };

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
      />
      {loading && (
        <div style={{ 
          position: 'absolute', 
          right: '10px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          fontSize: '12px',
          color: '#666'
        }}>
          Buscando...
        </div>
      )}
      {isOpen && suggestions.length > 0 && (
        <div className="autocomplete-suggestions">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div>
                <strong>{suggestion.nome}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {suggestion.nome_curto} - {suggestion.tipo_medida}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && suggestions.length === 0 && !loading && value.length >= 2 && (
        <div className="autocomplete-suggestions">
          <div className="suggestion-item" style={{ color: '#666', fontStyle: 'italic' }}>
            Nenhum material encontrado
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
export const materials = [
  // Areias e Britas
  { name: 'Areia Fina', category: 'areia', unit: 'saco', measureType: 'size', sizes: ['P', 'M', 'G'], vehicles: ['moto', 'carro', 'caminhao'] },
  { name: 'Areia Grossa', category: 'areia', unit: 'saco', measureType: 'size', sizes: ['P', 'M', 'G'], vehicles: ['moto', 'carro', 'caminhao'] },
  { name: 'Areia Lavada', category: 'areia', unit: 'metro', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Brita 0', category: 'brita', unit: 'saco', measureType: 'size', sizes: ['P', 'M', 'G'], vehicles: ['moto', 'carro', 'caminhao'] },
  { name: 'Brita 1', category: 'brita', unit: 'saco', measureType: 'size', sizes: ['P', 'M', 'G'], vehicles: ['moto', 'carro', 'caminhao'] },
  { name: 'Brita 2', category: 'brita', unit: 'metro', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Brita Corrida', category: 'brita', unit: 'carrada', measureType: 'quantity', sizes: ['G'], vehicles: ['caminhao'] },
  
  // Cimentos e Argamassas
  { name: 'Cimento CP II', category: 'cimento', unit: 'saco', measureType: 'size', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cimento CP III', category: 'cimento', unit: 'saco', measureType: 'size', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Argamassa AC I', category: 'argamassa', unit: 'saco', measureType: 'size', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Argamassa AC II', category: 'argamassa', unit: 'saco', measureType: 'size', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  
  // Canos e Conexões
  { name: 'Cano PVC 20mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cano PVC 25mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cano PVC 32mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cano PVC 40mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cano PVC 50mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['P', 'M'], vehicles: ['moto', 'carro'] },
  { name: 'Cano PVC 75mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Cano PVC 100mm', category: 'cano', unit: 'metro', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  
  // Conexões
  { name: 'Joelho 20mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Joelho 25mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Joelho 32mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Joelho 40mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Joelho 50mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Tê 20mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Tê 25mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Tê 32mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Tê 40mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Tê 50mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Luva 20mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Luva 25mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Luva 32mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Luva 40mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Luva 50mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Redução 32x25mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Redução 40x32mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  { name: 'Redução 50x40mm', category: 'conexao', unit: 'unidade', measureType: 'quantity', sizes: ['P'], vehicles: ['moto', 'carro'] },
  
  // Tijolos e Blocos
  { name: 'Tijolo Comum', category: 'tijolo', unit: 'milheiro', measureType: 'quantity', sizes: ['G'], vehicles: ['caminhao'] },
  { name: 'Tijolo Furado', category: 'tijolo', unit: 'milheiro', measureType: 'quantity', sizes: ['G'], vehicles: ['caminhao'] },
  { name: 'Bloco de Concreto 14x19x39', category: 'bloco', unit: 'unidade', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Bloco de Concreto 19x19x39', category: 'bloco', unit: 'unidade', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  
  // Telhas
  { name: 'Telha Cerâmica', category: 'telha', unit: 'unidade', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Telha Fibrocimento', category: 'telha', unit: 'unidade', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] },
  { name: 'Telha Metálica', category: 'telha', unit: 'metro', measureType: 'quantity', sizes: ['M', 'G'], vehicles: ['carro', 'caminhao'] }
];

export const vehicleInfo = {
  moto: { name: 'Moto', capacity: 'Itens P', color: 'vehicle-moto' },
  carro: { name: 'Carro Baixo', capacity: 'Itens P, M e G (pouca quantidade)', color: 'vehicle-carro' },
  caminhao: { name: 'Caminhão', capacity: 'Itens G e grandes quantidades', color: 'vehicle-caminhao' }
};
# 📱 Integração com App Móvel - Comprovantes de Entrega

## 🎯 Objetivo

Guia para implementar captura de assinatura e foto no app móvel e enviar para o sistema web.

## 📦 Dependências Necessárias

```bash
# React Native
npm install react-native-signature-canvas
npm install react-native-image-picker
npm install @react-native-community/geolocation

# Expo (alternativa)
expo install expo-signature-pad
expo install expo-image-picker
expo install expo-location
```

## 🔧 Implementação

### 1. Tela de Confirmação de Entrega

```jsx
import React, { useState, useRef } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { comprovanteService } from './services/comprovanteService';
import { orderService } from './services/orderService';

const EntregaConfirmacaoScreen = ({ route, navigation }) => {
  const { pedido } = route.params;
  const signatureRef = useRef();
  
  const [nomeRecebedor, setNomeRecebedor] = useState('');
  const [assinatura, setAssinatura] = useState(null);
  const [foto, setFoto] = useState(null);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  // Capturar assinatura
  const handleAssinatura = (signature) => {
    setAssinatura(signature);
  };

  // Capturar foto
  const handleTirarFoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Erro', 'Não foi possível tirar a foto');
          return;
        }
        
        const fotoBase64 = `data:image/jpeg;base64,${response.assets[0].base64}`;
        setFoto(fotoBase64);
      }
    );
  };

  // Confirmar entrega
  const handleConfirmarEntrega = async () => {
    if (!nomeRecebedor.trim()) {
      Alert.alert('Atenção', 'Digite o nome de quem recebeu');
      return;
    }

    if (!assinatura) {
      Alert.alert('Atenção', 'É necessário coletar a assinatura');
      return;
    }

    setLoading(true);

    try {
      // Obter localização
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Criar comprovante
      const comprovanteResult = await comprovanteService.createComprovante({
        pedidoId: pedido.id,
        nomeRecebedor: nomeRecebedor.trim(),
        assinaturaBase64: assinatura,
        fotoComprovante: foto,
        observacoes: observacoes.trim() || null,
        latitude,
        longitude,
      });

      if (!comprovanteResult.success) {
        throw new Error(comprovanteResult.error);
      }

      // Atualizar status do pedido
      const statusResult = await orderService.updateOrderStatus(
        pedido.id,
        'entregue'
      );

      if (!statusResult.success) {
        throw new Error(statusResult.error);
      }

      Alert.alert(
        'Sucesso! ✅',
        'Entrega confirmada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', `Não foi possível confirmar a entrega: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Confirmar Entrega
      </Text>

      {/* Informações do Pedido */}
      <View style={{ backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Pedido #{pedido.id}</Text>
        <Text>Cliente: {pedido.cliente_nome}</Text>
        <Text>Endereço: {pedido.rua}, {pedido.numero}</Text>
      </View>

      {/* Nome do Recebedor */}
      <TextInput
        placeholder="Nome de quem recebeu *"
        value={nomeRecebedor}
        onChangeText={setNomeRecebedor}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      {/* Assinatura */}
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Assinatura Digital *
      </Text>
      <View style={{ height: 200, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 }}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleAssinatura}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Confirmar"
          webStyle={`.m-signature-pad { border: none; }`}
        />
      </View>

      {/* Foto (opcional) */}
      <Button
        title={foto ? "📸 Foto Capturada" : "📸 Tirar Foto (Opcional)"}
        onPress={handleTirarFoto}
        color={foto ? "#10b981" : "#2563eb"}
      />
      {foto && (
        <Image
          source={{ uri: foto }}
          style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 8 }}
        />
      )}

      {/* Observações */}
      <TextInput
        placeholder="Observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={3}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginTop: 15,
          marginBottom: 20,
        }}
      />

      {/* Botão Confirmar */}
      <Button
        title={loading ? "Confirmando..." : "✅ Confirmar Entrega"}
        onPress={handleConfirmarEntrega}
        disabled={loading}
        color="#10b981"
      />
    </View>
  );
};

export default EntregaConfirmacaoScreen;
```

## 🔄 Fluxo Completo

### 1. **Entregador no App Móvel**
```
1. Seleciona pedido para entregar
2. Navega até o local
3. Entrega o material
4. Abre tela de confirmação
5. Coleta nome do recebedor
6. Coleta assinatura digital
7. Tira foto (opcional)
8. Adiciona observações (opcional)
9. Confirma entrega
```

### 2. **Sistema Processa**
```
1. Captura localização GPS
2. Converte assinatura para Base64
3. Converte foto para Base64
4. Envia para Supabase
5. Cria registro em comprovantes_entrega
6. Atualiza status do pedido para 'entregue'
```

### 3. **Painel Web**
```
1. Lista atualiza automaticamente
2. Pedido aparece como "Entregue"
3. Botão "Ver Comprovante" fica visível
4. Usuário pode visualizar todos os dados
```

## 📊 Formato dos Dados

### Assinatura Base64
```javascript
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### Foto Base64
```javascript
"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
```

## ⚠️ Considerações Importantes

### Tamanho dos Arquivos
- Assinatura: ~10-50 KB
- Foto: ~100-500 KB (com qualidade 0.7)
- Total: ~600 KB por comprovante

### Otimizações
```javascript
// Reduzir qualidade da foto
launchCamera({
  quality: 0.5, // 0 a 1
  maxWidth: 1024,
  maxHeight: 1024,
});

// Comprimir assinatura
signatureRef.current.readSignature({
  quality: 0.8,
});
```

### Offline First
```javascript
// Salvar localmente se offline
import AsyncStorage from '@react-native-async-storage/async-storage';

const salvarComprovanteOffline = async (comprovante) => {
  const pendentes = await AsyncStorage.getItem('comprovantes_pendentes');
  const lista = pendentes ? JSON.parse(pendentes) : [];
  lista.push(comprovante);
  await AsyncStorage.setItem('comprovantes_pendentes', JSON.stringify(lista));
};

// Sincronizar quando voltar online
const sincronizarComprovantes = async () => {
  const pendentes = await AsyncStorage.getItem('comprovantes_pendentes');
  if (!pendentes) return;
  
  const lista = JSON.parse(pendentes);
  for (const comprovante of lista) {
    await comprovanteService.createComprovante(comprovante);
  }
  
  await AsyncStorage.removeItem('comprovantes_pendentes');
};
```

## 🎨 UI/UX Recomendações

1. **Feedback Visual**
   - Mostrar preview da assinatura
   - Confirmar antes de enviar
   - Loading spinner durante upload

2. **Validações**
   - Nome obrigatório
   - Assinatura obrigatória
   - Foto opcional

3. **Erros**
   - Mensagens claras
   - Opção de tentar novamente
   - Salvar offline se falhar

## 🔒 Segurança

1. **Validar no Backend**
   - Verificar formato Base64
   - Limitar tamanho dos arquivos
   - Validar pedido_id existe

2. **Permissões**
   - Solicitar permissão de câmera
   - Solicitar permissão de localização
   - Tratar negações

## 📝 Checklist de Implementação

- [ ] Instalar dependências
- [ ] Criar tela de confirmação
- [ ] Implementar captura de assinatura
- [ ] Implementar captura de foto
- [ ] Implementar captura de localização
- [ ] Integrar com comprovanteService
- [ ] Testar fluxo completo
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Testar offline
- [ ] Otimizar tamanho das imagens
- [ ] Adicionar validações

## 🚀 Próximos Passos

1. Implementar sincronização offline
2. Adicionar compressão de imagens
3. Implementar retry automático
4. Adicionar analytics
5. Implementar notificações push

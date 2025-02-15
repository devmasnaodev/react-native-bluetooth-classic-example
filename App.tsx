import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";

import BluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";

// Hook personalizado para gerenciar as permissões de localização e Bluetooth
import { usePermissions } from "./usePermissions";

/*
 * View principal do aplicativo
 */

const App = () => {
  /*
   * Estado para armazenar a lista de dispositivos Bluetooth
   */
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  /*
   * Estado para armazenar as mensagens recebidas do dispositivo conectado
   */
  const [messages, setMessages] = useState<string[]>([]);

  /*
   * Estados para controlar o status da conexão
   */
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  /*
   * Estado para armazenar o dispositivo ativo
   */
  const [activeDevice, setActiveDevice] = useState<BluetoothDevice | null>(
    null
  );

  /*
   * Estado para armazenar os dados a serem enviados
   */
  const [data, setData] = useState<string>("");

  /*
   * Estado para armazenar o listener de eventos
   */
  const [listener, setListener] = useState<BluetoothEventSubscription | null>(
    null
  );

  /*
   * Hook personalizado para gerenciar as permissões de localização e Bluetooth
   */
  const { permissions, requestPermissions } = usePermissions();

  /*
   * Inicia a descoberta de dispositivos Bluetooth Classic
   */
  const startDiscovery = async (): Promise<void> => {
    setIsScanning(true);
    setConnectionError(null);
    try {
      const discoveredDevices = await BluetoothClassic.startDiscovery();
      console.log(
        "🔍 Dispositivos encontrados:",
        JSON.stringify(discoveredDevices, null, 2)
      );
      setDevices(discoveredDevices);
    } catch (error) {
      console.error("❌ Erro ao buscar dispositivos:", error);
      setConnectionError("Erro ao buscar dispositivos");
    } finally {
      setIsScanning(false);
    }
  };

  /*
   * Conecta a um dispositivo Bluetooth Classic
   *
   * @param deviceId - O endereço MAC do dispositivo
   * @returns Promise<void>
   */
  const connectToDevice = async (deviceId: string): Promise<void> => {
    setIsConnecting(true);
    setConnectionError(null);
    setMessages([]);

    try {
      const device: BluetoothDevice = await BluetoothClassic.connectToDevice(
        deviceId
      );
      console.log("✅ Conectado ao dispositivo:", device.name);
      setActiveDevice(device);
      setIsConnected(true);
      setIsConnecting(false);

      const isConnected = await device.isConnected();
      if (!isConnected) {
        throw new Error("Dispositivo não está conectado.");
      }

      const newListener = device.onDataReceived((event) => {
        console.log("📡 Dados recebidos:", event.data);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      });

      setListener(newListener);
    } catch (error) {
      console.error("❌ Erro de conexão:", error);
      setConnectionError("Falha ao conectar ao dispositivo");
      setIsConnecting(false);
    }
  };

  /*
   * Desconecta o dispositivo Bluetooth Classic
   */
  const disconnectDevice = async (): Promise<void> => {
    if (!activeDevice) {
      console.error("❌ Nenhum dispositivo ativo");
      return;
    }
    try {
      await activeDevice.disconnect();
      console.log("🔌 Desconectado do dispositivo");
      setIsConnected(false);
      setActiveDevice(null);
      listener?.remove();
      setListener(null);
    } catch (error) {
      console.error("❌ Erro ao desconectar:", error);
    }
  };

  /*
   * Envia dados para o dispositivo conectado
   *
   * @param data - Os dados a serem enviados
   * @returns Promise<void>
   */
  const sendData = async (data: string): Promise<void> => {
    if (!activeDevice) {
      throw new Error("⚠️ Nenhum dispositivo conectado para enviar dados.");
    }

    try {
      await activeDevice.write(data);
      console.log(`📤 Dados enviados: ${data}`);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      throw new Error("Falha ao enviar dados.");
    }
  };

  /*
   * Hook de efeito para solicitar permissões de localização e Bluetooth
   */
  useEffect(() => {
    if (!permissions.location || !permissions.bluetooth) {
      requestPermissions();
    }
  }, [permissions]);

  /*
   * Hook de efeito para remover o listener de eventos ao desmontar o componente
   */
  useEffect(() => {
    return () => {
      listener?.remove();
    };
  }, [listener]);

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Button
        title="🔍 Buscar Dispositivos"
        onPress={startDiscovery}
        disabled={isScanning || isConnected}
      />
      {isScanning && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.name || "Dispositivo Desconhecido"} - {item.address}
            </Text>
            <Button
              title={`Conectar a ${item.name || "Dispositivo"}`}
              onPress={() => connectToDevice(item.address)}
              disabled={isConnected}
            />
          </View>
        )}
      />

      <ScrollView
        style={{ height: 200, borderWidth: 1, marginTop: 10, padding: 10 }}
      >
        <Text style={{ fontWeight: "bold" }}>📩 Mensagens Recebidas:</Text>
        {messages.length > 0 ? (
          messages.map((msg, index) => <Text key={index}>{msg}</Text>)
        ) : (
          <Text>Nenhuma mensagem recebida ainda.</Text>
        )}
      </ScrollView>

      {isConnecting && <ActivityIndicator size="large" color="#0000ff" />}
      {connectionError && (
        <Text style={{ color: "red" }}>{connectionError}</Text>
      )}

      {isConnected && (
        <View>
          <Button title="❌ Desconectar" onPress={disconnectDevice} />
          <TextInput
            style={{
              height: 40,
              marginVertical: 12,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={setData}
          />
          <Button title="📤 Enviar Dados" onPress={() => sendData(data)} />
        </View>
      )}
    </View>
  );
};

export default App;

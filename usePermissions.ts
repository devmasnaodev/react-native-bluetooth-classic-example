import { useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";

type PermissionsStatus = {
  bluetooth: boolean;
  location: boolean;
};

export const usePermissions = () => {
  /*
   * Estado para armazenar o status das permissões
   */
  const [permissions, setPermissions] = useState<PermissionsStatus>({
    bluetooth: false,
    location: false,
  });

  /*
   * Função para checar as permissões
   */
  const checkPermissions = async () => {
    if (Platform.OS === "android") {
      const locationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      let bluetoothGranted = false;

      if (Platform.Version >= 31) {
        const scanGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );
        const connectGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );

        bluetoothGranted = scanGranted && connectGranted;
      } else {
        bluetoothGranted = true; // Para versões abaixo do Android 12, não é necessário pedir Bluetooth explicitamente
      }

      setPermissions({
        bluetooth: bluetoothGranted,
        location: locationGranted,
      });

      return { bluetooth: bluetoothGranted, location: locationGranted };
    }
  };

  /*
   * Função para solicitar as permissões
   */
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    }

    await checkPermissions();
  };

  /*
   * Função para checar a permissão de localização
   */
  const checkLocationPermission = async () => {
    const locationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return locationGranted;
  };

  /*
   * Hook de efeito para checar as permissões ao montar o componente
   */
  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    checkPermissions,
    requestPermissions,
    checkLocationPermission,
  };
};

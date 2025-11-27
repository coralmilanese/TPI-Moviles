import { config } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "haEntradoMuseo6";
const INTERVALO_VERIFICACION = 10000; // Verificar cada 10 segundos

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Calcula la distancia entre dos coordenadas de forma simplificada
 * Aproximación usando distancia euclidiana con factor de conversión
 * @returns distancia en metros
 */
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Conversión aproximada: 1 grado de latitud ≈ 111km, 1 grado de longitud ≈ 111km * cos(latitud)
  const diferenciaLat = lat2 - lat1;
  const diferenciaLon = lon2 - lon1;

  const distanciaKm = Math.sqrt(
    Math.pow(diferenciaLat * 111, 2) +
      Math.pow(diferenciaLon * 111 * Math.cos((lat1 * Math.PI) / 180), 2)
  );

  return distanciaKm * 1000;
}

export function useLocationService(): void {
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const estaDentroRef = useRef(false);

  const iniciarSeguimientoUbicacion = async () => {
    try {
      intervaloRef.current = setInterval(async () => {
        try {
          const ubicacion = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const distancia = calcularDistancia(
            ubicacion.coords.latitude,
            ubicacion.coords.longitude,
            config.MUSEO_LAT,
            config.MUSEO_LON
          );

          console.log(`Distancia al museo: ${distancia.toFixed(2)}m`);

          const estabaDentro = estaDentroRef.current;
          const ahoraEstaDentro = distancia <= config.MUSEO_RADIUS;

          estaDentroRef.current = ahoraEstaDentro;

          if (!estabaDentro && ahoraEstaDentro) {
            await manejarEntradaMuseo();
          }

          if (estabaDentro && !ahoraEstaDentro) {
            await resetearEntradaMuseo();
            console.log("Usuario salió del museo, notificación reseteada");
          }
        } catch (error) {
          console.error("Error obteniendo ubicación:", error);
        }
      }, INTERVALO_VERIFICACION);
    } catch (error) {
      console.error("Error iniciando tracking de ubicación:", error);
    }
  };

  const manejarEntradaMuseo = async () => {
    try {
      const haEntrado = await AsyncStorage.getItem(STORAGE_KEY);

      if (haEntrado === "true") {
        console.log(
          "Ya se mostró la notificación de bienvenida en esta sesión"
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Bienvenido al Museo Digital!",
          body: "Explora nuestra colección y descubre el arte de una manera única",
          data: { type: "museum_entry" },
          sound: true,
        },
        trigger: null,
      });

      await AsyncStorage.setItem(STORAGE_KEY, "true");

      console.log("Notificación de bienvenida enviada");
    } catch (error) {
      console.error("Error enviando notificación de bienvenida:", error);
    }
  };

  const inicializarServicio = async () => {
    try {
      const { status: estadoUbicacion } =
        await Location.requestForegroundPermissionsAsync();

      if (estadoUbicacion !== "granted") {
        console.log("Permiso de ubicación denegado, servicio no se iniciará");
        return;
      }

      const { status: estadoNotificaciones } =
        await Notifications.requestPermissionsAsync();

      if (estadoNotificaciones !== "granted") {
        console.log(
          "Permiso de notificaciones denegado, solo se hará tracking sin notificaciones"
        );
      }

      console.log("Servicio de ubicación iniciado automáticamente");
      iniciarSeguimientoUbicacion();
    } catch (error) {
      console.error("Error inicializando servicio de ubicación:", error);
    }
  };

  useEffect(() => {
    inicializarServicio();

    return () => {
      const intervalo = intervaloRef.current;
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export const resetearEntradaMuseo = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

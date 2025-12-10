<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '../api/types';
import { getEvent } from '../api/services/events';
>>>>>>> Stashed changes

export default function CheckoutScreen({ navigation }: any) {
  // 5 minutos = 300 segundos
  const [timeLeft, setTimeLeft] = useState(300);

<<<<<<< Updated upstream
=======
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // tiempo (ahora 10s para probar; pon 5 * 60 para 5 minutos)
  const [timeLeft, setTimeLeft] = useState(10);

  // cantidades
  const [generalQty, setGeneralQty] = useState(0);
  const [vipQty, setVipQty] = useState(0);

  // precios (PLACEHOLDERS, hay que cambiarlos por los datos reales del evento)
  const generalPrice = 15000;
  const vipPrice = 35000;

  const total = generalQty * generalPrice + vipQty * vipPrice;
  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (error) {
        console.log('Error cargando evento', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  // ---------------- LÓGICA: TIMER ----------------
>>>>>>> Stashed changes
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate("Tabs", { screen: "HomeTab" });
      return;
    }

    const interval = setInterval(() => {
<<<<<<< Updated upstream
      setTimeLeft((prev) => prev - 1);
=======
      setTimeLeft(prev => prev - 1);
>>>>>>> Stashed changes
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigation]);

  const formatTime = (totalSeconds: number) => {
<<<<<<< Updated upstream
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Contenido scrolleable */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.eventCard}>
            {/* Imagen */}
            <View style={styles.imageBox}>
              <Text style={styles.imageText}>Img</Text>
            </View>

            {/* aca va la info del evento (PLACEHOLDERS) */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>[Nombre del evento]</Text>
              <Text style={styles.eventMeta}>
                [Ubicación del evento]
              </Text>
              <Text style={styles.eventMeta}>
                [Horario del evento]
              </Text>
            </View>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>Tiempo restante</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            </View>
=======
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // ---------------- ESTADOS DE CARGA ----------------
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-slate-700">Cargando evento...</Text>
      </View>
    );
  }

  // ---------------- UI PRINCIPAL ----------------
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 px-4 pt-4 pb-28">
        <View className="mb-3">
        </View>

        {/* Tarjeta de info del evento */}
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-xl bg-slate-200 items-center justify-center mr-3">
              <Text className="text-slate-500 text-sm">Img</Text>
            </View>

            {/* Texto del evento */}
            <View className="flex-1">
              <Text className="font-semibold text-lg text-slate-800">
                {event?.name ?? '[Nombre del evento]'}
              </Text>
              <Text className="text-slate-500 text-sm mt-1">
                Ubicación: {event?.location ?? '[Ubicación del evento]'}
              </Text>
              <Text className="text-slate-500 text-sm">
                Horario: {event?.date ?? '[Fecha y hora del evento]'}
              </Text>
            </View>
>>>>>>> Stashed changes
          </View>

<<<<<<< Updated upstream
          {/* aca va la info de Tickets */}
          <View style={styles.ticketsCard}>
            {/* General */}
            <View style={styles.ticketRow}>
              <View>
                <Text style={styles.ticketName}>General</Text>
                <Text style={styles.ticketPrice}>$[barato]</Text>
              </View>

              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterButtonMinus}
                  onPress={() => {
                    // TODO: restar cantidad general
                  }}
                >
                  <Text style={styles.counterButtonTextMinus}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>[cantidad]</Text>

                <TouchableOpacity
                  style={styles.counterButtonPlus}
                  onPress={() => {
                    // TODO: sumar cantidad general
                  }}
                >
                  <Text style={styles.counterButtonTextPlus}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* VIP, place holders */}
            <View style={styles.ticketRow}>
              <View>
                <Text style={styles.ticketName}>VIP</Text>
                <Text style={styles.ticketPrice}>$[caro]</Text>
              </View>

              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterButtonMinus}
                  onPress={() => {
                    // TODO: restar cantidad vip
                  }}
                >
                  <Text style={styles.counterButtonTextMinus}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>[cantidad]</Text>

                <TouchableOpacity
                  style={styles.counterButtonPlus}
                  onPress={() => {
                    // TODO: sumar cantidad vip
                  }}
                >
                  <Text style={styles.counterButtonTextPlus}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$[algo]</Text>
          </View>
        </ScrollView>
      </View>

      {/* Botón comprar pegado abajo */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={timeLeft === 0}
          style={[
            styles.buyButton,
            timeLeft === 0 && styles.buyButtonDisabled,
          ]}
          onPress={() => {
            // TODO: lógica de compra
          }}
        >
          <Text style={styles.buyButtonText}>Comprar</Text>
=======
        {/* Tarjeta de tiempo restante */}
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <Text className="text-base text-slate-700 mb-3">
            Tiempo restante
          </Text>

          <View className="border border-slate-200 rounded-2xl py-4 items-center">
            <Text className="text-3xl font-bold text-slate-800">
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* Tarjeta de tickets con + y - */}
        <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-semibold text-slate-800">General</Text>
              <Text className="text-slate-500 text-sm">
                ${generalPrice.toLocaleString('es-CL')}
              </Text>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-10 h-10 rounded-xl border border-slate-200 items-center justify-center"
                onPress={() =>
                  setGeneralQty(prev => (prev > 0 ? prev - 1 : 0))
                }
              >
                <Text className="text-lg text-slate-700">-</Text>
              </TouchableOpacity>

              <Text className="mx-4 text-base font-semibold text-slate-800">
                {generalQty}
              </Text>

              <TouchableOpacity
                className="w-10 h-10 rounded-xl bg-slate-900 items-center justify-center"
                onPress={() => setGeneralQty(prev => prev + 1)}
              >
                <Text className="text-lg text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-semibold text-slate-800">VIP</Text>
              <Text className="text-slate-500 text-sm">
                ${vipPrice.toLocaleString('es-CL')}
              </Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-10 h-10 rounded-xl border border-slate-200 items-center justify-center"
                onPress={() => setVipQty(prev => (prev > 0 ? prev - 1 : 0))}
              >
                <Text className="text-lg text-slate-700">-</Text>
              </TouchableOpacity>

              <Text className="mx-4 text-base font-semibold text-slate-800">
                {vipQty}
              </Text>

              <TouchableOpacity
                className="w-10 h-10 rounded-xl bg-slate-900 items-center justify-center"
                onPress={() => setVipQty(prev => prev + 1)}
              >
                <Text className="text-lg text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Total */}
        <View className="bg-white rounded-2xl shadow-sm p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-slate-800">
              Total
            </Text>
            <Text className="text-xl font-bold text-slate-900">
              ${total.toLocaleString('es-CL')}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 pb-4 pt-2">
        <TouchableOpacity
          className={`w-full rounded-2xl py-3 items-center justify-center ${
            timeLeft === 0 ? 'bg-slate-400' : 'bg-blue-600'
          }`}
          disabled={timeLeft === 0}
          onPress={() => {
            if (timeLeft === 0) return;
            //aquí irá la llamada real a la API de compra
            Alert.alert('Compra realizada con éxito');
          }}
        >
          <Text className="text-white text-lg font-semibold">
            {timeLeft === 0 ? 'Tiempo agotado' : 'Comprar'}
          </Text>
>>>>>>> Stashed changes
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

<<<<<<< Updated upstream
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9", // gris clarito
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  smallTitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  imageText: {
    fontSize: 12,
    color: "#6b7280",
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  eventMeta: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 2,
  },
  timeCard: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },
  timeTitle: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  timeBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  ticketsCard: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  ticketName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  ticketPrice: {
    fontSize: 12,
    color: "#6b7280",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButtonMinus: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  counterButtonPlus: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  counterButtonTextMinus: {
    fontSize: 18,
    color: "#374151",
  },
  counterButtonTextPlus: {
    fontSize: 18,
    color: "#ffffff",
  },
  counterValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalCard: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  buyButton: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
=======
>>>>>>> Stashed changes

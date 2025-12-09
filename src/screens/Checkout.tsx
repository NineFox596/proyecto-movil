import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen({ navigation }: any) {
  // 5 minutos = 300 segundos
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate("Tabs", { screen: "HomeTab" });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigation]);

  const formatTime = (totalSeconds: number) => {
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
          </View>

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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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

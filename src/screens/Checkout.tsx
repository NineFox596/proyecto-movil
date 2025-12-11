import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '../api/types';
import { getEvent } from '../api/services/events';
import { createReservation } from '../api/services/reservations';
import { checkout } from '../api/services/checkout';

export default function CheckoutScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer
  const [timeLeft, setTimeLeft] = useState(90);

  // Cantidades dinámicas por ticket
  const [quantities, setQuantities] = useState<{ [ticketId: string]: number }>({});

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEvent(eventId);
        setEvent(data);

        // Inicializar cantidades
        const initialQty: { [ticketId: string]: number } = {};
        data.tickets.forEach((t) => (initialQty[t.type] = 0));
        setQuantities(initialQty);
      } catch (error) {
        console.log('Error cargando evento', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  // TIMER
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate('Tabs', { screen: 'HomeTab' });
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, navigation]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Total dinámico
  const total = event
    ? event.tickets.reduce((acc, t) => acc + (quantities[t.type] || 0) * t.price, 0)
    : 0;

  // Función de compra/reserva + checkout
  const handlePurchase = async () => {
    if (!event) return;

    const items = event.tickets
      .map((t) => ({
        type: t.type, // obligatorio para la API
        quantity: quantities[t.type] || 0,
      }))
      .filter((i) => i.quantity > 0);

    if (items.length === 0) {
      Alert.alert('Selecciona al menos un ticket');
      return;
    }

    try {
      // 1Crear la reserva
      const res = await createReservation({
        event_id: eventId,
        items,
      });

      // 2Checkout
      const checkoutResult = await checkout({
        reservation_id: res.reservation_id,
        buyer: { name: 'Usuario Demo', email: 'demo@example.com' },
      });

      Alert.alert('Compra realizada con éxito');

      // 3️⃣ Navegar a pantalla de éxito
      navigation.replace('PurchaseSuccess', { purchaseId: checkoutResult._id });
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-slate-700">Cargando evento...</Text>
      </View>
    );
  }

  if (!event) return null;

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="mt-14 flex-1">
        <ScrollView className="flex-1 px-4 pb-32 pt-4">
          {/* Card Evento */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="mr-3 h-20 w-20 items-center justify-center rounded-xl bg-slate-200">
                {event.image ? (
                  <Image
                    source={{ uri: event.image }}
                    className="mt-14 aspect-[16/9] w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="mt-14 h-52 w-full items-center justify-center bg-gray-200">
                    <Text className="text-lg text-slate-500">Sin imagen</Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-800">{event.name}</Text>
                <Text className="mt-1 text-sm text-slate-500">Ubicación: {event.location}</Text>
                <Text className="text-sm text-slate-500">Horario: {event.date}</Text>
              </View>
            </View>
          </View>

          {/* Card Timer */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base text-slate-700">Tiempo restante</Text>
            <View className="items-center rounded-2xl border border-slate-200 py-4">
              <Text className="text-3xl font-bold text-slate-800">{formatTime(timeLeft)}</Text>
            </View>
          </View>

          {/* Tickets dinámicos */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            {event.tickets.map((t) => (
              <View key={t.type} className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-slate-800">{t.type}</Text>
                  <Text className="text-sm text-slate-500">${t.price.toLocaleString('es-CL')}</Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
                    onPress={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [t.type]: Math.max(0, prev[t.type] - 1),
                      }))
                    }>
                    <Text className="text-lg text-slate-700">-</Text>
                  </TouchableOpacity>
                  <Text className="mx-4 text-base font-semibold text-slate-800">
                    {quantities[t.type]}
                  </Text>
                  <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-xl bg-slate-900"
                    onPress={() =>
                      setQuantities((prev) => ({ ...prev, [t.type]: prev[t.type] + 1 }))
                    }>
                    <Text className="text-lg text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-slate-800">Total</Text>
              <Text className="text-xl font-bold text-slate-900">
                ${total.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botón inferior fijo */}
        <TouchableOpacity
          className={`mx-4 mb-4 mt-2 rounded-2xl py-3 ${
            timeLeft === 0 ? 'bg-slate-400' : 'bg-blue-600'
          }`}
          disabled={timeLeft === 0}
          onPress={handlePurchase}>
          <Text className="text-center text-xl font-semibold text-white">
            {timeLeft === 0 ? 'Tiempo agotado' : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

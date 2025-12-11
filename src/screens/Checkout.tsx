import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '../api/types';
import { getEvent } from '../api/services/events';
import { createReservation } from '../api/services/reservations';
import { checkout } from '../api/services/checkout';
import { Ionicons } from '@expo/vector-icons';
import type { Purchase } from '../api/types';

export default function CheckoutScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer
  const [timeLeft, setTimeLeft] = useState(7200);

  // Cantidades dinámicas por ticket
  const [quantities, setQuantities] = useState<{ [ticketId: string]: number }>({});

  // Datos del usuario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    // Mostrar HH:MM:SS si hay horas, si no solo MM:SS
    return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
  };

  // Total dinámico
  const total = event
    ? event.tickets.reduce((acc, t) => acc + (quantities[t.type] || 0) * t.price, 0)
    : 0;

  // Validaciones
  const isNameValid = /^[a-zA-Z\s]{3,}$/.test(name);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Suma de tickets seleccionados
  const totalTicketsSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  // Función de compra/reserva + checkout
  const handlePurchase = async () => {
    if (!event) return;

    const items = event.tickets
      .map((t) => ({
        type: t.type,
        quantity: quantities[t.type] || 0,
      }))
      .filter((i) => i.quantity > 0);

    if (items.length === 0) {
      Alert.alert('Selecciona al menos un ticket');
      return;
    }

    if (!isNameValid) {
      Alert.alert('Nombre inválido', 'Ingresa un nombre válido (mínimo 3 letras)');
      return;
    }

    if (!isEmailValid) {
      Alert.alert('Email inválido', 'Ingresa un correo válido');
      return;
    }

    try {
      // Crear la reserva
      const res = await createReservation({
        event_id: eventId,
        items,
      });

      // Checkout
      const checkoutResult = await checkout({
        reservation_id: res.reservation_id,
        buyer: { name, email },
      });

      const raw = await AsyncStorage.getItem('localPurchases');
      const previous: Purchase[] = raw ? JSON.parse(raw) : [];

      // Evitar duplicados por _id
      const withoutDuplicate = previous.filter((p) => p._id !== checkoutResult._id);

      // Nuevo array: compra más reciente primero
      const updated: Purchase[] = [checkoutResult, ...withoutDuplicate];

      // Guardar el nuevo historial
      await AsyncStorage.setItem('localPurchases', JSON.stringify(updated));

      Alert.alert('Compra realizada con éxito');

      // Navegar a pantalla de éxito
      Alert.alert(
        'Compra completada',
        'Tu compra ha sido realizada con éxito. Puedes verla en "Mis compras".',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Tabs', { screen: 'HomeTab' });
            },
          },
        ]
      );
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
                    className="h-full w-full rounded-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-sm text-slate-500">Sin imagen</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-slate-800">{event.name}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#444" />
                  <Text className="ml-2 text-base text-gray-700">Ubicación: {event.location}</Text>
                </View>
                <View className="mb-1 flex-row items-center">
                  <Ionicons name="calendar-outline" size={14} color="#444" />
                  <Text className="ml-2 text-base text-gray-700">
                    Fecha: {new Date(event.date).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card Datos del usuario */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-bold mb-2 text-lg text-black">Ingrese sus datos</Text>
            <TextInput
              placeholder="Nombre usuario"
              value={name}
              onChangeText={setName}
              className="flex-1 rounded border border-gray-300 p-3 text-base"
              autoCapitalize="words"
            />
            <TextInput
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={setEmail}
              className="mb-3 mt-3 flex-1 rounded border border-gray-300 p-3 text-base"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Card Timer */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base text-black">Tiempo restante</Text>
            <View className="items-center rounded-2xl border border-slate-200 py-4">
              <Text className="text-3xl font-bold text-slate-800">{formatTime(timeLeft)}</Text>
            </View>
          </View>

          {/* Tickets dinámicos */}
          <View className="mb-4 rounded-2xl bg-white p-4 pt-5 shadow-sm">
            {event.tickets.map((t) => {
              const isSoldOut = t.available === 0; // bandera de agotado
              return (
                <View
                  key={t.type}
                  className="mb-4 flex-row items-center justify-between opacity-75">
                  <View>
                    <Text className="text-lg font-bold text-slate-800">
                      - {t.type} {isSoldOut && '(Agotado)'}
                    </Text>
                    <Text className="text-base text-sm text-slate-800">
                      ${t.price.toLocaleString('es-CL')} ({t.available} disponibles)
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className="h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
                      onPress={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [t.type]: Math.max(0, prev[t.type] - 1),
                        }))
                      }
                      disabled={isSoldOut || quantities[t.type] === 0} // no permitir restar si está en 0 o agotado
                    >
                      <Text className="text-lg text-slate-700">-</Text>
                    </TouchableOpacity>

                    <Text className="mx-4 text-base font-semibold text-slate-800">
                      {quantities[t.type]}
                    </Text>

                    <TouchableOpacity
                      className={`h-10 w-10 items-center justify-center rounded-xl ${
                        isSoldOut ? 'bg-gray-400' : 'bg-slate-900'
                      }`}
                      onPress={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [t.type]: Math.min(t.available, (prev[t.type] || 0) + 1),
                        }))
                      }
                      disabled={isSoldOut} // no permitir aumentar si está agotado
                    >
                      <Text className="text-lg text-white">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Total */}
          <View className="mb-7 rounded-2xl bg-white p-4 shadow-sm">
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
          className={`mx-4 mb-4 mt-2 rounded py-3 ${
            timeLeft === 0 || totalTicketsSelected === 0 ? 'bg-slate-400' : 'bg-blue-600'
          }`}
          disabled={timeLeft === 0 || totalTicketsSelected === 0}
          onPress={handlePurchase}>
          <Text className="text-center text-xl font-semibold text-white">
            {timeLeft === 0
              ? 'Tiempo agotado'
              : totalTicketsSelected === 0
                ? 'Seleccione tickets'
                : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEvent } from '../api/services/events';
import { createReservation } from '../api/services/reservations';
import { checkout } from '../api/services/checkout';
import { Event, Purchase } from '../api/types';
import { useTheme } from '../context/ThemeContext';

export default function Checkout({ route, navigation }: any) {
  const { theme } = useTheme();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(7200);
  const [quantities, setQuantities] = useState<{ [ticketId: string]: number }>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEvent(eventId);
        setEvent(data);
        const initialQty: { [ticketId: string]: number } = {};
        data.tickets.forEach((t) => (initialQty[t.type] = 0));
        setQuantities(initialQty);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate('Tabs', { screen: 'HomeTab' });
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
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
    return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
  };

  const total = event
    ? event.tickets.reduce((acc, t) => acc + (quantities[t.type] || 0) * t.price, 0)
    : 0;
  const isNameValid = /^[a-zA-Z\s]{3,}$/.test(name);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const totalTicketsSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handlePurchase = async () => {
    if (!event) return;
    const items = event.tickets
      .map((t) => ({ type: t.type, quantity: quantities[t.type] || 0 }))
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
      const res = await createReservation({ event_id: eventId, items });
      const checkoutResult = await checkout({
        reservation_id: res.reservation_id,
        buyer: { name, email },
      });
      const raw = await AsyncStorage.getItem('localPurchases');
      const previous: Purchase[] = raw ? JSON.parse(raw) : [];
      const withoutDuplicate = previous.filter((p) => p._id !== checkoutResult._id);
      const updated: Purchase[] = [checkoutResult, ...withoutDuplicate];
      await AsyncStorage.setItem('localPurchases', JSON.stringify(updated));
      Alert.alert(
        'Compra realizada con éxito',
        'Tu compra ha sido realizada con éxito. Puedes verla en "Mis compras".',
        [{ text: 'OK', onPress: () => navigation.navigate('Tabs', { screen: 'HomeTab' }) }]
      );
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  if (loading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'}`}>
        <ActivityIndicator size="large" />
        <Text className={`${theme === 'light' ? 'text-slate-700' : 'text-white'} mt-2`}>
          Cargando evento...
        </Text>
      </View>
    );
  }

  if (!event) return null;

  return (
    <SafeAreaView className={`flex-1 ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'}`}>
      <View className="mt-20 flex-1">
        <ScrollView className="flex-1 px-4 pb-32 pt-4">
          {/* Card Evento */}
          <View
            className={`mb-4 rounded-2xl p-4 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <View className="flex-row items-center">
              <View
                className={`mr-3 h-20 w-20 items-center justify-center rounded-xl ${theme === 'light' ? 'bg-slate-200' : 'bg-gray-700'}`}>
                {event.image ? (
                  <Image
                    source={{ uri: event.image }}
                    className="h-full w-full rounded-xl"
                    resizeMode="cover"
                  />
                ) : (
                  <Text
                    className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-300'} text-sm`}>
                    Sin imagen
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text
                  className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} text-xl font-bold`}>
                  {event.name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={theme === 'light' ? '#444' : '#ccc'}
                  />
                  <Text
                    className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-2 text-base`}>
                    Ubicación: {event.location}
                  </Text>
                </View>
                <View className="mb-1 flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme === 'light' ? '#444' : '#ccc'}
                  />
                  <Text
                    className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-2 text-base`}>
                    Fecha: {new Date(event.date).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card Datos del usuario */}
          <View
            className={`mb-4 rounded-2xl p-4 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <Text
              className={`${theme === 'light' ? 'text-black' : 'text-white'} mb-2 text-lg font-bold`}>
              Ingrese sus datos
            </Text>
            <TextInput
              placeholder="Nombre usuario"
              value={name}
              onChangeText={setName}
              className={`flex-1 rounded border p-3 text-base ${theme === 'light' ? 'border-gray-300 text-black' : 'border-gray-600 text-white'}`}
              autoCapitalize="words"
              placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
            />
            <TextInput
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={setEmail}
              className={`mb-3 mt-3 flex-1 rounded border p-3 text-base ${theme === 'light' ? 'border-gray-300 text-black' : 'border-gray-600 text-white'}`}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
            />
          </View>

          {/* Card Timer */}
          <View
            className={`mb-4 rounded-2xl p-4 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <Text className={`${theme === 'light' ? 'text-black' : 'text-white'} mb-3 text-base`}>
              Tiempo restante
            </Text>
            <View
              className={`items-center rounded-2xl border py-4 ${theme === 'light' ? 'border-slate-200' : 'border-gray-700'}`}>
              <Text
                className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} text-3xl font-bold`}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>

          {/* Tickets dinámicos */}
          <View
            className={`mb-4 rounded-2xl p-4 pt-5 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            {event.tickets.map((t) => {
              const isSoldOut = t.available === 0;
              return (
                <View
                  key={t.type}
                  className="mb-4 flex-row items-center justify-between opacity-75">
                  <View>
                    <Text
                      className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} text-lg font-bold`}>
                      - {t.type} {isSoldOut && '(Agotado)'}
                    </Text>
                    <Text
                      className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} text-base text-sm`}>
                      ${t.price.toLocaleString('es-CL')} ({t.available} disponibles)
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className={`h-10 w-10 items-center justify-center rounded-xl border ${theme === 'light' ? 'border-slate-200' : 'border-gray-700'}`}
                      onPress={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [t.type]: Math.max(0, prev[t.type] - 1),
                        }))
                      }
                      disabled={isSoldOut || quantities[t.type] === 0}>
                      <Text
                        className={`${theme === 'light' ? 'text-slate-700' : 'text-white'} text-lg`}>
                        -
                      </Text>
                    </TouchableOpacity>

                    <Text
                      className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} mx-4 text-base font-semibold`}>
                      {quantities[t.type]}
                    </Text>

                    <TouchableOpacity
                      className={`h-10 w-10 items-center justify-center rounded-xl ${isSoldOut ? 'bg-gray-400' : 'bg-slate-900'}`}
                      onPress={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [t.type]: Math.min(t.available, (prev[t.type] || 0) + 1),
                        }))
                      }
                      disabled={isSoldOut}>
                      <Text className="text-lg text-white">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Total */}
          <View
            className={`mb-7 rounded-2xl p-4 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <View className="flex-row items-center justify-between">
              <Text
                className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} text-base font-semibold`}>
                Total
              </Text>
              <Text
                className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} text-xl font-bold`}>
                ${total.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          className={`mx-4 mb-4 mt-2 rounded py-3 ${timeLeft === 0 || totalTicketsSelected === 0 ? 'bg-slate-400' : 'bg-blue-600'}`}
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

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '../api/types';
import { getEvent } from '../api/services/events';

export default function CheckoutScreen({ route, navigation }: any) {
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);

  // Obtener datos del evento
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

  // Temp
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate('Tabs', { screen: 'HomeTab' });
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 p-4">
        {/* Datos del Evento */}
        <View className="mb-4 rounded bg-white p-3 shadow-sm">
          <Text className="text-xs text-slate-500">ULA Tickets</Text>
          <Text className="text-xl font-bold text-slate-900">{event?.name}</Text>
          <Text className="mt-1 text-sm text-slate-600">{event?.location}</Text>
        </View>

        {/* Tiempo restante */}
        <View className="mb-4 rounded bg-white p-3 shadow-sm">
          <Text className="mb-1 text-sm text-slate-600">
            Tiempo restante para completar la compra:
          </Text>
          <View className="items-center justify-center rounded-lg bg-slate-100 py-3">
            <Text className="text-2xl font-bold text-slate-900">{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <TouchableOpacity
          className={`mt-6 items-center rounded py-3 ${
            timeLeft === 0 ? 'bg-slate-400' : 'bg-blue-600'
          }`}
          disabled={timeLeft === 0}
          onPress={() => alert('Compra realizada con éxito')}>
          <Text className="text-base text-xl font-semibold text-white">
            {timeLeft === 0 ? 'Tiempo agotado' : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

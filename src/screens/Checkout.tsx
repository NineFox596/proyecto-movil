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

export default function CheckoutScreen({ route, navigation }: any) {
  const { eventId } = route.params;

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
  useEffect(() => {
    if (timeLeft === 0) {
      navigation.navigate('Tabs', { screen: 'HomeTab' });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
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
          </View>
        </View>

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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


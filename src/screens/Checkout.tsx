import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event } from '../api/types';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

export default function CheckoutScreen({ route, navigation }: any) {
  const event: Event = route.params?.event;
  const [timeLeft, setTimeLeft] = useState(10);

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
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleComprar = () => {
    if (timeLeft === 0) return;
    // aca va la logica
    alert('Compra realizada con éxito');
  };
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 p-4">
        <View className="mb-4 rounded bg-white p-3 shadow-sm">
          <Text className="text-xs text-slate-500">ULA Tickets</Text>
          <Text className="text-xl font-bold text-slate-900">nombre aca</Text>
          <Text className="mt-1 text-sm text-slate-600"> ubicacion aca</Text>
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
          className={`mt-6 items-center rounded-xl py-3 ${
            timeLeft === 0 ? 'bg-slate-400' : 'bg-blue-600'
          }`}
          disabled={timeLeft === 0}
          onPress={handleComprar}>
          <Text className="text-base font-semibold text-white">
            {timeLeft === 0 ? 'Tiempo agotado' : 'Comprar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

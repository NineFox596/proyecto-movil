import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEvent } from '../api/services/events';
import { Event } from '../api/types';
import { useTheme } from '../context/ThemeContext';

export default function EventDetail({ route, navigation }: any) {
  const { theme } = useTheme();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await getEvent(eventId);
        setEvent(res);
      } catch {
        setError('No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={theme === 'light' ? 'black' : 'white'} />
        <Text className={`${theme === 'light' ? 'text-gray-700' : 'text-white'} mt-2`}>
          Cargando evento...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className={`${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>{error}</Text>
      </View>
    );
  }

  if (!event) return null;

  return (
    <SafeAreaView className={`flex-1 ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'}`}>
      <View className="flex-1">
        {event.image ? (
          <Image
            source={{ uri: event.image }}
            className="mt-20 aspect-[16/9] w-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`mt-14 h-52 w-full items-center justify-center ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
            <Text className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-200'}`}>
              Sin imagen
            </Text>
          </View>
        )}

        <View className="flex-1 border-gray-200 p-5">
          <Text
            className={`border-b-2 border-gray-300 pb-4 text-center text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {event.name}
          </Text>
          <View className="mx-4">
            <ScrollView>
              <View className="mb-1 mt-4 flex-row items-center">
                <Ionicons
                  name="pricetag-outline"
                  size={17}
                  color={theme === 'light' ? '#444' : '#ccc'}
                />
                <Text
                  className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-2 text-xl`}>
                  Categoría: {event.category}
                </Text>
              </View>

              <View className="mb-1 flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={theme === 'light' ? '#444' : '#ccc'}
                />
                <Text
                  className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-2 text-xl`}>
                  Fecha: {new Date(event.date).toLocaleString()}
                </Text>
              </View>

              <View className="mb-1 flex-row items-center">
                <Ionicons
                  name="location-outline"
                  size={17}
                  color={theme === 'light' ? '#444' : '#ccc'}
                />
                <Text
                  className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-2 text-xl`}>
                  Ubicación: {event.location}
                </Text>
              </View>

              <Text
                className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} mt-3 text-2xl font-semibold`}>
                Tickets:
              </Text>
              {event.tickets.map((t, i) => (
                <Text
                  key={i}
                  className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-xl`}>
                  - {t.type}: ${t.price} ({t.available} disponibles)
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity
          className="mx-4 mb-4 mt-2 rounded bg-blue-600 px-4 py-3"
          onPress={() => navigation.navigate('Checkout', { eventId: event._id })}>
          <Text className="text-center text-xl font-semibold text-white">Reservar Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

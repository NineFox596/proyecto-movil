import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { getEvent } from '../api/services/events';
import { Event } from '../api/types';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetail({ route, navigation }: any) {
  const { eventId } = route.params;

  // Para comprobar el evento que devuelve
  console.log('EVENT DETAIL DATA:', eventId);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await getEvent(eventId);
        setEvent(res);
      } catch (err) {
        setError('No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Agregado para evitar "event is possibly null"
  if (!event) return null;

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-col">
        <View>
          {event.image ? (
            <Image source={{ uri: event.image }} className="mb-3 h-44 w-full" resizeMode="cover" />
          ) : (
            <View className="mb-3 h-44 w-full items-center justify-center rounded-lg bg-gray-200">
              <Text className="text-gray-500">Sin imagen</Text>
            </View>
          )}
        </View>

        <View className="mx-4 rounded border border-gray-200 bg-white p-5">
          <Text className="text-3xl font-bold">{event.name}</Text>
          <View className="mb-1 mt-2 flex-row items-center">
            <Ionicons name="pricetag-outline" size={17} color="#444" />
            <Text className="ml-2 text-xl text-gray-700">Categoría: {event.category}</Text>
          </View>
          <View className="mb-1 flex-row items-center">
            <Ionicons name="calendar-outline" size={17} color="#444" />
            <Text className="ml-2 text-xl text-gray-700">
              Fecha: {new Date(event.date).toLocaleString()}
            </Text>
          </View>
          <View className="mb-1 flex-row items-center">
            <Ionicons name="location-outline" size={17} color="#444" />
            <Text className="ml-2 text-xl text-gray-700">Ubicación: {event.location}</Text>
          </View>

          <Text className="mt-3 text-2xl font-semibold">Tickets:</Text>
          {event.tickets.map((t, i) => (
            <Text key={i} className="text-xl text-gray-600">
              - {t.type}: ${t.price} ({t.available} disponibles)
            </Text>
          ))}
        </View>

        <TouchableOpacity
          className="mx-4 my-4 rounded bg-blue-600 px-4 py-3"
          onPress={() => navigation.navigate('Checkout', { eventId })}>
          <Text className="text-center text-xl font-semibold text-white">Reservar Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

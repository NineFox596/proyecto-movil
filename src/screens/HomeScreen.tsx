import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../api/services/events';
import { Event } from '../api/types';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import HomeHeader from '../components/HomeHeader';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFilteredEvents = async (category: string, query: string) => {
    try {
      setLoading(true);

      const res = await getEvents({
        category: category !== 'todas' ? category : undefined,
        q: query || undefined,
        page: 1,
        limit: 20,
      });

      setEvents(res.data);
    } catch (err) {
      console.error('ERROR EN BÚSQUEDA:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getEvents();
        setEvents(res.data);
      } catch (err: any) {
        console.error('Error al cargar eventos:', err);
        setError('No se pudieron cargar los eventos');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Cargando eventos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <HomeHeader title="ULA Tickets" />
      <SearchBar
        onSearch={({ category, query }) => {
          loadFilteredEvents(category, query);
        }}
      />
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {events.map((ev) => (
          <View key={ev._id} className="mb-6 rounded bg-white p-4 shadow-md">
            {/* Imagen */}
            {ev.image ? (
              <Image
                source={{ uri: ev.image }}
                className="mb-3 h-44 w-full rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="mb-3 h-44 w-full items-center justify-center rounded-lg bg-gray-200">
                <Text className="text-gray-500">Sin imagen</Text>
              </View>
            )}

            {/* Información */}
            <Text className="text-2xl font-bold">{ev.name}</Text>
            <View className="mb-1 mt-0.5 mt-1 flex-row items-center">
              <Ionicons name="pricetag-outline" size={15} color="#444" />
              <Text className="text-gl ml-2 text-gray-700">{ev.category}</Text>
            </View>
            <View className="mb-1 mt-0.5 flex-row items-center">
              <Ionicons name="calendar-outline" size={15} color="#444" />
              <Text className="text-gl ml-2 text-gray-700">
                {new Date(ev.date).toLocaleString()}
              </Text>
            </View>
            <View className="mb-1 mt-0.5 flex-row items-center">
              <Ionicons name="location-outline" size={15} color="#444" />
              <Text className="text-gl ml-2 text-gray-700">{ev.location}</Text>
            </View>

            {/* Botón */}
            <View className="mt-4">
              <TouchableOpacity
                className="rounded bg-blue-600 px-4 py-3"
                onPress={() => navigation.navigate('Event Details', { eventId: ev._id })}>
                <Text className="text-center font-semibold text-white">Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

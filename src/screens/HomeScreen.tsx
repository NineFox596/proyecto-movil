import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../api/services/events';
import { Event } from '../api/types';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import HomeHeader from '../components/HomeHeader';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<{ category?: string; query?: string }>({});

  // FUNCIÓN GENERAL PARA CARGAR EVENTOS
  const fetchEvents = async (
    pageNumber = 10,
    merge = false,
    opts?: { category?: string; query?: string }
  ) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const usedCategory = opts?.category ?? filters.category;
      const usedQuery = opts?.query ?? filters.query;

      const res = await getEvents({
        category: usedCategory && usedCategory !== 'todas' ? usedCategory : undefined,
        q: usedQuery || undefined,
        limit: 10,
        page: pageNumber,
      });

      const newEvents = res.data;

      if (merge) setEvents((prev) => [...prev, ...newEvents]);
      else setEvents(newEvents);

      setHasMore(newEvents.length >= 10);
    } catch (err) {
      console.error('Error en paginación:', err);
      setError('Error cargando eventos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // DESDE SEARCHBAR
  const handleSearch = ({ category, query }: { category: string; query: string }) => {
    setFilters({ category, query });
    setPage(1);
    fetchEvents(1, false, { category, query });
  };

  // CARGA INICIAL
  useEffect(() => {
    fetchEvents(1, false);
  }, []);

  // CARGAR MÁS ITEMS (INFINITE SCROLL)
  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, true);
  };

  // DISEÑO DEL EVENTO (UI BONITA)
  const renderEvent = ({ item }: { item: Event }) => (
    <View className="mb-6 rounded bg-white p-4 shadow-md">
      {/* Imagen */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          className="mb-3 h-44 w-full rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="mb-3 h-44 w-full items-center justify-center rounded-lg bg-gray-200">
          <Text className="text-gray-500">Sin imagen</Text>
        </View>
      )}

      {/* Información */}
      <Text className="text-2xl font-bold">{item.name}</Text>

      <View className="mb-1 mt-1 flex-row items-center">
        <Ionicons name="pricetag-outline" size={15} color="#444" />
        <Text className="ml-2 text-gray-700">{item.category}</Text>
      </View>

      <View className="mb-1 flex-row items-center">
        <Ionicons name="calendar-outline" size={15} color="#444" />
        <Text className="ml-2 text-gray-700">{new Date(item.date).toLocaleString()}</Text>
      </View>

      <View className="mb-1 flex-row items-center">
        <Ionicons name="location-outline" size={15} color="#444" />
        <Text className="ml-2 text-gray-700">{item.location}</Text>
      </View>

      {/* Botón */}
      <View className="mt-4">
        <TouchableOpacity
          className="rounded bg-blue-600 px-4 py-3"
          onPress={() => navigation.navigate('Event Details', { eventId: item._id })}>
          <Text className="text-center font-semibold text-white">Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <HomeHeader
        title="ULA Tickets"
        isHome
        rightButton={
          <TouchableOpacity
            className="mr-2 rounded border bg-white p-1"
            onPress={() => navigation.navigate('Purchases')}>
            <Ionicons name="receipt-outline" size={24} color="black" />
          </TouchableOpacity>
        }
      />

      <SearchBar onSearch={handleSearch} />

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="large" className="my-5" /> : null
        }
      />
    </View>
  );
}

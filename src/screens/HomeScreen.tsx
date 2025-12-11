import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../api/services/events';
import { Event } from '../api/types';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import HomeHeader from '../components/HomeHeader';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{ category?: string; query?: string }>({});

  const fetchEvents = async (
    pageNumber = 1,
    merge = false,
    opts?: { category?: string; query?: string }
  ) => {
    try {
      console.log('fetchEvents llamado con:', { pageNumber, merge, opts });

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

      console.log('Datos recibidos de la API:', res.data);

      const newEvents = res.data;

      if (!Array.isArray(newEvents)) {
        console.warn('res.data no es un array', newEvents);
        setEvents([]);
        setHasMore(false);
        return;
      }

      if (merge) setEvents((prev) => [...prev, ...newEvents]);
      else setEvents(newEvents);

      setHasMore(newEvents.length >= 10);
      console.log('Eventos actuales en state:', merge ? [...events, ...newEvents] : newEvents);
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = ({ category, query }: { category: string; query: string }) => {
    console.log('handleSearch:', { category, query });
    setFilters({ category, query });
    setPage(1);
    fetchEvents(1, false, { category, query });
  };

  useEffect(() => {
    fetchEvents(1, false);
  }, []);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    console.log('loadMore llamado, página:', nextPage);
    setPage(nextPage);
    fetchEvents(nextPage, true);
  };

  const renderEvent = ({ item }: { item: Event }) => {
    if (!item) {
      console.warn('Evento undefined recibido en renderEvent');
      return null;
    }

    return (
      <View className={`mb-6 rounded p-4 shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="mb-3 h-44 w-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`mb-3 h-44 w-full items-center justify-center rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
            <Text className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Sin imagen</Text>
          </View>
        )}

        <Text className={`${isDark ? 'text-white' : 'text-black'} text-2xl font-bold`}>
          {item.name}
        </Text>

        <View className="mb-1 mt-1 flex-row items-center">
          <Ionicons name="pricetag-outline" size={15} color={isDark ? '#ccc' : '#444'} />
          <Text className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {item.category}
          </Text>
        </View>

        <View className="mb-1 flex-row items-center">
          <Ionicons name="calendar-outline" size={15} color={isDark ? '#ccc' : '#444'} />
          <Text className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {new Date(item.date).toLocaleString()}
          </Text>
        </View>

        <View className="mb-1 flex-row items-center">
          <Ionicons name="location-outline" size={15} color={isDark ? '#ccc' : '#444'} />
          <Text className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {item.location}
          </Text>
        </View>

        <View className="mt-4">
          <TouchableOpacity
            className="rounded bg-blue-600 px-4 py-3"
            onPress={() => navigation.navigate('Event Details', { eventId: item._id })}>
            <Text className="text-center font-semibold text-white">Ver Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
        <Text className={`${isDark ? 'text-white' : 'text-black'} mt-2`}>Cargando eventos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} flex-1`}>
      <HomeHeader
        title="ULA Tickets"
        isHome
        rightButton={
          <TouchableOpacity
            className={`mr-2 rounded border ${isDark ? 'bg-gray-700' : 'bg-white'} p-1`}
            onPress={() => navigation.navigate('Purchases')}>
            <Ionicons name="receipt-outline" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
        }
      />

      <SearchBar onSearch={handleSearch} />

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item?._id || Math.random().toString()}
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

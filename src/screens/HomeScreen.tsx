import { View, Text, Image, Button, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../api/services/events';
import { Event } from '../api/types';
import SearchBar from '../../components/SearchBar';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<{ category?: string; query?: string }>({});

  // 🔥 Cargar eventos con filtros + paginación
  const fetchEvents = async (pageNumber = 1, merge = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await getEvents({
        category: filters.category !== 'todas' ? filters.category : undefined,
        q: filters.query || undefined,
        limit: 10,
        page: pageNumber,
      });

      const newEvents = res.data;

      if (merge) {
        setEvents((prev) => [...prev, ...newEvents]);
      } else {
        setEvents(newEvents);
      }

      // Comprobar si hay más páginas
      setHasMore(newEvents.length >= 10);
    } catch (err) {
      console.error('Error en paginación:', err);
      setError('Error cargando eventos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ⭐ Ejecutar búsqueda desde SearchBar
  const handleSearch = ({ category, query }: { category: string; query: string }) => {
    setFilters({ category, query });
    setPage(1);
    fetchEvents(1, false);
  };

  // Cargar inicial
  useEffect(() => {
    fetchEvents(1);
  }, []);

  // 🔥 Lazy loading - cargar más
  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, true);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View
      style={{
        marginBottom: 20,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
      }}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 10 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 180,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: '#eee',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#777' }}>Sin imagen</Text>
        </View>
      )}

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>Categoría: {item.category}</Text>
      <Text>Fecha: {new Date(item.date).toLocaleString()}</Text>
      <Text>Ubicación: {item.location}</Text>

      <Text style={{ marginTop: 6, fontWeight: 'bold' }}>Tickets:</Text>
      {item.tickets.map((t, i) => (
        <Text key={i}>
          - {t.type}: ${t.price} ({t.available} disponibles)
        </Text>
      ))}

      <Button
        title="Ver detalles"
        onPress={() => navigation.navigate('Event Details', { eventId: item._id })}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="large" style={{ marginVertical: 20 }} /> : null
          }
        />
      )}
    </SafeAreaView>
  );
}

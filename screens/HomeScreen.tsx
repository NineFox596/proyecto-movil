import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEvents } from '../src/api/services/events';
import { Event } from '../src/api/types';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando eventos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 16 }}>
        {events.map((ev) => (
          <View
            key={ev._id}
            style={{
              marginBottom: 20,
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ddd',
              backgroundColor: 'white',
            }}>
            {/* Imagen */}
            {ev.image ? (
              <Image
                source={{ uri: ev.image }}
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
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

            {/* Información */}
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ev.name}</Text>
            <Text>Categoría: {ev.category}</Text>
            <Text>Fecha: {new Date(ev.date).toLocaleString()}</Text>
            <Text>Ubicación: {ev.location}</Text>

            <Text style={{ marginTop: 6, fontWeight: 'bold' }}>Tickets:</Text>
            {ev.tickets.map((t, i) => (
              <Text key={i}>
                - {t.type}: ${t.price} ({t.available} disponibles)
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

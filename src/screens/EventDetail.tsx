import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { getEvent } from '../api/services/events';
import { Event } from '../api/types';

export default function EventDetail({ route, navigation }: any) {
  // Obtenemos el Id desde Homescreen
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
      } catch (err) {
        setError('No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // Loading
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Vista final
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* No le supe agregar imagenes :( ) */}
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{event?.name}</Text>
      <Text>Categoría: {event?.category}</Text>
      <Text>Fecha: {new Date(event?.date || '').toLocaleString()}</Text>
      <Text>Ubicación: {event?.location}</Text>

      {/* Ir a checkout */}
      <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout', { eventId })} />
    </View>
  );
}

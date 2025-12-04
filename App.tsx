import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvents } from "./src/api/services/events";
import { Event } from "./src/api/types";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getEvents();
        setEvents(res.data);
      } catch (err: any) {
        console.error("Error al cargar eventos:", err);
        setError("No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando eventos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 16 }}>
        {events.map((ev) => (
          <View key={ev._id} style={{ marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 8 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{ev.name}</Text>
            <Text>Categoria: {ev.category}</Text>
            <Text>Fecha: {new Date(ev.date).toLocaleString()}</Text>
            <Text>Ubicación: {ev.location}</Text>
            <Text>Tickets disponibles: {ev.tickets.map(t => `${t.type} (${t.available})`).join(", ")}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

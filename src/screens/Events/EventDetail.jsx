import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { getEventById } from "../../api/events";

export default function EventDetail({ route }) {
  const { id } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(id).then(setEvent).catch(console.error);
  }, []);

  if (!event) return <Text>Cargando...</Text>;

  return (
    <ScrollView className="p-4">
      <Text className="text-3xl font-bold mb-2">{event.name}</Text>
      <Text className="text-gray-700 mb-4">{event.description}</Text>
    </ScrollView>
  );
}

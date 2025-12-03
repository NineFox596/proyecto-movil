import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { EventsAPI } from "../../api/events";

export default function EventDetailScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    EventsAPI.getById(id).then(setEvent).catch(console.error);
  }, []);

  if (!event) return <Text>Cargando...</Text>;

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold">{event.name}</Text>
      <Text className="text-gray-600 mb-4">{event.date}</Text>
      <Text>{event.description}</Text>
    </View>
  );
}

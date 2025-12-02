import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { getEvents } from "../../api/events";
import EventCard from "../../components/EventCard";

export default function EventsList({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <ScrollView className="p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Eventos</Text>

      {events.map((ev) => (
        <EventCard
          key={ev.id}
          event={ev}
          onPress={() => navigation.navigate("EventDetail", { id: ev.id })}
        />
      ))}
    </ScrollView>
  );
}

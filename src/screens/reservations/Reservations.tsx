import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ReservationsAPI } from "../../api/reservations";

export default function MyReservationsScreen() {
  const userId = 1; // TODO: obtener de contexto/auth
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    ReservationsAPI.getByUser(userId)
      .then(setReservations)
      .catch(console.error);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="font-bold text-lg">{item.eventName}</Text>
            <Text className="text-gray-500">{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

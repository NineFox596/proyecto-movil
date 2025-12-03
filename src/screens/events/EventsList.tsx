import { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { EventsAPI } from "../../api/events";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/StackNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList, "Root">;

export default function EventsListScreen() {
  const navigation = useNavigation<Nav>();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    EventsAPI.getAll().then(setEvents).catch(console.error);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            className="p-4 border-b border-gray-200"
            onPress={() => navigation.navigate("EventDetail", { id: item.id })}
          >
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-gray-500">{item.date}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Bienvenido a Tickets App</Text>
      <Text className="text-gray-500">Explora eventos y gestiona tus reservas</Text>
    </View>
  );
}

import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { PurchasesAPI } from "../../api/purchases";

export default function MyPurchasesScreen() {
  const userId = 1; // TODO: auth real
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    PurchasesAPI.getByUser(userId).then(setPurchases);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">{item.eventName}</Text>
            <Text className="text-gray-500">Boletos: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
}

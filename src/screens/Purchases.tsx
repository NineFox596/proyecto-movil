import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Solo para tipar y dejar claro qué datos se esperan, podria considerarce como place holder, cambienlo a su gusto
interface PurchaseItem {
  type: string;      // "General" | "VIP" | etc.
  quantity: number;  // cantidad de tickets
}

interface Purchase {
  eventName: string;
  eventDate: string;     // string formateado, p.ej. "15 de diciembre de 2025"
  location: string;
  items: PurchaseItem[];
  purchasedAt: string;   // "10 de diciembre de 2025"
  totalPrice: number;
}

export default function PurchasesScreen({ navigation }: any) {
  // Reemplazar esto por datos reales desde la API
  const [loading] = useState(false);
  const [purchase] = useState<Purchase | null>({
    eventName: 'Concierto Sinfónico de Verano',
    eventDate: '15 de diciembre de 2025',
    location: 'Teatro Municipal de Puerto Montt',
    items: [
      { type: 'General', quantity: 2 },
      { type: 'VIP', quantity: 1 },
    ],
    purchasedAt: '10 de diciembre de 2025',
    totalPrice: 45000,
  });

  // Estado de carga (placeholder la api va aca)
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100 items-center justify-center">
        <Text className="text-slate-700">Cargando compra...</Text>
      </SafeAreaView>
    );
  }

  //no hay compra
  if (!purchase) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100 px-4 pt-4">
        <View className="bg-white rounded-2xl shadow-sm p-6 items-center">
          <Text className="text-lg font-semibold text-slate-900">
            Sin tickets
          </Text>
          <Text className="mt-2 text-slate-500 text-center">
            No se encontró la compra.
          </Text>

          <TouchableOpacity
            className="mt-4 rounded-xl bg-blue-600 px-5 py-3"
            onPress={() =>
              navigation.navigate('Tabs', { screen: 'HomeTab' })
            }
          >
            <Text className="text-white font-semibold">Buscar eventos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Vista de cuando encuentra una compra
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 px-4 pt-4 pb-4">
        <Text className="text-xl font-semibold text-slate-700 mb-3">
          Historial de compra
        </Text>
        <View className="bg-white rounded-2xl shadow-sm p-4">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-semibold text-slate-900">
                {purchase.eventName}
              </Text>
              <Text className="mt-2 text-sm text-slate-600">
                Día: {purchase.eventDate}
              </Text>
              <Text className="text-sm text-slate-600">
                Ubicación: {purchase.location}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-slate-500 mb-1">Total</Text>
              <Text className="text-xl font-bold text-slate-900">
                ${purchase.totalPrice.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>
          <View className="border-t border-slate-200 pt-3 mt-1">
            <Text className="font-semibold text-slate-800 mb-2">
              Tickets
            </Text>

            {purchase.items.map((item, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between mb-1"
              >
                <Text className="text-slate-700">
                  {item.quantity} × {item.type}
                </Text>
              </View>
            ))}
          </View>
          <Text className="mt-4 text-xs text-slate-500">
            Comprado el {purchase.purchasedAt}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


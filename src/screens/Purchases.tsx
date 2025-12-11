import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../components/HomeHeader';
import { getPurchase } from '../api/services/checkout';

export default function PurchaseDetail({ route, navigation }: any) {
  const { purchaseId } = route.params; // ID de la compra pasada desde Checkout
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPurchase(purchaseId); // ahora sí pasamos el purchase_id
        setPurchase(data);
      } catch (e) {
        console.log('Error cargando compra', e);
        setPurchase(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [purchaseId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Cargando compra...</Text>
      </SafeAreaView>
    );
  }

  if (!purchase) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100 px-4 pt-4">
        <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">Compra no encontrada</Text>
          <Text className="mt-2 text-center text-slate-600">
            No se pudo cargar la información de la compra.
          </Text>

          <TouchableOpacity
            className="mt-4 rounded-xl bg-blue-600 px-5 py-3"
            onPress={() => navigation.navigate('Tabs', { screen: 'HomeTab' })}>
            <Text className="font-semibold text-white">Buscar eventos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <HomeHeader title="Detalle de compra" isHome />

      <ScrollView className="px-4 pb-4 pt-4">
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="mb-3 flex-row justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-lg font-semibold">{purchase.eventName}</Text>
              <Text className="mt-2 text-sm text-slate-600">
                Día: {new Date(purchase.eventDate).toLocaleDateString('es-CL')}
              </Text>
              <Text className="text-sm text-slate-600">Ubicación: {purchase.location}</Text>
            </View>

            <View className="items-end">
              <Text className="text-xs text-slate-500">Total</Text>
              <Text className="text-xl font-bold">
                ${purchase.totalPrice.toLocaleString('es-CL')}
              </Text>
            </View>
          </View>

          <View className="border-t border-slate-200 pt-3">
            <Text className="mb-2 font-semibold">Tickets</Text>

            {purchase.items.map((item: any, i: number) => (
              <Text key={i} className="text-slate-700">
                {item.quantity} × {item.type}
              </Text>
            ))}
          </View>

          <Text className="mt-4 text-xs text-slate-500">
            Comprado el {new Date(purchase.purchasedAt).toLocaleDateString('es-CL')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

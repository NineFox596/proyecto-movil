import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import type { Purchase } from '../api/types';

export default function PurchasesScreen() {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const raw = await AsyncStorage.getItem('localPurchases');
        const list: Purchase[] = raw ? JSON.parse(raw) : [];
        setPurchases(list);
      } catch (e) {
        console.log('Error cargando compras locales', e);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    }

    loadPurchases();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Cargando compras...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View>
      <CustomHeader title="Mis compras" />

      <ScrollView className="px-4 pb-14 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {purchases.length === 0 ? (
          <View className="rounded-2xl bg-white p-6 shadow-sm">
            <Text className="text-lg font-semibold text-slate-900">
              Aún no tienes compras guardadas
            </Text>
            <Text className="mt-2 text-slate-600">
              Cuando realices una compra, aparecerá aquí en tu historial local.
            </Text>
          </View>
        ) : (
          purchases.map((purchase) => (
            <View key={purchase._id} className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
              <View className="mb-2 flex-row justify-between">
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-slate-500">ID de compra</Text>
                  <Text className="text-sm font-semibold text-slate-900">{purchase._id}</Text>

                  <Text className="mt-2 text-xs text-slate-600">
                    Confirmada el {new Date(purchase.confirmed_at).toLocaleDateString('es-CL')}
                  </Text>

                  <Text className="text-xs text-slate-600">
                    Comprador: {purchase.buyer.name} ({purchase.buyer.email})
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-xs text-slate-500">Total</Text>
                  <Text className="text-lg font-bold text-slate-900">
                    ${purchase.total_price.toLocaleString('es-CL')}
                  </Text>
                </View>
              </View>
              <View className="mt-2 border-t border-slate-200 pt-2">
                <Text className="mb-1 text-xs font-semibold text-slate-900">Tickets</Text>
                {purchase.tickets.map((t, i) => (
                  <Text key={i} className="text-xs text-slate-700">
                    {t.code} — {t.type}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

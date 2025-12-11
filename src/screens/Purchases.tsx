import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../components/HomeHeader';
import { getPurchase } from '../api/services/checkout';
import type { Purchase } from '../api/types';

export default function PurchasesScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    async function fetchLastPurchase() {
      try {
        // 1️⃣ leer el último id guardado
        const purchaseId = await AsyncStorage.getItem('lastPurchaseId');

        if (!purchaseId) {
          setPurchase(null);
          return;
        }

        // 2️⃣ pedir la compra al backend
        const data = await getPurchase(purchaseId);
        setPurchase(data);
      } catch (e) {
        console.log('Error cargando compra', e);
        setPurchase(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLastPurchase();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Cargando compra...</Text>
      </SafeAreaView>
    );
  }

  // No hay compras guardadas aún
  if (!purchase) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100">
        <HomeHeader title="Mis compras" isHome />

        <View className="m-4 rounded-2xl bg-white p-6 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">
            Aún no tienes compras registradas
          </Text>
          <Text className="mt-2 text-slate-600">
            Cuando realices una compra, podrás ver aquí el detalle de la más reciente.
          </Text>

          <TouchableOpacity
            className="mt-4 rounded-xl bg-blue-600 px-5 py-3"
            onPress={() => navigation.navigate('Tabs', { screen: 'HomeTab' })}
          >
            <Text className="font-semibold text-white">Buscar eventos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sí hay una compra → detalle
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <HomeHeader title="Mi última compra" isHome />

      <ScrollView className="px-4 pb-4 pt-4">
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="mb-3">
            <Text className="text-xs text-slate-500">ID de compra</Text>
            <Text className="text-base font-semibold text-slate-900">
              {purchase._id}
            </Text>

            <Text className="mt-2 text-sm text-slate-600">
              Confirmada el{' '}
              {new Date(purchase.confirmed_at).toLocaleDateString('es-CL')}
            </Text>

            <Text className="mt-1 text-sm text-slate-600">
              Comprador: {purchase.buyer.name} ({purchase.buyer.email})
            </Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm text-slate-500">Total</Text>
            <Text className="text-xl font-bold text-slate-900">
              ${purchase.total_price.toLocaleString('es-CL')}
            </Text>
          </View>

          <View className="mt-4 border-t border-slate-200 pt-3">
            <Text className="mb-2 font-semibold text-slate-900">Tickets</Text>

            {purchase.tickets.map((t, i) => (
              <Text key={i} className="text-slate-700">
                {t.code} — {t.type}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

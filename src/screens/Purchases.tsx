import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import { Purchase } from '../api/types';
import { useTheme } from '../context/ThemeContext';

export default function Purchases() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const raw = await AsyncStorage.getItem('localPurchases');
        const list: Purchase[] = raw ? JSON.parse(raw) : [];
        setPurchases(list);
      } catch (e) {
        console.log(e);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'}`}>
        <ActivityIndicator size="large" color={theme === 'light' ? 'black' : 'white'} />
        <Text className={`${theme === 'light' ? 'text-slate-700' : 'text-white'} mt-2 text-base`}>
          Cargando compras...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View className={`${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'} flex-1`}>
      <CustomHeader title="Mis compras" />
      <ScrollView className="px-4 pb-14 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {purchases.length === 0 ? (
          <View
            className={`rounded-2xl p-6 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <Text
              className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} text-xl font-semibold`}>
              Aún no tienes compras guardadas
            </Text>
            <Text
              className={`${theme === 'light' ? 'text-slate-600' : 'text-gray-300'} mt-2 text-base`}>
              Cuando realices una compra, aparecerá aquí en tu historial local.
            </Text>
          </View>
        ) : (
          purchases.map((purchase) => (
            <View
              key={purchase._id}
              className={`mb-3 rounded-2xl p-4 shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
              <View className="mb-2 flex-row justify-between">
                <View className="mr-3 flex-1">
                  <Text
                    className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-300'} text-sm`}>
                    ID de compra
                  </Text>
                  <Text
                    className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} text-base font-semibold`}>
                    {purchase._id}
                  </Text>
                  <Text
                    className={`${theme === 'light' ? 'text-slate-600' : 'text-gray-300'} mt-2 text-sm`}>
                    Confirmada el {new Date(purchase.confirmed_at).toLocaleDateString('es-CL')}
                  </Text>
                  <Text
                    className={`${theme === 'light' ? 'text-slate-600' : 'text-gray-300'} text-sm`}>
                    Comprador: {purchase.buyer.name} ({purchase.buyer.email})
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className={`${theme === 'light' ? 'text-slate-500' : 'text-gray-300'} text-sm`}>
                    Total
                  </Text>
                  <Text
                    className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} text-xl font-bold`}>
                    ${purchase.total_price.toLocaleString('es-CL')}
                  </Text>
                </View>
              </View>

              <View
                className={`${theme === 'light' ? 'border-slate-200' : 'border-gray-700'} mt-2 border-t pt-2`}>
                <Text
                  className={`${theme === 'light' ? 'text-slate-900' : 'text-white'} mb-1 text-sm font-semibold`}>
                  Tickets
                </Text>
                {purchase.tickets.map((t, i) => (
                  <Text
                    key={i}
                    className={`${theme === 'light' ? 'text-slate-700' : 'text-gray-300'} text-sm`}>
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

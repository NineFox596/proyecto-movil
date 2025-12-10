import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import HomeHeader from '../components/HomeHeader';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Purchases() {
  const { id } = useLocalSearchParams(); // purchase_id
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchase() {
      if (!id) return;

      try {
        const res = await fetch(`${API_BASE_URL}/purchases/${id}`);
        const data = await res.json();
        setPurchase(data);
      } catch (err) {
        console.error('Error:', err);
        setPurchase(null);
      } finally {
        setLoading(false);
      }
    }

    loadPurchase();
  }, [id]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
        <Text className="mt-4 text-black">Cargando compra...</Text>
      </View>
    );

  if (!purchase)
    return (
      <View>
        <HomeHeader title="Historial de compras" />
      </View>
    );
}

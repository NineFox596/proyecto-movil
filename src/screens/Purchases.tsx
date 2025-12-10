import React from 'react';
import { View, Text } from 'react-native';
import HomeHeader from '../components/HomeHeader';

export default function Purchases() {
  return (
    <View>
      <HomeHeader title="Historial de compras" />
      <Text className="text-lg">Purchases Screen</Text>
    </View>
  );
}

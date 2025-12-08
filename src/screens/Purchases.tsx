import React from 'react';
import { View, Text } from 'react-native';
import HomeHeader from '../components/HomeHeader';

export default function Purchases() {
  return (
    <View>
      <HomeHeader title="Purchases" />

      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Purchases Screen</Text>
      </View>
    </View>
  );
}

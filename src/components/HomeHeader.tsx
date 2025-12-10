// components/HomeHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  title?: string;
  isHome?: boolean;
};

export default function HomeHeader({ title = '', isHome = false }: Props) {
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="w-full flex-row items-center border-b border-gray-200 bg-white px-4 py-4">
        {/* Icono solo si es Home */}
        {isHome && (
          <MaterialCommunityIcons
            name="ticket"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
        )}
        <Text className="text-xl font-semibold text-gray-900">{title}</Text>
      </View>
    </SafeAreaView>
  );
}

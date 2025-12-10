// components/HomeHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
};

export default function HomeHeader({ title = '' }: Props) {
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="w-full flex-row items-center border-b border-gray-200 bg-white px-4 py-4">
        <Text className="text-xl font-semibold text-gray-900">{title}</Text>
      </View>
    </SafeAreaView>
  );
}

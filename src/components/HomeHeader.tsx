import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  title?: string;
  isHome?: boolean;
  rightButton?: React.ReactNode;
};

export default function HomeHeader({ title = '', isHome = false, rightButton }: Props) {
  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="h-20 w-full flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <View className="flex-row items-center">
          {/* Icono solo si es Home */}
          {isHome && (
            <MaterialCommunityIcons name="ticket" size={24} color="black" className="mr-3" />
          )}
          <Text className="text-2xl font-bold text-gray-900">{title}</Text>
        </View>

        {/* Botón a la derecha */}
        <View>{rightButton && <View>{rightButton}</View>}</View>
      </View>
    </SafeAreaView>
  );
}

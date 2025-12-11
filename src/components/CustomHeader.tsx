import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type Props = {
  title?: string;
};

export default function CustomHeader({ title = '' }: Props) {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <View className="w-full flex-row items-center border-b border-gray-200 bg-white px-4 py-4">
        {/* Botón atrás */}
        {navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <View className="mr-3 w-6" /> // espacio para alinear
        )}

        {/* Título */}
        <Text className="text-xl font-semibold text-gray-900">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
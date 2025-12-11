import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  title?: string;
};

export default function CustomHeader({ title = '' }: Props) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={['top']} className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <View
        className={`h-20 w-full flex-row items-center border-b px-4 py-4 ${
          theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-900'
        }`}>
        {navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={theme === 'light' ? 'black' : 'white'} />
          </TouchableOpacity>
        ) : (
          <View className="mr-3 w-6" />
        )}

        <Text
          className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-2xl font-semibold`}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

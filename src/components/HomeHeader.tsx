import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

type Props = {
  title?: string;
  isHome?: boolean;
  rightButton?: React.ReactNode;
};

export default function HomeHeader({ title = '', isHome = false, rightButton }: Props) {
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={['top']} className={`${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <View
        className={`h-20 w-full flex-row items-center justify-between border-b px-4 py-4 ${
          theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-900'
        }`}>
        <View className="flex-row items-center">
          {isHome && (
            <MaterialCommunityIcons
              name="ticket"
              size={30}
              color={theme === 'light' ? 'black' : 'white'}
              className="mr-3"
            />
          )}
          <Text
            className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-2xl font-bold`}>
            {title}
          </Text>
        </View>

        <View>{rightButton && <View>{rightButton}</View>}</View>
      </View>
    </SafeAreaView>
  );
}

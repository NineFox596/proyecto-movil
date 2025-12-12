import { View, Text, Switch, ScrollView } from 'react-native';
import React from 'react';
import HomeHeader from '../components/HomeHeader';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className={`${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'} flex-1`}>
      <HomeHeader title="Configuración" isHome />

      <View>
        <View className="px-4 pb-14 pt-4">
          <View
            className={`
              mb-4 flex flex-row items-center
              justify-between rounded-2xl p-4 shadow-sm
              ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
            `}>
            <Text
              className={`text-lg font-semibold ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
              Tema {theme === 'light' ? 'Claro' : 'Oscuro'}
            </Text>

            <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
          </View>
        </View>
      </View>
    </View>
  );
}

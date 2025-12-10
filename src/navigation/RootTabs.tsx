import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

/* Screens */
import HomeScreen from '../screens/HomeScreen';
import Purchases from '../screens/Purchases';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Purchases') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E27F5',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'ULA Tickets',  headerTitleAlign: 'center' }} />
      <Tab.Screen name="Purchases" component={Purchases} options={{ title: 'Mis Compras',  }} />
    </Tab.Navigator>
  );
}

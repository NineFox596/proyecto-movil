import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

/* Screens */
import HomeScreen from '../screens/HomeScreen';
import Purchases from '../screens/Purchases';

type RootTabParamList = {
  Home: undefined;
  Purchases: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Purchases') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3e3ef9ff',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // <--- Desactiva el header del navegador
        }}
      />
      <Tab.Screen
        name="Purchases"
        component={Purchases}
        options={{
          headerShown: false, // <--- Desactiva el header del navegador
        }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* Screens, Tabs y CustomHeader */
import RootTabs from './RootTabs';
import EventDetail from '../screens/EventDetail';
import Checkout from '../screens/Checkout';
import Purchases from '../screens/Purchases';
import CustomHeader from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        header: ({ options }) => <CustomHeader title={options.title} />,
        headerTransparent: true,
      }}>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Event Details"
        component={EventDetail}
        options={{ title: 'Detalles del evento' }}
      />
      <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Cancelar reserva' }} />
      <Stack.Screen name="Purchases" component={Purchases} options={{ title: 'Mis compras' }} />
    </Stack.Navigator>
  );
}

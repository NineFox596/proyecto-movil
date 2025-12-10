import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* Screens & Tabs */
import RootTabs from './RootTabs';
import EventDetail from '../screens/EventDetail';
import Checkout from '../screens/Checkout';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Event Details" component={EventDetail} options={{ title: 'ULA Tickets', }} />
      <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'ULA Tickets' }} />
    </Stack.Navigator>
  );
}

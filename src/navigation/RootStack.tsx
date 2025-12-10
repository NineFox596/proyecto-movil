import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

/* Screens & Tabs */
import RootTabs from './RootTabs';
import EventDetail from '../screens/EventDetail';
import Checkout from '../screens/Checkout';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
<<<<<<< Updated upstream
      <Stack.Screen name="Event Details" component={EventDetail} />
=======
      <Stack.Screen name="Event Details" component={EventDetail} options={{ title: 'ULA Tickets', }} />
>>>>>>> Stashed changes
      <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'ULA Tickets' }} />
    </Stack.Navigator>
  );
}

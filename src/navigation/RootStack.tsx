import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* Screens, Tabs y CustomHeader */
import RootTabs from './RootTabs';
import EventDetail from '../screens/EventDetail';
import Checkout from '../screens/Checkout';
import CustomHeader from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        header: ({ options }) => <CustomHeader title={options.title} />,
      }}>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Event Details"
        component={EventDetail}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen name="Checkout" component={Checkout} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

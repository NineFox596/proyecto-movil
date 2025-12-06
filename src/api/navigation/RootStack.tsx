import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* Screens & Tabs */
import RootTabs from './RootTabs';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

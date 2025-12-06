import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

export default function EventDetail({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>EVENT DETAIL Screen</Text>
      {/* Conexión a Checkout */}
      <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
}

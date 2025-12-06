import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function EventDetail({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>EVENT DETAIL Screen</Text>
      {/* Conexión a Checkout */}
      <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
}

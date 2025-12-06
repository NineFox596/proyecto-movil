import React from 'react';
import { View, Text } from 'react-native';
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

export default function Purchases() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Purchases Screen</Text>
    </View>
  );
}

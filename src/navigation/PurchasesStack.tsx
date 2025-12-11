import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PurchaseDetail from '../screens/Purchases';

const Stack = createNativeStackNavigator();

export default function PurchasesStack() {
return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PurchaseDetail" component={PurchaseDetail} />
    </Stack.Navigator>
);
}

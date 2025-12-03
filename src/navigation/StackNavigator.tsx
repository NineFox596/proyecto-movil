import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";

// PANTALLAS FUERA DE LOS TABS
import EventDetailScreen from "../screens/events/EventDetail"; 

// DEFINICIÓN DE TIPOS PARA EL STACK
export type RootStackParamList = {
  Root: undefined;
  EventDetail: { id: number };
  // Si en el futuro agregas más pantallas, las defines aquí:
  // ReservationDetail: { id: number };
  // PurchaseDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      {/* TABS PRINCIPALES */}
      <Stack.Screen
        name="Root"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* PANTALLAS FUERA DE LOS TABS */}
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: "Evento" }}
      />
    </Stack.Navigator>
  );
}

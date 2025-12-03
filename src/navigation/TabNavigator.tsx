import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home/Home";
import EventsScreen from "../screens/events/EventDetail";
import ReservationsScreen from "../screens/reservations/Reservations";
import PurchasesScreen from "../screens/purchases/Purchases";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Eventos" component={EventsScreen} />
      <Tab.Screen name="Reservas" component={ReservationsScreen} />
      <Tab.Screen name="Compras" component={PurchasesScreen} />
    </Tab.Navigator>
  );
}

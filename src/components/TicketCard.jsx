import { View, Text } from "react-native";

export default function TicketCard({ ticket }) {
    return (
        <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="text-lg front-semibold">{ticket.tipe}</Text>
            <Text className="text-gray-600">Precio: {ticket.price}</Text>
            <Text className="text-gray-600">Disponibles: {ticket.available}</Text>
        </View>
    );
}
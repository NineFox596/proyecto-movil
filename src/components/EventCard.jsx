import { View, Text, Image, Pressable } from "react-native";

export default function EventCard({ event, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-xl p-4 m-2 shadow"
        >
            <Image
                source={{ uri: event.image }}
                className="h-40 w-full rounded-lg"
            />
            <Text className="text-xl font-bold mt-2">{event.name}</Text>
            <Text className="text-gray-600 mt-1">{event.date}</Text>
            <Text className="text-gray-800 mt-2">{event.location}</Text>
        </Pressable>
    );
}

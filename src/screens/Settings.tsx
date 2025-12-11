import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import HomeHeader from '../components/HomeHeader';

export default function Settings({ route, navigation }: any) {
  return (
    <View className="flex-1 bg-white">
      <HomeHeader title="Configuración" isHome />
      <Text>SETTINGS</Text>
    </View>
  );
}

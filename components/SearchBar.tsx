import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import axios from 'axios';

const API_URL = Constants.expoConfig?.extra?.API_URL as string;

// Tipo de los parámetros que se devuelven al buscar
interface SearchParams {
  category: string;
  query: string;
}

// Tipo de las props del componente
interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [categories, setCategories] = useState<string[]>(['todas']);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar categorías desde API
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);

        let allEvents: any[] = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
          const res = await axios.get(`${API_URL}/events?page=${page}`);
          const events = res.data?.data || [];

          allEvents = [...allEvents, ...events];

          if (events.length < 20) keepFetching = false;
          else page++;
        }

        const uniqueCats = [
          'todas',
          ...new Set(allEvents.map((e) => e.category?.trim()?.toLowerCase()).filter(Boolean)),
        ];

        setCategories(uniqueCats);
      } catch (err) {
        console.error('Error cargando categorías:', err);
        setCategories(['todas']);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!onSearch) return;

    // Evita que se ejecute al montar por primera vez
    if (selectedCategory === 'todas' && query === '') return;

    const timer = setTimeout(() => {
      onSearch({ category: selectedCategory, query });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, query]);

  const handleSearchButton = () => {
    if (onSearch) onSearch({ category: selectedCategory, query });
  };

  return (
    <View className="w-full p-4">
      {/* Picker de categorías */}
      <View className="mb-3 rounded-lg bg-gray-200">
        <Picker selectedValue={selectedCategory} onValueChange={(val) => setSelectedCategory(val)}>
          {categories.map((cat) => (
            <Picker.Item
              key={cat}
              label={
                cat === 'todas'
                  ? 'Todas las categorías'
                  : cat.charAt(0).toUpperCase() + cat.slice(1)
              }
              value={cat}
            />
          ))}
        </Picker>
      </View>

      {/* TextInput + botón */}
      <View className="flex-row items-center rounded-xl bg-white p-2 shadow">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar evento..."
          className="flex-1 text-base"
          returnKeyType="search"
          onSubmitEditing={() => {
            if (onSearch) onSearch({ category: selectedCategory, query });
          }}
        />

        <TouchableOpacity
          className="ml-2 rounded-lg bg-sky-500 px-4 py-2"
          onPress={handleSearchButton}>
          <Text className="font-bold text-white">Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="mt-3">
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
}

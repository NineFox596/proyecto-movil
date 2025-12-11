import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.API_URL as string;

interface SearchParams {
  category: string;
  query: string;
}

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<string[]>(['todas']);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
          ...new Set(allEvents.map((e) => e.category?.trim()).filter(Boolean)),
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
      <View className={`mb-3 rounded-lg ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(val) => setSelectedCategory(val)}
          dropdownIconColor={theme === 'light' ? 'black' : 'white'}
          style={{ color: theme === 'light' ? 'black' : 'white' }}>
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
      <View
        className={`flex-row items-center rounded-xl p-2 shadow ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar evento..."
          placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
          className={`flex-1 text-base ${theme === 'light' ? 'text-black' : 'text-white'}`}
          returnKeyType="search"
          onSubmitEditing={handleSearchButton}
        />

        <TouchableOpacity
          className="ml-2 rounded-lg px-4 py-2"
          style={{ backgroundColor: theme === 'light' ? '#3B82F6' : '#2563EB' }}
          onPress={handleSearchButton}>
          <Text className="font-bold text-white">Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="mt-3">
          <ActivityIndicator size="small" color={theme === 'light' ? 'black' : 'white'} />
        </View>
      )}
    </View>
  );
}

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_CURRENCY, getCurrencySymbol } from '@/services/currency-utils';
import { addCategory, deleteCategory, getAllCategories, initDatabase } from '@/services/database';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initialize database
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

export default function SettingsScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#FF6384');
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState<boolean>(true);
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#121212' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1e1e1e' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#bbbbbb' }, 'text');
  const inputBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0a84ff' }, 'tint');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      setLoading(true);
      const categoryList = getAllCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      addCategory({
        name: newCategory.trim(),
        color: newCategoryColor
      });

      // Reset form
      setNewCategory('');

      // Reload categories
      loadCategories();

      Alert.alert('Success', 'Category added successfully');
    } catch (error: any) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Error', 'Category already exists');
      } else {
        console.error('Error adding category:', error);
        Alert.alert('Error', 'Failed to add category. Please try again.');
      }
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    // Prevent deletion of default categories
    const defaultCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Others'];
    if (defaultCategories.includes(name)) {
      Alert.alert('Error', 'Cannot delete default categories');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteCategory(id);
              loadCategories();
              Alert.alert('Success', 'Category deleted successfully');
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Error', 'Failed to delete category. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <View style={[styles.colorPreview, { backgroundColor: item.color }]} />
        <ThemedText type="defaultSemiBold" style={{ color: textColor, flex: 1 }}>
          {item.name}
        </ThemedText>
        <TouchableOpacity onPress={() => handleDeleteCategory(item.id!, item.name)}>
          <ThemedText style={styles.deleteButton}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  // Color options for category creation
  const colorOptions = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8AC926', '#1982C4',
    '#6A4C93', '#F15BB5', '#00BBF9', '#00F5D4'
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: textColor }}>Loading settings...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Settings
          </ThemedText>
        </ThemedView>

        {/* Currency Settings */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Currency
          </ThemedText>
          <ThemedView style={styles.pickerContainer}>
            <ThemedText style={[styles.pickerLabel, { color: subtitleColor }]}>
              Default Currency:
            </ThemedText>
            <View style={[styles.pickerWrapper, { backgroundColor: inputBackgroundColor }]}>
              <Picker
                selectedValue={selectedCurrency}
                style={[styles.picker, { color: textColor }]}
                onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
              >
                <Picker.Item label={`BDT (${getCurrencySymbol('BDT')})`} value="BDT" color={textColor} />
                <Picker.Item label={`USD (${getCurrencySymbol('USD')})`} value="USD" color={textColor} />
                <Picker.Item label={`EUR (${getCurrencySymbol('EUR')})`} value="EUR" color={textColor} />
              </Picker>
            </View>
          </ThemedView>
        </ThemedView>

        {/* Category Management */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Manage Categories
          </ThemedText>

          {/* Add New Category */}
          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="New category name"
            placeholderTextColor={useThemeColor({ light: '#999', dark: '#888' }, 'text')}
            value={newCategory}
            onChangeText={setNewCategory}
          />

          <ThemedText style={[styles.colorLabel, { color: subtitleColor }]}>
            Select Color:
          </ThemedText>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newCategoryColor === color && styles.selectedColor
                ]}
                onPress={() => setNewCategoryColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: primaryColor }]}
            onPress={handleAddCategory}
          >
            <ThemedText style={styles.addButtonText}>Add Category</ThemedText>
          </TouchableOpacity>

          {/* Category List */}
          <ThemedText style={[styles.listTitle, { color: textColor }]}>
            Existing Categories
          </ThemedText>
          {categories.length === 0 ? (
            <ThemedText style={[styles.noCategoriesText, { color: subtitleColor }]}>
              No categories found
            </ThemedText>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderCategoryItem}
              style={styles.categoriesList}
              scrollEnabled={false}
            />
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 0,
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoriesList: {
    flex: 1,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  deleteButton: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  noCategoriesText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 10,
  },
});
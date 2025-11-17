import { ExpenseItem } from '@/components/expense-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { categorizeExpense } from '@/services/ai-service';
import { addExpense, deleteExpense, getAllCategories, getAllExpenses, initDatabase, updateExpense } from '@/services/database';
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

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#121212' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1e1e1e' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#bbbbbb' }, 'text');
  const inputBackgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0a84ff' }, 'tint');

  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, []);

  const loadExpenses = () => {
    try {
      setLoading(true);
      const expenseList = getAllExpenses();
      setExpenses(expenseList);
    } catch (error) {
      console.error('Error loading expenses:', error);
      Alert.alert('Error', 'Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = () => {
    try {
      const categoryList = getAllCategories();
      setCategories(categoryList);
      if (categoryList.length > 0 && !selectedCategory) {
        setSelectedCategory(categoryList[0].name);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    }
  };

  const handleAddExpense = () => {
    // If we have natural language input, use AI categorization
    if (inputText.trim()) {
      try {
        const categorized = categorizeExpense(inputText);
        setAmount(categorized.amount.toString());
        setDescription(categorized.description);
        setSelectedCategory(categorized.category);

        // Clear the input text
        setInputText('');

        // Add the expense
        saveExpense(categorized.amount, categorized.description, categorized.category);
      } catch (error) {
        console.error('Error categorizing expense:', error);
        Alert.alert('Error', 'Failed to process natural language input. Please try manual entry.');
        return;
      }
      return;
    }

    // Otherwise, use manual input
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill all fields or provide a natural language description');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    saveExpense(amountValue, description, selectedCategory);
  };

  const saveExpense = (amount: number, description: string, category: string) => {
    try {
      if (editingId) {
        // Update existing expense
        updateExpense({
          id: editingId,
          amount,
          category,
          description,
          date: new Date()
        });
        setEditingId(null);
      } else {
        // Add new expense
        addExpense({
          amount,
          category,
          description,
          date: new Date()
        });
      }

      // Reset form
      setAmount('');
      setDescription('');

      // Reload expenses
      loadExpenses();

      Alert.alert('Success', editingId ? 'Expense updated successfully' : 'Expense added successfully');
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Error', `Failed to ${editingId ? 'update' : 'add'} expense. Please try again.`);
    }
  };

  const handleDeleteExpense = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteExpense(id);
              loadExpenses();
              Alert.alert('Success', 'Expense deleted successfully');
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleEditExpense = (id: number) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      setEditingId(id);
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setSelectedCategory(expense.category);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setDescription('');
  };

  const renderExpenseItem = ({ item }: { item: any }) => (
    <ExpenseItem
      id={item.id}
      amount={item.amount}
      category={item.category}
      description={item.description}
      date={new Date(item.date)}
      onDelete={handleDeleteExpense}
      onEdit={handleEditExpense}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: textColor }}>Loading expenses...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.formContainer, { backgroundColor: cardBackgroundColor }]}>
          {/* Natural Language Input */}
          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="e.g., Spent 500 BDT on groceries yesterday"
            placeholderTextColor={useThemeColor({ light: '#999', dark: '#888' }, 'text')}
            value={inputText}
            onChangeText={setInputText}
          />

          <ThemedText style={[styles.orText, { color: subtitleColor }]}>OR</ThemedText>

          {/* Manual Input */}
          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="Amount"
            placeholderTextColor={useThemeColor({ light: '#999', dark: '#888' }, 'text')}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="Description"
            placeholderTextColor={useThemeColor({ light: '#999', dark: '#888' }, 'text')}
            value={description}
            onChangeText={setDescription}
          />

          <ThemedView style={styles.pickerContainer}>
            <ThemedText style={[styles.pickerLabel, { color: subtitleColor }]}>Category:</ThemedText>
            {categories.length > 0 ? (
              <View style={[styles.pickerWrapper, { backgroundColor: inputBackgroundColor }]}>
                <Picker
                  selectedValue={selectedCategory}
                  style={[styles.picker, { color: textColor }]}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                >
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.id}
                      label={category.name}
                      value={category.name}
                      color={textColor}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <ThemedText style={{ color: subtitleColor, padding: 10 }}>
                No categories available. Add categories in Settings.
              </ThemedText>
            )}
          </ThemedView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: primaryColor }]}
              onPress={handleAddExpense}
            >
              <ThemedText style={styles.addButtonText}>
                {editingId ? 'Update Expense' : 'Add Expense'}
              </ThemedText>
            </TouchableOpacity>

            {editingId ? (
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: '#ff3b30' }]}
                onPress={cancelEdit}
              >
                <ThemedText style={styles.addButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
            ) : null}
          </View>
        </ThemedView>

        <ThemedView style={[styles.expensesContainer, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Recent Expenses
          </ThemedText>

          {expenses.length === 0 ? (
            <ThemedText style={[styles.noExpensesText, { color: subtitleColor }]}>
              No expenses recorded yet
            </ThemedText>
          ) : (
            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderExpenseItem}
              style={styles.expensesList}
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
  formContainer: {
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
  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 20,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  addButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  expensesContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
  noExpensesText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
  expensesList: {
    flex: 1,
  },
});
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_CURRENCY, formatCurrency } from '@/services/currency-utils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ExpenseItemProps {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  id,
  amount,
  category,
  description,
  date,
  onDelete,
  onEdit
}) => {
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#bbbbbb' }, 'text');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={[styles.description, { color: textColor }]}>
          {description}
        </ThemedText>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(id)} style={styles.editButton}>
            <ThemedText style={[styles.editText, { color: '#007AFF' }]}>Edit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
            <ThemedText style={[styles.deleteText, { color: '#ff3b30' }]}>Delete</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.details}>
        <ThemedText style={[styles.amount, { color: textColor }]}>
          {formatCurrency(amount, DEFAULT_CURRENCY)}
        </ThemedText>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
          <ThemedText style={styles.categoryText}>{category}</ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.date, { color: subtitleColor }]}>
        {date.toLocaleDateString()}
      </ThemedText>
    </View>
  );
};

// Simple function to get a color for a category (in a real app, this would come from the database)
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food': '#FF6384',
    'Transport': '#36A2EB',
    'Bills': '#FFCE56',
    'Entertainment': '#4BC0C0',
    'Others': '#9966FF'
  };

  return colors[category] || '#CCCCCC';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 16,
  },
  editText: {
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
  },
  deleteText: {
    fontWeight: '600',
    fontSize: 14,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
  },
});
import { ExpenseChart } from '@/components/expense-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_CURRENCY, formatCurrency } from '@/services/currency-utils';
import { getCategoryTotals, getTotalExpenses, initDatabase } from '@/services/database';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initialize database
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

export default function HomeScreen() {
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#121212' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1e1e1e' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#bbbbbb' }, 'text');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      setLoading(true);
      const total = getTotalExpenses();
      setTotalExpenses(total);

      const categoryTotals = getCategoryTotals();
      setCategoryData(categoryTotals);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: textColor }}>Loading dashboard...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Expense Tracker
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.summaryCard, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: subtitleColor }]}>
            Total Expenses
          </ThemedText>
          <ThemedText type="title" style={[styles.totalAmount, { color: textColor }]}>
            {formatCurrency(totalExpenses, DEFAULT_CURRENCY)}
          </ThemedText>
          <ThemedText style={[styles.cardSubtitle, { color: subtitleColor }]}>
            This month
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.chartContainer, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Expenses by Category
          </ThemedText>
          <ExpenseChart
            data={categoryData}
            title=""
            type="pie"
          />
        </ThemedView>

        <ThemedView style={[styles.recentExpenses, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Recent Expenses
          </ThemedText>
          <ThemedText style={[styles.placeholderText, { color: subtitleColor }]}>
            No recent expenses yet
          </ThemedText>
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
  summaryCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginVertical: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  chartContainer: {
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
  recentExpenses: {
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
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
});
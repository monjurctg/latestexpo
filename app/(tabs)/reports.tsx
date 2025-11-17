import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEFAULT_CURRENCY, formatCurrency } from '@/services/currency-utils';
import { getAllExpenses, getCategoryTotals, initDatabase } from '@/services/database';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initialize database
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#121212' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1e1e1e' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#bbbbbb' }, 'text');
  const primaryColor = useThemeColor({ light: '#007AFF', dark: '#0a84ff' }, 'tint');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    try {
      setLoading(true);
      const expenseList = getAllExpenses();
      setExpenses(expenseList);

      const categoryTotals = getCategoryTotals();
      setCategoryData(categoryTotals);
    } catch (error) {
      console.error('Error loading report data:', error);
      Alert.alert('Error', 'Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and save a CSV file
    Alert.alert('Export to CSV', 'In a full implementation, this would generate a CSV file with your expense data.');
  };

  const handleExportPDF = () => {
    // In a real app, this would generate and save a PDF file
    Alert.alert('Export to PDF', 'In a full implementation, this would generate a PDF report with your expense data.');
  };

  const handleShareSummary = async () => {
    try {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const message = `Expense Summary:\nTotal Expenses: ${formatCurrency(totalExpenses, DEFAULT_CURRENCY)}\nCategories: ${categoryData.length}`;

      // In a real app, you would use Share.share() here
      Alert.alert('Share', message);
    } catch (error) {
      console.error('Error sharing summary:', error);
      Alert.alert('Error', 'Failed to share summary. Please try again.');
    }
  };

  // Prepare data for charts
  const chartData = {
    labels: categoryData.map(item => item.category.substring(0, 10)), // Limit label length
    datasets: [
      {
        data: categoryData.map(item => item.total),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Expenses by Category']
  };

  const chartConfig = {
    backgroundColor: cardBackgroundColor,
    backgroundGradientFrom: cardBackgroundColor,
    backgroundGradientTo: cardBackgroundColor,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => textColor,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: textColor }}>Loading reports...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Reports
          </ThemedText>
        </ThemedView>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ThemedView style={[styles.summaryCard, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText type="subtitle" style={[styles.cardTitle, { color: subtitleColor }]}>
              Total Expenses
            </ThemedText>
            <ThemedText type="title" style={[styles.totalAmount, { color: textColor }]}>
              {formatCurrency(totalExpenses, DEFAULT_CURRENCY)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.summaryCard, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText type="subtitle" style={[styles.cardTitle, { color: subtitleColor }]}>
              Categories
            </ThemedText>
            <ThemedText type="title" style={[styles.totalAmount, { color: textColor }]}>
              {categoryData.length}
            </ThemedText>
          </ThemedView>
        </View>

        {/* Chart */}
        {categoryData.length > 0 && (
          <ThemedView style={[styles.chartContainer, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              Expenses by Category
            </ThemedText>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </ThemedView>
        )}

        {/* Export Options */}
        <ThemedView style={[styles.exportContainer, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Export Data
          </ThemedText>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.exportButton, { backgroundColor: primaryColor }]} onPress={handleExportCSV}>
              <ThemedText style={styles.exportButtonText}>Export CSV</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.exportButton, { backgroundColor: primaryColor }]} onPress={handleExportPDF}>
              <ThemedText style={styles.exportButtonText}>Export PDF</ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.shareButton, { backgroundColor: '#34c759' }]} onPress={handleShareSummary}>
            <ThemedText style={styles.shareButtonText}>Share Summary</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Recent Expenses */}
        <ThemedView style={[styles.expensesContainer, { backgroundColor: cardBackgroundColor }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
            Recent Expenses
          </ThemedText>
          {expenses.length === 0 ? (
            <ThemedText style={[styles.noDataText, { color: subtitleColor }]}>
              No expenses recorded yet
            </ThemedText>
          ) : (
            <FlatList
              data={expenses.slice(0, 5)} // Show only recent 5 expenses
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <ThemedView style={styles.expenseItem}>
                  <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
                    {item.description}
                  </ThemedText>
                  <ThemedText style={{ color: textColor }}>
                    {formatCurrency(item.amount, DEFAULT_CURRENCY)}
                  </ThemedText>
                  <ThemedText style={[styles.date, { color: subtitleColor }]}>
                    {new Date(item.date).toLocaleDateString()}
                  </ThemedText>
                </ThemedView>
              )}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: '700',
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  exportContainer: {
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  exportButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
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
  expenseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
});
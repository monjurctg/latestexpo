import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface ExpenseChartProps {
  data: Array<{
    category: string;
    total: number;
    color: string;
  }>;
  type?: 'pie' | 'bar';
  title: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, type = 'pie', title }) => {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1e1e1e' }, 'background');
  const textColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText type="subtitle" style={[styles.title, { color: textColor }]}>{title}</ThemedText>
        <ThemedText style={[styles.noDataText, { color: textColor }]}>No data available</ThemedText>
      </View>
    );
  }

  // Format data for charts
  const chartData = data.map(item => ({
    name: item.category.substring(0, 15) + (item.category.length > 15 ? '...' : ''), // Truncate long names
    population: item.total,
    color: item.color,
    legendFontColor: textColor,
    legendFontSize: 14
  }));

  const barChartData = {
    labels: data.map(item => item.category.substring(0, 10)),
    datasets: [
      {
        data: data.map(item => item.total),
        colors: data.map(item => (opacity = 1) => item.color)
      }
    ]
  };

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => textColor,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.container}>
      {title ? <ThemedText type="subtitle" style={[styles.title, { color: textColor }]}>{title}</ThemedText> : null}
      {type === 'pie' ? (
        <PieChart
          data={chartData}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          center={[10, 0]}
          absolute
          hasLegend={true}
        />
      ) : (
        <BarChart
          data={barChartData}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="৳"
          yAxisSuffix=""
          verticalLabelRotation={0}
          fromZero={true}
          showBarTops={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
});
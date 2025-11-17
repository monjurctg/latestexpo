# Component Documentation

## Overview

This document provides documentation for the custom components created for the Expense Tracker app.

## Components

### ExpenseChart

A reusable component for displaying expense data in chart format.

#### Props

| Prop | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| data | Array<{category: string, total: number, color: string}> | Array of expense data to display | Yes | - |
| type | 'pie' \| 'bar' | Type of chart to display | No | 'pie' |
| title | string | Title to display above the chart | Yes | - |

#### Usage

```tsx
<ExpenseChart
  data={categoryData}
  title="Expenses by Category"
  type="pie"
/>
```

### ExpenseItem

A component for displaying individual expense items in a list with edit and delete functionality.

#### Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| id | number | Unique identifier for the expense | Yes |
| amount | number | Expense amount | Yes |
| category | string | Expense category | Yes |
| description | string | Expense description | Yes |
| date | Date | Date of the expense | Yes |
| onDelete | (id: number) => void | Function to call when delete is pressed | Yes |
| onEdit | (id: number) => void | Function to call when edit is pressed | Yes |

#### Usage

```tsx
<ExpenseItem
  id={expense.id}
  amount={expense.amount}
  category={expense.category}
  description={expense.description}
  date={new Date(expense.date)}
  onDelete={handleDeleteExpense}
  onEdit={handleEditExpense}
/>
```

## Services

### Database Service

Handles all SQLite database operations for the app.

#### Functions

| Function | Description |
|----------|-------------|
| initDatabase() | Initializes the database and creates tables if they don't exist |
| addExpense(expense) | Adds a new expense to the database |
| getAllExpenses() | Retrieves all expenses from the database |
| getExpensesByDateRange(startDate, endDate) | Retrieves expenses within a date range |
| updateExpense(expense) | Updates an existing expense |
| deleteExpense(id) | Deletes an expense by ID |
| getAllCategories() | Retrieves all categories from the database |
| addCategory(category) | Adds a new category to the database |
| deleteCategory(id) | Deletes a category by ID |
| getTotalExpenses() | Calculates the total of all expenses |
| getCategoryTotals() | Calculates totals for each category |

### AI Service

Provides natural language processing for expense categorization.

#### Functions

| Function | Description |
|----------|-------------|
| categorizeExpense(input) | Processes natural language input and extracts expense details |
| getCategories() | Returns available expense categories |

### Currency Utilities

Provides currency formatting and parsing functions.

#### Functions

| Function | Description |
|----------|-------------|
| formatCurrency(amount, currency) | Formats a number as currency |
| parseCurrency(currencyString) | Parses a currency string to a number |
| getCurrencySymbol(currency) | Returns the symbol for a given currency code |

## Hooks

### useThemeColor

A custom hook for getting theme-appropriate colors.

#### Usage

```tsx
const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');
```

## Constants

### Theme

Contains color definitions and font settings for light and dark modes.

## File Structure

```
components/
  expense-chart.tsx     # ExpenseChart component
  expense-item.tsx      # ExpenseItem component
  external-link.tsx     # External link component (from template)
  haptic-tab.tsx        # Haptic feedback for tabs (from template)
  hello-wave.tsx        # Animated wave component (from template)
  parallax-scroll-view.tsx # Parallax scroll view (from template)
  themed-text.tsx       # Themed text component (from template)
  themed-view.tsx       # Themed view component (from template)
  ui/
    collapsible.tsx     # Collapsible component (from template)
    icon-symbol.ios.tsx # iOS icon symbols (from template)
    icon-symbol.tsx     # Icon symbols (from template)

constants/
  theme.ts              # Theme definitions

hooks/
  use-color-scheme.ts   # Color scheme hook (from template)
  use-color-scheme.web.ts # Web color scheme hook (from template)
  use-theme-color.ts    # Theme color hook

services/
  database.ts           # Database service
  ai-service.ts         # AI service
  currency-utils.ts     # Currency utilities
```
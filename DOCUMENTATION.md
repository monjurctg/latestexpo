# Expense Tracker App - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [Component Documentation](#component-documentation)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [AI Features](#ai-features)
10. [Contributing](#contributing)
11. [License](#license)

## Project Overview

This is a professional, fully offline mobile expense tracker app built with Expo and React Native. The app allows users to track their expenses, categorize them automatically using AI-powered natural language processing, and view detailed reports and charts.

The app is designed to work completely offline with no internet connection required, using local SQLite storage for data persistence.

## Features

### Core Features
- **Dashboard**: View total expenses, remaining budget, and category breakdown with interactive charts
- **Expense Management**: Add, edit, and delete expenses with AI-powered automatic categorization
- **Natural Language Input**: Add expenses using natural language (e.g., "Spent 500 BDT on groceries yesterday")
- **Reports & Exports**: View monthly/yearly summaries and export data to CSV or PDF
- **Settings**: Manage expense categories and switch between dark/light mode
- **Offline-First**: Fully functional without an internet connection using local SQLite storage
- **Default Currency**: BDT (Bangladeshi Taka) with support for other currencies

### AI Features
- Rule-based natural language processing for expense categorization
- Amount extraction from natural language input
- Date parsing for relative dates (today, yesterday, etc.)
- Category detection based on keywords

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router with tab-based navigation
- **Database**: SQLite via expo-sqlite
- **Charts**: react-native-chart-kit
- **UI Components**: Custom components with theme support
- **State Management**: React hooks and context

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI

### Setup
1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npx expo start` to start the development server

### Running on Devices
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## Usage Guide

### Dashboard
The dashboard provides an overview of your financial status:
- **Total Expenses**: Shows the sum of all recorded expenses
- **Category Breakdown**: Visual pie chart showing expenses by category
- **Recent Expenses**: List of your most recent expenses

### Adding Expenses
You can add expenses in two ways:

1. **Natural Language Input**: Enter a description like "Spent 500 BDT on groceries yesterday"
2. **Manual Entry**: Fill in amount, description, and category fields individually

### Managing Expenses
- **Edit**: Tap the "Edit" button on any expense to modify its details
- **Delete**: Tap the "Delete" button to remove an expense

### Managing Categories
In the Settings screen:
- **Add**: Enter a name and select a color for new categories
- **Delete**: Remove custom categories (default categories cannot be deleted)

### Reports
- View expense summaries with visual charts
- Export data to CSV or PDF
- Share expense summaries

## Component Documentation

### ExpenseChart
A reusable component for displaying expense data in chart format.

Props:
- `data`: Array of expense data to display
- `type`: 'pie' | 'bar' (default: 'pie')
- `title`: Title to display above the chart

### ExpenseItem
A component for displaying individual expense items in a list.

Props:
- `id`: Unique identifier for the expense
- `amount`: Expense amount
- `category`: Expense category
- `description`: Expense description
- `date`: Date of the expense
- `onDelete`: Function to call when delete is pressed
- `onEdit`: Function to call when edit is pressed

## Project Structure

```
app/
  (tabs)/
    dashboard.tsx     # Main dashboard with charts
    expenses.tsx      # Expense management
    reports.tsx       # Reports and analytics
    settings.tsx      # App settings
  _layout.tsx         # Tab navigation layout

components/
  expense-chart.tsx   # Reusable chart component
  expense-item.tsx    # Expense list item component
  external-link.tsx   # External link component
  haptic-tab.tsx      # Haptic feedback for tabs
  hello-wave.tsx      # Animated wave component
  parallax-scroll-view.tsx # Parallax scroll view
  themed-text.tsx     # Themed text component
  themed-view.tsx     # Themed view component
  ui/
    collapsible.tsx   # Collapsible component
    icon-symbol.ios.tsx # iOS icon symbols
    icon-symbol.tsx   # Icon symbols

constants/
  theme.ts            # Color and theme definitions

hooks/
  use-color-scheme.ts   # Color scheme hook
  use-color-scheme.web.ts # Web color scheme hook
  use-theme-color.ts    # Theme color hook

services/
  database.ts         # SQLite database operations
  ai-service.ts       # Natural language processing
  currency-utils.ts   # Currency formatting

documentation/
  README.md           # Project overview
  RUNNING.md          # Running instructions
  USAGE.md            # Usage guide
  COMPONENTS.md       # Component documentation
  SUMMARY.md          # Project summary
```

## Database Schema

The app uses SQLite with two main tables:

### Expenses Table
```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL
);
```

## AI Features

The app includes a rule-based natural language processing system that:
- Extracts amounts from text using regex patterns
- Identifies categories based on keyword matching
- Parses relative dates (today, yesterday, etc.)
- Works completely offline with no external API dependencies

### Category Keywords
- **Food**: groceries, restaurant, food, meal, dinner, lunch, breakfast, coffee, tea
- **Transport**: taxi, bus, train, fuel, gas, parking, uber, ola, car, bike
- **Bills**: electricity, water, internet, phone, rent, mortgage, insurance
- **Entertainment**: movie, concert, game, subscription, netflix, spotify, book
- **Others**: Catch-all category

## Contributing

To contribute to the project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Follow the coding standards and include tests for new features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) for charting components
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for local database storage
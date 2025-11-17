# Expense Tracker App

A professional, fully offline mobile expense tracker app built with Expo and React Native.

## Features

- **Dashboard**: View total expenses, remaining budget, and category breakdown with interactive charts
- **Expense Management**: Add, edit, and delete expenses with AI-powered automatic categorization
- **Natural Language Input**: Add expenses using natural language (e.g., "Spent 500 BDT on groceries yesterday")
- **Reports & Exports**: View monthly/yearly summaries and export data to CSV or PDF
- **Settings**: Manage expense categories and switch between dark/light mode
- **Offline-First**: Fully functional without an internet connection using local SQLite storage
- **Default Currency**: BDT (Bangladeshi Taka) with support for other currencies

## Tech Stack

- **Frontend**: React Native with Expo
- **Local Database**: SQLite via expo-sqlite
- **Charts**: react-native-chart-kit
- **AI Features**: Rule-based natural language processing for expense categorization
- **Navigation**: Expo Router with tab-based navigation

## Screenshots

Dashboard | Expenses | Reports | Settings
---------|----------|---------|---------
![Dashboard](./assets/screenshots/dashboard.png) | ![Expenses](./assets/screenshots/expenses.png) | ![Reports](./assets/screenshots/reports.png) | ![Settings](./assets/screenshots/settings.png)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd expense-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal after starting the development server
- **Android Emulator**: Press `a` in the terminal after starting the development server
- **Physical Device**: Install the Expo Go app and scan the QR code

## Project Structure

```
app/
  (tabs)/
    dashboard.tsx     # Dashboard with charts and summaries
    expenses.tsx      # Expense management screen
    reports.tsx       # Reports and export functionality
    settings.tsx      # App settings and category management
  _layout.tsx         # Tab navigation layout
constants/
  theme.ts            # Color definitions and themes
hooks/
  use-color-scheme.ts # Theme handling
  use-theme-color.ts  # Color utilities
services/
  database.ts         # SQLite database operations
  ai-service.ts       # AI-powered expense categorization
  currency-utils.ts   # Currency formatting and parsing
```

## Database Schema

The app uses SQLite for local storage with the following tables:

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

The app includes a rule-based natural language processing system for automatic expense categorization:

1. **Amount Extraction**: Automatically extracts amounts from natural language input
2. **Category Detection**: Uses keyword matching to categorize expenses
3. **Date Parsing**: Recognizes relative dates like "yesterday", "today", etc.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) for charting components
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for local database storage
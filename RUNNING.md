# Running the Expense Tracker App

## Prerequisites

Make sure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI (installed globally with `npm install -g expo-cli`)

## Installation

1. Clone or download the repository
2. Navigate to the project directory:
   ```
   cd expense-tracker
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the App

### Development Mode

To start the development server:
```
npx expo start
```

If port 8081 is already in use, Expo will prompt you to use another port. Press 'Y' to accept.

### Running on Different Platforms

After starting the development server, you can run the app on:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Web Browser**: Press `w` in the terminal
- **Physical Device**:
  1. Install the Expo Go app on your device
  2. Scan the QR code displayed in the terminal or browser

### Building for Production

To build standalone apps:

#### For Android:
```
npx expo build:android
```

#### For iOS:
```
npx expo build:ios
```

Note: You'll need an Expo account and to configure app.json with your own credentials for building standalone apps.

## Troubleshooting

### Common Issues

1. **Port already in use**: If you see a message about port 8081 being used, simply accept the option to use another port.

2. **Missing dependencies**: If you encounter errors about missing modules, try:
   ```
   npm install
   ```

3. **Metro bundler issues**: If the bundler fails to start, try:
   ```
   npx expo start --clear
   ```

### Clearing Cache

If you experience unexpected behavior, you can clear the cache:

```
npx expo start --clear
```

This will reset the Metro bundler cache and may resolve issues with the app not updating properly.

## Project Structure

The app uses file-based routing with Expo Router:

- `app/` - Contains all screens and routes
- `app/(tabs)/` - Tab-based screens (dashboard, expenses, reports, settings)
- `services/` - Business logic and data handling
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `constants/` - Theme and configuration constants

## Database

The app uses SQLite for local storage. Data is persisted locally on the device and does not require an internet connection.

## AI Features

The app includes a rule-based natural language processing system for automatic expense categorization. This works offline and does not require any external API calls.
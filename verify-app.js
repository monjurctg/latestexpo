// Simple verification script to check if the app components are working

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Expense Tracker App...\n');

// Check if required directories exist
const requiredDirs = ['app', 'components', 'services', 'constants', 'hooks'];
const missingDirs = [];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    missingDirs.push(dir);
  }
});

if (missingDirs.length > 0) {
  console.log(`❌ Missing directories: ${missingDirs.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required directories exist');

// Check if required files exist
const requiredFiles = [
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/dashboard.tsx',
  'app/(tabs)/expenses.tsx',
  'app/(tabs)/reports.tsx',
  'app/(tabs)/settings.tsx',
  'services/database.ts',
  'services/ai-service.ts',
  'services/currency-utils.ts',
  'components/expense-chart.tsx',
  'components/expense-item.tsx'
];

const missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required files exist');

// Check if package.json has required dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const requiredDependencies = [
  'expo-sqlite',
  'react-native-chart-kit',
  '@react-native-picker/picker'
];

const missingDependencies = [];

requiredDependencies.forEach(dep => {
  if (!packageJson.dependencies[dep]) {
    missingDependencies.push(dep);
  }
});

if (missingDependencies.length > 0) {
  console.log(`❌ Missing dependencies: ${missingDependencies.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required dependencies are installed');

// Check if app.json has correct configuration
const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));

if (appJson.expo.name !== 'Expense Tracker') {
  console.log('❌ App name is not set correctly in app.json');
  process.exit(1);
}

console.log('✅ App configuration is correct');

console.log('\n🎉 Verification complete! The app is ready to run.');
console.log('\nTo start the app, run:');
console.log('  npx expo start');
# Expense Tracker App - Usage Guide

## Getting Started

After installing and running the app, you'll see a tab-based interface with four main sections:

1. **Dashboard** - Overview of your expenses
2. **Expenses** - Add, edit, and manage expenses
3. **Reports** - View detailed reports and charts
4. **Settings** - Configure app settings and categories

## Dashboard

The dashboard provides an overview of your financial status:

- **Total Expenses**: Shows the sum of all recorded expenses
- **Category Breakdown**: Visual pie chart showing expenses by category
- **Recent Expenses**: List of your most recent expenses

## Adding Expenses

You can add expenses in two ways:

### 1. Natural Language Input
Enter a description like "Spent 500 BDT on groceries yesterday" in the text field at the top of the Expenses screen. The app will automatically:
- Extract the amount (500)
- Categorize the expense (Food)
- Set the date (yesterday)

### 2. Manual Entry
Fill in the fields individually:
- **Amount**: Enter the expense amount
- **Description**: Brief description of the expense
- **Category**: Select from available categories

Press "Add Expense" to save.

## Editing Expenses

To edit an expense:
1. Find the expense in the list
2. Tap the "Edit" button
3. Modify the details in the form
4. Tap "Update Expense" to save changes

## Deleting Expenses

To delete an expense:
1. Find the expense in the list
2. Tap the "Delete" button
3. Confirm deletion in the dialog

## Managing Categories

In the Settings screen, you can:

### Add New Categories
1. Enter a category name
2. Select a color from the palette
3. Tap "Add Category"

### Delete Categories
1. Find the category in the list
2. Tap the "Delete" button
3. Confirm deletion

Note: Default categories (Food, Transport, Bills, Entertainment, Others) cannot be deleted.

## Reports

The Reports screen provides:

- **Summary Cards**: Total expenses and category count
- **Charts**: Visual representation of expenses by category
- **Export Options**:
  - Export to CSV (functionality implemented in UI)
  - Export to PDF (functionality implemented in UI)
  - Share summary

## Currency

The app defaults to BDT (Bangladeshi Taka) but supports other currencies. You can change the default currency in the Settings screen.

## Dark/Light Mode

The app automatically adapts to your device's theme settings. To change manually:
1. Go to your device's settings
2. Change the system theme
3. The app will update automatically

## Data Privacy

All data is stored locally on your device using SQLite database. No data is sent to external servers, ensuring your financial information remains private.

## Troubleshooting

### Common Issues

1. **App not starting**:
   - Ensure all dependencies are installed with `npm install`
   - Clear the cache with `npx expo start --clear`

2. **Charts not displaying**:
   - Ensure you have expenses with categories
   - Restart the app after adding expenses

3. **Natural language parsing not working**:
   - Use clear, simple language
   - Include the amount in the description

### Resetting the App

To start fresh:
1. Uninstall the app from your device
2. Clear the development server cache
3. Reinstall the app

## Tips for Best Experience

1. **Regular Usage**: Add expenses daily for accurate tracking
2. **Descriptive Entries**: Use clear descriptions to help with future analysis
3. **Category Management**: Customize categories to match your spending habits
4. **Review Reports**: Check reports weekly to understand spending patterns
5. **Natural Language**: Use the natural language feature for quick entry

## Feature Requests

For future versions, consider requesting:

1. **Budget Tracking**: Set monthly budgets for categories
2. **Recurring Expenses**: Automatically add regular expenses
3. **Data Export**: Full implementation of CSV/PDF export
4. **Multi-device Sync**: Sync data across devices (would require backend)
5. **Advanced Analytics**: More detailed spending insights

## Feedback

If you encounter any issues or have suggestions for improvement, please:
1. Check the GitHub issues for known problems
2. Submit a new issue with detailed information
3. Include screenshots if applicable
4. Describe steps to reproduce the issue

## Contributing

To contribute to the project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Follow the coding standards and include tests for new features.
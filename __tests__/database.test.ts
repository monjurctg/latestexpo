import { initDatabase, addExpense, getAllExpenses, deleteExpense, addCategory, getAllCategories, deleteCategory, getTotalExpenses, getCategoryTotals } from '../services/database';

// Initialize the database before running tests
initDatabase();

describe('Database Service', () => {
  // Clear the database before each test
  beforeEach(() => {
    // Delete all expenses
    const expenses = getAllExpenses();
    expenses.forEach(expense => {
      if (expense.id) {
        deleteExpense(expense.id);
      }
    });
    
    // Delete custom categories (keep default ones)
    const categories = getAllCategories();
    categories.forEach(category => {
      // Don't delete default categories
      const defaultCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Others'];
      if (category.id && !defaultCategories.includes(category.name)) {
        deleteCategory(category.id);
      }
    });
  });

  test('should add and retrieve expenses', () => {
    // Add an expense
    const expenseId = addExpense({
      amount: 100.50,
      category: 'Food',
      description: 'Groceries',
      date: new Date()
    });
    
    // Retrieve expenses
    const expenses = getAllExpenses();
    
    // Verify the expense was added
    expect(expenses).toHaveLength(1);
    expect(expenses[0].id).toBe(expenseId);
    expect(expenses[0].amount).toBe(100.50);
    expect(expenses[0].category).toBe('Food');
    expect(expenses[0].description).toBe('Groceries');
  });

  test('should calculate total expenses', () => {
    // Add multiple expenses
    addExpense({
      amount: 50.00,
      category: 'Food',
      description: 'Lunch',
      date: new Date()
    });
    
    addExpense({
      amount: 30.00,
      category: 'Transport',
      description: 'Bus fare',
      date: new Date()
    });
    
    // Calculate total
    const total = getTotalExpenses();
    
    // Verify total
    expect(total).toBe(80.00);
  });

  test('should get category totals', () => {
    // Add expenses in different categories
    addExpense({
      amount: 50.00,
      category: 'Food',
      description: 'Lunch',
      date: new Date()
    });
    
    addExpense({
      amount: 50.00,
      category: 'Food',
      description: 'Dinner',
      date: new Date()
    });
    
    addExpense({
      amount: 30.00,
      category: 'Transport',
      description: 'Bus fare',
      date: new Date()
    });
    
    // Get category totals
    const categoryTotals = getCategoryTotals();
    
    // Verify category totals
    const foodTotal = categoryTotals.find(c => c.category === 'Food');
    const transportTotal = categoryTotals.find(c => c.category === 'Transport');
    
    expect(foodTotal?.total).toBe(100.00);
    expect(transportTotal?.total).toBe(30.00);
  });

  test('should manage categories', () => {
    // Add a new category
    const categoryId = addCategory({
      name: 'Shopping',
      color: '#FF0000'
    });
    
    // Retrieve categories
    const categories = getAllCategories();
    
    // Verify the category was added
    const newCategory = categories.find(c => c.id === categoryId);
    expect(newCategory).toBeDefined();
    expect(newCategory?.name).toBe('Shopping');
    expect(newCategory?.color).toBe('#FF0000');
    
    // Delete the category
    if (categoryId) {
      deleteCategory(categoryId);
    }
    
    // Verify the category was deleted
    const categoriesAfterDelete = getAllCategories();
    const deletedCategory = categoriesAfterDelete.find(c => c.id === categoryId);
    expect(deletedCategory).toBeUndefined();
  });

  test('should delete expenses', () => {
    // Add an expense
    const expenseId = addExpense({
      amount: 100.50,
      category: 'Food',
      description: 'Groceries',
      date: new Date()
    });
    
    // Verify the expense was added
    let expenses = getAllExpenses();
    expect(expenses).toHaveLength(1);
    
    // Delete the expense
    if (expenseId) {
      deleteExpense(expenseId);
    }
    
    // Verify the expense was deleted
    expenses = getAllExpenses();
    expect(expenses).toHaveLength(0);
  });
});
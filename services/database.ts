import * as SQLite from 'expo-sqlite';

// Define types
export interface Expense {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
}

// Database instance
let db: SQLite.SQLiteDatabase | null = null;

// Initialize database with error handling
export const initDatabase = () => {
  try {
    if (db) return db;

    db = SQLite.openDatabaseSync('expenses.db');

    db.withTransactionSync(() => {
      // Create expenses table
      db!.runSync(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL
        )
      `);

      // Create categories table
      db!.runSync(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          color TEXT NOT NULL
        )
      `);

      // Insert default categories if they don't exist
      const defaultCategories = [
        { name: 'Food', color: '#FF6384' },
        { name: 'Transport', color: '#36A2EB' },
        { name: 'Bills', color: '#FFCE56' },
        { name: 'Entertainment', color: '#4BC0C0' },
        { name: 'Others', color: '#9966FF' }
      ];

      const existingCategories = db!.getAllSync('SELECT * FROM categories') as Category[];

      if (existingCategories.length === 0) {
        defaultCategories.forEach(category => {
          try {
            db!.runSync(
              'INSERT INTO categories (name, color) VALUES (?, ?)',
              category.name,
              category.color
            );
          } catch (error) {
            console.warn('Failed to insert default category:', category.name, error);
          }
        });
      }
    });

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
};

// Ensure database is initialized
const getDatabase = () => {
  if (!db) {
    db = initDatabase();
  }
  return db;
};

// Expense operations
export const addExpense = (expense: Omit<Expense, 'id'>): number => {
  try {
    const database = getDatabase();
    if (!database) throw new Error('Database not available');

    const result = database.runSync(
      'INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)',
      expense.amount,
      expense.category,
      expense.description,
      expense.date.toISOString()
    );
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw error;
  }
};

export const getAllExpenses = (): Expense[] => {
  try {
    const database = getDatabase();
    if (!database) return [];

    const expenses = database.getAllSync('SELECT * FROM expenses ORDER BY date DESC') as Expense[];
    return expenses.map(expense => ({
      ...expense,
      date: new Date(expense.date)
    }));
  } catch (error) {
    console.error('Failed to get expenses:', error);
    return [];
  }
};

export const getExpensesByDateRange = (startDate: Date, endDate: Date): Expense[] => {
  try {
    const database = getDatabase();
    if (!database) return [];

    const expenses = database.getAllSync(
      'SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY date DESC',
      startDate.toISOString(),
      endDate.toISOString()
    ) as Expense[];

    return expenses.map(expense => ({
      ...expense,
      date: new Date(expense.date)
    }));
  } catch (error) {
    console.error('Failed to get expenses by date range:', error);
    return [];
  }
};

export const updateExpense = (expense: Expense): void => {
  try {
    if (expense.id === undefined) {
      throw new Error('Expense ID is required for update');
    }

    const database = getDatabase();
    if (!database) throw new Error('Database not available');

    database.runSync(
      'UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?',
      expense.amount,
      expense.category,
      expense.description,
      expense.date.toISOString(),
      expense.id
    );
  } catch (error) {
    console.error('Failed to update expense:', error);
    throw error;
  }
};

export const deleteExpense = (id: number): void => {
  try {
    const database = getDatabase();
    if (!database) throw new Error('Database not available');

    database.runSync('DELETE FROM expenses WHERE id = ?', id);
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw error;
  }
};

// Category operations
export const getAllCategories = (): Category[] => {
  try {
    const database = getDatabase();
    if (!database) return [];

    return database.getAllSync('SELECT * FROM categories') as Category[];
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
};

export const addCategory = (category: Omit<Category, 'id'>): number => {
  try {
    const database = getDatabase();
    if (!database) throw new Error('Database not available');

    const result = database.runSync(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      category.name,
      category.color
    );
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
};

export const deleteCategory = (id: number): void => {
  try {
    const database = getDatabase();
    if (!database) throw new Error('Database not available');

    database.runSync('DELETE FROM categories WHERE id = ?', id);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
};

// Summary operations
export const getTotalExpenses = (): number => {
  try {
    const database = getDatabase();
    if (!database) return 0;

    const result = database.getFirstSync('SELECT SUM(amount) as total FROM expenses') as { total: number };
    return result.total || 0;
  } catch (error) {
    console.error('Failed to get total expenses:', error);
    return 0;
  }
};

export const getCategoryTotals = (): { category: string; total: number; color: string }[] => {
  try {
    const database = getDatabase();
    if (!database) return [];

    const results = database.getAllSync(`
      SELECT e.category, SUM(e.amount) as total, c.color
      FROM expenses e
      JOIN categories c ON e.category = c.name
      GROUP BY e.category, c.color
      ORDER BY total DESC
    `) as { category: string; total: number; color: string }[];

    return results;
  } catch (error) {
    console.error('Failed to get category totals:', error);
    return [];
  }
};
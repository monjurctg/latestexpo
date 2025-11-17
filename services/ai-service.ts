// Mock AI service for expense categorization
// In a real implementation, this would connect to an AI API or use a local model

export interface ExpenseInput {
  text: string;
  amount?: number;
  description?: string;
  category?: string;
}

export interface CategorizedExpense {
  amount: number;
  description: string;
  category: string;
  date?: Date;
}

// Default categories for expense tracking
const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Others'
];

// Keywords mapping to categories
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Food: ['groceries', 'restaurant', 'food', 'meal', 'dinner', 'lunch', 'breakfast', 'coffee', 'tea'],
  Transport: ['taxi', 'bus', 'train', 'fuel', 'gas', 'parking', 'uber', 'ola', 'car', 'bike'],
  Bills: ['electricity', 'water', 'internet', 'phone', 'rent', 'mortgage', 'insurance'],
  Entertainment: ['movie', 'concert', 'game', 'subscription', 'netflix', 'spotify', 'book'],
  Others: [] // Catch-all category
};

/**
 * Simple NLP-based categorization of expenses from natural language input
 * @param input - Natural language description of expense
 * @returns Categorized expense with amount, description and category
 */
export const categorizeExpense = (input: string): CategorizedExpense => {
  // Extract amount (BDT) from text using regex
  const amountRegex = /(?:\b(?:spent|paid|cost)\s+)?(?:₹|rs\.?|bdt)?\s*(\d+(?:\.\d+)?)\s*(?:bdt|taka|tk)?/i;
  const amountMatch = input.match(amountRegex);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  // Extract date keywords
  const today = new Date();
  let date: Date | undefined;

  if (input.includes('today') || input.includes('now')) {
    date = today;
  } else if (input.includes('yesterday')) {
    date = new Date(today);
    date.setDate(date.getDate() - 1);
  } else if (input.includes('tomorrow')) {
    date = new Date(today);
    date.setDate(date.getDate() + 1);
  }

  // Clean the input text for category detection
  const cleanInput = input.toLowerCase().replace(/[^\w\s]/g, '');

  // Determine category based on keywords
  let category = 'Others'; // Default category

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => cleanInput.includes(keyword))) {
      category = cat;
      break;
    }
  }

  // Extract description by removing amount and common phrases
  const description = input
    .replace(/(?:spent|paid|cost)\s+/i, '')
    .replace(/(?:₹|rs\.?|bdt)?\s*\d+(?:\.\d+)?\s*(?:bdt|taka|tk)?/i, '')
    .replace(/\s+(today|yesterday|tomorrow)\s*/i, '')
    .trim() || 'Uncategorized expense';

  return {
    amount,
    description,
    category,
    ...(date && { date })
  };
};

/**
 * Get all available categories
 * @returns List of available categories
 */
export const getCategories = (): string[] => {
  return CATEGORIES;
};
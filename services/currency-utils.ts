// Currency utilities for the expense tracker app

// Default currency for the app
export const DEFAULT_CURRENCY = 'BDT';
export const DEFAULT_CURRENCY_SYMBOL = '৳';

// Currency formatting options
const CURRENCY_FORMATS: Record<string, Intl.NumberFormatOptions> = {
  BDT: {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  USD: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  EUR: {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: BDT)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY): string => {
  const formatter = new Intl.NumberFormat('en-BD', CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.BDT);
  return formatter.format(amount);
};

/**
 * Parse a currency string to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number value
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and commas
  const cleaned = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currency: string = DEFAULT_CURRENCY): string => {
  switch (currency) {
    case 'BDT': return '৳';
    case 'USD': return '$';
    case 'EUR': return '€';
    default: return DEFAULT_CURRENCY_SYMBOL;
  }
};
// ===========================================
// CURRENCY FORMATTING UTILITIES
// Proper money formatting for the application
// ===========================================

/**
 * Format currency in Bangladeshi Taka (BDT)
 */
export const formatBDT = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency in Indian Rupees (INR) 
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency with custom symbol (for display purposes)
 */
export const formatCurrency = (amount: number, symbol: string = '৳'): string => {
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${symbol}${formattedNumber}`;
};

/**
 * Format currency in Bangladeshi style with Taka symbol
 */
export const formatTaka = (amount: number): string => {
  return formatCurrency(amount, '৳');
};

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatCompactCurrency = (amount: number, symbol: string = '৳'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  
  return `${symbol}${formatter.format(amount)}`;
};

/**
 * Parse currency string to number (removes currency symbols and commas)
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[₹৳,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Convert INR to BDT (approximate rate)
 */
export const convertINRtoBDT = (inrAmount: number, rate: number = 1.05): number => {
  return Math.round(inrAmount * rate);
};

/**
 * Main currency formatter for the app (defaults to Taka)
 */
export const formatMoney = (amount: number): string => {
  return formatTaka(amount);
};
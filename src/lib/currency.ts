
export const CURRENCIES = {
    INR: { code: 'INR', symbol: '₹', rate: 1, name: 'Indian Rupee' },
    USD: { code: 'USD', symbol: '$', rate: 0.012, name: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.0095, name: 'British Pound' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.011, name: 'Euro' },
};

export type CurrencyCode = keyof typeof CURRENCIES;

/*
 * Convert price from base INR to target currency
 */
export function convertPrice(amountInINR: number, targetCurrency: CurrencyCode): number {
    if (!amountInINR) return 0;
    const rate = CURRENCIES[targetCurrency]?.rate || 1;
    return amountInINR * rate;
}

/*
 * Format price with correct symbol
 */
export function formatPrice(amountInINR: number, targetCurrency: CurrencyCode = 'INR'): string {
    const converted = convertPrice(amountInINR, targetCurrency);

    // Use Intl.NumberFormat for proper localization
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: targetCurrency,
            minimumFractionDigits: targetCurrency === 'INR' ? 0 : 2,
            maximumFractionDigits: targetCurrency === 'INR' ? 0 : 2,
        }).format(converted);
    } catch (e) {
        return `${CURRENCIES[targetCurrency].symbol}${converted.toFixed(2)}`;
    }
}

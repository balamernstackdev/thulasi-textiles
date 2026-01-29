import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CurrencyCode } from '@/lib/currency';

interface CurrencyState {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    isHydrated: boolean;
    setHydrated: (state: boolean) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: 'INR',
            isHydrated: false,
            setCurrency: (code: CurrencyCode) => set({ currency: code }),
            setHydrated: (state: boolean) => set({ isHydrated: state }),
        }),
        {
            name: 'thulasi-currency-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);

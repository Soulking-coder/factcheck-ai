import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisResult } from '../types';

interface AppState {
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  disclaimerDismissed: boolean;
  setDisclaimerDismissed: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),
      disclaimerDismissed: false,
      setDisclaimerDismissed: (v) => set({ disclaimerDismissed: v }),
    }),
    {
      name: 'factcheck-app-store',
      partialize: (state) => ({
        disclaimerDismissed: state.disclaimerDismissed,
      }),
    }
  )
);

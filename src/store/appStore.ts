import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisResult } from '../types';

interface AppState {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  disclaimerDismissed: boolean;
  setDisclaimerDismissed: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      googleApiKey: '',
      setGoogleApiKey: (key) => set({ googleApiKey: key }),
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),
      disclaimerDismissed: false,
      setDisclaimerDismissed: (v) => set({ disclaimerDismissed: v }),
    }),
    {
      name: 'factcheck-app-store',
      partialize: (state) => ({
        apiKey: state.apiKey,
        googleApiKey: state.googleApiKey,
        disclaimerDismissed: state.disclaimerDismissed,
      }),
    }
  )
);

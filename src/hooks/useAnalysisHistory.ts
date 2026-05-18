import { useState, useEffect, useCallback } from 'react';
import { AnalysisResult, FilterOptions, HistoryStats } from '../types';
import {
  getHistory,
  saveAnalysis,
  deleteAnalysis,
  clearHistory,
  getHistoryStats,
} from '../lib/historyStorage';

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    total: 0,
    avgCredibility: 0,
    verdictCounts: { 'Likely True': 0, Mixed: 0, 'Likely False': 0, Unverifiable: 0 },
    thisMonth: 0,
    avgBias: 0,
    avgEmotional: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const loaded = getHistory();
    setHistory(loaded);
    setStats(getHistoryStats());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAnalysis = useCallback((result: AnalysisResult) => {
    saveAnalysis(result);
    refresh();
  }, [refresh]);

  const removeAnalysis = useCallback((id: string) => {
    deleteAnalysis(id);
    refresh();
  }, [refresh]);

  const removeAll = useCallback(() => {
    clearHistory();
    refresh();
  }, [refresh]);

  const getFiltered = useCallback((filters: FilterOptions): AnalysisResult[] => {
    let results = [...history];

    if (filters.verdict && filters.verdict !== 'all') {
      results = results.filter(r => r.verdict === filters.verdict);
    }

    if (filters.contentType && filters.contentType !== 'all') {
      results = results.filter(r => r.contentType === filters.contentType);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      results = results.filter(r =>
        r.inputText.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      );
    }

    switch (filters.sort) {
      case 'oldest':
        results.sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime());
        break;
      case 'highest-score':
        results.sort((a, b) => b.credibilityScore - a.credibilityScore);
        break;
      case 'lowest-score':
        results.sort((a, b) => a.credibilityScore - b.credibilityScore);
        break;
      default: // newest
        results.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
    }

    return results;
  }, [history]);

  return {
    history,
    stats,
    isLoaded,
    refresh,
    addAnalysis,
    removeAnalysis,
    removeAll,
    getFiltered,
  };
}

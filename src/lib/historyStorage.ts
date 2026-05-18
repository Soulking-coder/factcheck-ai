import { AnalysisResult, HistoryStats, Verdict } from '../types';

const STORAGE_KEY = 'factcheck_analysis_history';
const MAX_ITEMS = 50;

export function saveAnalysis(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const updated = [result, ...history.filter(h => h.id !== result.id)];
    const trimmed = updated.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save analysis to history');
  }
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const history = getHistory();
  return history.find(h => h.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getHistoryStats(): HistoryStats {
  const history = getHistory();
  if (history.length === 0) {
    return {
      total: 0,
      avgCredibility: 0,
      verdictCounts: { 'Likely True': 0, Mixed: 0, 'Likely False': 0, Unverifiable: 0 },
      thisMonth: 0,
      avgBias: 0,
      avgEmotional: 0,
    };
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = history.filter(h => new Date(h.analyzedAt) >= thisMonthStart).length;

  const avgCredibility = Math.round(
    history.reduce((sum, h) => sum + h.credibilityScore, 0) / history.length
  );

  const avgBias = Math.round(
    history.reduce((sum, h) => sum + h.biasScore, 0) / history.length
  );

  const avgEmotional = Math.round(
    history.reduce((sum, h) => sum + h.emotionalManipulationScore, 0) / history.length
  );

  const verdictCounts: Record<Verdict, number> = {
    'Likely True': 0,
    Mixed: 0,
    'Likely False': 0,
    Unverifiable: 0,
  };

  history.forEach(h => {
    if (h.verdict in verdictCounts) {
      verdictCounts[h.verdict]++;
    }
  });

  return {
    total: history.length,
    avgCredibility,
    verdictCounts,
    thisMonth,
    avgBias,
    avgEmotional,
  };
}

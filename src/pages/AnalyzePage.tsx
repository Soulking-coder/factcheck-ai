import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, X } from 'lucide-react';
import { AnalyzerInput } from '../components/analyzer/AnalyzerInput';
import { AnalyzingAnimation } from '../components/analyzer/AnalyzingAnimation';
import { AnalysisReport } from '../components/results/AnalysisReport';
import { ContentType } from '../types';
import { analyzeContent } from '../lib/gemini';
import { useAppStore } from '../store/appStore';
import { useAnalysisHistory } from '../hooks/useAnalysisHistory';

export function AnalyzePage() {
  const { currentResult, setCurrentResult } = useAppStore();
  const { addAnalysis, removeAnalysis } = useAnalysisHistory();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Timer for elapsed seconds
  useEffect(() => {
    if (isAnalyzing) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnalyzing]);

  // Scroll to results when they appear
  useEffect(() => {
    if (currentResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [currentResult]);

  const handleAnalyze = useCallback(async (text: string, contentType: ContentType) => {

    setError(null);
    setCurrentResult(null);
    setIsAnalyzing(true);

    abortControllerRef.current = new AbortController();

    try {
      const result = await analyzeContent(
        text,
        contentType,
        abortControllerRef.current!.signal
      );

      setCurrentResult(result);
      addAnalysis(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      if (message.includes('cancelled')) {
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [setCurrentResult, addAnalysis]);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsAnalyzing(false);
  }, []);

  const handleAnalyzeAnother = useCallback(() => {
    setCurrentResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentResult]);

  const handleDelete = useCallback(() => {
    if (currentResult) {
      removeAnalysis(currentResult.id);
      setCurrentResult(null);
    }
  }, [currentResult, removeAnalysis, setCurrentResult]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            AI Misinformation Detector
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Paste any article, claim, or social media post to get an instant credibility analysis.
          </p>
        </motion.div>

        {/* Input Card */}
        <AnimatePresence>
          {!currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
            >
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Analysis Failed</p>
                      <p className="text-sm text-red-600 mt-0.5">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnalyzerInput
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {currentResult && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Back to analyze button */}
              <div className="mb-4">
                <button
                  onClick={handleAnalyzeAnother}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                >
                  ← Analyze another article
                </button>
              </div>

              <AnalysisReport
                result={currentResult}
                onAnalyzeAnother={handleAnalyzeAnother}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyzing Overlay */}
      <AnalyzingAnimation
        isVisible={isAnalyzing}
        onCancel={handleCancel}
        elapsedSeconds={elapsedSeconds}
      />
    </div>
  );
}

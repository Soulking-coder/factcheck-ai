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
import { animate, utils } from 'animejs';

export function AnalyzePage() {
  const { currentResult, setCurrentResult } = useAppStore();
  const { addAnalysis, removeAnalysis } = useAnalysisHistory();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial header animation
    if (headerRef.current?.children) {
      animate(headerRef.current.children, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: utils.stagger(100),
        easing: 'easeOutExpo'
      });
    }
  }, []);

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
        // Trigger results animation
        animate('.result-card-element', {
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 800,
          delay: utils.stagger(150),
          easing: 'easeOutExpo'
        });
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
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <div className="inline-flex p-3 glass rounded-2xl mb-5 shadow-[0_0_20px_rgba(34,211,238,0.15)] border border-cyan-500/30" style={{ opacity: 0 }}>
            <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 glow-text" style={{ opacity: 0 }}>
            AI Misinformation Detector
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg" style={{ opacity: 0 }}>
            Paste any article, claim, or social media post to get an instant credibility analysis.
          </p>
        </div>

        {/* Input Card */}
        <AnimatePresence>
          {!currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6 sm:p-8 mb-6"
            >
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/40 rounded-xl mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-300">Analysis Failed</p>
                      <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 transition-colors">
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
              transition={{ duration: 0.5 }}
            >
              {/* Back to analyze button */}
              <div className="mb-6 flex justify-between items-center result-card-element" style={{ opacity: 0 }}>
                <button
                  onClick={handleAnalyzeAnother}
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors bg-cyan-950/30 px-4 py-2 rounded-lg border border-cyan-500/20"
                >
                  ← Analyze another article
                </button>
              </div>

              <div className="result-card-element" style={{ opacity: 0 }}>
                <AnalysisReport
                  result={currentResult}
                  onAnalyzeAnother={handleAnalyzeAnother}
                  onDelete={handleDelete}
                />
              </div>
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


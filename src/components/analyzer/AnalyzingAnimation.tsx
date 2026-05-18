import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, FileSearch, BarChart3, X } from 'lucide-react';

interface AnalyzingAnimationProps {
  isVisible: boolean;
  onCancel: () => void;
  elapsedSeconds: number;
}

const steps = [
  { icon: FileSearch, label: 'Reading content...', sublabel: 'Parsing text structure and language' },
  { icon: Search, label: 'Detecting emotional triggers...', sublabel: 'Analyzing language patterns and framing' },
  { icon: Brain, label: 'Checking for logical fallacies...', sublabel: 'Identifying misleading arguments' },
  { icon: BarChart3, label: 'Generating credibility report...', sublabel: 'Calculating final scores and verdict' },
];

export function AnalyzingAnimation({ isVisible, onCancel, elapsedSeconds }: AnalyzingAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);
  const showCancel = elapsedSeconds >= 10;
  const showSlow = elapsedSeconds >= 30;

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(0);
      return;
    }

    const stepDuration = 4000;
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  const progressPercent = Math.min((elapsedSeconds / 20) * 100, 95);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">
              AI is analyzing your content
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8">
              Usually takes 5–15 seconds
            </p>

            {/* Steps */}
            <div className="space-y-3 mb-8">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i === activeStep;
                const isDone = i < activeStep;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.4 }}
                    animate={{
                      opacity: isDone ? 0.6 : isActive ? 1 : 0.3,
                      x: isActive ? 4 : 0,
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-blue-50' : isDone ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-blue-100' : isDone ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      <StepIcon className={`w-4 h-4 ${
                        isActive ? 'text-blue-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-900' : isDone ? 'text-emerald-800' : 'text-slate-500'
                      }`}>
                        {step.label}
                        {isActive && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          >
                            {' '}...
                          </motion.span>
                        )}
                        {isDone && ' ✓'}
                      </p>
                      {isActive && (
                        <p className="text-xs text-blue-600 mt-0.5">{step.sublabel}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  initial={{ width: '5%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                {elapsedSeconds}s elapsed
              </p>
            </div>

            {/* Slow warning */}
            <AnimatePresence>
              {showSlow && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-amber-600 text-center mb-4 bg-amber-50 rounded-lg p-3"
                >
                  This is taking longer than usual... The AI might be busy. Please wait.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Cancel button */}
            <AnimatePresence>
              {showCancel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel Analysis
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

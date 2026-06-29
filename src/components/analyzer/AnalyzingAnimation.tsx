import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, FileSearch, BarChart3, X } from 'lucide-react';
import { animate, utils } from 'animejs';

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
  const brainRef = useRef<HTMLDivElement>(null);

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

    // Anime.js pulse effect on the brain container
    if (brainRef.current) {
      animate(brainRef.current, {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 10px rgba(34,211,238,0.2)',
          '0 0 30px rgba(34,211,238,0.6)',
          '0 0 10px rgba(34,211,238,0.2)'
        ],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine'
      });
    }

    return () => {
      clearInterval(interval);
      if (brainRef.current) {
        utils.remove(brainRef.current);
      }
    };
  }, [isVisible]);

  const progressPercent = Math.min((elapsedSeconds / 20) * 100, 95);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.15)] p-8 w-full max-w-md mx-4"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400"
                />
                <div ref={brainRef} className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50">
                  <Brain className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2 glow-text">
              AI is analyzing your content
            </h3>
            <p className="text-sm text-slate-400 text-center mb-8">
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
                      isActive ? 'bg-cyan-950/40 border border-cyan-500/30' : isDone ? 'bg-emerald-950/20 border border-emerald-500/20' : 'bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : isDone ? 'bg-emerald-500/20' : 'bg-slate-800'
                    }`}>
                      <StepIcon className={`w-4 h-4 ${
                        isActive ? 'text-cyan-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold tracking-wide ${
                        isActive ? 'text-cyan-300' : isDone ? 'text-emerald-300' : 'text-slate-500'
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
                        <p className="text-xs text-cyan-500/80 mt-0.5 font-medium">{step.sublabel}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  initial={{ width: '5%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-slate-500 text-center mt-2 font-mono">
                {elapsedSeconds}s elapsed
              </p>
            </div>

            {/* Slow warning */}
            <AnimatePresence>
              {showSlow && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-amber-400 text-center mb-4 bg-amber-950/30 rounded-lg p-3 border border-amber-500/20 font-medium"
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
                  className="flex justify-center mt-4"
                >
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-red-950/40 border border-transparent hover:border-red-500/20"
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

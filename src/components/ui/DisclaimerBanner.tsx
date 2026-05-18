import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export function DisclaimerBanner() {
  const { disclaimerDismissed, setDisclaimerDismissed } = useAppStore();

  return (
    <AnimatePresence>
      {!disclaimerDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm text-white shadow-2xl border-t border-slate-700"
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-semibold text-amber-400">Important Disclaimer: </span>
              <span className="text-slate-300">
                This tool uses AI and may not be 100% accurate. Analysis results are for informational purposes only. 
                Always verify important claims with professional human fact-checkers and multiple independent sources.
                Do not make critical decisions based solely on AI analysis.
              </span>
            </div>
            <button
              onClick={() => setDisclaimerDismissed(true)}
              className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
              I Understand
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RedFlagsSectionProps {
  keyFlags: string[];
  missingContext: string[];
}

function getSeverity(index: number, total: number): { label: string; variant: 'danger' | 'warning' | 'info' } {
  if (total >= 5 && index === 0) return { label: 'Serious', variant: 'danger' };
  if (index < 2) return { label: 'Serious', variant: 'danger' };
  if (index < 4) return { label: 'Moderate', variant: 'warning' };
  return { label: 'Minor', variant: 'info' };
}

export function RedFlagsSection({ keyFlags, missingContext }: RedFlagsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const SHOW_LIMIT = 5;

  const displayedFlags = showAll ? keyFlags : keyFlags.slice(0, SHOW_LIMIT);

  if (keyFlags.length === 0 && missingContext.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-300">No major red flags detected ✓</p>
            <p className="text-sm text-emerald-400 mt-0.5">This content does not appear to contain significant misinformation patterns.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      {/* Red Flags */}
      {keyFlags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-slate-200">Red Flags Detected</h3>
            <Badge variant="danger" size="sm">{keyFlags.length}</Badge>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {displayedFlags.map((flag, i) => {
                const severity = getSeverity(i, keyFlags.length);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3.5 bg-red-950/30 rounded-xl border border-red-500/20"
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      severity.variant === 'danger' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 leading-relaxed">{flag}</p>
                    </div>
                    <Badge variant={severity.variant} size="sm" className="shrink-0">
                      {severity.label}
                    </Badge>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {keyFlags.length > SHOW_LIMIT && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1.5 mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {showAll ? (
                <><ChevronUp className="w-4 h-4" /> Show fewer</>
              ) : (
                <><ChevronDown className="w-4 h-4" /> Show {keyFlags.length - SHOW_LIMIT} more</>
              )}
            </button>
          )}
        </div>
      )}

      {/* Missing Context */}
      {missingContext.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-200">Missing Context</h3>
            <Badge variant="info" size="sm">{missingContext.length}</Badge>
          </div>

          <div className="space-y-3">
            {missingContext.map((ctx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
                className="flex items-start gap-3 p-3.5 bg-sky-950/30 rounded-xl border border-sky-500/20"
              >
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 leading-relaxed">{ctx}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

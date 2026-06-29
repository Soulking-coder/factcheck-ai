import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Verdict } from '../../types';
import { Badge } from '../ui/Badge';

interface VerdictBannerProps {
  verdict: Verdict;
  credibilityScore: number;
  summary: string;
}

const verdictConfig: Record<Verdict, {
  icon: React.ComponentType<{ className?: string }>;
  bgGradient: string;
  textColor: string;
  badgeVariant: 'success' | 'warning' | 'danger' | 'gray';
  borderColor: string;
  explanation: string;
}> = {
  'Likely True': {
    icon: CheckCircle,
    bgGradient: 'from-emerald-950/40 to-emerald-900/30',
    textColor: 'text-emerald-300',
    badgeVariant: 'success',
    borderColor: 'border-emerald-500/30',
    explanation: 'The main claims in this content appear to be factually accurate based on available evidence. While no AI can be 100% certain, the content aligns with verifiable facts and credible sources. Still, we recommend checking the recommended sources to confirm.',
  },
  'Mixed': {
    icon: AlertTriangle,
    bgGradient: 'from-amber-950/40 to-amber-900/30',
    textColor: 'text-amber-300',
    badgeVariant: 'warning',
    borderColor: 'border-amber-500/30',
    explanation: 'This content contains a mix of accurate information and misleading or unverified claims. Some statements may be true while others are exaggerated, taken out of context, or unsubstantiated. Read critically and verify specific claims independently.',
  },
  'Likely False': {
    icon: XCircle,
    bgGradient: 'from-red-950/40 to-red-900/30',
    textColor: 'text-red-300',
    badgeVariant: 'danger',
    borderColor: 'border-red-500/30',
    explanation: 'The main claims in this content appear to be false, misleading, or not supported by credible evidence. This content may be misinformation, propaganda, or deliberately manipulative. Do not share without thorough verification from independent sources.',
  },
  'Unverifiable': {
    icon: HelpCircle,
    bgGradient: 'from-slate-900/60 to-slate-800/40',
    textColor: 'text-slate-300',
    badgeVariant: 'gray',
    borderColor: 'border-slate-700',
    explanation: 'The claims in this content cannot be independently verified with available information. This may be because the content makes predictions, discusses unconfirmed events, or relies on information that cannot be cross-referenced. Treat with appropriate skepticism.',
  },
};

function getScoreBadge(score: number) {
  if (score >= 70) return { variant: 'success' as const, label: 'High Credibility' };
  if (score >= 40) return { variant: 'warning' as const, label: 'Medium Credibility' };
  return { variant: 'danger' as const, label: 'Low Credibility' };
}

export function VerdictBanner({ verdict, credibilityScore, summary }: VerdictBannerProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const config = verdictConfig[verdict];
  const Icon = config.icon;
  const scoreBadge = getScoreBadge(credibilityScore);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} rounded-2xl p-6 relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${config.textColor}`}>
        <Icon className="w-full h-full" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-slate-900/60 ${config.textColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Verdict</p>
              <h2 className={`text-2xl font-bold ${config.textColor}`}>{verdict}</h2>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-3xl font-bold text-white">{credibilityScore}</div>
            <div className="text-xs text-slate-400">/ 100</div>
            <Badge variant={scoreBadge.variant} size="sm" className="mt-1">
              {scoreBadge.label}
            </Badge>
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${config.textColor} mb-4 opacity-90`}>
          {summary}
        </p>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 text-xs font-medium ${config.textColor} opacity-70 hover:opacity-100 transition-opacity`}
        >
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          What does "{verdict}" mean?
        </button>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-3 p-4 bg-slate-900/50 rounded-xl text-sm ${config.textColor} leading-relaxed`}
          >
            {config.explanation}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Clock, BarChart2, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/cn';

interface HistoryCardProps {
  result: AnalysisResult;
  onView: (result: AnalysisResult) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const verdictBorderColor: Record<string, string> = {
  'Likely True': 'border-l-emerald-400',
  'Mixed': 'border-l-amber-400',
  'Likely False': 'border-l-red-400',
  'Unverifiable': 'border-l-slate-400',
};

const verdictBadgeVariant: Record<string, 'success' | 'warning' | 'danger' | 'gray'> = {
  'Likely True': 'success',
  'Mixed': 'warning',
  'Likely False': 'danger',
  'Unverifiable': 'gray',
};

const credibilityColor = (score: number) => {
  if (score >= 70) return 'text-emerald-600 bg-emerald-50';
  if (score >= 40) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

const riskBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'gray' }> = {
  low: { label: 'Low Risk', variant: 'success' },
  medium: { label: 'Medium Risk', variant: 'warning' },
  high: { label: 'High Risk', variant: 'danger' },
  'very-high': { label: 'Very High', variant: 'danger' },
};

const contentTypeLabel: Record<string, string> = {
  article: 'Article',
  claim: 'Claim',
  'social-media-post': 'Social Post',
};

export function HistoryCard({ result, onView, onDelete, index = 0 }: HistoryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const truncated = result.inputText.length > 150
    ? result.inputText.slice(0, 150) + '...'
    : result.inputText;

  const timeAgo = formatDistanceToNow(new Date(result.analyzedAt), { addSuffix: true });
  const risk = riskBadge[result.misinformationRisk] || riskBadge.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-l-4 hover:shadow-md transition-shadow',
        verdictBorderColor[result.verdict]
      )}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={verdictBadgeVariant[result.verdict]}>
              {result.verdict}
            </Badge>
            <Badge variant="gray">{contentTypeLabel[result.contentType]}</Badge>
          </div>

          <div className={cn(
            'shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
            credibilityColor(result.credibilityScore)
          )}>
            {result.credibilityScore}
          </div>
        </div>

        {/* Text Preview */}
        <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">
          {truncated}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge variant={risk.variant} size="sm">
            <AlertTriangle className="w-3 h-3" />
            {risk.label}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <BarChart2 className="w-3 h-3" />
            Bias: {result.biasScore > 0 ? '+' : ''}{result.biasScore}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(result)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Full Report
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(result.id); setShowConfirm(false); }}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

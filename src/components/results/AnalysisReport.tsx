import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Printer, RefreshCw, Trash2, Check, Calendar, Cpu } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { VerdictBanner } from './VerdictBanner';
import { ScoreGauges } from './ScoreGauges';
import { BiasIndicator } from './BiasIndicator';
import { RedFlagsSection } from './RedFlagsSection';
import { FactCheckSources } from './FactCheckSources';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface AnalysisReportProps {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
  onDelete?: () => void;
}

export function AnalysisReport({ result, onAnalyzeAnother, onDelete }: AnalysisReportProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const shareLink = `${window.location.origin}${window.location.pathname}?result=${result.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = shareLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'verdict', delay: 0 },
    { id: 'gauges', delay: 0.1 },
    { id: 'bias', delay: 0.15 },
    { id: 'flags', delay: 0.2 },
    { id: 'sources', delay: 0.25 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Verdict Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sections[0].delay }}>
        <VerdictBanner
          verdict={result.verdict}
          credibilityScore={result.credibilityScore}
          summary={result.summary}
        />
      </motion.div>

      {/* Score Gauges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sections[1].delay }}>
        <ScoreGauges
          credibilityScore={result.credibilityScore}
          emotionalManipulationScore={result.emotionalManipulationScore}
          misinformationRisk={result.misinformationRisk}
        />
      </motion.div>

      {/* Bias Indicator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sections[2].delay }}>
        <BiasIndicator biasScore={result.biasScore} />
      </motion.div>

      {/* Red Flags */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sections[3].delay }}>
        <RedFlagsSection keyFlags={result.keyFlags} missingContext={result.missingContext} />
      </motion.div>

      {/* Fact Check Sources */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sections[4].delay }}>
        <FactCheckSources sources={result.factCheckSources} />
      </motion.div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            className={copied ? 'border-emerald-300 text-emerald-700' : ''}
          >
            {copied ? 'Link Copied!' : 'Share Report'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyzeAnother}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Analyze Another
          </Button>

          {onDelete && (
            <div className="ml-auto">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600">Are you sure?</span>
                  <Button size="sm" variant="danger" onClick={() => { onDelete(); setShowDeleteConfirm(false); }}>
                    Yes, Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                  className="text-red-500 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Metadata Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-4 px-1 text-xs text-slate-400"
      >
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {format(new Date(result.analyzedAt), 'MMM d, yyyy h:mm a')}
        </span>
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3" />
          {result.modelUsed || 'gpt-4o'}
        </span>
        <span>ID: {result.id.slice(-8)}</span>
        {result.tokensUsed && <span>{result.tokensUsed.toLocaleString()} tokens</span>}
        <a href="#" className="hover:text-slate-600 underline underline-offset-2">
          Report an issue
        </a>
      </motion.div>
    </motion.div>
  );
}

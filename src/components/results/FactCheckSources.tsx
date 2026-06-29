import { motion } from 'framer-motion';
import { Shield, ExternalLink, Info } from 'lucide-react';
import { FactCheckSource } from '../../types';
import { Badge } from '../ui/Badge';

interface FactCheckSourcesProps {
  sources: FactCheckSource[];
}

const reliabilityConfig = {
  high: { label: 'Highly Reliable', variant: 'success' as const, icon: '🛡️' },
  medium: { label: 'Generally Reliable', variant: 'warning' as const, icon: '⚠️' },
  low: { label: 'Use With Caution', variant: 'danger' as const, icon: '🔴' },
};

const sourceColors: Record<string, string> = {
  'Snopes': '#FF6B35',
  'PolitiFact': '#2D9CDB',
  'FactCheck.org': '#27AE60',
  'Reuters Fact Check': '#E74C3C',
  'AP Fact Check': '#C0392B',
  'Full Fact': '#8E44AD',
  'Africa Check': '#F39C12',
};

function SourceLogo({ name }: { name: string }) {
  const color = sourceColors[name] || '#64748b';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export function FactCheckSources({ sources }: FactCheckSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-slate-200">Verify With These Sources</h3>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        We recommend cross-referencing at least 2 independent sources.
      </p>

      <div className="space-y-3">
        {sources.map((source, i) => {
          const reliability = reliabilityConfig[source.reliability];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 hover:border-slate-700 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all group"
            >
              <SourceLogo name={source.name} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">{source.name}</span>
                  <Badge variant={reliability.variant} size="sm">
                    {reliability.icon} {reliability.label}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{source.reason}</p>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-500/20 transition-colors group-hover:shadow-sm"
              >
                Check
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          These are independent organizations. FactCheck AI is not affiliated with any of them. 
          Always use your own judgment when evaluating sources.
        </p>
      </div>
    </motion.div>
  );
}

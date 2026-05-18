import { motion } from 'framer-motion';
import { RiskLevel } from '../../types';

interface ScoreGaugesProps {
  credibilityScore: number;
  emotionalManipulationScore: number;
  misinformationRisk: RiskLevel;
}

const riskToNumber: Record<RiskLevel, number> = {
  low: 15,
  medium: 45,
  high: 75,
  'very-high': 95,
};

const riskLabels: Record<RiskLevel, { label: string; color: string; textColor: string }> = {
  low: { label: 'Low Risk', color: '#10b981', textColor: 'text-emerald-600' },
  medium: { label: 'Medium Risk', color: '#f59e0b', textColor: 'text-amber-600' },
  high: { label: 'High Risk', color: '#f97316', textColor: 'text-orange-600' },
  'very-high': { label: 'Very High Risk', color: '#ef4444', textColor: 'text-red-600' },
};

function getCredibilityColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function getEmotionalColor(score: number): string {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

interface GaugeProps {
  value: number;
  max: number;
  color: string;
  label: string;
  sublabel?: string;
  description: string;
  displayValue?: string;
  delay?: number;
}

function CircularGauge({ value, max, color, label, sublabel, description, displayValue, delay = 0 }: GaugeProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
    >
      <div className="relative mb-3">
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Background track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
          />
          {/* Animated progress */}
          <motion.circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay, ease: 'easeOut' }}
            transform="rotate(-90 65 65)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-3xl font-bold text-slate-900"
            style={{ color }}
          >
            {displayValue || value}
          </motion.span>
          {!displayValue && (
            <span className="text-xs text-slate-400">/{max}</span>
          )}
        </div>
      </div>
      <h3 className="font-semibold text-slate-800 text-center text-sm">{label}</h3>
      {sublabel && (
        <p className="text-xs font-medium mt-0.5" style={{ color }}>{sublabel}</p>
      )}
      <p className="text-xs text-slate-400 text-center mt-2 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function ScoreGauges({ credibilityScore, emotionalManipulationScore, misinformationRisk }: ScoreGaugesProps) {
  const riskNumber = riskToNumber[misinformationRisk];
  const riskInfo = riskLabels[misinformationRisk];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <CircularGauge
        value={credibilityScore}
        max={100}
        color={getCredibilityColor(credibilityScore)}
        label="Credibility Score"
        description="How credible is this content based on evidence, sources, and factual accuracy?"
        delay={0}
      />
      <CircularGauge
        value={emotionalManipulationScore}
        max={100}
        color={getEmotionalColor(emotionalManipulationScore)}
        label="Emotional Manipulation"
        description="How much does this content use emotional triggers instead of facts?"
        delay={0.1}
      />
      <CircularGauge
        value={riskNumber}
        max={100}
        color={riskInfo.color}
        label="Misinformation Risk"
        sublabel={riskInfo.label}
        displayValue={riskInfo.label.split(' ')[0]}
        description="Overall risk that this content contains misinformation or misleading claims."
        delay={0.2}
      />
    </div>
  );
}

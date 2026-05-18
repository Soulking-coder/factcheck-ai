import { motion } from 'framer-motion';

interface BiasIndicatorProps {
  biasScore: number;
}

function getBiasLabel(score: number): { label: string; description: string } {
  if (score <= -61) return { label: 'Far Left', description: 'Strong progressive/left-wing framing detected' };
  if (score <= -21) return { label: 'Left Leaning', description: 'Moderate left-leaning perspective detected' };
  if (score <= 20) return { label: 'Center / Neutral', description: 'Relatively balanced presentation detected' };
  if (score <= 60) return { label: 'Right Leaning', description: 'Moderate right-leaning perspective detected' };
  return { label: 'Far Right', description: 'Strong conservative/right-wing framing detected' };
}

export function BiasIndicator({ biasScore: rawScore }: BiasIndicatorProps) {
  const biasScore = Math.max(-100, Math.min(100, rawScore));
  const { label, description } = getBiasLabel(biasScore);

  // Convert -100..+100 to 0..100% position
  const positionPercent = ((biasScore + 100) / 200) * 100;

  const zones = [
    { label: 'Far Left', width: '15%', color: '#1d4ed8' },
    { label: 'Left', width: '20%', color: '#3b82f6' },
    { label: 'Center', width: '30%', color: '#8b5cf6' },
    { label: 'Right', width: '20%', color: '#ef4444' },
    { label: 'Far Right', width: '15%', color: '#991b1b' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Political Bias Indicator</h3>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-700">{label}</div>
          <div className="text-xs text-slate-400">Score: {biasScore > 0 ? '+' : ''}{biasScore}</div>
        </div>
      </div>

      {/* Spectrum bar */}
      <div className="relative mb-6">
        {/* Colored zones */}
        <div className="flex h-4 rounded-full overflow-hidden">
          {zones.map((zone, i) => (
            <div
              key={i}
              style={{ width: zone.width, backgroundColor: zone.color }}
            />
          ))}
        </div>

        {/* Marker needle */}
        <div
          className="absolute top-0 h-4 flex flex-col items-center"
          style={{ left: `${positionPercent}%`, transform: 'translateX(-50%)' }}
        >
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-1 h-4 bg-white rounded-full border-2 border-slate-700 shadow-lg"
          />
        </div>
      </div>

      {/* Zone labels */}
      <div className="flex justify-between mb-4 px-1">
        {zones.map((zone, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium hidden sm:block"
            style={{ color: zone.color, width: zone.width }}
          >
            {zone.label}
          </div>
        ))}
        {/* Mobile labels */}
        <div className="flex justify-between w-full sm:hidden">
          <span className="text-xs text-blue-600 font-medium">Left</span>
          <span className="text-xs text-purple-600 font-medium">Center</span>
          <span className="text-xs text-red-600 font-medium">Right</span>
        </div>
      </div>

      {/* Current bias */}
      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        ℹ️ Political bias indicates perspective, not accuracy. Biased content can still be factually correct. Neutral content can still contain errors.
      </p>
    </motion.div>
  );
}

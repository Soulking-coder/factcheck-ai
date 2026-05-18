import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoryStats } from '../../types';

interface VerdictPieChartProps {
  stats: HistoryStats;
}

const COLORS: Record<string, string> = {
  'Likely True': '#10b981',
  'Mixed': '#f59e0b',
  'Likely False': '#ef4444',
  'Unverifiable': '#94a3b8',
};

export function VerdictPieChart({ stats }: VerdictPieChartProps) {
  const data = Object.entries(stats.verdictCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
          formatter={(value: unknown, name: unknown) => [`${value} analyses`, name as string]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#64748b', fontSize: '12px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

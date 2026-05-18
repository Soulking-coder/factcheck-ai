import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnalysisResult } from '../../types';
import { format, subDays, startOfDay } from 'date-fns';

interface ScoreAreaChartProps {
  history: AnalysisResult[];
  days?: number;
}

export function ScoreAreaChart({ history, days = 14 }: ScoreAreaChartProps) {
  // Build data for last N days
  const now = new Date();
  const dayData: Record<string, { date: string; credibility: number[]; emotional: number[] }> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = startOfDay(subDays(now, i));
    const key = format(d, 'yyyy-MM-dd');
    dayData[key] = { date: format(d, 'MMM d'), credibility: [], emotional: [] };
  }

  history.forEach(item => {
    const key = format(startOfDay(new Date(item.analyzedAt)), 'yyyy-MM-dd');
    if (dayData[key]) {
      dayData[key].credibility.push(item.credibilityScore);
      dayData[key].emotional.push(item.emotionalManipulationScore);
    }
  });

  const chartData = Object.values(dayData).map(d => ({
    date: d.date,
    credibility: d.credibility.length > 0 ? Math.round(d.credibility.reduce((a, b) => a + b, 0) / d.credibility.length) : null,
    emotional: d.emotional.length > 0 ? Math.round(d.emotional.reduce((a, b) => a + b, 0) / d.emotional.length) : null,
    count: d.credibility.length,
  }));

  // Only show labels for every 2nd day on mobile
  const tickInterval = days > 7 ? 1 : 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="credibilityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="emotionalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          interval={tickInterval}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
          formatter={(value: unknown, name: unknown) => [
            value === null ? 'No data' : `${value}/100`,
            name === 'credibility' ? 'Avg Credibility' : 'Avg Emotional Manip.',
          ]}
        />
        <Area
          type="monotone"
          dataKey="credibility"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#credibilityGrad)"
          connectNulls={false}
          dot={{ r: 3, fill: '#3b82f6' }}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="emotional"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#emotionalGrad)"
          connectNulls={false}
          dot={{ r: 3, fill: '#ef4444' }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TrendEntry } from '../types/weather';

interface WeatherChartProps {
  data: TrendEntry[];
  type: 'temperature' | 'rainfall' | 'humidity';
}

export default function WeatherChart({ data, type }: WeatherChartProps) {
  const isLight = document.documentElement.dataset.theme === 'light';

  const colorMap = {
    temperature: isLight ? '#0ea5e9' : '#38bdf8',
    rainfall: isLight ? '#16a34a' : '#22c55e',
    humidity: isLight ? '#d97706' : '#f59e0b',
  };

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={colorMap[type]} stopOpacity={isLight ? 0.32 : 0.5} />
              <stop offset="95%" stopColor={colorMap[type]} stopOpacity={isLight ? 0.08 : 0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={isLight ? '#cbd5e1' : '#334155'} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" stroke={isLight ? '#475569' : '#94a3b8'} />
          <YAxis stroke={isLight ? '#475569' : '#94a3b8'} />
          <Tooltip
            contentStyle={{
              background: isLight ? '#ffffff' : '#020817',
              border: isLight ? '1px solid #cbd5e1' : '1px solid #334155',
              borderRadius: 12,
              color: isLight ? '#0f172a' : '#fff',
            }}
          />
          <Area type="monotone" dataKey={type} stroke={colorMap[type]} fill="url(#trendFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { AlertTriangle, CheckCircle2, CloudRain, MapPinned, TriangleAlert, Users } from 'lucide-react';
import type { MetricCard } from '../types/weather';

const iconMap = {
  AlertTriangle,
  TriangleAlert,
  MapPinned,
  CloudRain,
  Users,
  CheckCircle2,
};

interface StatCardProps {
  item: MetricCard;
}

const tones = {
  blue: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  red: 'border-red-500/30 bg-red-500/10 text-red-200',
  green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
};

export default function StatCard({ item }: StatCardProps) {
  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? CloudRain;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-slate-700">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl border p-2.5 ${tones[item.tone as keyof typeof tones]}`}>
          <Icon size={18} />
        </div>
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
            item.trend === 'up' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : item.trend === 'down' ? 'border-red-500/20 bg-red-500/10 text-red-300' : 'border-slate-700 bg-slate-800 text-slate-300'
          }`}
        >
          {item.delta}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{item.value}</p>
        <p className="text-sm font-medium text-slate-200">{item.label}</p>
        <p className="text-xs text-slate-400">{item.description}</p>
      </div>
    </article>
  );
}

import { CloudSun, Gauge, Wind } from 'lucide-react';
import type { RegionCondition } from '../types/weather';

interface RegionCardProps {
  region: RegionCondition;
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/30 transition hover:border-slate-700 hover:-translate-y-0.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">{region.name}</h3>
        <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] font-medium text-sky-200">
          {region.alertCount} alerts
        </span>
      </div>

      <div className="space-y-3 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2"><CloudSun size={14} className="text-orange-300" /> Temperature</span>
          <span className="font-semibold text-white">{region.temperature}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Gauge size={14} className="text-cyan-300" /> Rainfall</span>
          <span>{region.rainfall} mm</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Wind size={14} className="text-violet-300" /> Wind</span>
          <span>{region.windSpeed} km/h</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">AQI</span>
          <span className={region.aqi > 100 ? 'text-orange-300' : 'text-emerald-300'}>{region.aqi}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Condition</p>
        <p className="mt-1 font-medium text-slate-100">{region.condition}</p>
      </div>
    </article>
  );
}

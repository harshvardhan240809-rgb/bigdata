import { ArrowRight, Clock3, ShieldAlert } from 'lucide-react';
import type { WeatherAlert } from '../types/weather';

interface AlertCardProps {
  alert: WeatherAlert;
  onView: (alert: WeatherAlert) => void;
}

const severityStyles = {
  low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  moderate: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  high: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  critical: 'border-red-500/30 bg-red-500/10 text-red-200',
};

export default function AlertCard({ alert, onView }: AlertCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm shadow-slate-900/30">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityStyles[alert.severity]}`}>
            {alert.severity}
          </span>
          <span className="text-xs text-slate-400">{alert.id}</span>
        </div>
        <ShieldAlert size={16} className="text-slate-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
        <span>{alert.state}</span>
        <span>•</span>
        <span>{alert.district}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Clock3 size={13} />
        {alert.issuedAt}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{alert.description}</p>

      <button
        type="button"
        onClick={() => onView(alert)}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20"
      >
        View details
        <ArrowRight size={15} />
      </button>
    </article>
  );
}

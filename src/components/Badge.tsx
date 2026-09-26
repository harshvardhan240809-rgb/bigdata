interface BadgeProps {
  label: string;
  tone?: 'sky' | 'green' | 'amber' | 'red' | 'slate';
}

const tones = {
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  red: 'border-red-500/30 bg-red-500/10 text-red-200',
  slate: 'border-slate-700 bg-slate-800 text-slate-300',
};

export default function Badge({ label, tone = 'slate' }: BadgeProps) {
  return <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}>{label}</span>;
}

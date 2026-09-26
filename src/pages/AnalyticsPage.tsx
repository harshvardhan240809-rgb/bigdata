import { Download, Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const formatMonthYear = (date: Date) => monthFormatter.format(date);

const getCurrentPeriod = () => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(now.getMonth() - 8);
  return `${formatMonthYear(start)} – ${formatMonthYear(now)}`;
};

const historical = [
  { month: 'Jan', rainfall: 32, temp: 30 },
  { month: 'Feb', rainfall: 36, temp: 31 },
  { month: 'Mar', rainfall: 42, temp: 34 },
  { month: 'Apr', rainfall: 58, temp: 37 },
  { month: 'May', rainfall: 64, temp: 39 },
  { month: 'Jun', rainfall: 86, temp: 36 },
  { month: 'Jul', rainfall: 92, temp: 33 },
  { month: 'Aug', rainfall: 79, temp: 32 },
];

const stateRisk = [
  { state: 'Odisha', value: 88 },
  { state: 'Kerala', value: 74 },
  { state: 'Rajasthan', value: 70 },
  { state: 'Maharashtra', value: 63 },
  { state: 'Bihar', value: 57 },
];

const buildCsv = (title: string, rows: Array<Record<string, string | number>>) => {
  const columns = Object.keys(rows[0] ?? {});
  const content = [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => `"${String(row[column]).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return `${title}\n\n${content}`;
};

const downloadAnalyticsReport = (format: 'csv' | 'json') => {
  const periodLabel = getCurrentPeriod();
  const csvContent = buildCsv('Climate Intelligence Report', [
    { metric: 'Rainfall comparison', value: '+18% vs seasonal norm' },
    { metric: 'Temperature anomaly', value: '+2.4°C above baseline' },
    { metric: 'Prediction accuracy', value: '92% in the last 30 days' },
    ...stateRisk.map((item) => ({ metric: item.state, value: `${item.value}%` })),
  ]);

  const jsonContent = JSON.stringify(
    {
      title: 'Climate Intelligence Report',
      period: periodLabel,
      rainfallComparison: '+18% vs seasonal norm',
      temperatureAnomaly: '+2.4°C above baseline',
      predictionAccuracy: '92% in the last 30 days',
      stateRisk,
      historical,
    },
    null,
    2,
  );

  const content = format === 'csv' ? csvContent : jsonContent;
  const extension = format === 'csv' ? 'csv' : 'json';
  const mimeType = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `climate-intelligence-report.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function AnalyticsPage() {
  const periodLabel = getCurrentPeriod();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Climate intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Analytics dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <Filter size={15} className="text-sky-300" />
              {periodLabel}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => downloadAnalyticsReport('csv')}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-200"
              >
                <Download size={15} />
                CSV
              </button>
              <button
                type="button"
                onClick={() => downloadAnalyticsReport('json')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <Download size={15} />
                JSON
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Rainfall comparison', value: '+18%', sentiment: 'up', detail: 'vs seasonal norm' },
          { label: 'Temperature anomaly', value: '+2.4°C', sentiment: 'up', detail: 'above baseline' },
          { label: 'Prediction accuracy', value: '92%', sentiment: 'up', detail: 'last 30 days' },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{item.label}</p>
              {item.sentiment === 'up' ? <TrendingUp size={16} className="text-emerald-300" /> : <TrendingDown size={16} className="text-red-300" />}
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{item.value}</div>
            <div className="mt-1 text-xs text-slate-400">{item.detail}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">Historical rainfall trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historical}>
                <defs>
                  <linearGradient id="rainFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background:'#020817', border:'1px solid #334155', borderRadius:12, color:'#fff' }} />
                <Area type="monotone" dataKey="rainfall" stroke="#38bdf8" fill="url(#rainFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">State-wise incident distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRisk}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="state" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background:'#020817', border:'1px solid #334155', borderRadius:12, color:'#fff' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="mb-4 text-xl font-semibold text-white">Response time analytics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Cyclone response', '1.2h', 'Excellent'],
            ['Flood coordination', '2.3h', 'Stable'],
            ['Heatwave support', '3.1h', 'Improving'],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-sm text-slate-400">{label}</div>
              <div className="mt-2 text-3xl font-bold text-white">{value}</div>
              <div className="mt-1 text-xs text-slate-400">{note}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

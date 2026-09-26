import { BarChart3, Clock3, Filter, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { getIncidentData } from '../services/weatherService';
import type { Incident } from '../types/weather';

const categoryData = [
  { name: 'Flood', value: 28 },
  { name: 'Cyclone', value: 18 },
  { name: 'Heatwave', value: 16 },
  { name: 'Thunderstorm', value: 12 },
  { name: 'Landslide', value: 9 },
];

const stateData = [
  { state: 'Odisha', incidents: 9 },
  { state: 'Kerala', incidents: 8 },
  { state: 'Rajasthan', incidents: 7 },
  { state: 'Maharashtra', incidents: 6 },
  { state: 'Bihar', incidents: 4 },
];

const COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#f97316', '#f43f5e'];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    let active = true;

    const loadIncidents = async () => {
      const nextIncidents = await getIncidentData();
      if (active) {
        setIncidents(nextIncidents);
      }
    };

    void loadIncidents();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Emergency response intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Incident analytics</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <Filter size={15} className="text-sky-300" />
            Last 7 days
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total incidents', value: '126', tone: 'sky' },
          { label: 'Open incidents', value: '29', tone: 'amber' },
          { label: 'Resolved incidents', value: '84', tone: 'green' },
          { label: 'Avg response time', value: '1.8h', tone: 'red' },
        ].map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <div className="mt-2 text-3xl font-bold text-white">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Incident category</h2>
            <BarChart3 size={18} className="text-sky-300" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background:'#020817', border:'1px solid #334155', borderRadius:12, color:'#fff' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">By state</h2>
            <ShieldAlert size={18} className="text-orange-300" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stateData} dataKey="incidents" nameKey="state" innerRadius={56} outerRadius={94} paddingAngle={4}>
                  {stateData.map((entry, index) => (<Cell key={entry.state} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background:'#020817', border:'1px solid #334155', borderRadius:12, color:'#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent incident timeline</h2>
          <div className="flex items-center gap-2 text-sm text-slate-300"><Clock3 size={15} className="text-sky-300" /> 24h summary</div>
        </div>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/75 px-4 py-3">
              <div>
                <div className="font-medium text-white">{incident.location}</div>
                <div className="text-xs text-slate-400">{incident.id} · {incident.category}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-200">{incident.status}</div>
                <div className="text-xs text-slate-400">{incident.reportedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Incident ID</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Reported time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Agency</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-t border-slate-800 text-slate-200">
                  <td className="px-4 py-3">{incident.id}</td>
                  <td className="px-4 py-3">{incident.location}</td>
                  <td className="px-4 py-3">{incident.category}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${incident.severity === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-200' : incident.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : incident.severity === 'moderate' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>{incident.severity}</span></td>
                  <td className="px-4 py-3">{incident.reportedAt}</td>
                  <td className="px-4 py-3">{incident.status}</td>
                  <td className="px-4 py-3">{incident.assignedAgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

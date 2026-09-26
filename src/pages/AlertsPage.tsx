import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getAlerts } from '../services/weatherService';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const loadAlerts = async () => {
      const result = await getAlerts();
      setAlerts(result);
    };

    void loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesQuery =
        query.trim() === '' ||
        alert.title.toLowerCase().includes(query.toLowerCase()) ||
        alert.state.toLowerCase().includes(query.toLowerCase()) ||
        alert.district.toLowerCase().includes(query.toLowerCase());
      const matchesSeverity = severity === 'all' || alert.severity === severity;
      const matchesState = stateFilter === 'all' || alert.state === stateFilter;
      const matchesStatus = status === 'all' || alert.status === status;
      return matchesQuery && matchesSeverity && matchesState && matchesStatus;
    });
  }, [alerts, query, severity, stateFilter, status]);

  const handleAlertStatusChange = (alertId: string, nextStatus: 'active' | 'resolved') => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: nextStatus } : alert,
      ),
    );
  };

  const activeAlertCount = alerts.filter((alert) => alert.status === 'active').length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Active alert operations</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Alerts management</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <SlidersHorizontal size={15} className="text-sky-300" />
            {activeAlertCount} active alerts
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 md:col-span-2 xl:col-span-2">
            <Search size={15} className="text-sky-300" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-slate-500" placeholder="Search alerts" />
          </div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none">
            <option value="all">All severity</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none">
            <option value="all">All states</option>
            <option value="Odisha">Odisha</option>
            <option value="Kerala">Kerala</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Bihar">Bihar</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Alert</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                <tr key={alert.id} className="border-t border-slate-800 text-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{alert.title}</div>
                    <div className="text-xs text-slate-400">{alert.id}</div>
                  </td>
                  <td className="px-4 py-3">{alert.state}</td>
                  <td className="px-4 py-3">{alert.type}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${alert.severity === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-200' : alert.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : alert.severity === 'moderate' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${alert.status === 'active' ? 'border-sky-500/30 bg-sky-500/10 text-sky-200' : alert.status === 'acknowledged' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{alert.issuedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAlertStatusChange(alert.id, 'active')}
                        className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1.5 text-xs text-sky-200"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAlertStatusChange(alert.id, 'resolved')}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-xs text-emerald-200"
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">No alerts match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

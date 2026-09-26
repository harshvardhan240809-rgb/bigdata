import { BellRing, CalendarDays, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AlertCard from '../components/AlertCard';
import RegionCard from '../components/RegionCard';
import StatCard from '../components/StatCard';
import WeatherChart from '../components/WeatherChart';
import WeatherMap from '../components/WeatherMap';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { acknowledgeAlert, getAlerts, getOverviewStats, getRegions, getTrendData } from '../services/weatherService';
import type { WeatherAlert } from '../types/weather';

const chartTabs = [
  { id: 'temperature', label: 'Temperature' },
  { id: 'rainfall', label: 'Rainfall' },
  { id: 'humidity', label: 'Humidity' },
] as const;

const regionOptions = ['All India', 'Maharashtra', 'Odisha', 'Delhi', 'Kerala'] as const;

type RegionOption = (typeof regionOptions)[number];

export default function OverviewPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedChart, setSelectedChart] = useState<(typeof chartTabs)[number]['id']>('temperature');
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionOption>('All India');
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [responseLog, setResponseLog] = useState<Array<{
    id: string;
    alertId: string;
    title: string;
    state: string;
    district: string;
    dispatchedTo: string;
    acknowledgedAt: string;
  }>>([]);

  useEffect(() => {
    const loadData = async () => {
      const [statsResult, alertsResult, regionsResult, trendsResult] = await Promise.all([
        getOverviewStats(),
        getAlerts(),
        getRegions(),
        getTrendData(),
      ]);
      setStats(statsResult);
      setAlerts(alertsResult);
      setRegions(regionsResult);
      setTrendData(trendsResult);
    };

    void loadData();
  }, []);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleAlertView = (alert: WeatherAlert) => setSelectedAlert(alert);
  const handleAcknowledge = async () => {
    if (!selectedAlert) {
      return;
    }

    const result = await acknowledgeAlert(selectedAlert.id);
    if (result?.alert) {
      setAlerts((current) => current.map((alert) => (alert.id === result.alert?.id ? { ...alert, status: 'acknowledged' } : alert)));
    }

    const nextEntry = {
      id: `${selectedAlert.id}-${Date.now()}`,
      alertId: selectedAlert.id,
      title: selectedAlert.title,
      state: selectedAlert.state,
      district: selectedAlert.district,
      dispatchedTo: result?.dispatchedTo ?? 'Response Team',
      acknowledgedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setResponseLog((current) => [nextEntry, ...current].slice(0, 5));
    setToastOpen(true);
    setSelectedAlert(null);
  };
  const handleViewAllAlerts = () => {
    setSelectedRegion('All India');
    setSelectedAlert(null);
  };
  const handleCompareRegions = () => {
    setSelectedRegion('All India');
    setSelectedAlert(null);
    setToastOpen(true);
  };

  const selectedRegionLabel = selectedRegion === 'All India' ? 'India' : selectedRegion;
  const todayLabel = currentTime.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const lastUpdatedLabel = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });

  const visibleStats = useMemo(() => {
    if (selectedRegion === 'All India') {
      return stats;
    }

    const regionOverrides: Record<Exclude<RegionOption, 'All India'>, Record<string, string>> = {
      Maharashtra: { alerts: '15', incidents: '05', states: '09', rainfall: '+11%', people: '2.1M', resolved: '27' },
      Odisha: { alerts: '12', incidents: '04', states: '07', rainfall: '+16%', people: '1.7M', resolved: '21' },
      Delhi: { alerts: '09', incidents: '03', states: '06', rainfall: '+8%', people: '1.2M', resolved: '18' },
      Kerala: { alerts: '11', incidents: '04', states: '08', rainfall: '+19%', people: '1.5M', resolved: '23' },
    };

    return stats.map((item) => {
      const override = regionOverrides[selectedRegion as Exclude<RegionOption, 'All India'>];
      const nextValue = override?.[item.id];
      if (!nextValue) {
        return item;
      }

      return { ...item, value: nextValue };
    });
  }, [selectedRegion, stats]);

  const visibleAlerts = useMemo(() => {
    if (selectedRegion === 'All India') {
      return alerts;
    }

    return alerts.filter((alert) => alert.state === selectedRegion);
  }, [alerts, selectedRegion]);

  const visibleRegions = useMemo(() => {
    if (selectedRegion === 'All India') {
      return regions;
    }

    return regions.map((region) => {
      const isSelected = region.name.toLowerCase().includes(selectedRegion.toLowerCase());
      return isSelected ? { ...region, alertCount: region.alertCount + 2 } : region;
    });
  }, [regions, selectedRegion]);

  const visibleTrendData = useMemo(() => {
    if (selectedRegion === 'All India') {
      return trendData;
    }

    return trendData.map((point) => ({
      ...point,
      temperature: Math.max(18, point.temperature + (selectedRegion === 'Delhi' ? 2 : selectedRegion === 'Odisha' ? -1 : 1)),
      rainfall: Math.max(10, point.rainfall + (selectedRegion === 'Kerala' ? 10 : selectedRegion === 'Delhi' ? -8 : 4)),
      humidity: Math.max(35, point.humidity + (selectedRegion === 'Maharashtra' ? 4 : selectedRegion === 'Delhi' ? -5 : 2)),
    }));
  }, [selectedRegion, trendData]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">National Weather Intelligence</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Real-time weather monitoring and incident analytics for India</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <CalendarDays size={16} className="text-sky-300" />
              <span>{todayLabel}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <BellRing size={16} className="text-amber-300" />
              Last updated {lastUpdatedLabel} IST
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 text-sm text-slate-300">
            {regionOptions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                aria-pressed={selectedRegion === region}
                className={`rounded-full border px-3 py-2 transition ${selectedRegion === region ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 bg-slate-950 hover:border-sky-500/40'}`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <MapPin size={16} className="text-red-300" />
            <span>Selected region: {selectedRegionLabel}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleStats.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          {!selectedAlert && <WeatherMap selectedRegion={selectedRegion} />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Live alerts</h2>
            <button type="button" onClick={handleViewAllAlerts} className="text-sm text-sky-300">View all</button>
          </div>

          <div className="space-y-3">
            {visibleAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onView={handleAlertView} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Weather trends</h2>
            <p className="text-sm text-slate-400">Seven-day national pattern</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedChart(tab.id)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${selectedChart === tab.id ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <WeatherChart data={visibleTrendData} type={selectedChart} />
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Response team dispatch</h2>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-200">
            {responseLog.length} active
          </span>
        </div>

        {responseLog.length === 0 ? (
          <p className="text-sm text-slate-400">No alerts have been acknowledged and forwarded yet.</p>
        ) : (
          <div className="space-y-3">
            {responseLog.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.state} · {item.district} · {item.acknowledgedAt}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1">{item.dispatchedTo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Regional conditions</h2>
          <button type="button" onClick={handleCompareRegions} className="text-sm text-sky-300">Compare regions</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </section>

      <Modal isOpen={Boolean(selectedAlert)} title={selectedAlert?.title ?? 'Alert Details'} onClose={() => setSelectedAlert(null)}>
        {selectedAlert && (
          <div className="space-y-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-200">
                {selectedAlert.severity}
              </span>
              <span className="text-slate-400">{selectedAlert.id}</span>
            </div>
            <p>{selectedAlert.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3"><div className="text-slate-400">State</div><div className="mt-1 font-medium text-white">{selectedAlert.state}</div></div>
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3"><div className="text-slate-400">District</div><div className="mt-1 font-medium text-white">{selectedAlert.district}</div></div>
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3"><div className="text-slate-400">Issued</div><div className="mt-1 font-medium text-white">{selectedAlert.issuedAt}</div></div>
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-3"><div className="text-slate-400">Type</div><div className="mt-1 font-medium text-white">{selectedAlert.type}</div></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setSelectedAlert(null)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">Close</button>
              <button type="button" onClick={handleAcknowledge} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Acknowledge</button>
            </div>
          </div>
        )}
      </Modal>

      <Toast open={toastOpen} onClose={() => setToastOpen(false)} message="Alert acknowledged and forwarded to the response team." />
    </div>
  );
}

import { Ambulance, Building2, ClipboardList, Clock3, MapPinned, ShieldAlert, Siren, Stethoscope, Truck } from 'lucide-react';
import { useState } from 'react';

const initialEmergencies = [
  { id: 'EM-145', location: 'Cuttack, Odisha', status: 'Evacuation in progress', team: 'ODRAF-3', severity: 'critical' },
  { id: 'EM-146', location: 'Wayanad, Kerala', status: 'Shelter readiness check', team: 'NDRF-2', severity: 'high' },
  { id: 'EM-147', location: 'Jaipur, Rajasthan', status: 'Heat relief teams deployed', team: 'State Health', severity: 'moderate' },
];

const initialResources = [
  { label: 'Available response teams', value: 8, icon: Truck },
  { label: 'Active shelters', value: 14, icon: Building2 },
  { label: 'Hospitals', value: 21, icon: Stethoscope },
  { label: 'Ambulances', value: 17, icon: Ambulance },
];

const actionButtons = [
  'Assign response team',
  'Create evacuation task',
  'Open shelter',
  'Notify district officer',
  'Request medical support',
  'Mark road as blocked',
  'Mark incident as contained',
] as const;

export default function ResponseCenterPage() {
  const [emergencies, setEmergencies] = useState(initialEmergencies);
  const [resources, setResources] = useState(initialResources);
  const [timeline, setTimeline] = useState([
    ['Alert issued', '08:15'],
    ['Incident verified', '08:45'],
    ['Team assigned', '09:20'],
    ['Evacuation started', '10:05'],
    ['Shelter opened', '10:40'],
    ['Incident resolved', '13:00'],
  ]);
  const [lastAction, setLastAction] = useState('No action executed yet');

  const handleAction = (action: string) => {
    setLastAction(`${action} initiated successfully.`);

    setTimeline((current) => [
      [`${action} executed`, new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })],
      ...current,
    ].slice(0, 6));

    setEmergencies((current) => current.map((emergency, index) => {
      if (action === 'Assign response team' && index === 0) {
        return { ...emergency, status: 'Team dispatched to incident site', team: 'ODRAF-3 / medical unit' };
      }
      if (action === 'Create evacuation task' && index === 0) {
        return { ...emergency, status: 'Evacuation plan activated', team: 'District authority' };
      }
      if (action === 'Open shelter' && index === 1) {
        return { ...emergency, status: 'Shelter opened and staffed', team: 'Volunteer network' };
      }
      if (action === 'Request medical support' && index === 2) {
        return { ...emergency, status: 'Medical relief dispatched', team: 'State Health' };
      }
      if (action === 'Mark road as blocked' && index === 0) {
        return { ...emergency, status: 'Traffic route diverted', team: 'Traffic police' };
      }
      if (action === 'Mark incident as contained' && index === 0) {
        return { ...emergency, status: 'Incident contained and monitoring', team: 'Control room' };
      }
      return emergency;
    }));

    setResources((current) => current.map((resource) => {
      if (action === 'Assign response team' && resource.label === 'Available response teams') {
        return { ...resource, value: Math.max(0, resource.value - 1) };
      }
      if (action === 'Open shelter' && resource.label === 'Active shelters') {
        return { ...resource, value: resource.value + 1 };
      }
      if (action === 'Request medical support' && resource.label === 'Ambulances') {
        return { ...resource, value: resource.value + 1 };
      }
      return resource;
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Emergency operations</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Response center</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            <Siren size={15} />
            Emergency response mode active
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resources.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{label}</p>
              <Icon size={16} className="text-sky-300" />
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{String(value).padStart(2, '0')}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Response map</h2>
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-sky-200">Live</span>
          </div>
          <div className="h-80 rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-400">
              GIS response canvas: shelters, hospitals, blocked roads, and emergency teams overlay
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Action panel</h2>
            <ClipboardList size={18} className="text-sky-300" />
          </div>
          <div className="space-y-2">
            {actionButtons.map((action) => (
              <button key={action} type="button" onClick={() => handleAction(action)} className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-left text-sm text-slate-200 hover:border-sky-500/40 hover:text-white">
                <span>{action}</span>
                <ShieldAlert size={14} className="text-sky-300" />
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
            {lastAction}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="mb-4 text-xl font-semibold text-white">Active emergencies</h2>
          <div className="space-y-3">
            {emergencies.map((emergency) => (
              <div key={emergency.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                <div>
                  <div className="font-medium text-white">{emergency.id}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-300"><MapPinned size={14} className="text-sky-300" /> {emergency.location}</div>
                </div>
                <div className="text-right">
                  <div className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${emergency.severity === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-200' : emergency.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                    {emergency.severity}
                  </div>
                  <div className="mt-2 text-xs text-slate-400">{emergency.status}</div>
                  <div className="text-xs text-slate-500">{emergency.team}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Timeline</h2>
            <Clock3 size={18} className="text-sky-300" />
          </div>
          <div className="space-y-4">
            {timeline.map(([event, time], index) => (
              <div key={event} className="flex items-start gap-3">
                <div className={`mt-1 h-3 w-3 rounded-full ${index === 5 ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                <div>
                  <div className="font-medium text-white">{event}</div>
                  <div className="text-xs text-slate-400">{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

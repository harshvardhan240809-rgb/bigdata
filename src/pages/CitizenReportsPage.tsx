import { AlertCircle, CheckCircle2, FileImage, MapPinned, PlusCircle, Search, ShieldCheck, Upload, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const initialReports = [
  {
    id: 'CR-2041',
    reporterType: 'Citizen',
    location: 'Bhubaneswar, Odisha',
    category: 'Heavy Rain',
    description: 'Waterlogging near NH-16 and road visibility reduced drastically after 18:30.',
    severity: 'high',
    status: 'Pending Verification',
    confidence: 81,
    nearbyMatches: 5,
    distanceKm: 8,
    media: true,
  },
  {
    id: 'CR-2042',
    reporterType: 'Volunteer',
    location: 'Wayanad, Kerala',
    category: 'Landslide',
    description: 'Slope instability reported near a residential lane with debris accumulation.',
    severity: 'critical',
    status: 'Under Review',
    confidence: 88,
    nearbyMatches: 6,
    distanceKm: 6,
    media: true,
  },
  {
    id: 'CR-2043',
    reporterType: 'Anonymous',
    location: 'Jaipur, Rajasthan',
    category: 'Extreme Heat',
    description: 'Heat stress conditions at market area with multiple residents reporting discomfort.',
    severity: 'moderate',
    status: 'Verified',
    confidence: 74,
    nearbyMatches: 3,
    distanceKm: 12,
    media: false,
  },
];

export default function CitizenReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = selectedStatus === 'All' || report.status === selectedStatus;
      const matchesQuery =
        query.trim() === '' ||
        report.location.toLowerCase().includes(query.toLowerCase()) ||
        report.category.toLowerCase().includes(query.toLowerCase()) ||
        report.id.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, reports, selectedStatus]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const location = String(formData.get('location') || 'New location');
    const category = String(formData.get('category') || 'Heavy Rain');
    const reportId = `CR-${Math.floor(3000 + Math.random() * 8000)}`;

    setReports((current) => [{
      id: reportId,
      reporterType: String(formData.get('reporterType') || 'Citizen'),
      location,
      category,
      description: String(formData.get('description') || 'Citizen observation submitted for verification.'),
      severity: String(formData.get('severity') || 'moderate'),
      status: 'Pending Verification',
      confidence: 76,
      nearbyMatches: 2,
      distanceKm: 9,
      media: false,
    }, ...current]);

    setSubmitted(true);
    setFeedback(`Report ${reportId} submitted successfully and sent to verification.`);
    form.reset();
    setTimeout(() => setSubmitted(false), 2200);
  };

  const handleStatusChange = (reportId: string, nextStatus: string) => {
    setReports((current) => current.map((report) => (report.id === reportId ? { ...report, status: nextStatus } : report)));
    setFeedback(`Report ${reportId} marked as ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Citizen intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Citizen reports & verification</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            <ShieldCheck size={15} className="text-emerald-300" />
            18 verified this week
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.5fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Submit report</h2>
            <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-200">
              <PlusCircle size={12} />
              Public input
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
              <span>Location</span>
              <input name="location" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="e.g. Cuttack, Odisha" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>State</span>
              <input name="state" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500" placeholder="Odisha" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>District</span>
              <input name="district" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500" placeholder="Cuttack" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Observation type</span>
              <select name="category" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none">
                <option>Heavy Rain</option>
                <option>Flooding</option>
                <option>Hailstorm</option>
                <option>Lightning</option>
                <option>Thunderstorm</option>
                <option>Strong Winds</option>
                <option>Cyclone Damage</option>
                <option>Landslide</option>
                <option>Road Damage</option>
                <option>Waterlogging</option>
                <option>Extreme Heat</option>
                <option>Dense Fog</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Severity</span>
              <select name="severity" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none">
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
              <span>Description</span>
              <textarea name="description" required rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500" placeholder="Describe the current weather condition or impact observed." />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>GPS coordinates</span>
              <input name="gps" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500" placeholder="20.51, 85.82" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Reporter type</span>
              <select name="reporterType" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none">
                <option>Citizen</option>
                <option>Volunteer</option>
                <option>Official</option>
                <option>Anonymous</option>
              </select>
            </label>
            <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200">
                <Upload size={15} />
                Photo upload
              </button>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200">
                <FileImage size={15} />
                Video upload
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
              Anonymous submission
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">Simulated citizen input with local verification workflow.</div>
            <button type="submit" className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm font-medium text-sky-100">
              Submit report
            </button>
          </div>
          {(submitted || feedback) && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {feedback || 'Report submitted successfully and queued for verification.'}
            </div>
          )}
        </form>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Verification panel</h2>
              <p className="text-sm text-slate-400">Admin workflow for report quality control</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <Search size={15} className="text-sky-300" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-40 bg-transparent text-white outline-none placeholder:text-slate-500" placeholder="Search reports" />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {['All', 'Pending Verification', 'Under Review', 'Verified', 'Rejected', 'Duplicate'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${selectedStatus === status ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' : 'border-slate-700 bg-slate-950 text-slate-300'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white">{report.id}</div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${report.severity === 'critical' ? 'border-red-500/30 bg-red-500/10 text-red-200' : report.severity === 'high' ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : report.severity === 'moderate' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400"><MapPinned size={12} /> {report.location}</div>
                    <div className="mt-3 text-sm text-slate-300">{report.category} · {report.reporterType}</div>
                    <p className="mt-2 text-sm text-slate-400">{report.description}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${report.status === 'Verified' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : report.status === 'Rejected' ? 'border-red-500/30 bg-red-500/10 text-red-200' : report.status === 'Duplicate' ? 'border-slate-500/30 bg-slate-500/10 text-slate-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                      {report.status}
                    </span>
                    <div className="text-xs text-slate-400">Confidence {report.confidence}%</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-2">Nearby reports: {report.nearbyMatches}</div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-2">Distance: {report.distanceKm} km</div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-2">Media: {report.media ? 'Attached' : 'Not provided'}</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => handleStatusChange(report.id, 'Verified')} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                    <CheckCircle2 size={14} /> Verify
                  </button>
                  <button type="button" onClick={() => handleStatusChange(report.id, 'Rejected')} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    <XCircle size={14} /> Reject
                  </button>
                  <button type="button" onClick={() => handleStatusChange(report.id, 'Duplicate')} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200">
                    <AlertCircle size={14} /> Duplicate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { Download, Eye, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReports } from '../services/weatherService';
import type { ReportItem } from '../types/weather';

const buildReportContent = (report: ReportItem) => `
Report: ${report.title}
Date: ${report.date}
Type: ${report.type}
File Type: ${report.fileType}

Operational Summary
===================
This ${report.type.toLowerCase()} report captures current operational conditions and monitoring indicators for the region.

Status: Active
Coverage: National weather monitoring and incident readiness
Prepared by: MausamNet Operations Center
`;

const buildCsvContent = (report: ReportItem) => {
  const rows = [
    ['Title', 'Date', 'Type', 'File Type', 'Status', 'Summary'],
    [report.title, report.date, report.type, report.fileType, 'Active', 'Operational summary for the selected monitoring window'],
  ];

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
};

const triggerDownload = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const downloadReport = (report: ReportItem) => {
  const safeName = report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  triggerDownload(buildCsvContent(report), `${safeName}.csv`, 'text/csv;charset=utf-8');
};

const viewReport = (report: ReportItem) => {
  const html = `
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #020817; color: #e2e8f0; padding: 24px; }
          .card { border: 1px solid #334155; border-radius: 16px; padding: 20px; background: #0f172a; }
          .label { color: #7dd3fc; text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; }
          h1 { margin: 12px 0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="label">${report.fileType}</div>
          <h1>${report.title}</h1>
          <p><strong>Date:</strong> ${report.date}</p>
          <p><strong>Type:</strong> ${report.type}</p>
          <p>${buildReportContent(report).replace(/\n/g, '<br />')}</p>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      const nextReports = await getReports();
      if (active) {
        setReports(nextReports);
      }
    };

    void loadReports();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Operational reporting</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Reports library</h1>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <article key={report.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-200">
                <FileText size={18} />
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-300">{report.fileType}</span>
            </div>
            <div className="text-lg font-semibold text-white">{report.title}</div>
            <div className="mt-3 space-y-1 text-sm text-slate-300">
              <div>Date: {report.date}</div>
              <div>Type: {report.type}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => viewReport(report)}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-200"
              >
                <Eye size={14} /> View
              </button>
              <button
                type="button"
                onClick={() => downloadReport(report)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
              >
                <Download size={14} /> CSV
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

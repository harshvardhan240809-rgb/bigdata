import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl shadow-slate-950/20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sky-300">
          <SearchX size={28} />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-slate-400">The requested route does not exist in the MAUSAMNET INDIA operational dashboard.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-sm font-medium text-sky-200">
          <ArrowLeft size={15} />
          Back to overview
        </Link>
      </div>
    </div>
  );
}

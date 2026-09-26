import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

export default function Toast({ message, open, onClose }: ToastProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-slate-900/95 px-4 py-3 shadow-xl shadow-emerald-900/20">
      <CheckCircle2 size={18} className="text-emerald-300" />
      <span className="text-sm text-slate-100">{message}</span>
      <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-300 hover:text-white">
        <X size={14} />
      </button>
    </div>
  );
}

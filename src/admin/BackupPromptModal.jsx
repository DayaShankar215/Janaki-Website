import { Download, Save, X, ShieldAlert } from 'lucide-react';

export default function BackupPromptModal({ body, onBackup, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-navy-900 dark:text-white">Back up data first?</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{body}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button data-testid="backup-do" onClick={onBackup}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md bg-amber-500 text-navy-950 hover:bg-amber-400 transition">
            <Download className="w-4 h-4" /> Backup, then apply
          </button>
          <button data-testid="backup-skip" onClick={onSave}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-600 transition">
            <Save className="w-4 h-4" /> Apply without backup
          </button>
          <button data-testid="backup-cancel" onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Inbox, Search, Download, Trash2, FileText, Mail, Phone, MapPin, GraduationCap,
  Clock, CheckCircle2, AlertTriangle, Loader2, X, Copy, Eye, EyeOff, Filter,
  ChevronLeft, MessageSquare, ShieldAlert, ExternalLink,
} from 'lucide-react';
import {
  STATUS_FLOW, STATUS_IDS, statusInfo, PRIVACY_NOTE,
  subscribeSubmissions, updateSubmission, deleteSubmission, markAllRead,
} from '@/utils/submissions';
import { describeBytes, downloadDocument } from '@/utils/documents';
import { Badge } from '@/components/ui/Badge';
import { downloadJson, backupFilename } from '@/utils/downloadJson';
import { cn } from '@/utils/cn';

const when = (ts) => {
  try {
    return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
};

function Field({ label, value, icon: Icon, mono }) {
  if (!value || value === '—') return null;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn('mt-0.5 flex items-start gap-1.5 text-sm text-slate-700 dark:text-slate-200', mono && 'font-mono')}>
        {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />}
        <span className="min-w-0 break-words">{value}</span>
      </p>
    </div>
  );
}

function Documents({ docs }) {
  const [open, setOpen] = useState(null);
  if (!Array.isArray(docs) || docs.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No documents attached.</p>;
  }
  return (
    <ul className="space-y-2" data-testid="submission-docs">
      {docs.map((d, i) => (
        <li key={`${d.name}-${i}`} className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            {d.preview ? (
              <img src={d.preview} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500 dark:bg-white/5">
                <FileText className="h-4 w-4" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{d.name}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">{describeBytes(d.size)}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                title={open === i ? 'Hide' : 'Preview'}
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-navy-800 dark:hover:bg-white/10"
              >
                {open === i ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => downloadDocument(d)}
                title="Download"
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-navy-800 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
              </button>
            </span>
          </div>
          {open === i && (
            <div className="mt-2.5">
              {d.type?.startsWith('image/') ? (
                <img src={d.data} alt={d.name} className="max-h-72 w-full rounded-lg object-contain" />
              ) : (
                <iframe title={d.name} src={d.data} className="h-72 w-full rounded-lg border border-slate-200 dark:border-white/10" />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Detail({ record, onClose, onChanged, onDeleted, notify }) {
  const [status, setStatus] = useState(record.status || 'received');
  const [note, setNote] = useState(record.adminNote || '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setStatus(record.status || 'received');
    setNote(record.adminNote || '');
  }, [record.reference, record.status, record.adminNote]);

  const save = async (patch, message) => {
    setBusy(true);
    try {
      await updateSubmission(record.reference, patch);
      notify?.(message, 'success');
      onChanged?.();
    } catch (err) {
      notify?.(`Could not save: ${err.message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${record.reference} (${record.name}) permanently? Attached documents go too.`)) return;
    setBusy(true);
    try {
      await deleteSubmission(record.reference);
      notify?.('Submission deleted', 'success');
      onDeleted?.();
    } catch (err) {
      notify?.(`Could not delete: ${err.message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    notify?.('Copied', 'success');
  };

  return (
    <div className="space-y-5" data-testid="submission-detail">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-navy-900 dark:text-white">{record.name}</h3>
            <Badge tone={statusInfo(record.status).tone}>{statusInfo(record.status).label}</Badge>
            {!record.read && <Badge tone="amber">New</Badge>}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button type="button" onClick={() => copy(record.reference)} className="inline-flex items-center gap-1 font-mono font-semibold text-navy-700 hover:text-accent-600 dark:text-slate-300">
              {record.reference} <Copy className="h-3 w-3" />
            </button>
            <span>·</span>
            <Clock className="h-3 w-3" /> {when(record.createdAt)}
            {record.updatedAt !== record.createdAt && <span className="text-slate-400">· updated {when(record.updatedAt)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={remove} disabled={busy} title="Delete permanently" className="rounded-md p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 dark:border-white/10 dark:bg-white/[0.03]">
        <Field label="Email" value={record.email} icon={Mail} />
        <Field label="Phone" value={record.phone} icon={Phone} />
        <Field label="Program" value={record.courseTitle || record.course} icon={GraduationCap} />
        <Field label="Education" value={record.education} />
        <Field label="Preferred time" value={record.timing} icon={Clock} />
        <Field label="Address" value={record.address} icon={MapPin} />
        <Field label="Source" value={record.source} />
        <Field label="Documents" value={record.documents?.length ? `${record.documents.length} attached` : null} icon={FileText} />
      </div>

      {record.message && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <MessageSquare className="h-3.5 w-3.5" /> Message
          </p>
          <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
            {record.message}
          </p>
        </div>
      )}

      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Uploaded documents</p>
        <Documents docs={record.documents} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            data-testid="submission-status"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-800 dark:text-white"
          >
            {STATUS_FLOW.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy || status === record.status}
            onClick={() => save({ status, markRead: true }, `Status set to ${statusInfo(status).label}`)}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50 dark:bg-accent-500 dark:text-navy-950 dark:hover:bg-accent-400"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Save status
          </button>
          {!record.read && (
            <button type="button" onClick={() => save({ markRead: true }, 'Marked as read')} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-navy-500 hover:text-navy-800 dark:border-white/15 dark:text-slate-300">
              Mark as read
            </button>
          )}
        </div>

        <p className="mb-1.5 mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Note shown to the applicant on their tracking page
        </p>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          data-testid="submission-note"
          placeholder="e.g. Bring your original citizenship copy to the centre on Saturday."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-slate-800 dark:text-white"
        />
        <button
          type="button"
          disabled={busy || note === (record.adminNote || '')}
          onClick={() => save({ adminNote: note }, 'Note saved')}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-navy-800/20 px-3 py-2 text-sm font-semibold text-navy-800 transition hover:border-accent-500 disabled:opacity-50 dark:border-white/20 dark:text-slate-200"
        >
          Save note
        </button>
      </div>

      {Array.isArray(record.history) && record.history.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">History</p>
          <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            {record.history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                {statusInfo(h.status).label} · {when(h.at)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function SubmissionsTab({ notify }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRef, setSelectedRef] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let alive = true;
    const stop = subscribeSubmissions(
      (list) => {
        if (!alive) return;
        setItems(list);
        setLoading(false);
        setProblem('');
      },
      (err) => {
        if (!alive) return;
        setLoading(false);
        setProblem(err?.message || 'Could not reach the submissions database.');
      }
    );
    return () => {
      alive = false;
      stop();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      if (filter === 'unread' && s.read) return false;
      if (STATUS_IDS.includes(filter) && s.status !== filter) return false;
      if (!q) return true;
      return [s.name, s.email, s.phone, s.reference, s.courseTitle, s.course, s.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, query, filter]);

  const selected = useMemo(
    () => items.find((s) => (s.reference || s.id) === selectedRef) || filtered[0] || null,
    [items, selectedRef, filtered]
  );

  const unread = items.filter((s) => !s.read).length;
  const refresh = useCallback(() => {}, []);

  const exportCsv = () => {
    const head = ['Reference', 'Name', 'Email', 'Phone', 'Program', 'Education', 'Timing', 'Status', 'Documents', 'Received', 'Message'];
    const rows = filtered.map((s) => [
      s.reference, s.name, s.email, s.phone, s.courseTitle || s.course, s.education, s.timing,
      statusInfo(s.status).label, (s.documents || []).map((d) => d.name).join(' | '), when(s.createdAt),
      String(s.message || '').replace(/\s+/g, ' '),
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    // UTF-8 BOM so Excel opens Nepali/accented names correctly.
    downloadJson(`${backupFilename()}-submissions.csv`, `\uFEFF${csv}`);
    notify?.(`Exported ${rows.length} submission${rows.length === 1 ? '' : 's'}`, 'success');
  };

  return (
    <div data-testid="submissions-tab">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-white">
            <Inbox className="h-5 w-5 text-accent-500" /> Enquiries
            {unread > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unread} new</span>}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Every enquiry sent from the website, with the documents the applicant attached.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-navy-500 dark:border-white/15 dark:text-slate-200">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button type="button" onClick={exportCsv} disabled={!filtered.length} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-navy-500 disabled:opacity-50 dark:border-white/15 dark:text-slate-200">
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            type="button"
            onClick={async () => {
              await markAllRead().catch(() => {});
              refresh();
            }}
            disabled={!unread}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50 dark:bg-accent-500 dark:text-navy-950"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark all read
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, reference…"
              data-testid="submissions-search"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-slate-800 dark:text-white"
            />
          </div>
          {['all', 'unread', ...STATUS_IDS].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                filter === id ? 'bg-navy-800 text-white dark:bg-accent-500 dark:text-navy-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300'
              )}
            >
              {id === 'all' ? 'All' : id === 'unread' ? `Unread (${unread})` : statusInfo(id).label}
            </button>
          ))}
        </div>
      )}

      {problem && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">Enquiries cannot load right now.</strong> {problem} — check that
            Anonymous sign-in is enabled in the Firebase console (Authentication → Sign-in method), then reload this page.
          </span>
        </div>
      )}

      {loading ? (
        <p className="flex items-center gap-2 py-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading enquiries…
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15">
          <Inbox className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 font-semibold text-navy-900 dark:text-white">No enquiries yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
            When a visitor sends the contact form — with or without documents — it appears here instantly, and they get
            a reference number they can use on the public tracking page.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          {/* list */}
          <div className={cn('space-y-2', selected && 'hidden lg:block')}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filtered.length} of {items.length} shown
            </p>
            {filtered.map((s) => {
              const key = s.reference || s.id;
              const active = selected && (selected.reference || selected.id) === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedRef(key);
                    if (!s.read) updateSubmission(s.reference, { markRead: true }).catch(() => {});
                  }}
                  data-testid="submission-row"
                  className={cn(
                    'block w-full rounded-xl border p-3 text-left transition',
                    active
                      ? 'border-accent-500 bg-accent-50 dark:border-accent-500 dark:bg-accent-500/10'
                      : 'border-slate-200 bg-white hover:border-navy-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-navy-900 dark:text-white">{s.name}</span>
                    {!s.read && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-label="unread" />}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400">
                    {s.courseTitle || s.course || 'No program'} · {when(s.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone={statusInfo(s.status).tone}>{statusInfo(s.status).label}</Badge>
                    {s.documents?.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        <FileText className="h-3 w-3" /> {s.documents.length}
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[10px] text-slate-400">{s.reference}</span>
                  </div>
                </button>
              );
            })}
            {!filtered.length && <p className="py-6 text-center text-sm text-slate-500">Nothing matches those filters.</p>}
          </div>

          {/* detail */}
          <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]', selected ? 'block' : 'hidden lg:block')} data-testid="submission-pane">
            {selected ? (
              <>
                <button type="button" onClick={() => setSelectedRef(null)} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 lg:hidden">
                  <ChevronLeft className="h-4 w-4" /> Back to list
                </button>
                <Detail
                  record={selected}
                  onClose={() => setSelectedRef(null)}
                  onChanged={refresh}
                  onDeleted={() => setSelectedRef(null)}
                  notify={notify}
                />
              </>
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">Select an enquiry to read it.</p>
            )}
          </div>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {PRIVACY_NOTE} Downloaded documents contain personal data — store them safely and delete enquiries you no
        longer need.
        <a href="/verify" className="inline-flex items-center gap-1 font-semibold text-navy-700 underline underline-offset-2 dark:text-slate-300">
          <ExternalLink className="h-3 w-3" /> Certificates
        </a>
      </p>
    </div>
  );
}

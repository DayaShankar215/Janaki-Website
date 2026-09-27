import { useState } from 'react';
import { Award, Plus, Trash2, CheckCircle2, XCircle, Copy, Search, Download, ShieldCheck, Loader2 } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { suggestNumber, formatIssueDate, normaliseNumber } from '@/utils/certificates';
import { downloadJson, backupFilename } from '@/utils/downloadJson';
import { Badge } from '@/components/ui/Badge';
import { logActivity } from '@/hooks/useAdminActivity';
import { cn } from '@/utils/cn';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-navy-900 dark:text-white focus:ring-2 focus:ring-accent-400 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

const blank = { number: '', name: '', course: '', issued: '', grade: '', note: '', valid: true };

export default function CertificatesTab({ notify }) {
  const { content, updateSection } = useContent();
  const certificates = Array.isArray(content.certificates) ? content.certificates : [];
  const courses = Array.isArray(content.courses) ? content.courses : [];

  const [draft, setDraft] = useState(blank);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const issue = async (e) => {
    e.preventDefault();
    setError('');
    const name = draft.name.trim();
    const course = draft.course.trim();
    if (!name || !course) {
      setError('A holder name and a program are required.');
      return;
    }
    if (certificates.some((c) => normaliseNumber(c.number) === normaliseNumber(draft.number))) {
      setError('That certificate number already exists.');
      return;
    }
    setBusy(true);
    const record = {
      number: normaliseNumber(draft.number) || suggestNumber(certificates),
      name,
      course,
      issued: draft.issued || new Date().toISOString().slice(0, 10),
      grade: draft.grade.trim(),
      note: draft.note.trim(),
      valid: true,
    };
    updateSection('certificates', [record, ...certificates]);
    logActivity?.('Issued certificate', `${record.number} — ${record.name}`);
    notify?.(`Certificate ${record.number} issued`, 'success');
    setDraft({ ...blank, number: suggestNumber([record, ...certificates]) });
    setBusy(false);
  };

  const setValid = (number, valid, note) => {
    updateSection(
      'certificates',
      certificates.map((c) => (normaliseNumber(c.number) === normaliseNumber(number) ? { ...c, valid, note } : c))
    );
    logActivity?.(valid ? 'Reinstated certificate' : 'Revoked certificate', number);
    notify?.(valid ? 'Certificate reinstated' : 'Certificate revoked', 'success');
  };

  const remove = (number) => {
    if (!window.confirm(`Delete certificate ${number}? Anyone verifying it will be told it cannot be found.`)) return;
    updateSection('certificates', certificates.filter((c) => normaliseNumber(c.number) !== normaliseNumber(number)));
    logActivity?.('Deleted certificate', number);
    notify?.('Certificate deleted', 'success');
  };

  const exportList = () => {
    const head = ['Number', 'Holder', 'Program', 'Issued', 'Grade', 'Status', 'Note'];
    const rows = certificates.map((c) => [
      c.number, c.name, c.course, c.issued, c.grade || '',
      c.valid === false ? 'Revoked' : 'Valid', c.note || '',
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    downloadJson(`${backupFilename()}-certificates.csv`, `\uFEFF${csv}`);
  };

  const q = query.trim().toLowerCase();
  const shown = certificates.filter(
    (c) => !q || [c.number, c.name, c.course].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
  );

  return (
    <div data-testid="certificates-tab">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900 dark:text-white">
            <Award className="h-5 w-5 text-accent-500" /> Certificates
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Issue a certificate, then anyone can confirm it with the number on{' '}
            <a href="/verify" target="_blank" rel="noreferrer" className="font-semibold text-navy-800 underline underline-offset-2 dark:text-slate-200">
              the verification page
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={exportList}
          disabled={!certificates.length}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-navy-500 disabled:opacity-50 dark:border-white/15 dark:text-slate-200"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <form onSubmit={issue} className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-navy-900 dark:text-white">
          <Plus className="h-4 w-4 text-accent-500" /> Issue a new certificate
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="ct-name">Holder name</label>
            <input id="ct-name" className={inputCls} value={draft.name} onChange={set('name')} placeholder="As printed on the certificate" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ct-course">Program</label>
            <input id="ct-course" className={inputCls} value={draft.course} onChange={set('course')} list="ct-courses" placeholder="e.g. Advanced CNC Programming" />
            <datalist id="ct-courses">
              {courses.map((c) => (
                <option key={c.id || c.slug} value={c.title} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelCls} htmlFor="ct-issued">Issue date</label>
            <input id="ct-issued" type="date" className={inputCls} value={draft.issued} onChange={set('issued')} />
          </div>
          <div>
            <label className={labelCls} htmlFor="ct-number">Certificate number</label>
            <input id="ct-number" className={cn(inputCls, 'font-mono')} value={draft.number} onChange={set('number')} placeholder={suggestNumber(certificates)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="ct-grade">Grade / result (optional)</label>
            <input id="ct-grade" className={inputCls} value={draft.grade} onChange={set('grade')} placeholder="e.g. Distinction" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelCls} htmlFor="ct-note">Note (optional)</label>
            <input id="ct-note" className={inputCls} value={draft.note} onChange={set('note')} placeholder="Shown only on the verification result" />
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-xs font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          data-testid="cert-issue"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50 dark:bg-accent-500 dark:text-navy-950 dark:hover:bg-accent-400"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Issue certificate
        </button>
      </form>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {certificates.length} issued · {certificates.filter((c) => c.valid === false).length} revoked
        </p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search holder, number, program…"
            className="w-64 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/15">
          <Award className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 font-semibold text-navy-900 dark:text-white">
            {certificates.length ? 'Nothing matches that search' : 'No certificates issued yet'}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
            {certificates.length
              ? 'Try a different name or number.'
              : 'Use the form above when a graduate completes a program. The record appears on the public verification page straight away.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {shown.map((c) => (
            <li
              key={c.number}
              data-testid="certificate-row"
              className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-navy-900 dark:text-white">{c.name}</span>
                    <Badge tone={c.valid === false ? 'red' : 'green'}>{c.valid === false ? 'Revoked' : 'Valid'}</Badge>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {c.course} · issued {formatIssueDate(c.issued) || '—'}
                    {c.grade ? ` · ${c.grade}` : ''}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {c.number}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(`${window.location.origin}/verify?number=${encodeURIComponent(c.number)}`);
                        notify?.('Verification link copied', 'success');
                      }}
                      title="Copy verification link"
                      className="rounded p-0.5 text-slate-400 transition hover:text-navy-800 dark:hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </p>
                  {c.note && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.note}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {c.valid === false ? (
                    <button
                      type="button"
                      onClick={() => setValid(c.number, true, '')}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/15 dark:text-slate-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Reinstate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setValid(c.number, false, 'This certificate has been revoked by the training centre.')}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-red-400 hover:text-red-600 dark:border-white/15 dark:text-slate-200"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Revoke
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(c.number)}
                    title="Delete certificate"
                    className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

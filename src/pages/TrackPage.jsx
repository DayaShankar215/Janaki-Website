import { useEffect, useState } from 'react';
import { Search, Loader2, CheckCircle2, AlertTriangle, TicketCheck, Mail, Phone, ArrowRight, FileText } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { useContent } from '@/content/ContentContext';
import { getSubmission, statusInfo, STATUS_FLOW } from '@/utils/submissions';
import { isNotEmpty, isValidEmail } from '@/utils/validate';
import { describeBytes } from '@/utils/documents';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-accent-400';

const when = (ts) => {
  try {
    return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export default function TrackPage() {
  const { courses, siteConfig } = useContent();
  useSeo(
    'Track your application',
    'Check the status of your enquiry to Janaki Technical Training Center with your reference number.'
  );

  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | found | missing
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

  // Pre-fill from ?ref=…&email=… so the confirmation screen can link straight here.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const emailParam = params.get('email');
    if (refParam) setReference(refParam.toUpperCase());
    if (emailParam) setEmail(emailParam);
  }, []);

  const lookup = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isNotEmpty(reference)) next.reference = 'Enter the reference number from your confirmation.';
    if (!isNotEmpty(email) || !isValidEmail(email)) next.email = 'Enter the email address you applied with.';
    setError(next.reference || next.email || '');
    if (Object.keys(next).length) return;

    setState('loading');
    try {
      const found = await getSubmission(reference, email);
      if (found) {
        setRecord(found);
        setState('found');
      } else {
        setState('missing');
      }
    } catch (err) {
      console.error('[Track] lookup failed:', err);
      setState('missing');
    }
  };

  const currentIndex = record ? Math.max(0, STATUS_FLOW.findIndex((s) => s.id === record.status)) : 0;
  const courseTitle = record?.courseTitle || courses.find((c) => c.slug === record?.course)?.title || record?.course;

  return (
    <>
      <PageHero
        title="Track your application"
        description="Enter your reference number and email to see exactly where your enquiry stands."
        breadcrumb={[{ label: 'Track application', to: '/track' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x max-w-3xl">
          <form onSubmit={lookup} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tr-ref" className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
                  Reference number
                </label>
                <input
                  id="tr-ref"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                  placeholder="JTTC-2026-8H3K"
                  data-testid="track-ref"
                  className={cn(inputClass, 'font-mono uppercase')}
                />
                {error && !error.includes('email') && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
              </div>
              <div>
                <label htmlFor="tr-email" className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
                  Email address
                </label>
                <input
                  id="tr-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  data-testid="track-email"
                  className={inputClass}
                />
                {error && error.includes('email') && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
              </div>
            </div>
            <button
              type="submit"
              disabled={state === 'loading'}
              data-testid="track-submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-soft transition hover:bg-accent-400 disabled:opacity-70 sm:w-auto"
            >
              {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Check my status
            </button>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Both details are required so nobody else can read your application.
            </p>
          </form>

          {state === 'missing' && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200" data-testid="track-missing">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                We could not find that reference with that email address. Check both, or call us and we will look it
                up for you.
              </span>
            </div>
          )}

          {state === 'found' && record && (
            <div className="mt-6 space-y-4" data-testid="track-result">
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <TicketCheck className="h-3.5 w-3.5" /> {record.reference}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-navy-900 dark:text-white">
                      {statusInfo(record.status).label}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{statusInfo(record.status).blurb}</p>
                  </div>
                  <p className="rounded-lg bg-navy-50 px-3 py-2 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    Applied for <strong className="font-semibold">{courseTitle || 'a program'}</strong>
                    <br />
                    on {when(record.createdAt)}
                  </p>
                </div>

                <ol className="mt-7 space-y-4" data-testid="track-timeline">
                  {STATUS_FLOW.map((step, i) => {
                    const done = i < currentIndex;
                    const active = i === currentIndex;
                    const stamp = record.history?.filter((h) => h.status === step.id).slice(-1)[0];
                    return (
                      <li key={step.id} className="flex gap-3">
                        <span
                          className={cn(
                            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold',
                            done
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : active
                                ? 'border-accent-500 bg-accent-500 text-navy-950'
                                : 'border-slate-300 text-slate-400 dark:border-white/20'
                          )}
                        >
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className={cn('block text-sm font-semibold', active ? 'text-navy-900 dark:text-white' : 'text-slate-600 dark:text-slate-300')}>
                            {step.label}
                            {active && <span className="ml-2 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-950">Now</span>}
                          </span>
                          {stamp && <span className="block text-xs text-slate-500 dark:text-slate-400">{when(stamp.at)}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {Array.isArray(record.documents) && record.documents.length > 0 && (
                  <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 dark:text-white">
                      <FileText className="h-4 w-4 text-accent-500" /> Documents you sent ({record.documents.length})
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {record.documents.map((d, i) => (
                        <li key={`${d.name}-${i}`}>
                          {d.name} · {describeBytes(d.size)} · received successfully
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {record.adminNote && (
                  <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200">
                    <strong className="font-semibold">Note from our team:</strong> {record.adminNote}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-sm text-slate-600 dark:text-slate-300">Something wrong or need to hurry up?</p>
                <Button to="/contact" variant="outline" size="sm">
                  <Mail className="h-4 w-4" /> Message us
                </Button>
                <a href={`tel:${siteConfig?.phone || ''}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-accent-600 dark:text-slate-200">
                  <Phone className="h-4 w-4" /> {siteConfig?.phone}
                </a>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Never applied yet?{' '}
            <a href="/courses" className="inline-flex items-center gap-1 font-semibold text-navy-800 underline underline-offset-2 hover:text-accent-600 dark:text-slate-200">
              Browse the programs <ArrowRight className="h-3 w-3" />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

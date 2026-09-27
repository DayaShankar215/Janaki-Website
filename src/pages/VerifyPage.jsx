import { useEffect, useState } from 'react';
import { Award, Search, CheckCircle2, XCircle, ShieldCheck, AlertTriangle, Calendar, GraduationCap, Mail, Phone } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { useContent } from '@/content/ContentContext';
import { verifyCertificate, formatIssueDate, normaliseNumber } from '@/utils/certificates';
import { isNotEmpty } from '@/utils/validate';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm uppercase text-navy-900 placeholder:font-sans placeholder:text-slate-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-white/15 dark:bg-white/[0.05] dark:text-white';

export default function VerifyPage() {
  const { certificates, siteConfig } = useContent();
  useSeo(
    'Verify a certificate',
    'Check whether a certificate issued by Janaki Technical Training Center is genuine.'
  );

  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  // /verify?number=… — lets an admin or a printed certificate link straight in.
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('number');
    if (fromQuery) setNumber(fromQuery.toUpperCase());
  }, []);

  const lookup = (e) => {
    e.preventDefault();
    if (!isNotEmpty(number)) {
      setError('Enter the certificate number printed on the certificate.');
      return;
    }
    setError('');
    setResult(verifyCertificate(certificates, number));
    setSearched(true);
  };

  return (
    <>
      <PageHero
        title="Verify a certificate"
        description="Employers, colleges and students can confirm a certificate in a few seconds using the number printed on it."
        breadcrumb={[{ label: 'Verify certificate', to: '/verify' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x max-w-2xl">
          <form onSubmit={lookup} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
            <label htmlFor="vc-number" className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
              Certificate number
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="vc-number"
                value={number}
                onChange={(e) => setNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && lookup(e)}
                placeholder="JTTC-CERT-2026-0001"
                data-testid="verify-number"
                className={cn(inputClass, error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20')}
              />
              <button
                type="submit"
                data-testid="verify-submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-bold text-navy-950 shadow-soft transition hover:bg-accent-400"
              >
                <Search className="h-4 w-4" /> Verify
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Only the certificate number is checked — we never
              show a list of graduates.
            </p>
          </form>

          {searched && !result && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200" data-testid="verify-not-found">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <strong className="font-semibold">No certificate found for {normaliseNumber(number)}.</strong> Check the
                number for typos, or contact the centre if the certificate is recent.
              </span>
            </div>
          )}

          {result && (
            <div
              className={cn(
                'mt-6 overflow-hidden rounded-2xl border bg-white shadow-card dark:bg-white/[0.04]',
                result.valid ? 'border-emerald-300 dark:border-emerald-500/40' : 'border-red-300 dark:border-red-500/40'
              )}
              data-testid="verify-result"
            >
              <div className={cn('flex items-center gap-3 px-6 py-4', result.valid ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10')}>
                {result.valid ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="h-6 w-6 shrink-0 text-red-600" />
                )}
                <div>
                  <p className={cn('font-display text-lg font-bold', result.valid ? 'text-emerald-900 dark:text-emerald-200' : 'text-red-900 dark:text-red-200')}>
                    {result.valid ? 'Genuine certificate' : 'Certificate not valid'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {result.valid
                      ? 'Issued by Janaki Technical Training Center.'
                      : result.reason}
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 p-6 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Certificate number</dt>
                  <dd className="mt-0.5 font-mono text-sm font-semibold text-navy-900 dark:text-white">{result.certificate.number}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Holder</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-navy-900 dark:text-white">{result.certificate.name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Program</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                    <GraduationCap className="h-4 w-4 text-accent-500" /> {result.certificate.course}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Issued</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                    <Calendar className="h-4 w-4 text-accent-500" /> {formatIssueDate(result.certificate.issued)}
                  </dd>
                </div>
                {result.certificate.grade && (
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Result</dt>
                    <dd className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">
                      <Badge tone="green">{result.certificate.grade}</Badge>
                    </dd>
                  </div>
                )}
              </dl>

              {result.certificate.note && (
                <p className="mx-6 mb-6 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {result.certificate.note}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
            <Award className="mx-auto h-8 w-8 text-accent-500" />
            <p className="mt-2 font-display text-base font-bold text-navy-900 dark:text-white">Something not adding up?</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
              We confirm every certificate by hand. Send us the number and we will check it for you.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href={`mailto:${siteConfig?.email || ''}`} className="inline-flex items-center gap-1.5 font-semibold text-navy-800 hover:text-accent-600 dark:text-slate-200">
                <Mail className="h-4 w-4" /> Email us
              </a>
              <a href={`tel:${siteConfig?.phone || ''}`} className="inline-flex items-center gap-1.5 font-semibold text-navy-800 hover:text-accent-600 dark:text-slate-200">
                <Phone className="h-4 w-4" /> {siteConfig?.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

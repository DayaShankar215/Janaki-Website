import { useMemo } from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';
import { useContent } from '@/content/ContentContext';

/** Small helper so the sheet stays readable as JSX. */
const Item = ({ children }) => <li className="print-keep flex gap-2 text-[11.5px] leading-relaxed text-slate-700">{children}</li>;

const Section = ({ title, children }) => (
  <section className="print-keep mt-5">
    <h2 className="mb-2 border-b border-slate-300 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-900 print-rule dark:text-slate-900">
      {title}
    </h2>
    {children}
  </section>
);

export default function BrochurePage() {
  const { siteConfig, courses, whyChooseUs, admissionSteps, facilities } = useContent();
  useSeo(
    'Brochure',
    'Download the Janaki Technical Training Center brochure — training areas, admission process and contact details.'
  );

  const liveCourses = useMemo(
    () => (courses || []).filter((c) => c.active !== false),
    [courses]
  );

  const areas = useMemo(() => {
    const seen = new Map();
    for (const c of liveCourses) {
      const area = c.area || c.category || 'General';
      if (!seen.has(area)) seen.set(area, []);
      seen.get(area).push(c);
    }
    return [...seen.entries()];
  }, [liveCourses]);

  return (
    <>
      {/* Toolbar: the visitor's screen only. */}
      <div className="no-print border-b border-slate-200 bg-slate-50 py-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="container-x flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-accent-600 dark:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Back to the site
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Print this page, or choose “Save as PDF” in the print dialog.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              data-testid="brochure-print"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-soft transition hover:bg-accent-400"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── The sheet ── */}
      <article className="print-page container-x max-w-3xl bg-white py-10 text-slate-900 dark:bg-white dark:text-slate-100">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-navy-900 pb-4 print-rule dark:border-slate-200">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 dark:text-slate-900">
              {siteConfig?.name || 'Janaki Technical Training Center'}
            </h1>
            <p className="mt-0.5 text-sm font-semibold text-slate-600 dark:text-slate-700">
              {siteConfig?.tagline || ''}
            </p>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-slate-600 dark:text-slate-700">
            {siteConfig?.address && <p>{siteConfig.address}</p>}
            {siteConfig?.phone && <p>Phone: {siteConfig.phone}{siteConfig?.phoneAlt ? ` / ${siteConfig.phoneAlt}` : ''}</p>}
            {siteConfig?.email && <p>{siteConfig.email}</p>}
          </div>
        </header>

        <p className="mt-4 text-[12px] leading-relaxed text-slate-700 dark:text-slate-700">
          {siteConfig?.description ||
            'Practical technical and vocational training designed to equip learners with industry-relevant skills and real-world, hands-on experience.'}
        </p>

        <Section title="Training areas and programs">
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {areas.map(([area, list]) => (
              <div key={area} className="print-keep">
                <h3 className="text-[12px] font-bold text-navy-900 dark:text-slate-900">{area}</h3>
                <ul className="mt-1 space-y-0.5">
                  {list.map((c) => (
                    <Item key={c.id || c.slug}>
                      <span aria-hidden="true">•</span>
                      <span>
                        <strong>{c.title}</strong>
                        {c.duration ? ` — ${c.duration}` : ''}
                      </span>
                    </Item>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {(whyChooseUs || []).length > 0 && (
          <Section title="Why learn with us">
            <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {whyChooseUs.slice(0, 8).map((w) => (
                <Item key={w.id || w.title}>
                  <span aria-hidden="true">✓</span>
                  <span>
                    <strong>{w.title}</strong>
                    {w.description ? ` — ${w.description}` : ''}
                  </span>
                </Item>
              ))}
            </ul>
          </Section>
        )}

        {(facilities || []).length > 0 && (
          <Section title="Facilities">
            <p className="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-700">
              {(facilities || [])
                .map((f) => f.title)
                .filter(Boolean)
                .join(' · ')}
            </p>
          </Section>
        )}

        {(admissionSteps || []).length > 0 && (
          <Section title="How to join">
            <ol className="space-y-1.5">
              {admissionSteps.map((s, i) => (
                <li key={s.id || s.title} className="print-keep flex gap-2 text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-700">
                  <span className="font-bold">{i + 1}.</span>
                  <span>
                    <strong>{s.title}</strong>
                    {s.description ? ` — ${s.description}` : ''}
                  </span>
                </li>
              ))}
            </ol>
            <p className="no-print mt-3 text-[11.5px] font-semibold text-navy-800 dark:text-slate-800">
              Ready to start? Fill the{' '}
              <Link to="/admission-form" className="underline underline-offset-2">
                admission form
              </Link>{' '}
              and print it, or send us an{' '}
              <Link to="/contact" className="underline underline-offset-2">
                online enquiry
              </Link>
              .
            </p>
          </Section>
        )}

        <Section title="Certificate verification">
          <p className="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-700">
            Every certificate we issue carries a number. Employers and colleges can confirm it online at{' '}
            <strong>/verify</strong> using the number printed on the certificate.
          </p>
        </Section>

        <footer className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-slate-300 pt-3 text-[10.5px] text-slate-500 print-rule dark:border-slate-300 dark:text-slate-600">
          <span>
            {siteConfig?.name} · Practical skills for real work
          </span>
          <span>Scan for current fees and intake dates — call {siteConfig?.phone || ''}</span>
        </footer>
      </article>

      <div className="no-print border-t border-slate-200 py-10 dark:border-white/10">
        <div className="container-x max-w-3xl text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Prefer a PDF on your phone? Use your browser’s print menu and choose “Save as PDF”.
          </p>
          <Link
            to="/admission-form"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-navy-800 transition hover:border-accent-500 dark:border-white/15 dark:text-slate-200"
          >
            <Download className="h-4 w-4" /> Admission form (printable)
          </Link>
        </div>
      </div>
    </>
  );
}

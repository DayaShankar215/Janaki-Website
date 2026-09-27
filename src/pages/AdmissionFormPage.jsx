import { useEffect, useMemo, useState } from 'react';
import { Printer, ArrowLeft, Eraser, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';
import { useContent } from '@/content/ContentContext';
import { isNotEmpty, isValidEmail } from '@/utils/validate';

const DRAFT_KEY = 'jttc-admission-form-draft';

const blankForm = {
  fullName: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  guardian: '',
  guardianPhone: '',
  program: '',
  timing: '',
  education: '',
  experience: '',
  hearAbout: '',
  agree: false,
  agreeTerms: false,
};

const FIELD_LABEL = 'text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-600';

/** Print-friendly input: a lined box that keeps its value on paper. */
function Line({ label, value, onChange, type = 'text', placeholder, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      <span className={FIELD_LABEL}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={`admission-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
        className="mt-1 w-full border-b border-slate-400 bg-transparent px-0 py-1 text-[12.5px] text-slate-900 outline-none placeholder:text-slate-300 focus:border-navy-700 dark:border-slate-500 dark:text-slate-900 dark:placeholder:text-slate-400"
        {...rest}
      />
    </label>
  );
}

function Box({ label, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-navy-800"
      />
      <span>
        <span className="font-semibold">{label}</span> {children}
      </span>
    </label>
  );
}

export default function AdmissionFormPage() {
  const { siteConfig, courses, educationLevels, preferredTimings } = useContent();
  useSeo(
    'Admission form',
    'Fill in, print or save as PDF, and bring or post the Janaki Technical Training Center admission form.'
  );

  const [form, setForm] = useState(blankForm);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  // Restore the applicant's own draft so a half-finished form survives a
  // refresh or a phone that sleeps mid-application.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setForm({ ...blankForm, ...JSON.parse(raw) });
    } catch {
      /* ignore a corrupt draft */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* private mode — the form still works, it just will not be remembered */
    }
  }, [form, loaded]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const programOptions = useMemo(
    () => (courses || []).filter((c) => c.active !== false).map((c) => c.title),
    [courses]
  );

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.fullName)) next.fullName = 'Please write your full name.';
    if (!isNotEmpty(form.phone)) next.phone = 'A phone number helps us call you back.';
    if (form.email && !isValidEmail(form.email)) next.email = 'That email address looks incomplete.';
    if (!isNotEmpty(form.program)) next.program = 'Choose the program you are applying for.';
    if (!form.agree) next.agree = 'Please confirm the declaration before printing.';
    if (!form.agreeTerms) next.agreeTerms = 'Please acknowledge the terms before printing.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const print = () => {
    if (validate()) window.print();
  };

  const clear = () => {
    if (!window.confirm('Clear the whole form? The saved draft will be deleted.')) return;
    setForm(blankForm);
    setErrors({});
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nothing to clean up */
    }
  };

  const levelOptions = (educationLevels || []).map((l) => l.label || l.title || l).filter(Boolean);
  const timingOptions = (preferredTimings || []).map((t) => t.label || t.title || t).filter(Boolean);

  return (
    <>
      <div className="no-print border-b border-slate-200 bg-slate-50 py-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="container-x flex flex-wrap items-center justify-between gap-3">
          <Link to="/admission" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-accent-600 dark:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Admission info
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">Your answers are saved on this device only.</p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-400 hover:text-red-600 dark:border-white/15 dark:text-slate-300"
            >
              <Eraser className="h-4 w-4" /> Clear
            </button>
            <button
              type="button"
              onClick={print}
              data-testid="admission-print"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-navy-950 shadow-soft transition hover:bg-accent-400"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <article className="print-page container-x max-w-3xl bg-white py-10 text-slate-900 dark:bg-white dark:text-slate-100">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-navy-900 pb-4 print-rule dark:border-slate-200">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 dark:text-slate-900">
              Admission form
            </h1>
            <p className="mt-0.5 text-sm font-semibold text-slate-600 dark:text-slate-700">
              {siteConfig?.name}
            </p>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-slate-600 dark:text-slate-700">
            {siteConfig?.address && <p>{siteConfig.address}</p>}
            {siteConfig?.phone && <p>Phone: {siteConfig.phone}</p>}
            {siteConfig?.email && <p>{siteConfig.email}</p>}
          </div>
        </header>

        <p className="no-print mt-4 flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50 p-3 text-[12px] text-accent-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200">
          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
          Fill this in on screen, then print or save as PDF. A printed, hand-signed copy is accepted the same way as the
          online form — bring it to the centre with your documents.
        </p>

        {/* 1 — Applicant */}
        <section className="print-keep mt-5">
          <h2 className="mb-3 border-b border-slate-300 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-900 print-rule dark:text-slate-900">
            1. Applicant details
          </h2>
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <Line label="Full name" value={form.fullName} onChange={set('fullName')} placeholder="As in your citizenship copy" />
            <Line label="Date of birth" type="date" value={form.dob} onChange={set('dob')} />
            <Line label="Gender" value={form.gender} onChange={set('gender')} placeholder="Male / Female / Other" />
            <Line label="Phone (mobile)" value={form.phone} onChange={set('phone')} placeholder="98XXXXXXXX" />
            <Line label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            <Line label="Current address" value={form.address} onChange={set('address')} />
            <Line label="Guardian / parent name" value={form.guardian} onChange={set('guardian')} />
            <Line label="Guardian phone" value={form.guardianPhone} onChange={set('guardianPhone')} />
          </div>
          {errors.fullName && <p className="no-print mt-2 text-xs font-medium text-red-600">{errors.fullName}</p>}
          {errors.phone && <p className="no-print text-xs font-medium text-red-600">{errors.phone}</p>}
          {errors.email && <p className="no-print text-xs font-medium text-red-600">{errors.email}</p>}
        </section>

        {/* 2 — Training */}
        <section className="print-keep mt-5">
          <h2 className="mb-3 border-b border-slate-300 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-900 print-rule dark:text-slate-900">
            2. Training you want
          </h2>
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <label className="block">
              <span className={FIELD_LABEL}>Program applied for</span>
              <select
                value={form.program}
                onChange={set('program')}
                data-testid="admission-program"
                className="mt-1 w-full border-b border-slate-400 bg-transparent px-0 py-1 text-[12.5px] text-slate-900 outline-none dark:border-slate-500 dark:text-slate-900"
              >
                <option value="">— choose a program —</option>
                {programOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={FIELD_LABEL}>Preferred batch / time</span>
              <select
                value={form.timing}
                onChange={set('timing')}
                className="mt-1 w-full border-b border-slate-400 bg-transparent px-0 py-1 text-[12.5px] text-slate-900 outline-none dark:border-slate-500 dark:text-slate-900"
              >
                <option value="">— any / let us advise —</option>
                {timingOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={FIELD_LABEL}>Highest qualification</span>
              <select
                value={form.education}
                onChange={set('education')}
                className="mt-1 w-full border-b border-slate-400 bg-transparent px-0 py-1 text-[12.5px] text-slate-900 outline-none dark:border-slate-500 dark:text-slate-900"
              >
                <option value="">— select —</option>
                {levelOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <Line label="Previous training or work" value={form.experience} onChange={set('experience')} placeholder="Years, or leave blank" />
            <Line label="How did you hear about us?" value={form.hearAbout} onChange={set('hearAbout')} className="sm:col-span-2" />
          </div>
          {errors.program && <p className="no-print mt-2 text-xs font-medium text-red-600">{errors.program}</p>}
        </section>

        {/* 3 — Documents */}
        <section className="print-keep mt-5">
          <h2 className="mb-3 border-b border-slate-300 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-900 print-rule dark:text-slate-900">
            3. Bring these with you
          </h2>
          <ul className="grid gap-1.5 text-[11.5px] text-slate-700 sm:grid-cols-2 dark:text-slate-700">
            {[
              'Citizenship copy (or birth certificate)',
              'Character / conduct certificate',
              'Last qualification mark sheet',
              'Passport-size photos (4 copies)',
              'Guardian’s copy of citizenship (if under 18)',
              'Any prior training certificate',
            ].map((d) => (
              <li key={d} className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-3 w-3 border border-slate-500" />
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* 4 — Declaration */}
        <section className="print-keep mt-5">
          <h2 className="mb-3 border-b border-slate-300 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-navy-900 print-rule dark:text-slate-900">
            4. Declaration and signature
          </h2>
          <div className="space-y-2">
            <Box label="I confirm" checked={form.agree} onChange={set('agree')}>
              the information above is correct, and I allow {siteConfig?.name} to keep a copy of my documents for
              admission and record keeping.
            </Box>
            <Box label="I understand" checked={form.agreeTerms} onChange={set('agreeTerms')}>
              that fees once paid are not refundable, and that the centre may verify my details with the documents I
              submit.
            </Box>
          </div>
          {errors.agree && <p className="no-print mt-2 text-xs font-medium text-red-600">{errors.agree}</p>}
          {errors.agreeTerms && <p className="no-print text-xs font-medium text-red-600">{errors.agreeTerms}</p>}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <span className={FIELD_LABEL}>Applicant signature</span>
              <div className="mt-6 border-b border-slate-400 dark:border-slate-500" />
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-600">Date</p>
            </div>
            <div>
              <span className={FIELD_LABEL}>Guardian signature (if under 18)</span>
              <div className="mt-6 border-b border-slate-400 dark:border-slate-500" />
              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-600">Date</p>
            </div>
          </div>
        </section>

        {/* Office use */}
        <section className="print-keep mt-5 rounded border border-dashed border-slate-400 p-3 dark:border-slate-400">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" /> For office use only
          </p>
          <div className="mt-2 grid gap-2 text-[10.5px] text-slate-600 sm:grid-cols-4 dark:text-slate-600">
            <span>Received on: ____________</span>
            <span>Fee paid: ____________</span>
            <span>Batch: ____________</span>
            <span>Receipt no: ____________</span>
          </div>
        </section>
      </article>

      <div className="no-print border-t border-slate-200 py-10 dark:border-white/10">
        <div className="container-x max-w-3xl space-y-3 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Would rather apply from your phone?{' '}
            <Link to="/contact" className="font-semibold text-navy-800 underline underline-offset-2 dark:text-slate-200">
              Send an online enquiry
            </Link>{' '}
            and attach your documents — you will get a reference number to track.
          </p>
          <Link
            to="/brochure"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-navy-800 transition hover:border-accent-500 dark:border-white/15 dark:text-slate-200"
          >
            <FileText className="h-4 w-4" /> Printable brochure
          </Link>
        </div>
      </div>
    </>
  );
}

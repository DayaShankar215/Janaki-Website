import { useMemo, useRef, useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Copy, TicketCheck } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { isNotEmpty, isValidEmail, isValidPhone } from '@/utils/validate';
import { sendInquiry } from '@/utils/sendInquiry';
import { saveSubmission } from '@/utils/submissions';
import { DocumentUpload } from '@/components/forms/DocumentUpload';
import { describeBytes } from '@/utils/documents';
import { cn } from '@/utils/cn';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  course: '',
  education: '',
  timing: '',
  message: '',
  // Honeypot — hidden from humans; bots tend to fill every field.
  company: '',
};

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-accent-400';

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy-900 dark:text-slate-200">
        {label}
        {required && !label.endsWith('*') && (
          <span className="text-red-500" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertTriangle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ defaultCourse = '', compact = false }) {
  const { courses, educationLevels, preferredTimings } = useContent();
  const [form, setForm] = useState({
    ...initialForm,
    course: courses.some((c) => c.slug === defaultCourse) ? defaultCourse : '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [demoMode, setDemoMode] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [result, setResult] = useState(null); // { reference, queued, emailed }
  const [copied, setCopied] = useState(false);
  const sendingRef = useRef(false);

  const activeCourses = useMemo(() => courses.filter((c) => c.active), [courses]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) next.name = 'Please tell us your name.';
    if (!isNotEmpty(form.email)) next.email = 'Please enter a valid email address.';
    else if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.';
    if (!isNotEmpty(form.phone)) next.phone = 'Please provide a contact number.';
    else if (!isValidPhone(form.phone)) next.phone = 'Please provide a contact number.';
    if (!form.course) next.course = 'Choose the program you are interested in.';
    if (!isNotEmpty(form.message)) next.message = 'Please write a short message.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sendingRef.current) return; // duplicate submission guard

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    sendingRef.current = true;
    setStatus('sending');

    const courseTitle = activeCourses.find((c) => c.slug === form.course)?.title || form.course || '—';
    const payload = {
      from_name: form.name.trim(),
      reply_email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || '—',
      course: form.course,
      education: form.education || '—',
      preferred_time: form.timing || '—',
      message: form.message.trim(),
      documents: documents.length ? documents.map((d) => d.name).join(', ') : 'none attached',
      sent_at: new Date().toLocaleString(),
    };

    // The enquiry itself is the thing that must not be lost, so it is stored
    // first. EmailJS stays the notification channel, but the visitor is not made
    // to wait for a third-party script on a slow connection — the confirmation
    // (and their reference number) appears as soon as the enquiry is safe, and
    // the email result updates the panel a moment later if it has not landed.
    let savedRecord = null;
    try {
      savedRecord = await saveSubmission({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        course: form.course,
        courseTitle,
        education: form.education,
        timing: form.timing,
        message: form.message.trim(),
        documents,
        source: compact ? 'contact-compact' : 'contact',
      });
    } catch (err) {
      console.error('[Submissions] Save failed:', err);
    }

    if (!savedRecord) {
      // Nothing stored anywhere — the visitor must be told, not left guessing.
      setStatus('error');
      sendingRef.current = false;
      return;
    }

    setResult({
      reference: savedRecord.reference,
      queued: savedRecord.queued,
      emailed: null, // decided below
      email: form.email.trim(),
    });
    setStatus('success');
    setForm({ ...initialForm });
    setDocuments([]);
    sendingRef.current = false;

    sendInquiry(payload)
      .then((res) => {
        setDemoMode(Boolean(res && res.demo));
        setResult((prev) => (prev ? { ...prev, emailed: true } : prev));
      })
      .catch((err) => {
        console.error('[EmailJS] Submission failed:', err);
        setResult((prev) => (prev ? { ...prev, emailed: false } : prev));
      });
  };

  if (status === 'success') {
    const ref_ = result?.reference;
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-emerald-900 dark:text-emerald-200">
          Inquiry sent!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-800 dark:text-emerald-300">
          Thank you — we will get back to you within one to two working days.
        </p>

        {ref_ && (
          <div className="mt-5 w-full max-w-sm rounded-xl border border-emerald-300 bg-white p-4 text-left dark:border-emerald-500/40 dark:bg-white/[0.06]" data-testid="submit-reference">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              <TicketCheck className="h-3.5 w-3.5" /> Your reference number
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="font-mono text-lg font-bold tracking-wide text-navy-900 dark:text-white">{ref_}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(ref_);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/20 dark:text-slate-300"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Keep this safe — use it with your email address to{' '}
                <a
                  href={`/track?ref=${encodeURIComponent(ref_)}&email=${encodeURIComponent(result?.email || '')}`}
                  className="font-semibold text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
                >
                  track your application
                </a>
                .
              </p>
          </div>
        )}

        {result?.queued && (
          <p className="mt-3 max-w-sm rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            Your connection dropped while uploading, so we have saved your details on this device and will send them the
            moment you are back online.
          </p>
        )}
        {!result?.emailed && result?.emailed === false && (
          <p className="mt-3 max-w-sm rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            The confirmation email could not be sent, but your enquiry is safely with us — we will contact you by phone.
          </p>
        )}
        {demoMode && (
          <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            Demo mode: no real email was sent — add the EmailJS keys to send confirmation emails.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setResult(null);
          }}
          className="mt-5 text-sm font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('space-y-4', !compact && '')} aria-label="Training inquiry form">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={update('company')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *" htmlFor="cf-name" required error={errors.name}>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder="e.g. Ramesh Shrestha"
          />
        </Field>

        <Field label="Email address" htmlFor="cf-email" required error={errors.email}>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone number *" htmlFor="cf-phone" required error={errors.phone}>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            placeholder="Your mobile / contact number"
          />
        </Field>

        <Field label="Address" htmlFor="cf-address">
          <input
            id="cf-address"
            type="text"
            autoComplete="street-address"
            value={form.address}
            onChange={update('address')}
            className={inputClass}
            placeholder="City / district"
          />
        </Field>

        <Field label="Interested course" htmlFor="cf-course" required error={errors.course}>
          <select
            id="cf-course"
            value={form.course}
            onChange={update('course')}
            aria-invalid={Boolean(errors.course)}
            className={cn(inputClass, !form.course && 'text-slate-400 dark:text-slate-500')}
          >
            <option value="">Select a course…</option>
            {activeCourses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Education level" htmlFor="cf-education">
          <select id="cf-education" value={form.education} onChange={update('education')} className={inputClass}>
            <option value="">Select education level…</option>
            {educationLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Preferred training time" htmlFor="cf-timing">
        <div id="cf-timing" className="flex flex-wrap gap-2" role="group" aria-label="Preferred training time">
          {preferredTimings.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, timing: f.timing === t ? '' : t }))}
              aria-pressed={form.timing === t}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                form.timing === t
                  ? 'border-navy-600 bg-navy-700 text-white dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                  : 'border-slate-300 text-slate-600 hover:border-navy-400 hover:text-navy-700 dark:border-white/20 dark:text-slate-300 dark:hover:border-white/40'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Your message" htmlFor="cf-message" required error={errors.message}>
        <textarea
          id="cf-message"
          rows={4}
          value={form.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          className={cn(inputClass, 'resize-y')}
          placeholder="Tell us a little about your training goals…"
        />
      </Field>

      {/* Documents: optional, but it saves a trip if the applicant can attach
          a citizenship photo, a marksheet or a previous certificate now. */}
      <DocumentUpload
        documents={documents}
        onChange={setDocuments}
        disabled={status === 'sending'}
        error={errors.documents}
      />

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          We couldn't send your inquiry right now. Please try again or contact us directly by phone or email.
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Your details and documents are only used to process your enquiry.
          {documents.length > 0 && ` ${describeBytes(documents.reduce((s, d) => s + (d.size || 0), 0))} attached.`}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-7 py-3 text-sm font-bold text-navy-950 shadow-soft transition-all hover:bg-accent-400 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send Inquiry
            </>
          )}
        </button>
      </div>
    </form>
  );
}



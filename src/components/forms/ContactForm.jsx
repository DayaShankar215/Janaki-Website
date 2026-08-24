import { useMemo, useRef, useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { isNotEmpty, isValidEmail, isValidPhone } from '@/utils/validate';
import { sendInquiry } from '@/utils/sendInquiry';
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
        {required && (
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
  const sendingRef = useRef(false);

  const activeCourses = useMemo(() => courses.filter((c) => c.active), []);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) next.name = 'Please enter your full name.';
    if (!isNotEmpty(form.email)) next.email = 'Please enter your email address.';
    else if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.';
    if (!isNotEmpty(form.phone)) next.phone = 'Please enter your phone number.';
    else if (!isValidPhone(form.phone)) next.phone = 'Please enter a valid phone number.';
    if (!form.course) next.course = 'Please choose the course you are interested in.';
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

    try {
      const result = await sendInquiry({
        from_name: form.name.trim(),
        reply_email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || '—',
        course: form.course,
        education: form.education || '—',
        preferred_time: form.timing || '—',
        message: form.message.trim(),
        sent_at: new Date().toLocaleString(),
      });
      setDemoMode(Boolean(result.demo));
      setStatus('success');
      setForm({ ...initialForm });
    } catch (err) {
      console.error('[EmailJS] Submission failed:', err);
      setStatus('error');
    } finally {
      sendingRef.current = false;
    }
  };

  if (status === 'success') {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-card">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-emerald-900 dark:text-emerald-200">
          Thank you for your inquiry.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-800 dark:text-emerald-300">
          Our team will contact you soon.
        </p>
        {demoMode && (
          <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            Demo mode: EmailJS is not configured yet — no email was actually sent.
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus('idle')}
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
        <Field label="Full Name" htmlFor="cf-name" required error={errors.name}>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder="e.g. Ram Kumar Sharma"
          />
        </Field>

        <Field label="Email" htmlFor="cf-email" required error={errors.email}>
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

        <Field label="Phone Number" htmlFor="cf-phone" required error={errors.phone}>
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

        <Field label="Course Interested In" htmlFor="cf-course" required error={errors.course}>
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

        <Field label="Education Level" htmlFor="cf-education">
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

      <Field label="Preferred Training Time" htmlFor="cf-timing">
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

      <Field label="Message" htmlFor="cf-message" required error={errors.message}>
        <textarea
          id="cf-message"
          rows={4}
          value={form.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          className={cn(inputClass, 'resize-y')}
          placeholder="Tell us briefly about yourself or ask any questions…"
        />
      </Field>

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
          Your details are only used to respond to your inquiry.
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
              <Send className="h-4 w-4" /> Submit Inquiry
            </>
          )}
        </button>
      </div>
    </form>
  );
}



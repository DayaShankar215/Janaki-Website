import { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Loader2, Mail } from 'lucide-react';
import { isValidEmail } from '@/utils/validate';
import { subscribeNewsletter } from '@/utils/sendInquiry';

const inputCls =
  'w-full rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30';

/** Footer email-subscribe box. Sends the address to the center via EmailJS. */
export function NewsletterSignup({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      setStatus('error');
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const result = await subscribeNewsletter(value);
      setStatus('ok');
      setEmail('');
      if (result.demo) {
        // still show success; a note is surfaced by the util
      }
    } catch {
      setStatus('error');
      setError("We couldn't subscribe you right now. Please try again.");
    }
  };

  if (status === 'ok') {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Thanks — you're on the list. We'll notify you about new batches and events.
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        <Mail className="h-3.5 w-3.5 text-accent-400" /> Get updates
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
        New batches, admission dates and events — straight to your inbox.
      </p>
      <div className="mt-3 flex gap-2">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="you@example.com"
          className={inputCls}
          aria-invalid={status === 'error'}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-label="Subscribe"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-bold text-navy-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="hidden sm:inline">{status === 'sending' ? 'Subscribing…' : 'Subscribe'}</span>
        </button>
      </div>
      {status === 'error' && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </form>
  );
}
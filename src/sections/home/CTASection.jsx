import { useState } from 'react';
import { Phone, ArrowRight, Send, CheckCircle2, BellRing } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/** Final call-to-action band with a "batch alerts" mini form. */
export function CTASection() {
  const { siteConfig } = useContent();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    try {
      const KEY = 'jttc-subscribers-v1';
      const raw = localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(email.trim())) list.push(email.trim());
      localStorage.setItem(KEY, JSON.stringify(list));
      setDone(true);
    } catch {
      setError('Could not save your email right now. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-20">
      <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
      <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden="true" />
      <div className="aurora">
        <div className="aurora-blob h-56 w-56 bg-accent-500/15" style={{ top: '10%', left: '55%', animation: 'aurora-drift-2 24s ease-in-out infinite' }} />
      </div>

      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {'Ready to Build Your Future?'}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {'Choose a trade, learn it practically, and step confidently toward work you can be proud of.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Button to="/admission" variant="accent" size="lg" className="group shine">
                {'Apply Now'}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button to="/contact" variant="white-outline" size="lg">
                <Send className="h-4 w-4" />
                {'Contact Us'}
              </Button>
            </div>
            <a
              href={`tel:${siteConfig.phone}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-accent-400"
            >
              <Phone className="h-4 w-4" />
              {'Call us:'} {siteConfig.phone}
            </a>

            {/* Batch alert signup */}
            <div className="mx-auto mt-8 max-w-md">
              {done ? (
                <p className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" /> {"You're on the list! We'll email you when a new batch opens."}
                </p>
              ) : (
                <form onSubmit={subscribe} noValidate className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <BellRing className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="Your email for new-batch alerts"
                      aria-label="Your email for new-batch alerts"
                      className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 backdrop-blur focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-accent-400"
                  >
                    {'Notify me'}
                  </button>
                </form>
              )}
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              <p className="mt-2 text-[11px] text-slate-500">
                {'We only use your email to notify you about admissions & batch openings.'}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
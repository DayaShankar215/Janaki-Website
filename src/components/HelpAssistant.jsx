import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageCircleQuestion, X, Send, Sparkles, Search, Phone, Mail, MapPin,
  FileText, TicketCheck, Award, BookOpen, MessageSquare, ChevronRight, Loader2,
} from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { cn } from '@/utils/cn';

const OPEN_KEY = 'jttc-help-open';

/**
 * Rule-based help assistant.
 *
 * No API key and no model: it matches the visitor's words against the FAQ
 * entries the admin panel already edits, plus a few hand-written shortcuts for
 * the tasks people ask about most (applying, tracking, verifying a certificate,
 * getting the brochure). Anything it cannot answer is handed to a human.
 */

const SHORTCUTS = [
  { id: 'apply', label: 'How do I apply?', icon: FileText, keywords: ['apply', 'application', 'admission', 'admit', 'join', 'enrol', 'enroll', 'form', 'start', 'apply now'], answer: 'There are three ways to apply: fill the printable admission form and bring it in, send an online enquiry with your documents attached, or just walk in during office hours. Every online enquiry gets a reference number so you can follow it up.', actions: [{ to: '/admission', label: 'Admission steps' }, { to: '/admission-form', label: 'Printable form' }, { to: '/contact', label: 'Send an enquiry' }] },
  { id: 'track', label: 'Track my application', icon: TicketCheck, keywords: ['track', 'status', 'progress', 'reference', 'number', 'jttc', 'enquiry', 'inquiry', 'where is', 'update'], answer: 'Open the tracking page and enter your reference number (it looks like JTTC-2026-8H3K) together with the email address you applied with. You will see exactly which stage your application is at.', actions: [{ to: '/track', label: 'Track application' }] },
  { id: 'verify', label: 'Verify a certificate', icon: Award, keywords: ['certificate', 'verify', 'genuine', 'valid', 'fake', 'degree', 'mark sheet', 'marksheet', 'transcript', 'provisional'], answer: 'Every certificate we issue carries a number. Enter it on the verification page and we will confirm whether it is genuine or has been revoked.', actions: [{ to: '/verify', label: 'Verify certificate' }] },
  { id: 'fees', label: 'Fees and payment', icon: TicketCheck, keywords: ['fee', 'fees', 'price', 'cost', 'payment', 'pay', 'money', 'installment', 'instalment', 'discount', 'scholarship', 'loan', 'emi'], answer: 'Fees depend on the program and its length, and we can usually offer installments for longer courses. Call the centre for the current fee list and payment options — we do not publish stale prices online.', actions: [{ to: '/contact', label: 'Ask about fees' }] },
  { id: 'duration', label: 'Course length and schedule', icon: BookOpen, keywords: ['duration', 'long', 'length', 'month', 'week', 'time', 'schedule', 'morning', 'evening', 'afternoon', 'weekend', 'shift', 'batch', 'when'], answer: 'Most programs run for a few months with morning and evening batches so you can study while you work or attend school. Each course page lists its own duration, and the admissions team will confirm the next intake for you.', actions: [{ to: '/courses', label: 'Browse courses' }, { to: '/contact', label: 'Ask about a batch' }] },
  { id: 'documents', label: 'What documents to bring', icon: FileText, keywords: ['document', 'documents', 'paper', 'papers', 'citizenship', 'birth', 'character', 'photo', 'marksheet', 'mark sheet', 'transcript', 'guardian', 'original', 'copy', 'proof'], answer: 'Bring your citizenship or birth certificate, character certificate, last qualification mark sheet, four passport-size photos, and a guardian’s citizenship copy if you are under 18. Photos of the originals are fine to start with — we verify them in person.', actions: [{ to: '/admission-form', label: 'Admission form checklist' }] },
  { id: 'moodle', label: 'Classes and practical training', icon: BookOpen, keywords: ['class', 'classroom', 'practical', 'lab', 'workshop', 'tool', 'equipment', 'moodle', 'online class', 'theory', 'hand on', 'hands on', 'training'], answer: 'Training is hands-on: you spend most of your time in the workshop with the tools you will use on the job, supported by classroom theory. Electrical, plumbing, welding, CNC, tailoring and the computer tracks each have their own workshop set-up.', actions: [{ to: '/practical-training', label: 'Practical training' }, { to: '/facilities', label: 'See the facilities' }] },
  { id: 'visit', label: 'Visit the centre', icon: MapPin, keywords: ['where', 'address', 'location', 'direction', 'map', 'visit', 'open', 'timing', 'hours', 'parking', 'kadam', 'janakpur', 'come'], answer: 'We are in KadamChowk, Janakpurdham-02. Call ahead so someone is free to show you around — walk-ins are welcome, but a quick call saves you a wasted trip.', actions: [{ to: '/contact', label: 'Contact details' }, { to: '/about', label: 'About the centre' }] },
  { id: 'job', label: 'Jobs and placement', icon: Sparkles, keywords: ['job', 'jobs', 'placement', 'work', 'employer', 'company', 'recruit', 'hire', 'interview', 'salary', 'career'], answer: 'We focus on practical, job-ready skills and keep in touch with employers who hire from our trainees. Placement is not guaranteed — it depends on your effort in class — but we introduce motivated graduates to employers who visit.', actions: [{ to: '/about', label: 'About the centre' }, { to: '/contact', label: 'Ask about hiring' }] },
];

const GREETING = 'Namaste! I can help with admissions, fees, documents, tracking an application or verifying a certificate. What would you like to know?';

const normalise = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export default function HelpAssistant() {
  const { faqs, courses, siteConfig } = useContent();
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(OPEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: GREETING }]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Never interrupt the homepage popup or a form the visitor is filling in.
  const onHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  const faqIndex = useMemo(
    () =>
      (faqs || [])
        .filter((f) => f && f.question)
        .map((f) => ({ q: f.question, a: f.answer, id: f.id })),
    [faqs]
  );

  const courseMatches = useMemo(() => {
    const words = normalise(input);
    if (words.length < 3) return [];
    return (courses || [])
      .filter((c) => c.active !== false)
      .map((c) => ({ c, score: score(normalise(`${c.title} ${c.area || ''} ${c.summary || ''}`), words) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [courses, input]);

  useEffect(() => {
    sessionStorage.setItem(OPEN_KEY, open ? '1' : '0');
  }, [open]);

  useEffect(() => {
    if (messages.length > 1) bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (isAdmin) return null;

  const ask = (text) => {
    const question = String(text || '').trim();
    if (!question) return;
    setMessages((m) => [...m, { from: 'user', text: question }]);
    setInput('');
    setThinking(true);

    // A short pause so the answer does not flash in — it reads as considered.
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, answerFor(question)]);
    }, 260);
  };

  /** Token overlap between the question and a candidate answer. */
  function score(text, words) {
    const tokens = text.split(' ').filter((t) => t.length > 2);
    if (!tokens.length) return 0;
    const haystack = ` ${text} `;
    return words.split(' ').filter((w) => w.length > 2 && haystack.includes(` ${w}`)).length / tokens.length;
  }

  function answerFor(question) {
    const words = normalise(question);

    for (const s of SHORTCUTS) {
      if (s.keywords.some((k) => words.includes(k))) {
        return { from: 'bot', text: s.answer, actions: s.actions };
      }
    }

    let best = null;
    for (const f of faqIndex) {
      const hay = normalise(`${f.q} ${f.a}`);
      const hits = words.split(' ').filter((w) => w.length > 2 && hay.includes(w)).length;
      const s = hits / Math.max(1, words.split(' ').filter((w) => w.length > 2).length);
      if (hits > 0 && (!best || s > best.s)) best = { s, f };
    }

    if (best && best.s >= 0.34) {
      return {
        from: 'bot',
        text: best.f.a,
        actions: [{ to: '/faq', label: 'See all questions' }],
      };
    }

    return {
      from: 'bot',
      text: 'I could not find that in our FAQs, and I would rather not guess. Send us a message and a human will answer — we reply during office hours.',
      actions: [
        { to: '/contact', label: 'Send a message' },
        { to: '/faq', label: 'Browse all FAQs' },
      ],
      fallback: true,
    };
  }

  const phone = siteConfig?.phone;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="help-launcher"
        aria-expanded={open}
        aria-label={open ? 'Close the help assistant' : 'Open the help assistant'}
        className={cn(
          'no-print fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full shadow-card-hover transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
          // Step aside from the WhatsApp button and the homepage popup.
          onHome ? 'bottom-24' : 'bottom-5',
          open ? 'bg-slate-800 text-white' : 'bg-navy-900 text-white dark:bg-accent-500 dark:text-navy-950'
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleQuestion className="h-6 w-6" />}
      </button>

      {open && (
        <div
          data-testid="help-assistant"
          role="dialog"
          aria-label="Help assistant"
          className="no-print fixed bottom-24 right-5 z-[60] flex h-[30rem] max-h-[75vh] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover dark:border-white/10 dark:bg-navy-900 sm:bottom-24"
        >
          <div className="flex items-center justify-between gap-2 bg-navy-900 px-4 py-3 text-white dark:bg-navy-800">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-navy-950">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">Ask the assistant</p>
                <p className="text-[11px] text-navy-100 dark:text-slate-300">Answers from our own FAQs</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1.5 transition hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={cn('max-w-[92%] space-y-2', m.from === 'user' ? 'ml-auto' : 'mr-auto')}>
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 leading-relaxed',
                    m.from === 'user'
                      ? 'rounded-br-sm bg-navy-900 text-white dark:bg-accent-500 dark:text-navy-950'
                      : cn('rounded-bl-sm', m.fallback ? 'bg-amber-50 text-slate-800 dark:bg-amber-500/10 dark:text-slate-200' : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-100')
                  )}
                >
                  {m.text}
                </div>
                {Array.isArray(m.actions) && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <Link
                        key={a.to + a.label}
                        to={a.to}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-navy-800 transition hover:border-accent-500 hover:bg-accent-50 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        {a.label} <ChevronRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking our FAQs…
              </p>
            )}
            {courseMatches.length > 0 && messages.length <= 2 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-2.5 dark:border-white/15">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Matching courses
                </p>
                {courseMatches.map(({ c, score: s }) => (
                  <Link
                    key={c.id || c.slug}
                    to={`/courses/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-navy-800 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {c.title}
                    <span className="text-[10px] font-normal text-slate-400">{Math.round(s * 100)}%</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick questions before the visitor types anything */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-4 py-2.5 dark:border-white/10">
              {SHORTCUTS.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => ask(s.label)}
                  className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-accent-500 hover:text-navy-800 dark:border-white/20 dark:text-slate-300"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-white/10"
          >
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fees, documents…"
              data-testid="help-input"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send question"
              className="rounded-lg bg-navy-900 p-2 text-white transition disabled:opacity-40 dark:bg-accent-500 dark:text-navy-950"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 border-t border-slate-100 pb-3 pt-1 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400">
            {phone && (
              <a href={`tel:${phone}`} className="inline-flex items-center gap-1 transition hover:text-accent-600">
                <Phone className="h-3 w-3" /> Call
              </a>
            )}
            {siteConfig?.email && (
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1 transition hover:text-accent-600">
                <Mail className="h-3 w-3" /> Email
              </a>
            )}
            <Link to="/contact" className="inline-flex items-center gap-1 transition hover:text-accent-600" onClick={() => setOpen(false)}>
              <MessageSquare className="h-3 w-3" /> Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

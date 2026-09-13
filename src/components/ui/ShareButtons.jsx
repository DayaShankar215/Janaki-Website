import { useState } from 'react';
import { Share2, Link2, MessageCircle, Check, Facebook } from 'lucide-react';
import { cn } from '@/utils/cn';

export function copyToClipboard(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error('Clipboard unavailable'));
}

/** Share buttons for course details: copy link, WhatsApp, Facebook. */
export function ShareButtons({ title, compact = false }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const doCopy = async () => {
    try {
      await copyToClipboard(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:border-white/10 dark:text-slate-300',
    compact && 'px-2.5 py-1.5'
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        <Share2 className="h-3.5 w-3.5" /> Share
      </span>
      <button onClick={doCopy} className={cn(cls, copied ? 'border-emerald-400 text-emerald-600 dark:text-emerald-300' : 'hover:bg-slate-50 dark:hover:bg-white/5')}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={cn(cls, 'hover:bg-[#25D366]/10 hover:text-[#128C7E]')}>
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </a>
      <a href={fb} target="_blank" rel="noopener noreferrer" className={cn(cls, 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]')}>
        <Facebook className="h-3.5 w-3.5" /> Facebook
      </a>
    </div>
  );
}
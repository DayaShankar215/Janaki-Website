import { useMemo } from 'react';
import { Megaphone, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

const SEEN_PREFIX = 'jttc-popup-seen-';

/**
 * Mirrors the popup's own rules so this panel can never disagree with what a
 * visitor actually sees. Keep in sync with AnnouncementPopup.
 */
function blockedReason(a) {
  if (!a) return 'missing item';
  if (a.status !== 'published') return 'not published';
  if (a.popup !== true) return 'popup switched off';
  if (!(a.title || '').trim()) return 'no title';
  return null;
}

/** Forget this browser's "already shown" flags so the popup can be re-tested. */
function resetPopupMemory() {
  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(SEEN_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

export default function PopupReadiness({ announcements = [] }) {
  const { ready, waiting, total } = useMemo(() => {
    const list = [...(announcements || [])].sort((a, b) =>
      String(b?.date || '').localeCompare(String(a?.date || ''))
    );
    const yes = [];
    const no = [];
    list.forEach((a) => {
      const reason = blockedReason(a);
      if (reason) no.push({ item: a, reason });
      else yes.push(a);
    });
    return { ready: yes, waiting: no, total: list.length };
  }, [announcements]);

  return (
    <section
      data-testid="popup-readiness"
      className={`mb-4 rounded-xl border p-4 ${
        ready.length
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
          : 'border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white">
            <Megaphone className="h-4 w-4 text-accent-500" /> Homepage popup
          </h3>
          {ready.length ? (
            <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>
                Shows on the homepage, newest first:{' '}
                <strong className="font-semibold">
                  {ready.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ' → '}
                      {a.title || 'Untitled'}
                    </span>
                  ))}
                </strong>
                . Each notice is shown once per visit, and closing one moves to the next.
              </span>
            </p>
          ) : (
            <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>
                <strong className="font-semibold">No popup will appear on the homepage.</strong> Set a notice to{' '}
                <em>Published</em> and switch on <em>Show as homepage popup</em> to enable it.
              </span>
            </p>
          )}
          {waiting.length > 0 && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {total} notice{total === 1 ? '' : 's'} in total · not shown:{' '}
              {waiting
                .slice(0, 4)
                .map((w) => `"${w.item.title || 'Untitled'}" (${w.reason})`)
                .join(', ')}
              {waiting.length > 4 ? ` +${waiting.length - 4} more` : ''}
            </p>
          )}
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={resetPopupMemory}
          title="Clears this browser's popup history and opens the homepage in a new tab"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy-900 transition hover:border-accent-500 hover:text-accent-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
        >
          Test popup <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

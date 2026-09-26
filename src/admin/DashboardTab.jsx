import { useMemo } from 'react';
import {
  BookOpen, Users, Building2, Image as ImageIcon, MessageSquareQuote, Megaphone, HelpCircle,
  Download, Upload, ExternalLink, AlertTriangle, CheckCircle2, Cloud, CloudOff, Loader2,
  RefreshCw, ArrowRight, HardDrive, Plus, History, XCircle,
} from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import { useAdminActivity } from '@/hooks/useAdminActivity';

const STORAGE_KEY = 'jttc-content-v1';
const QUOTA_BYTES = 5 * 1024 * 1024;

const timeAgo = (ts) => {
  if (!ts) return 'never';
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.round(h / 24)} day(s) ago`;
};

const fmtBytes = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`);

function StatCard({ icon: Icon, label, value, sub, tone = 'navy', onClick }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700 dark:bg-navy-500/15 dark:text-accent-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition dark:border-slate-700 dark:bg-slate-900 ${onClick ? 'hover:border-accent-400 hover:shadow-md' : ''}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-bold leading-tight text-navy-900 dark:text-white">{value}</span>
        <span className="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        {sub && <span className="block truncate text-[11px] text-slate-400">{sub}</span>}
      </span>
    </Tag>
  );
}

export default function DashboardTab({ onNavigate, onBackup, onRestore, notify }) {
  const content = useContent();
  const { entries, lastSavedAt } = useAdminActivity();

  const courses = content.courses || [];
  const announcements = content.announcements || [];
  const published = announcements.filter((a) => a.status === 'published');
  const drafts = announcements.filter((a) => a.status === 'draft');
  const gallery = content.galleryItems || [];

  const storage = useMemo(() => {
    let bytes = 0;
    let imageBytes = 0;
    let imageCount = 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      bytes = new Blob([raw]).size;
      const match = raw.match(/data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+/g) || [];
      imageCount = match.length;
      imageBytes = match.reduce((n, s) => n + s.length, 0);
    } catch {
      /* ignore */
    }
    return { bytes, imageBytes, imageCount, pct: Math.min(100, Math.round((bytes / QUOTA_BYTES) * 100)) };
  }, [content]);

  const issues = useMemo(() => {
    const list = [];
    const noSlug = courses.filter((c) => !String(c.slug || '').trim());
    if (noSlug.length) list.push({ tab: 'courses', tone: 'error', text: `${noSlug.length} course(s) missing a URL slug — the page link will not work.` });
    const dupSlugs = courses.filter((c, i) => c.slug && courses.findIndex((x) => x.slug === c.slug) !== i);
    if (dupSlugs.length) list.push({ tab: 'courses', tone: 'error', text: `${dupSlugs.length} duplicate course slug(s) — visitors may see the wrong page.` });
    const noImage = courses.filter((c) => !c.image);
    if (noImage.length) list.push({ tab: 'courses', tone: 'warn', text: `${noImage.length} course(s) have no photo — cards look empty.` });
    const hidden = courses.filter((c) => c.active === false);
    if (hidden.length) list.push({ tab: 'courses', tone: 'warn', text: `${hidden.length} course(s) hidden from visitors (Active is off).` });

    if (drafts.length) list.push({ tab: 'announcements', tone: 'warn', text: `${drafts.length} news item(s) are drafts — not visible on the website yet.` });
    const noNewsSlug = published.filter((a) => !String(a.slug || '').trim());
    if (noNewsSlug.length) list.push({ tab: 'announcements', tone: 'error', text: `${noNewsSlug.length} published notice(s) missing a URL slug.` });
    const popupNoImage = published.filter((a) => a.popup && !a.image);
    if (popupNoImage.length) list.push({ tab: 'announcements', tone: 'warn', text: `${popupNoImage.length} popup notice(s) have no photo — the popup needs one.` });

    const noAlt = gallery.filter((g) => !String(g.alt || '').trim());
    if (noAlt.length) list.push({ tab: 'gallery', tone: 'warn', text: `${noAlt.length} gallery photo(s) missing alt text (accessibility + SEO).` });
    if (storage.pct >= 80) list.push({ tab: 'gallery', tone: 'error', text: `Browser storage is ${storage.pct}% full — remove or shrink photos soon.` });
    return list;
  }, [courses, published, drafts, gallery, storage.pct]);

  const cloudTone =
    content.cloudStatus === 'on' ? 'green' : content.cloudStatus === 'connecting' ? 'amber' : content.cloudStatus === 'error' ? 'error' : 'muted';
  const cloudText =
    content.cloudStatus === 'on' ? 'Cloud sync live — changes reach every device'
      : content.cloudStatus === 'connecting' ? 'Connecting to the shared store…'
        : content.cloudStatus === 'error' ? 'Cloud sync error — changes stay on this device'
          : 'Local browser only — enable cloud sync in Site Settings';

  const addCourse = () => {
    onNavigate('courses', { newItem: true });
  };
  const addNews = () => {
    onNavigate('announcements', { newItem: true });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything you manage, in one place. Last saved {timeAgo(lastSavedAt)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onBackup}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            <Download className="w-4 h-4" /> Backup
          </button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            <Upload className="w-4 h-4" /> Restore
            <input type="file" accept=".json,application/json" className="hidden" onChange={onRestore} />
          </label>
          <a href="/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent-500 px-3 py-2 text-sm font-semibold text-navy-950 transition hover:bg-accent-400">
            <ExternalLink className="w-4 h-4" /> View site
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses" value={courses.length}
          sub={`${courses.filter((c) => c.active !== false).length} live · ${courses.filter((c) => c.active === false).length} hidden`}
          onClick={() => onNavigate('courses')} />
        <StatCard icon={Megaphone} label="Published notices" value={published.length}
          sub={drafts.length ? `${drafts.length} draft(s) hidden` : 'all published'} tone="green"
          onClick={() => onNavigate('announcements')} />
        <StatCard icon={ImageIcon} label="Gallery photos" value={gallery.length}
          sub={`${storage.imageCount} stored image(s)`} tone="amber"
          onClick={() => onNavigate('gallery')} />
        <StatCard icon={Users} label="Trainers" value={(content.trainers || []).length}
          sub={`${(content.testimonials || []).length} testimonial(s)`}
          onClick={() => onNavigate('trainers')} />
        <StatCard icon={Building2} label="Facilities" value={(content.facilities || []).length}
          onClick={() => onNavigate('facilities')} />
        <StatCard icon={HelpCircle} label="FAQs" value={(content.faqs || []).length}
          onClick={() => onNavigate('faqs')} />
        <StatCard icon={MessageSquareQuote} label="Testimonials" value={(content.testimonials || []).length}
          onClick={() => onNavigate('testimonials')} />
        <StatCard icon={Cloud} label="Cloud sync"
          value={content.cloudStatus === 'on' ? 'Live' : content.cloudStatus === 'connecting' ? '…' : 'Off'}
          sub={content.lastSyncedAt ? `synced ${timeAgo(content.lastSyncedAt)}` : 'never synced'}
          tone={cloudTone === 'green' ? 'green' : cloudTone === 'amber' ? 'amber' : 'navy'}
          onClick={() => onNavigate('settings')} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Quick actions */}
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200">
            <Plus className="h-4 w-4 text-accent-500" /> Quick actions
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <button onClick={addCourse}
              className="inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-accent-400 hover:bg-accent-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5">
              Add a course <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button onClick={addNews}
              className="inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-accent-400 hover:bg-accent-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5">
              Post a notice <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button onClick={() => onNavigate('gallery')}
              className="inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-accent-400 hover:bg-accent-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5">
              Upload photos <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
            <button onClick={() => onNavigate('settings')}
              className="inline-flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-accent-400 hover:bg-accent-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5">
              Edit contact details <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </section>

        {/* Storage */}
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200">
            <HardDrive className="h-4 w-4 text-accent-500" /> Browser storage
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {fmtBytes(storage.bytes)} of ~5 MB used ({storage.pct}%)
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all ${storage.pct >= 80 ? 'bg-red-500' : storage.pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.max(2, storage.pct)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {storage.imageCount} image(s) ({fmtBytes(storage.imageBytes)}) are stored inside the content. Photos are
            compressed on upload — if storage fills up, remove unused photos or use smaller ones.
          </p>
        </section>

        {/* Attention */}
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200">
            {issues.length ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            Needs attention {issues.length > 0 && <span className="text-slate-400">({issues.length})</span>}
          </h3>
          {issues.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Nothing outstanding — your content is complete.</p>
          ) : (
            <ul className="space-y-1.5">
              {issues.map((i) => (
                <li key={i.text}>
                  <button onClick={() => onNavigate(i.tab)}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    {i.tone === 'error'
                      ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                    <span className="text-slate-600 dark:text-slate-300">{i.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Activity */}
        <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200">
            <History className="h-4 w-4 text-accent-500" /> Recent activity
          </h3>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No admin changes recorded on this device yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {entries.slice(0, 8).map((e, i) => (
                <li key={`${e.ts}-${i}`} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-slate-600 dark:text-slate-300">{e.action}</span>
                  <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.ts)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Cloud strip */}
      <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          {content.cloudStatus === 'on' ? <Cloud className="h-4 w-4 text-emerald-500" /> : <CloudOff className="h-4 w-4 text-slate-400" />}
          {cloudText}
        </p>
        {content.cloudStatus === 'on' ? (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await content.syncNow();
                  notify('Pushed this device’s content to the cloud.');
                } catch (err) {
                  notify(err.message || 'Sync failed.', 'error');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
              <RefreshCw className="h-3.5 w-3.5" /> Sync now
            </button>
            <button
              onClick={async () => {
                if (!window.confirm('Replace this device’s content with the shared cloud version? Local unsynced edits are lost.')) return;
                try {
                  await content.pullNow();
                  notify('Loaded the shared cloud version.');
                } catch (err) {
                  notify(err.message || 'Pull failed.', 'error');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
              <Loader2 className="h-3.5 w-3.5" /> Load shared version
            </button>
          </div>
        ) : (
          <button onClick={() => onNavigate('settings')}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-600">
            Open cloud settings
          </button>
        )}
      </section>
    </div>
  );
}

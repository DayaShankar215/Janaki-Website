import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, ArrowLeft, ArrowRight, ImageIcon, Megaphone, Printer } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useContent } from '@/content/ContentContext';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { Lightbox } from '@/components/Lightbox';
import { cn } from '@/utils/cn';

const tagTones = {
  Admission: 'green',
  Notice: 'navy',
  Event: 'amber',
  News: 'green',
  Achievement: 'amber',
  Update: 'gray',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function paragraphs(text) {
  return String(text || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Individual news / notice article (published items only). */
export default function NewsDetailsPage() {
  const { slug } = useParams();
  const { publishedAnnouncements, getAnnouncementBySlug } = useContent();
  const news = getAnnouncementBySlug(slug);

  useSeo(
    news ? `${news.title} — News & Notices` : 'Notice not found',
    news?.excerpt || 'News and announcements from Janaki Technical Training Center.'
  );

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryItems = useMemo(
    () =>
      [news?.image, ...(news?.images || [])]
        .filter(Boolean)
        .map((src, idx) => ({ id: `n-${idx}`, image: src, alt: news.title, title: `${news.title} (${idx + 1})` })),
    [news]
  );

  const related = useMemo(
    () => (news ? publishedAnnouncements.filter((a) => a.id !== news.id).slice(0, 3) : []),
    [news, publishedAnnouncements]
  );

  if (!news) {
    return (
      <section className="bg-slate-50 py-20 dark:bg-white/[0.02]">
        <div className="container-x mx-auto max-w-xl text-center">
          <p className="text-5xl">📄</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-900 dark:text-white">Notice not found</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            This notice may have been removed or is no longer published.
          </p>
          <Link
            to="/news"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all news
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Article hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-hero-grid bg-grid opacity-40" aria-hidden="true" />
        {news.image && (
          <img src={news.image} alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent" aria-hidden="true" />

        <div className="container-x relative py-16 sm:py-24">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-sm text-slate-400">
              <li><Link to="/" className="transition-colors hover:text-accent-400">Home</Link></li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                <Link to="/news" className="transition-colors hover:text-accent-400">News &amp; Notices</Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-slate-300" aria-current="page">{news.title}</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={tagTones[news.tag] || 'gray'}>{news.tag}</Badge>
              {news.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-navy-950">
                  <Megaphone className="h-3 w-3" /> Pinned
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> Published {formatDate(news.date)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {news.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x max-w-3xl">
          <Reveal>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
              {news.excerpt && news.excerpt !== news.description && (
                <p className="border-l-4 border-accent-400 pl-4 text-lg font-medium leading-relaxed text-navy-800 dark:text-slate-100">
                  {news.excerpt}
                </p>
              )}

              <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                {paragraphs(news.description).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {galleryItems.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-navy-900 dark:text-white">
                    <ImageIcon className="h-4 w-4 text-accent-500" /> Photos
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {galleryItems.map((g, i) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className={cn('group relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10', i === 0 && galleryItems.length > 1 ? 'sm:col-span-2' : '')}
                      >
                        <img src={g.image} alt={g.title} loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        <span className="absolute inset-0 flex items-center justify-center bg-navy-950/0 text-white opacity-0 transition group-hover:bg-navy-950/30 group-hover:opacity-100">
                          View larger
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-white/10">
                <ShareButtons title={news.title} />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-500 hover:bg-navy-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 flex justify-between">
            <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 transition-colors hover:text-accent-600 dark:text-accent-400">
              <ArrowLeft className="h-4 w-4" /> All news &amp; notices
            </Link>
            {related.length > 0 && (
              <Link to={`/news/${related[0].slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 transition-colors hover:text-accent-600 dark:text-accent-400">
                More news <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">More updates</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {related.map((a) => (
                  <Link
                    key={a.id}
                    to={`/news/${a.slug}`}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wide text-accent-600 dark:text-accent-400">
                      {a.tag} · {formatDate(a.date)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-navy-900 transition-colors group-hover:text-navy-600 dark:text-white dark:group-hover:text-accent-300">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Lightbox items={galleryItems} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}
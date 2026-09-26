import { useEffect, useMemo, useState } from 'react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { Lightbox } from '@/components/Lightbox';
import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content/ContentContext';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 8;

export default function GalleryPage() {
  const { galleryItems } = useContent();
  useSeo(
    'Gallery',
    'Photos from training sessions, workshops and student activities at Janaki Technical Training Center.'
  );

  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const chips = useMemo(() => {
    const seen = new Set();
    galleryItems.forEach((g) => g && g.category && seen.add(g.category));
    return [...seen].filter((cat) => cat !== 'All');
  }, [galleryItems]);

  const counts = useMemo(() => {
    const map = new Map();
    galleryItems.forEach((g) => {
      if (!g || !g.category) return;
      map.set(g.category, (map.get(g.category) || 0) + 1);
    });
    return map;
  }, [galleryItems]);

  useEffect(() => setVisible(PAGE_SIZE), [filter]);

  // A filter pointing at a category that no longer has photos falls back to "All".
  const activeFilter = filter !== 'All' && (counts.get(filter) || 0) > 0 ? filter : 'All';

  const filtered = useMemo(
    () => (activeFilter === 'All' ? galleryItems : galleryItems.filter((g) => g.category === activeFilter)),
    [activeFilter, galleryItems]
  );

  const total = filtered.length;
  const shown = filtered.slice(0, visible);

  return (
    <>
      <PageHero
        title="Photo Gallery"
        description="Training sessions, workshops, students and events at the center."
        breadcrumb={[{ label: 'Gallery' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery by category">
            <button
              type="button"
              onClick={() => setFilter('All')}
              aria-pressed={filter === 'All'}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                filter === 'All'
                  ? 'border-navy-700 bg-navy-700 text-white shadow-soft dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
              )}
            >
              All ({galleryItems.length})
            </button>
            {chips.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={activeFilter === cat}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  activeFilter === cat
                    ? 'border-navy-700 bg-navy-700 text-white shadow-soft dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
                )}
              >
                {cat} ({counts.get(cat) || 0})
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {shown.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 0.06} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View larger: ${item.title}`}
                  className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <span className="relative block">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-navy-950/85 to-transparent p-4 pt-10">
                      <span className="text-left text-sm font-semibold text-white">{item.title}</span>
                      <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-navy-950">
                        {item.category}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          {total > visible && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border border-navy-300 bg-white px-6 py-2.5 text-sm font-bold text-navy-800 transition-colors hover:border-navy-500 hover:bg-navy-50 hover:text-navy-950 dark:border-white/20 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-accent-400 dark:hover:bg-white/10"
              >
                Load more photos ({shown.length} of {total})
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Photos of trainees at work will be added here as they become available. Click any photo to view it in full size.
          </p>
        </div>
      </section>

      <Lightbox items={shown} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}

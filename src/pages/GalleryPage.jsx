import { useMemo, useState } from 'react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { Lightbox } from '@/components/Lightbox';
import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content/ContentContext';
import { cn } from '@/utils/cn';

export default function GalleryPage() {
  const { galleryItems, galleryCategories } = useContent();
  useSeo(
    'Gallery',
    'Photos from training sessions, workshops and student activities at Janaki Technical Training Center.'
  );

  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const items = useMemo(
    () => (filter === 'All' ? galleryItems : galleryItems.filter((g) => g.category === filter)),
    [filter]
  );

  return (
    <>
      <PageHero
        title="Gallery"
        description="A look inside our training sessions, workshops and student activities."
        breadcrumb={[{ label: 'Gallery' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery by category">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  filter === cat
                    ? 'border-navy-700 bg-navy-700 text-white shadow-soft dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((item, i) => (
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

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Sample photos shown for design purposes — replace with real photos of the center in
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-white/10">src/data/gallery.js</code>.
          </p>
        </div>
      </section>

      <Lightbox items={items} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}


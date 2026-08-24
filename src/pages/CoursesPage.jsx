import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, SearchX } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { CourseCard } from '@/components/cards/CourseCard';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { courses, courseCountForCategory } from '@/data/courses';
import { categories, getCategoryLabel } from '@/data/categories';
import { cn } from '@/utils/cn';

const sortOptions = [
  { value: 'featured', label: 'Sort: Featured' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'duration-asc', label: 'Duration: Short → Long' },
  { value: 'duration-desc', label: 'Duration: Long → Short' },
];

export default function CoursesPage() {
  useSeo(
    'Courses & Training Programs',
    'Browse vocational training programs at Janaki Technical Training Center — electrical, plumbing, construction, welding, computer skills, hospitality, agriculture and tailoring.'
  );

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  const availableCategories = useMemo(() => categories.filter((c) => courseCountForCategory(c.id) > 0), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = courses.filter((course) => {
      const matchesCategory = category === 'all' || course.categoryId === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        getCategoryLabel(course.categoryId).toLowerCase().includes(q) ||
        course.skills.some((s) => s.toLowerCase().includes(q))
      );
    });

    switch (sort) {
      case 'name':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration-asc':
        list = [...list].sort((a, b) => a.durationWeeks - b.durationWeeks);
        break;
      case 'duration-desc':
        list = [...list].sort((a, b) => b.durationWeeks - a.durationWeeks);
        break;
      default:
        // Featured: active courses first, then original order
        list = [...list].sort((a, b) => Number(Boolean(b.active)) - Number(Boolean(a.active)));
    }
    return list;
  }, [query, category, sort]);

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setSort('featured');
  };

  const selectClass =
    'rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-navy-900 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:focus:border-accent-400';

  return (
    <>
      <PageHero
        title="Courses & Training Programs"
        description="Hands-on vocational training across the trades that build our homes, businesses and communities."
        breadcrumb={[{ label: 'Courses' }]}
      />

      <section className="bg-slate-50 py-14 dark:bg-white/[0.02] sm:py-16">
        <div className="container-x">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <label htmlFor="course-search" className="sr-only">
                Search courses
              </label>
              <input
                id="course-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses or skills…"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <label htmlFor="course-sort" className="sr-only">
                Sort courses
              </label>
              <select id="course-sort" value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category filter chips */}
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => setCategory('all')}
              aria-pressed={category === 'all'}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                category === 'all'
                  ? 'border-navy-700 bg-navy-700 text-white shadow-soft'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
              )}
            >
              All ({courses.length})
            </button>
            {availableCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  category === c.id
                    ? 'border-navy-700 bg-navy-700 text-white shadow-soft dark:border-accent-500 dark:bg-accent-500 dark:text-navy-950'
                    : 'border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-white/40'
                )}
              >
                {c.label} ({courseCountForCategory(c.id)})
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
            Showing {filtered.length} of {courses.length} programs
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course, i) => (
                <Reveal key={course.slug} delay={(i % 3) * 0.06} className="h-full">
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center dark:border-white/15 dark:bg-white/[0.03]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/10">
                <SearchX className="h-7 w-7" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">No courses found</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                Try a different search term or category — or reset the filters to see every program.
              </p>
              <Button onClick={resetFilters} variant="outline" size="md" className="mt-5">
                <RotateCcw className="h-4 w-4" /> Reset Filters
              </Button>
            </div>
          )}

          <p className="mt-10 rounded-xl border border-accent-200 bg-accent-50 p-4 text-xs leading-relaxed text-accent-900 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-200">
            Note: Program availability changes between batches. Durations shown are typical samples — contact the
            center for current schedules and confirmed details.
          </p>
        </div>
      </section>
    </>
  );
}

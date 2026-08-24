import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/** Shared hero band for inner pages. */
export function PageHero({ title, description, breadcrumb }) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* decorative layers */}
      <div className="absolute inset-0 hero-grid bg-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-navy-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-x relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1.5 text-sm text-slate-400">
            <li>
              <Link to="/" className="transition-colors hover:text-accent-400">
                Home
              </Link>
            </li>
            {breadcrumb?.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {item.to ? (
                  <Link to={item.to} className="transition-colors hover:text-accent-400">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-300" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { ArrowLeft, HardHat } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-navy-950">
      <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
      <div className="container-x relative py-20 text-center">
        <span className="mx-auto flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-accent-500 text-navy-950 shadow-card-hover">
          <HardHat className="h-8 w-8" />
        </span>
        <p className="mt-6 font-display text-7xl font-extrabold tracking-tight text-white sm:text-8xl">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">This page took a wrong turn</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-300">
          The page you are looking for doesn't exist — but plenty of skills do. Explore our training programs instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-soft transition-colors hover:bg-accent-400"
          >
            Browse Courses →
          </Link>
        </div>
      </div>
    </section>
  );
}

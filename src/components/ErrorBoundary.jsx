import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Catches a render error so one broken page can never leave a visitor staring
 * at a blank screen. Shows what happened, offers a retry, and keeps the
 * navigation links so they are never trapped.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[App] Something went wrong:', error, info?.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 dark:bg-navy-950">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card dark:border-white/10 dark:bg-white/[0.04]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            This page did not load properly
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Nothing you sent is lost — enquiry forms keep a local copy until the centre
            receives it. Try again, or head back to the home page.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-600 dark:bg-accent-500 dark:text-navy-950 dark:hover:bg-accent-400"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Home className="h-4 w-4" aria-hidden="true" /> Home
            </a>
          </div>
          <p className="mt-6 break-words font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {String(error?.message || error)}
          </p>
        </div>
      </div>
    );
  }
}

import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'janaki-admin';

export default function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('jttc-admin', '1');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(600px circle at 20% 20%, rgba(245,166,35,0.15), transparent 60%), radial-gradient(800px circle at 80% 80%, rgba(43,79,151,0.25), transparent 60%)' }}
      />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-2xl">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent-500/15 text-accent-400 mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white text-center">Admin Access</h1>
        <p className="text-sm text-slate-400 text-center mt-1 mb-6">
          Sign in to manage website content.
        </p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Password"
          className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder-slate-500 outline-none focus:ring-2 transition ${error ? 'border-red-500 ring-red-500/30 shake' : 'border-white/15 focus:ring-accent-400/50 focus:border-accent-400/60'}`}
        />
        {error && <p className="mt-2 text-sm text-red-400 text-center">Incorrect password. Try again.</p>}
        <button type="submit" className="mt-4 w-full py-2.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-navy-950 font-semibold transition inline-flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Enter dashboard
        </button>
        <a href="/" className="block mt-4 text-xs text-slate-500 hover:text-slate-300 text-center">← Back to website</a>
      </form>
    </div>
  );
}

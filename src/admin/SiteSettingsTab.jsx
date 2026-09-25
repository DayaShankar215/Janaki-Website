import { useEffect, useState } from 'react';
import { Save, RotateCcw, MapPin, Info, Cloud, CloudOff, CheckCircle2, XCircle, Loader2, Copy, Plug, Unplug } from 'lucide-react';
import { useContent } from '@/content/ContentContext';
import {
  saveFirebaseConfig,
  loadFirebaseConfig,
  testFirebaseConnection,
  configToJson,
  FIREBASE_RULES,
} from '@/utils/firebaseBackend';
import BackupPromptModal from './BackupPromptModal';
import { downloadJson, backupFilename } from '@/utils/downloadJson';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent-400 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

function Text({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} className={inputCls} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange, rows = 2 }) {
  return (
    <div className="sm:col-span-2">
      <label className={labelCls}>{label}</label>
      <textarea rows={rows} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Group({ title, icon: Icon, children }) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        {Icon && <Icon className="w-4 h-4 text-accent-500" />} {title}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function parseConfig(text) {
  try {
    const cfg = JSON.parse(text);
    if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) throw new Error('must be a JSON object');
    if (typeof cfg.databaseURL !== 'string' || !cfg.databaseURL.startsWith('https')) throw new Error('must include databaseURL (https://…)');
    return cfg;
  } catch (e) {
    throw new Error(e.message === 'must be a JSON object' || e.message === 'must include databaseURL (https://…)' ? e.message : 'Invalid JSON');
  }
}

function CloudSyncCard({ notify, status, source }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(status === 'error' || status === 'off');

  const servedStatically = source === 'static';

  useEffect(() => {
    if (status === 'on' || status === 'connecting') setEditing(false);
  }, [status]);

  const enable = async () => {
    let cfg;
    try {
      cfg = parseConfig(text);
    } catch (e) {
      notify(e.message, 'error');
      return;
    }
    if (!saveFirebaseConfig(cfg)) {
      notify('Could not save config.', 'error');
      return;
    }
    setBusy(true);
    try {
      const ok = await testFirebaseConnection();
      if (!ok) throw new Error('failed');
      notify('Cloud sync enabled — reloading…');
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      saveFirebaseConfig(null); // roll back so the panel shows local-only again
      notify('Connection failed — check the config and database Rules.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const copyConfigForAll = async () => {
    try {
      const cfg = await loadFirebaseConfig();
      if (!cfg) throw new Error('no config');
      await navigator.clipboard.writeText(configToJson(cfg));
      notify('Config copied — paste it into public/firebase-config.json and redeploy.');
    } catch {
      notify('Could not copy config.', 'error');
    }
  };

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(FIREBASE_RULES);
      notify('Rules copied — paste into Firebase console → Realtime Database → Rules.');
    } catch {
      notify('Could not copy rules.', 'error');
    }
  };

  const disconnect = () => {
    if (!window.confirm('Disconnect cloud sync? The site returns to local-browser-only editing.')) return;
    if (saveFirebaseConfig(null)) {
      notify('Cloud sync disabled — reloading…');
      window.setTimeout(() => window.location.reload(), 700);
    }
  };

  const banner = () => {
    if (status === 'on' && servedStatically)
      return (
        <div className="flex items-start gap-2 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span><b>Cloud sync is live.</b> It ships with the site (<code>public/firebase-config.json</code>), so
            content saved here updates on <b>every device</b> automatically. To stop syncing, remove that file before
            rebuilding the site.</span>
        </div>
      );
    if (status === 'on')
      return (
        <div className="flex items-start gap-2 p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span><b>Cloud sync is live.</b> Content saved here updates on <b>every device</b> (mobile, other computers) instantly.</span>
        </div>
      );
    if (status === 'connecting')
      return (
        <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950/40 text-sm text-blue-800 dark:text-blue-300">
          <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />
          <span>Connecting to the shared content store…</span>
        </div>
      );
    if (status === 'error')
      return (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/40 text-sm text-red-800 dark:text-red-300">
          <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span><b>Cloud sync error.</b> Check the Firebase database Rules and that the anonymous sign-in provider is
            enabled, then reload the page.</span>
        </div>
      );
    return (
      <div className="flex items-start gap-2 p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300">
        <CloudOff className="w-4 h-4 shrink-0 mt-0.5" />
        <span><b>Local browser storage only.</b> Changes show on this device alone. Enable cloud sync to publish to every visitor&apos;s device.</span>
      </div>
    );
  };

  const connected = status === 'on' || status === 'connecting';

  return (
    <section className="mb-8">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <Cloud className="w-4 h-4 text-accent-500" /> Cloud sync (Firebase)
      </h3>

      {banner()}

      {connected && (
        <div className="mt-4 flex flex-wrap gap-2">
          {!servedStatically && (
            <button onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Plug className="w-4 h-4" /> Change config
            </button>
          )}
          <button onClick={copyConfigForAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Copy className="w-4 h-4" /> Copy config for all devices
          </button>
          <button onClick={copyRules}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Copy className="w-4 h-4" /> Copy database Rules
          </button>
          {!servedStatically && (
            <button onClick={disconnect}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40">
              <Unplug className="w-4 h-4" /> Disconnect
            </button>
          )}
        </div>
      )}

      {!servedStatically && (editing || !connected) && (
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Paste your Firebase <b>Realtime Database</b> web config JSON here. Get it from: Firebase console →
              Project settings → General → <i>Your apps</i> → Web app → <i>SDK setup and configuration</i> (copy the
              <code> firebaseConfig </code> object). It needs <code>databaseURL</code> to point at a Realtime Database
              you created. Disable it any time without affecting the site.
            </span>
          </div>
          <div>
            <label className={labelCls}>Firebase web config (JSON)</label>
            <textarea rows={8} name="firebase-config" className={`${inputCls} font-mono text-xs`} value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'{\n  "apiKey": "…",\n  "authDomain": "…",\n  "databaseURL": "https://…-default-rtdb.firebaseio.com",\n  "projectId": "…",\n  "storageBucket": "…",\n  "messagingSenderId": "…",\n  "appId": "…"\n}'} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 rounded-md bg-slate-50 dark:bg-slate-800/60 p-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              One-time <b>Rules</b> step in Firebase (Realtime Database → Rules) — paste:{' '}
              <code className="font-mono text-[10px]">{"{ \"rules\": { \".read\": true, \".write\": \"auth != null\" } }"}</code>{' '}
              <button type="button" onClick={copyRules} className="ml-1 underline hover:text-navy-700 dark:hover:text-slate-200">copy</button>
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={enable} disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-600 disabled:opacity-50">
              <Cloud className="w-4 h-4" /> {busy ? 'Connecting…' : 'Enable cloud sync'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            <b>Tip:</b> after enabling once, copy the config and paste it into <code>public/firebase-config.json</code> in
            this repo, then rebuild + redeploy. Every device then auto-connects without needing the admin panel.
          </p>
        </div>
      )}
    </section>
  );
}

export default function SiteSettingsTab({ notify, guard }) {
  const content = useContent();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(content.siteConfig)));
  const [pendingSave, setPendingSave] = useState(false);

  const set = (key) => (v) => setDraft((d) => ({ ...d, [key]: v }));
  const setSocial = (key) => (v) => setDraft((d) => ({ ...d, socialLinks: { ...d.socialLinks, [key]: v } }));

  const doSave = () => {
    if (guard(content.updateSection('siteConfig', draft))) notify('Site settings saved.');
  };

  const save = () => setPendingSave(true);

  const reset = () => {
    if (window.confirm('Reset site settings to the code defaults?')) {
      content.resetSection('siteConfig');
      setDraft(JSON.parse(JSON.stringify(content.siteConfig)));
      notify('Site settings reset.');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">Site Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Contact details, map location and links — used across every page.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} title="Reset to code defaults"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={save}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-600 transition">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <Group title="Organization identity">
        <Text label="Full name" value={draft.name} onChange={set('name')} />
        <Text label="Short name (navbar)" value={draft.shortName} onChange={set('shortName')} />
        <Area label="Tagline" value={draft.tagline} onChange={set('tagline')} />
        <Area label="Description" value={draft.description} onChange={set('description')} />
      </Group>

      <Group title="Contact details">
        <Text label="Email" type="email" value={draft.email} onChange={set('email')} />
        <Text label="Phone" value={draft.phone} onChange={set('phone')} placeholder="e.g. 9804804563" />
        <Text label="Alternate phone (optional)" value={draft.phoneAlt} onChange={set('phoneAlt')} />
        <Text label="Office hours" value={draft.officeHours} onChange={set('officeHours')} placeholder="e.g. Sun–Fri, 7am–5pm" />
        <Area label="Office address" value={draft.address} onChange={set('address')} />
      </Group>

      <Group title="Map location" icon={MapPin}>
        <div className="sm:col-span-2 -mt-1 mb-1 flex gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950/40 text-xs text-blue-800 dark:text-blue-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <b>Easiest:</b> open Google Maps, find your exact location, right-click it and copy the coordinates
            (first number = latitude, second = longitude). A map with a marker is generated automatically.
            Or paste a full Google Maps embed URL below to override.
          </span>
        </div>
        <Text label="Latitude" value={draft.mapLat} onChange={set('mapLat')} placeholder='e.g. "27.3244" (keep quotes not needed)' />
        <Text label="Longitude" value={draft.mapLng} onChange={set('mapLng')} placeholder="e.g. 85.9115" />
        <Area label="Custom embed URL (optional — overrides coordinates)" value={draft.mapEmbedUrl} onChange={set('mapEmbedUrl')}
          rows={2} />
        <Text label="Directions link (shown as button)" value={draft.mapLinkUrl} onChange={set('mapLinkUrl')}
          placeholder="Google Maps share link" />
      </Group>

      <Group title="Social media">
        {Object.keys(draft.socialLinks || {}).map((k) => (
          <Text key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={(draft.socialLinks || {})[k]}
            onChange={setSocial(k)} placeholder={`https://${k}.com/…`} />
        ))}
      </Group>

      <CloudSyncCard notify={notify} status={content.cloudStatus} source={content.cloudSource} />

      {pendingSave && (
        <BackupPromptModal
          body="Download a copy of the current content before applying your settings changes? You can restore it anytime with the Restore button."
          onBackup={() => {
            downloadJson(backupFilename(), content.exportAll());
            doSave();
            setPendingSave(false);
          }}
          onSave={() => {
            doSave();
            setPendingSave(false);
          }}
          onClose={() => setPendingSave(false)}
        />
      )}
    </div>
  );
}
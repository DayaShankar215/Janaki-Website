import { useState } from 'react';
import { Save, RotateCcw, MapPin, Info } from 'lucide-react';
import { useContent } from '@/content/ContentContext';

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

export default function SiteSettingsTab({ notify, guard }) {
  const content = useContent();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(content.siteConfig)));

  const set = (key) => (v) => setDraft((d) => ({ ...d, [key]: v }));
  const setSocial = (key) => (v) => setDraft((d) => ({ ...d, socialLinks: { ...d.socialLinks, [key]: v } }));

  const save = () => {
    if (guard(content.updateSection('siteConfig', draft))) notify('Site settings saved.');
  };

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
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Plus, Trash2, Copy, Save, X, Search, RotateCcw } from 'lucide-react';
import ImageInput from './ImageInput';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent-400 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <textarea rows={field.rows || 3} className={inputCls} value={value ?? ''} placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'lines':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <textarea
            rows={field.rows || 4}
            className={`${inputCls} font-mono text-xs`}
            value={(value || []).join('\n')}
            placeholder={'One item per line'}
            onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          />
          <p className="mt-1 text-xs text-slate-400">One item per line.</p>
        </div>
      );
    case 'bool':
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded accent-amber-500" />
          <span className="text-sm text-slate-700 dark:text-slate-300">{field.label}</span>
        </label>
      );
    case 'number':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="number" min={field.min} max={field.max} className={inputCls} value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
      );
    case 'date':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="date" className={inputCls} value={(value || '').slice(0, 10)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'select': {
      const opts = field.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      );
    }
    case 'image':
      return <ImageInput label={field.label} value={value || ''} aspect={field.aspect} onChange={onChange} />;
    default:
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="text" className={inputCls} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
}

/**
 * Generic list + form editor for any array of objects stored in the
 * content context. Handles add / duplicate / delete / save.
 */
export default function CollectionEditor({
  title,
  description,
  items,
  idKey = 'id',
  displayKey,
  subtitleFn,
  imageKey,
  schema,
  newItem,
  onSave,
  onSaved,
  allowDelete = true,
}) {
  const [selectedId, setSelectedId] = useState(null); // null = nothing selected; '__new__' = creating
  const [draft, setDraft] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) =>
      [it[displayKey], it[idKey], ...(subtitleFn ? [subtitleFn(it)] : [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query, displayKey, idKey, subtitleFn]);

  const startNew = () => {
    setDraft(typeof newItem === 'function' ? newItem() : { ...newItem });
    setSelectedId('__new__');
    setError('');
  };

  const startEdit = (item) => {
    setDraft(JSON.parse(JSON.stringify(item)));
    setSelectedId(item[idKey]);
    setError('');
  };

  const applySave = () => {
    const idVal = String(draft[idKey] ?? '').trim();
    if (!idVal) {
      setError(`"${schema.find((f) => f.key === idKey)?.label || idKey}" is required.`);
      return;
    }
    const requiredField = schema.find((f) => f.required);
    if (requiredField && !String(draft[requiredField.key] ?? '').trim()) {
      setError(`${requiredField.label} is required.`);
      return;
    }
    // Build new list: replace item that previously had selectedId's key (if editing), drop duplicates of new id.
    let list = items.filter((it) => String(it[idKey]) !== idVal);
    if (selectedId !== '__new__' && selectedId !== null) {
      // keep position of original item when possible
      const origIdx = items.findIndex((it) => String(it[idKey]) === String(selectedId));
      if (origIdx >= 0) {
        list = [...items];
        list.splice(origIdx, 1);
        list.splice(origIdx, 0, { ...draft, [idKey]: idVal });
        onSave(list);
        onSaved(`${title} saved.`);
        setSelectedId(idVal);
        return;
      }
    }
    list.push({ ...draft, [idKey]: idVal });
    onSave(list);
    onSaved(`${title} saved.`);
    setSelectedId(idVal);
  };

  const removeItem = (item) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    onSave(items.filter((it) => String(it[idKey]) !== String(item[idKey])));
    if (String(selectedId) === String(item[idKey])) {
      setSelectedId(null);
      setDraft(null);
    }
    onSaved('Entry deleted.');
  };

  const duplicateItem = (item) => {
    const copy = JSON.parse(JSON.stringify(item));
    copy[idKey] = `${copy[idKey]}-copy-${Date.now().toString(36).slice(-4)}`;
    if (displayKey in copy) copy[displayKey] = `${copy[displayKey]} (copy)`;
    onSave([...items, copy]);
    onSaved('Duplicated — remember to press Save after edits.');
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-accent-500 hover:bg-accent-600 text-navy-950 transition">
          <Plus className="w-4 h-4" /> Add new
        </button>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-5">
        {/* List */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`}
              className={`${inputCls} pl-8`} />
          </div>
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 && <p className="p-4 text-sm text-slate-400">Nothing found.</p>}
            {filtered.map((it) => {
              const activeSel = String(selectedId) === String(it[idKey]);
              return (
                <div key={it[idKey]}
                  className={`group flex items-center gap-3 p-2.5 cursor-pointer transition ${activeSel ? 'bg-navy-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                  onClick={() => startEdit(it)}>
                  {imageKey && it[imageKey] ? (
                    <img src={it[imageKey]} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center text-xs text-slate-500">
                      {(it[displayKey] || '?').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${activeSel ? 'text-navy-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {it[displayKey] || '(untitled)'}
                    </p>
                    {subtitleFn && <p className="truncate text-xs text-slate-400">{subtitleFn(it)}</p>}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); duplicateItem(it); }} title="Duplicate"
                      className="p-1 rounded text-slate-400 hover:text-navy-600"><Copy className="w-4 h-4" /></button>
                    {allowDelete && (
                      <button onClick={(e) => { e.stopPropagation(); removeItem(it); }} title="Delete"
                        className="p-1 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 md:p-5 bg-white dark:bg-slate-900/40">
          {!draft ? (
            <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center text-slate-400">
              <p>Select an item from the list to edit it,</p>
              <p>or press <span className="font-semibold text-accent-500">Add new</span>.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {schema.map((f) => (
                  <div key={f.key} className={f.type === 'textarea' || f.type === 'lines' || f.full ? 'sm:col-span-2' : ''}>
                    <Field field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
                  </div>
                ))}
              </div>
              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => { setDraft(null); setSelectedId(null); setError(''); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={applySave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-600 transition">
                  <Save className="w-4 h-4" /> Save changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResetSectionButton({ sectionName, onReset }) {
  return (
    <button
      onClick={() => {
        if (window.confirm(`Reset "${sectionName}" to the original code defaults? Your changes here will be lost.`)) onReset();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-slate-400 hover:text-red-500 transition"
    >
      <RotateCcw className="w-3.5 h-3.5" /> Reset to defaults
    </button>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, Trash2, Copy, Save, X, Search, RotateCcw, Upload, ChevronUp, ChevronDown,
  ExternalLink, Undo2, CircleAlert, Loader2,
} from 'lucide-react';
import ImageInput from './ImageInput';
import { fileToDataUrl } from '@/utils/imageTools';
import { useContent } from '@/content/ContentContext';
import BackupPromptModal from './BackupPromptModal';
import { downloadJson, backupFilename } from '@/utils/downloadJson';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent-400 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

function FieldHelp({ help }) {
  if (!help) return null;
  return <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{help}</p>;
}

function Field({ field, value, onChange, invalid }) {
  const ring = invalid ? 'border-red-400 focus:ring-red-300 dark:border-red-500/70' : '';
  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <textarea rows={field.rows || 3} className={`${inputCls} ${ring}`} value={value ?? ''} placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)} />
          <FieldHelp help={field.help} />
        </div>
      );
    case 'lines':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <textarea
            rows={field.rows || 4}
            className={`${inputCls} font-mono text-xs ${ring}`}
            value={(value || []).join('\n')}
            placeholder={'One item per line'}
            onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          />
          <FieldHelp help={field.help || 'One item per line.'} />
        </div>
      );
    case 'bool':
      return (
        <div>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{field.label}</span>
          </label>
          <FieldHelp help={field.help} />
        </div>
      );
    case 'number':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="number" min={field.min} max={field.max} className={`${inputCls} ${ring}`} value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
          <FieldHelp help={field.help} />
        </div>
      );
    case 'date':
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="date" className={`${inputCls} ${ring}`} value={(value || '').slice(0, 10)} onChange={(e) => onChange(e.target.value)} />
          <FieldHelp help={field.help} />
        </div>
      );
    case 'select': {
      const opts = field.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <select className={`${inputCls} ${ring}`} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <FieldHelp help={field.help} />
        </div>
      );
    }
    case 'image':
      return (
        <div>
          <ImageInput label={field.label} value={value || ''} aspect={field.aspect} onChange={onChange} />
          <FieldHelp help={field.help} />
        </div>
      );
    case 'imageList': {
      const list = Array.isArray(value) ? value : [];
      const setAt = (i, v) => {
        const next = [...list];
        if (v) next[i] = v;
        else next.splice(i, 1);
        onChange(next);
      };
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <div className="space-y-3">
            {list.map((src, i) => (
              <ImageInput key={i} label={`Photo ${i + 1}`} value={src || ''} aspect={field.aspect || 'aspect-video'} onChange={(v) => setAt(i, v)} />
            ))}
          </div>
          <button
            type="button"
            disabled={list.length >= (field.maxItems || 8)}
            onClick={() => onChange([...list, ''])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:border-accent-400 hover:text-accent-600 disabled:opacity-40 dark:text-slate-400"
          >
            <Plus className="w-4 h-4" /> Add photo
          </button>
          <FieldHelp help={field.help} />
        </div>
      );
    }
    default:
      return (
        <div>
          <label className={labelCls}>{field.label}</label>
          <input type="text" className={`${inputCls} ${ring}`} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
          <FieldHelp help={field.help} />
        </div>
      );
  }
}

const badgeTones = {
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  gray: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  navy: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-accent-300',
};

/**
 * Generic list + form editor for any array of objects stored in the
 * content context. Handles add / duplicate / delete / reorder / save.
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
  bulkUpload = null,
  badgeFn = null,
  previewUrlFn = null,
  autoSelect = null,
  onAutoSelectDone = null,
  onDirtyChange = null,
}) {
  const content = useContent();
  const [selectedId, setSelectedId] = useState(null); // null = nothing selected; '__new__' = creating
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [pendingSave, setPendingSave] = useState(null); // asks "back up first?" before applying
  const [picked, setPicked] = useState([]); // ids ticked for bulk actions
  const [undoEntry, setUndoEntry] = useState(null); // { item, index, timer }
  const courses = content.courses || [];
  const fileRef = useRef(null);
  const searchRef = useRef(null);
  // Once the admin edits the slug by hand, stop auto-generating it from the title.
  const slugTouched = useRef(false);
  const [bulkCourse, setBulkCourse] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMsg, setBulkMsg] = useState('');
  const effectiveBulkCourse = bulkCourse || courses[0]?.slug || '';

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) =>
      [it[displayKey], it[idKey], ...(subtitleFn ? [subtitleFn(it)] : [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query, displayKey, idKey, subtitleFn]);

  const dirty = !!draft && JSON.stringify(draft) !== baseline;
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  const dirtyCbRef = useRef(onDirtyChange);
  dirtyCbRef.current = onDirtyChange;

  useEffect(() => {
    if (dirtyCbRef.current) dirtyCbRef.current(dirty);
  }, [dirty]);

  // Warn before closing the tab with unsaved edits in the open form.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const startNew = () => {
    const item = typeof newItem === 'function' ? newItem() : { ...newItem };
    slugTouched.current = false;
    setDraft(item);
    setBaseline(JSON.stringify(item));
    setSelectedId('__new__');
    setError('');
  };

  const startEdit = (item) => {
    const copy = JSON.parse(JSON.stringify(item));
    slugTouched.current = true; // never rewrite the slug of an existing entry
    setDraft(copy);
    setBaseline(JSON.stringify(copy));
    setSelectedId(item[idKey]);
    setError('');
  };

  // Jump-to-item from the dashboard / global admin search.
  useEffect(() => {
    if (!autoSelect) return;
    if (autoSelect.newItem) {
      startNew();
    } else {
      const it = items.find((x) => String(x[idKey]) === String(autoSelect.id));
      if (it) startEdit(it);
    }
    if (onAutoSelectDone) onAutoSelectDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelect]);

  // Keyboard: Ctrl+S saves the open form, Esc discards, "/" focuses search.
  useEffect(() => {
    const onKey = (e) => {
      const typingInField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && draft) applySaveRef.current?.();
        return;
      }
      if (e.key === 'Escape' && dirty && draft) {
        e.preventDefault();
        setDraft(null);
        setBaseline(null);
        setSelectedId(null);
        setError('');
        return;
      }
      if (e.key === '/' && !typingInField) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, draft]);

  const commit = (list, idVal) => {
    onSave(list);
    onSaved(pendingSave?.note || `${title} saved.`);
    setPicked([]);
    // A form save clears the "unsaved" state; other commits (reorder, delete,
    // bulk upload) must leave a half-finished form marked as dirty.
    if (pendingSave?.savedForm && draft) setBaseline(JSON.stringify(draft));
    setSelectedId(idVal);
    if (!idVal) {
      setDraft(null);
      setBaseline(null);
      setError('');
    }
  };

  const startBulkUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    const course = courses.find((c) => c.slug === effectiveBulkCourse);
    if (!course) {
      setBulkMsg('Pick a course before uploading.');
      return;
    }
    setBulkBusy(true);
    setBulkMsg('');
    try {
      const images = await Promise.all(files.map((f) => fileToDataUrl(f)));
      const stamp = Date.now().toString(36);
      const created = images.map((dataUrl, i) => ({
        ...bulkUpload.makeItem(course),
        id: `${idKey}-${stamp}${i.toString(36)}`,
        image: dataUrl,
        alt: files[i].name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || course.title,
      }));
      setBulkMsg(`${created.length} photo(s) ready — confirm the backup step to save.`);
      setPendingSave({
        list: [...created, ...items],
        idVal: null,
        note: `${created.length} photo(s) uploaded for "${course.title}".`,
      });
    } catch (err) {
      setBulkMsg(`Upload failed: ${err.message || 'unknown error'}`);
    } finally {
      setBulkBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const applySave = () => {
    const idVal = String(draft[idKey] ?? '').trim();
    if (!idVal) {
      setError(`"${schema.find((f) => f.key === idKey)?.label || idKey}" is required.`);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(idVal)) {
      setError('Use lowercase letters, numbers and dashes only (no spaces or capitals).');
      return;
    }
    const requiredField = schema.find((f) => f.required);
    if (requiredField && !String(draft[requiredField.key] ?? '').trim()) {
      setError(`${requiredField.label} is required.`);
      return;
    }
    const clash = items.find((it) => String(it[idKey]) === idVal && String(it[idKey]) !== String(selectedId));
    if (clash) {
      setError(`"${idVal}" is already used by "${clash[displayKey] || clash[idKey]}". Pick a different value.`);
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
        setPendingSave({ list, idVal, savedForm: true });
        return;
      }
    }
    list.push({ ...draft, [idKey]: idVal });
    setPendingSave({ list, idVal, savedForm: true });
  };
  const applySaveRef = useRef(applySave);
  applySaveRef.current = applySave;

  const removeItem = (item) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    const index = items.findIndex((it) => String(it[idKey]) === String(item[idKey]));
    onSave(items.filter((it) => String(it[idKey]) !== String(item[idKey])));
    if (String(selectedId) === String(item[idKey])) {
      setSelectedId(null);
      setDraft(null);
      setBaseline(null);
    }
    setPicked((p) => p.filter((id) => String(id) !== String(item[idKey])));
    onSaved('Entry deleted.');
    setUndoEntry({ item, index });
  };

  const undoDelete = () => {
    if (!undoEntry) return;
    const list = [...items];
    list.splice(Math.min(undoEntry.index, list.length), 0, undoEntry.item);
    onSave(list);
    onSaved('Deletion undone.');
    setUndoEntry(null);
  };

  useEffect(() => {
    if (!undoEntry) return undefined;
    const t = window.setTimeout(() => setUndoEntry(null), 7000);
    return () => window.clearTimeout(t);
  }, [undoEntry]);

  const duplicateItem = (item) => {
    const copy = JSON.parse(JSON.stringify(item));
    const base = `${copy[idKey]}-copy`;
    copy[idKey] = items.some((it) => String(it[idKey]) === base) ? `${base}-${Date.now().toString(36).slice(-3)}` : base;
    if (displayKey in copy) copy[displayKey] = `${copy[displayKey]} (copy)`;
    onSave([...items, copy]);
    onSaved('Duplicated — remember to press Save after edits.');
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const list = [...items];
    const [row] = list.splice(index, 1);
    list.splice(target, 0, row);
    onSave(list);
    onSaved(dir < 0 ? 'Moved up.' : 'Moved down.');
  };

  const togglePick = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const deletePicked = () => {
    if (!picked.length) return;
    const names = picked.map((id) => items.find((it) => String(it[idKey]) === String(id))?.[displayKey] || id);
    if (!window.confirm(`Delete ${picked.length} selected entr${picked.length > 1 ? 'ies' : 'y'}?\n\n${names.slice(0, 8).join('\n')}${names.length > 8 ? '\n…' : ''}`)) return;
    onSave(items.filter((it) => !picked.includes(String(it[idKey]))));
    setPicked([]);
    onSaved(`${picked.length} entr${picked.length > 1 ? 'ies' : 'y'} deleted.`);
  };

  const invalidKeys = new Set(
    error && draft
      ? schema
        .filter((f) => f.required && !String(draft[f.key] ?? '').trim())
        .map((f) => f.key)
      : []
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900 dark:text-white">
            {title}
            {dirty && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <CircleAlert className="h-3 w-3" /> Unsaved changes
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-accent-500 hover:bg-accent-600 text-navy-950 transition">
          <Plus className="w-4 h-4" /> Add new
        </button>
      </div>

      {undoEntry && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/60">
          <span className="truncate text-slate-600 dark:text-slate-300">
            Deleted “{undoEntry.item[displayKey] || undoEntry.item[idKey]}”.
          </span>
          <button onClick={undoDelete}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-700 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-navy-600">
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </button>
        </div>
      )}

      {bulkUpload && courses.length > 0 && (
        <div className="mb-5 rounded-lg border border-dashed border-accent-400/70 bg-accent-50/40 px-4 py-4 dark:bg-accent-500/[0.06]">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <label className={labelCls}>{bulkUpload.label || 'Add multiple photos for a course'}</label>
              <select value={effectiveBulkCourse} onChange={(e) => setBulkCourse(e.target.value)} className={inputCls}>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => fileRef.current && fileRef.current.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-accent-500 hover:bg-accent-600 text-navy-950 disabled:opacity-50"
              >
                {bulkBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {bulkBusy ? 'Processing…' : 'Choose multiple photos'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={startBulkUpload} />
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {bulkUpload.hint ||
              'Pick a course, then select several photos at once — each becomes its own item.'}
          </p>
          {bulkMsg && (
            <p className={`mt-1 text-xs ${bulkMsg.startsWith('Upload failed') ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {bulkMsg}
            </p>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-[300px_1fr] gap-5">
        {/* List */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}…  (press /)`}
              className={`${inputCls} pl-8`} />
          </div>
          <p className="px-1 text-xs text-slate-400">
            Showing {filtered.length} of {items.length}
            {picked.length > 0 && <span className="ml-2 font-semibold text-accent-600 dark:text-accent-400">{picked.length} selected</span>}
          </p>
          {picked.length > 0 && allowDelete && (
            <div className="flex gap-2">
              <button onClick={deletePicked}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-red-600 text-white transition hover:bg-red-500">
                <Trash2 className="w-3.5 h-3.5" /> Delete {picked.length} selected
              </button>
              <button onClick={() => setPicked([])}
                className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400">
                Clear
              </button>
            </div>
          )}
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 && <p className="p-4 text-sm text-slate-400">Nothing found.</p>}
            {filtered.map((it) => {
              const activeSel = String(selectedId) === String(it[idKey]);
              const realIndex = items.findIndex((x) => String(x[idKey]) === String(it[idKey]));
              const badge = badgeFn ? badgeFn(it) : null;
              const preview = previewUrlFn ? previewUrlFn(it) : null;
              return (
                <div key={it[idKey]}
                  className={`group flex items-center gap-2 p-2.5 cursor-pointer transition ${activeSel ? 'bg-navy-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                  onClick={() => startEdit(it)}>
                  {allowDelete && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${it[displayKey] || 'entry'}`}
                      checked={picked.includes(String(it[idKey]))}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => togglePick(String(it[idKey]))}
                      className="h-3.5 w-3.5 shrink-0 rounded accent-navy-600"
                    />
                  )}
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
                    <p className="truncate text-xs text-slate-400">{subtitleFn ? subtitleFn(it) : ''}</p>
                    {badge && (
                      <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeTones[badge.tone] || badgeTones.gray}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition flex gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); move(realIndex, -1); }} title="Move up" disabled={realIndex <= 0}
                      className="p-1 rounded text-slate-400 hover:text-navy-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); move(realIndex, 1); }} title="Move down" disabled={realIndex === items.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-navy-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    {preview && (
                      <a href={preview} target="_blank" rel="noreferrer" title="View on website" onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded text-slate-400 hover:text-accent-600"><ExternalLink className="w-4 h-4" /></a>
                    )}
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
              <p className="mt-3 text-xs">Shortcuts: <span className="font-mono">/</span> search · <span className="font-mono">Ctrl+S</span> save · <span className="font-mono">Esc</span> discard</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {schema.map((f) => (
                  <div key={f.key} className={f.type === 'textarea' || f.type === 'lines' || f.full ? 'sm:col-span-2' : ''}>
                    <Field
                      field={f}
                      value={draft[f.key]}
                      invalid={invalidKeys.has(f.key)}
                      onChange={(v) => {
                        if (f.key === 'slug') slugTouched.current = true;
                        setDraft((d) => {
                          const next = { ...d, [f.key]: v };
                          // Keep the URL slug in step with the title while typing a new entry,
                          // until the admin overrides the slug by hand.
                          if (f.key === 'title' && selectedId === '__new__' && !slugTouched.current) {
                            next.slug = slugify(v);
                          }
                          return next;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
              <div className="flex flex-wrap gap-2 justify-end items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                {dirty && <span className="mr-auto text-xs text-amber-600 dark:text-amber-400">You have unsaved edits.</span>}
                <button onClick={() => { setDraft(null); setBaseline(null); setSelectedId(null); setError(''); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={applySave} disabled={!dirty}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" /> Save changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {pendingSave && (
        <BackupPromptModal
          body="Download a copy of the current content before applying your changes? You can restore it anytime with the Restore button."
          onBackup={() => {
            downloadJson(backupFilename(), content.exportAll());
            commit(pendingSave.list, pendingSave.idVal);
            setPendingSave(null);
          }}
          onSave={() => {
            commit(pendingSave.list, pendingSave.idVal);
            setPendingSave(null);
          }}
          onClose={() => setPendingSave(null)}
        />
      )}
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

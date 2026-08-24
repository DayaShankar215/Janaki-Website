import { useRef, useState } from 'react';
import { Upload, Link2, X } from 'lucide-react';
import { fileToDataUrl } from '@/utils/imageTools';

/**
 * Image field for the admin panel: upload from device (auto-resized +
 * compressed to a data-URL) or paste any image URL.
 */
export default function ImageInput({ value, onChange, label = 'Image', aspect = 'aspect-video' }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-2 bg-slate-100 dark:bg-slate-800">
          <img src={value} alt="Preview" className={`w-full ${aspect} object-cover`} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`${aspect} rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 mb-2 text-slate-400`}>
          <Upload className="w-6 h-6" />
          <span className="text-xs">No image yet</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current && fileRef.current.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-navy-700 text-white hover:bg-navy-600 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {busy ? 'Processing…' : 'Upload photo'}
        </button>
        {!value && (
          <div className="relative flex-1 min-w-[180px]">
            <Link2 className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="…or paste an image URL"
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent-400 focus:border-transparent"
            />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-slate-400">Photos are auto-resized &amp; compressed. Tip: URLs save storage space.</p>
    </div>
  );
}

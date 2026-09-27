import { useRef, useState } from 'react';
import { Paperclip, X, FileText, ImageIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { ACCEPT_ATTR, LIMITS, MAX_FILES, describeBytes, prepareFiles, validateFile } from '@/utils/documents';
import { cn } from '@/utils/cn';

const iconFor = (doc) => (doc.type?.startsWith('image/') ? ImageIcon : FileText);

function Thumb({ doc }) {
  const Icon = iconFor(doc);
  if (doc.preview) {
    return (
      <img
        src={doc.preview}
        alt=""
        className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-white/10"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
      <Icon className="h-5 w-5" />
    </span>
  );
}

/**
 * Document picker for the enquiry form: click to browse, or drag files onto it.
 * Files are read in the browser and handed back as records (see utils/documents).
 */
export function DocumentUpload({ documents = [], onChange, disabled, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  const add = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setBusy(true);
    let next = [...documents];
    const issues = [];
    for (const file of files) {
      const issue = validateFile(file, next.length);
      if (issue) {
        issues.push(issue);
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      const [record] = await prepareFiles([file]);
      if (record) next = [...next, record];
    }
    setProblem(issues[0] || '');
    onChange(next);
    setBusy(false);
  };

  const removeAt = (index) => onChange(documents.filter((_, i) => i !== index));

  const total = documents.reduce((sum, d) => sum + (d.size || 0), 0);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) add(e.dataTransfer.files);
        }}
        className={cn(
          'rounded-xl border-2 border-dashed p-4 transition-colors',
          dragging
            ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10'
            : error
              ? 'border-red-300 bg-red-50/60 dark:border-red-500/40 dark:bg-red-500/5'
              : 'border-slate-300 bg-slate-50/70 dark:border-white/15 dark:bg-white/[0.03]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="sr-only"
          data-testid="doc-input"
          disabled={disabled}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-slate-200">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4 text-accent-500" />}
            Attach documents
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(optional)</span>
          </p>
          <button
            type="button"
            disabled={disabled || documents.length >= MAX_FILES || busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-900/15 bg-white px-3 py-1.5 text-xs font-bold text-navy-900 transition hover:border-accent-500 hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            Choose files
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {LIMITS.label}. Drop files here instead. Uploading a document lets us process your enquiry faster — you
          can still apply without it.
        </p>

        {problem && (
          <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" /> {problem}
          </p>
        )}

        {documents.length > 0 && (
          <ul className="mt-3 space-y-2" data-testid="doc-list">
            {documents.map((doc, i) => (
              <li
                key={`${doc.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <Thumb doc={doc} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{doc.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{describeBytes(doc.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  disabled={disabled}
                  aria-label={`Remove ${doc.name}`}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {documents.length > 0 && (
          <p className="mt-2 text-right text-[11px] text-slate-500 dark:text-slate-400">
            {documents.length} of {MAX_FILES} attached · {describeBytes(total)} total
          </p>
        )}
      </div>
    </div>
  );
}

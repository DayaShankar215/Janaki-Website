/**
 * Uploaded documents on the enquiry form.
 *
 * Everything here is deliberately strict, because a file is stored as a data
 * URL inside a single Realtime Database node (the free Spark plan has no Cloud
 * Storage without enabling billing). Three files of 1.5 MB is roughly 6 MB of
 * base64 per applicant — generous for a training-centre admission, and small
 * enough that the database stays quick.
 *
 * To raise the limits, raise these AND enable billing for Cloud Storage, then
 * swap `prepareFiles` for a direct upload and store only the download URL.
 */

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 1.5 * 1024 * 1024;

export const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];
export const ACCEPT_ATTR = '.pdf,.jpg,.jpeg,.png,.webp,.heic';
export const ACCEPT_LABEL = 'PDF, JPG, PNG or WEBP';

/** Human labels for admin/visitor UI, so the rules are never a mystery. */
export const LIMITS = {
  label: `Up to ${MAX_FILES} documents · ${ACCEPT_LABEL} · max ${Math.round(MAX_FILE_BYTES / 1024 / 1024 * 10) / 10} MB each`,
};

const MB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function describeBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return MB(bytes);
}

/** Validate a picked/dropped file. Returns an error string, or null if fine. */
export function validateFile(file, currentCount = 0) {
  if (currentCount >= MAX_FILES) return `You can attach up to ${MAX_FILES} documents.`;
  if (!ACCEPTED.includes(file.type)) {
    const ext = (file.name.split('.').pop() || '').toUpperCase();
    return `${ext || 'That file type'} is not supported. Use ${ACCEPTED.map((t) => t.split('/')[1].toUpperCase().replace('JPEG', 'JPG')).join(', ')}.`;
  }
  if (file.size > MAX_FILE_BYTES) return `"${file.name}" is ${MB(file.size)} — the limit is ${MB(MAX_FILE_BYTES)} per file.`;
  return null;
}

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`));
    reader.readAsDataURL(file);
  });

/**
 * Turn picked files into storable records. Images also get a tiny thumbnail
 * data URL so the admin list can show what was attached without downloading
 * the full file.
 */
export async function prepareFiles(files) {
  const out = [];
  for (const file of Array.from(files || [])) {
    const data = await readAsDataUrl(file);
    const record = {
      name: file.name,
      type: file.type,
      size: file.size,
      data,
      addedAt: Date.now(),
    };
    if (file.type.startsWith('image/')) {
      record.preview = await downscale(data, 220).catch(() => null);
    }
    out.push(record);
  }
  return out;
}

/** Draw a small preview so the admin never has to open a 3 MB photo. */
function downscale(dataUrl, max) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('preview failed'));
    img.src = dataUrl;
  });
}

/** Trigger a browser download for an attached document. */
export function downloadDocument(doc, nameSuffix = '') {
  if (!doc || !doc.data) return false;
  const a = document.createElement('a');
  a.href = doc.data;
  a.download = `${doc.name || 'document'}${nameSuffix}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

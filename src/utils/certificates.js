/**
 * Certificate helpers shared by the admin issuing form and the public
 * verification page.
 *
 * Verification is by certificate number only — the page never lists graduates,
 * so it cannot be used as a phone book.
 */

const PREFIX = 'JTTC-CERT';

/** Human-friendly date for the verification result: "12 August 2026". */
export function formatIssueDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Case/whitespace-insensitive so a printed certificate always matches. */
export const normaliseNumber = (value) => String(value || '').trim().toUpperCase().replace(/\s+/g, '');

/** Next free number for a year, e.g. existing → JTTC-CERT-2026-0008. */
export function suggestNumber(certificates, year = new Date().getFullYear()) {
  const used = new Set(
    (Array.isArray(certificates) ? certificates : [])
      .map((c) => normaliseNumber(c.number))
      .filter((n) => n.startsWith(`${PREFIX}-${year}-`))
  );
  for (let i = 1; i <= 9999; i += 1) {
    const candidate = `${PREFIX}-${year}-${String(i).padStart(4, '0')}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${PREFIX}-${year}-${Date.now().toString().slice(-4)}`;
}

/**
 * Look a certificate up in the published content.
 * @returns {{ certificate: object, valid: boolean, reason?: string } | null}
 */
export function verifyCertificate(certificates, number) {
  const wanted = normaliseNumber(number);
  if (!wanted) return null;
  const found = (Array.isArray(certificates) ? certificates : []).find(
    (c) => normaliseNumber(c.number) === wanted
  );
  if (!found) return null;
  const isValid = found.valid !== false;
  return {
    certificate: found,
    valid: isValid,
    reason: isValid ? '' : found.note || 'This certificate has been revoked by the training centre.',
  };
}

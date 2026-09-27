/**
 * Certificates issued by the centre.
 *
 * Intentionally empty — the site ships without sample graduate records, so the
 * list only ever contains certificates the admin panel has actually issued.
 * Each row is published to the public verification page, so keep it to the facts
 * a certificate carries: holder, program, issue date, status.
 *
 * @typedef {object} Certificate
 * @property {string} number   unique certificate number, e.g. JTTC-CERT-2026-0007
 * @property {string} name     holder's full name, as printed on the certificate
 * @property {string} course   program completed
 * @property {string} issued   ISO date (yyyy-mm-dd)
 * @property {string} [grade]  optional grade or distinction
 * @property {boolean} [valid] false marks it revoked/withdrawn (default true)
 * @property {string} [note]   short note shown on the verification result
 */

/** @type {Certificate[]} */
export const certificates = [];

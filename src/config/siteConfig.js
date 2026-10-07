// ═══════════════════════════════════════════════════════════════
//  CENTRAL SITE CONFIGURATION — Janaki Technical Training Center
//
//  ⚠️  ORGANIZATION OWNER: This is THE file to edit first.
//  Replace every placeholder (marked "YOUR_…" or "your-…") with
//  the real information. Nothing else needs to change.
// ═══════════════════════════════════════════════════════════════

export const siteConfig = {
  /** Full registered name of the organization */
  name: 'Janaki Technical Training Center Pvt. Ltd.',
  /** Shorter name used in tight spaces (navbar, page titles) */
  shortName: 'JTTC',

  /** Live website URL (no trailing slash) — used for SEO/canonical links */
  url: 'https://janakitechnical.com.np',

  tagline: 'Building Skills. Creating Opportunities.',
  description:
    'Practical technical and vocational training designed to equip learners with industry-relevant skills and real-world, hands-on experience.',

  // ── Contact details ─────────────────────────────────────────
  // ✅ Real details added. Address/map still need to be filled in.
  email: 'janakitechnical73@gmail.com',
  phone: '9804804563',
  phoneAlt: '041-420180',
  address: 'KadamChowk, Janakpurdham-02, Nepal',
  mapLinkUrl: 'https://www.google.com/maps/place/Janaki+Technical+Training+Center+Pvt.+Ltd/@26.7267162,85.9351639,741m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39ec3ff859f313af:0x2c19d14d7c44d356!8m2!3d26.7267162!4d85.9351639!16s%2Fg%2F11ggb2dv46',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.6624790510654!2d85.9351639!3d26.7267162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec3ff859f313af%3A0x2c19d14d7c44d356!2sJanaki%20Technical%20Training%20Center%20Pvt.%20Ltd!5e0!3m2!1sen!2snp!4v0000000000000!5m2!1sen!2snp',

  /**
   * Map coordinates (optional). If set and no custom embed URL above,
   * an OpenStreetMap embed with a marker is generated automatically.
   * Find coordinates: right-click your location in Google Maps → the
   * first number is latitude, second is longitude.
   */
  mapLat: '26.7267162',
  mapLng: '85.9351639',

  /** Office hours — leave empty to display "contact us for hours" */
  officeHours: '',

  // ── Social media ────────────────────────────────────────────
  // Paste real profile URLs. Leave "" to hide the icon.
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    linkedin: '',
  },

  // ── Accreditation / affiliation ───────────────────────────────
  // ONLY add verified claims here (e.g. CTEVT registration details).
  // Each entry renders as a badge on the About page.
  // While this array is empty, the website makes NO official claims.
  affiliations: [],

  // ── Internal ────────────────────────────────────────────────
  defaultTitle: 'Janaki Technical Training Center Pvt. Ltd. | Technical & Vocational Training',
};

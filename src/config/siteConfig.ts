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
  shortName: 'Janaki TTC',

  tagline: 'Building Skills. Creating Opportunities.',
  description:
    'Practical technical and vocational training designed to equip learners with industry-relevant skills and real-world, hands-on experience.',

  // ── Contact details ─────────────────────────────────────────
  // TODO: Replace ALL of these placeholders before going live.
  email: 'YOUR_OFFICIAL_EMAIL@example.com',
  phone: '+977-98XXXXXXXX',
  phoneAlt: '',
  address: 'YOUR_COMPLETE_OFFICE_ADDRESS, Nepal',
  mapLinkUrl: '', // e.g. a Google Maps share link for directions

  /**
   * Google Maps embed URL. In Google Maps → Share → Embed a map,
   * copy the src="..." URL and paste it here.
   * Leave empty ("") to show a placeholder panel instead.
   */
  mapEmbedUrl: '',

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
  // Each entry renders as a badge in the About page & footer.
  // While this array is empty, the website makes NO official claims.
  affiliations: [] as Array<{ label: string; detail: string }>,

  // ── Multilingual readiness ──────────────────────────────────
  // The site ships in English. Content lives in data files so a
  // Nepali translation layer can be added later without redesign.
  i18n: {
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ne'] as string[],
    enabled: false,
  },

  // ── Internal (no need to touch) ─────────────────────────────
  defaultTitle: 'Janaki Technical Training Center Pvt. Ltd. | Technical & Vocational Training',
} as const;

export type SiteConfig = typeof siteConfig;

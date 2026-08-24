# Janaki Technical Training Center Pvt. Ltd. — Website

Official website for **Janaki Technical Training Center Pvt. Ltd.** — a technical & vocational training institution.
Built to look and feel like a trustworthy, modern institutional website: courses, practical training, facilities,
trainers, admission process, gallery, FAQ and a working inquiry form.

> **Stack:** React 18 · Vite · JavaScript (JSX) · Tailwind CSS · React Router · Framer Motion · Lucide icons · EmailJS

---

## 1. Quick Start

```bash
npm install
npm run dev      # start dev server
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

---

## 2. Project Structure

```
├── public/
│   ├── favicon.svg          # site icon
│   ├── robots.txt           # SEO crawler rules (edit domain!)
│   ├── sitemap.xml          # SEO sitemap (edit domain!)
│   └── _redirects           # Netlify SPA routing
├── src/
│   ├── assets/              # put your own photos here if preferred
│   ├── components/
│   │   ├── cards/           # CourseCard, TrainerCard, FacilityCard, TestimonialCard
│   │   ├── forms/           # ContactForm (inquiry form)
│   │   ├── layout/          # Navbar, Footer, Layout, PageHero
│   │   └── ui/              # Button, Badge, Reveal, SmartImage, SectionHeading…
│   ├── config/
│   │   ├── siteConfig.js    # ⭐ EDIT ME FIRST — all organization info
│   │   └── icons.js         # icon name registry used by data files
│   ├── data/                # ⭐ ALL WEBSITE CONTENT lives here
│   │   ├── courses.js       # every course (add/edit/remove programs)
│   │   ├── categories.js    # course categories/filters
│   │   ├── trainers.js      # trainer profiles (sample-marked)
│   │   ├── testimonials.js  # student testimonials (sample-marked)
│   │   ├── facilities.js    # workshops & facilities
│   │   ├── gallery.js       # gallery images & captions
│   │   ├── faqs.js          # FAQ entries
│   │   ├── announcements.js # notice board items
│   │   └── misc.js          # values, methodology, career paths, admission steps…
│   ├── hooks/               # useTheme (dark mode), useSeo, ScrollToTop…
│   ├── pages/               # one file per route
│   ├── sections/home/       # homepage building blocks
│   ├── styles/index.css     # global styles
│   ├── utils/               # cn(), validation, EmailJS sender
│   ├── App.jsx              # routes
│   └── main.jsx             # entry point
├── .env.example             # copy to .env for the contact form
├── vercel.json              # Vercel SPA routing
└── index.html               # SEO meta tags + fonts
```

---

## 3. Owner Setup Checklist (before going live)

### Step A — Organization info (`src/config/siteConfig.js`)
Replace **every placeholder**:
- `email`, `phone`, `address`
- `mapEmbedUrl` — Google Maps → Share → *Embed a map* → paste the `src="…"` URL
- `mapLinkUrl` — optional "Get Directions" link
- `officeHours`
- `socialLinks` — leave `""` to hide an icon
- `affiliations` — **only add verified claims here** (e.g. CTEVT registration). While empty,
  the site makes no official claims.

### Step B — Contact form (`EmailJS`)
1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. Add an **email service** (e.g., Gmail) → copy the *Service ID*.
3. Create an **email template** using variables:
   `{{from_name}} {{reply_email}} {{phone}} {{address}} {{course}} {{education}} {{preferred_time}} {{message}} {{sent_at}}`
4. Copy your *Public Key* from Account → API Keys.
5. Copy `.env.example` → `.env` and fill in:

```env
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Without these values the form runs in a clearly-labelled **demo mode**
(no email is sent) so the site can still be tested safely.

### Step C — Content review
- `src/data/courses.js` — confirm each program is real; set `active: true/false`.
  Durations are editable samples — replace with your confirmed schedules.
- Sample-marked trainers/testimonials show a small "Sample" badge until you set
  `isSample: false` on genuine content.
- Replace Unsplash sample photos with real photos of your center (see below).

### Step D — Domain / SEO
- In `public/robots.txt` and `public/sitemap.xml`: find & replace `www.YOUR-DOMAIN.com`.
- In `index.html`: uncomment the canonical link and add the domain.

---

## 4. Managing Courses

Open `src/data/courses.js` and copy any existing block:

```js
{
  slug: 'new-course-slug',            // becomes /courses/new-course-slug
  title: 'Course Title',
  categoryId: 'electrical',           // see categories.js
  shortDescription: 'One or two sentences shown on cards.',
  overview: ['Paragraph 1', 'Paragraph 2'],
  image: 'https://…',                 // photo URL
  durationLabel: '8 weeks',
  durationWeeks: 8,                   // numeric, for sorting only
  level: 'Beginner',
  practicalFocus: true,
  active: true,                       // false = listed but not enrolling
  skills: ['…'],                      // what students learn
  practicalSkills: ['…'],             // hands-on tasks practiced
  eligibility: ['…'],
  tools: ['…'],
  careers: ['…'],
}
```

The Courses page filters, search, sorting, related-course sections and the inquiry-form
dropdown all update automatically.

---

## 5. Replacing Images

Sample photos are hot-linked from [Unsplash](https://unsplash.com) (free to use).
To swap any image, just change its URL in the relevant data file — or place files in
`src/assets/` and import them:

```js
import myPhoto from '@/assets/my-photo.jpg';
// then: image: myPhoto,
```

If a remote image ever fails to load, the UI shows a branded fallback panel instead of a broken image.

---

## 6. Deployment

### Netlify
1. Push this project to GitHub/GitLab.
2. Netlify → *Add new site* → import the repo.
3. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables (*Site settings → Environment variables*):
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
5. SPA routing already handled by `public/_redirects`. ✅
6. Custom domain: *Domain settings → Add domain* → follow DNS instructions.
7. Update `robots.txt` / `sitemap.xml` / canonical URL with the final domain, redeploy.

### Vercel
1. Push the repo, then *Add New Project* in Vercel.
2. Framework preset: **Vite** (auto-detected).
   - Build command: `npm run build` · Output directory: `dist`
3. Add the three `VITE_EMAILJS_*` environment variables under *Settings → Environment Variables*.
4. SPA routing already handled by `vercel.json`. ✅
5. Custom domain: *Project → Domains* → add and update DNS.

> ⚠️ After adding/changing environment variables, trigger a fresh deploy so they take effect.

---

## 7. Notes & Guarantees

- The site intentionally makes **no claims** about CTEVT affiliation, certification,
  placement rates or government approval unless you add verified text yourself
  (`siteConfig.affiliations`). Keep it that way.
- Multilingual readiness: content is centralized in `src/data/*` and `siteConfig.js`,
  so a Nepali translation layer can be added later without redesigning components.
- Accessibility: semantic HTML, labelled forms, keyboard-navigable menus/gallery,
  visible focus states and `prefers-reduced-motion` support are built in.

import { Link } from 'react-router-dom';
import { Zap, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { categories } from '@/data/categories';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/courses', label: 'Courses' },
  { to: '/admission', label: 'Admission' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

const trainingAreas = [
  { id: 'electrical', label: 'Electrical' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'construction', label: 'Construction' },
  { id: 'computer', label: 'Computer & Technology' },
  { id: 'mechanical', label: 'Mechanical / Welding' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'tailoring', label: 'Tailoring & Garment' },
];

const socials = [
  { name: 'Facebook', icon: Facebook, key: 'facebook' },
  { name: 'Instagram', icon: Instagram, key: 'instagram' },
  { name: 'YouTube', icon: Youtube, key: 'youtube' },
  { name: 'LinkedIn', icon: Linkedin, key: 'linkedin' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const activeSocials = socials.filter((s) => siteConfig.socialLinks[s.key]);

  return (
    <footer className="bg-navy-950 text-slate-300">
      {/* Accent strip */}
      <div className="h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-navy-500" aria-hidden="true" />

      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* About */}
        <div>
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} — Home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Zap className="h-5 w-5 text-accent-400" fill="currentColor" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold text-white">Janaki Technical</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Training Center
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {siteConfig.description}
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent-400"
                >
                  <span className="h-px w-3 bg-slate-600 transition-all group-hover:w-5 group-hover:bg-accent-400" aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Training areas */}
        <nav aria-label="Training areas">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">Training Areas</h3>
          <ul className="mt-4 space-y-2.5">
            {trainingAreas.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/courses?category=${a.id}`}
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent-400"
                >
                  <span className="h-px w-3 bg-slate-600 transition-all group-hover:w-5 group-hover:bg-accent-400" aria-hidden="true" />
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">Contact</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              <span>{siteConfig.address}</span>
            </li>
            <li>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2.5 transition-colors hover:text-accent-400">
                <Phone className="h-4 w-4 shrink-0 text-accent-400" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 break-all transition-colors hover:text-accent-400">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" />
                {siteConfig.email}
              </a>
            </li>
            {siteConfig.officeHours && (
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>{siteConfig.officeHours}</span>
              </li>
            )}
          </ul>

          {activeSocials.length > 0 && (
            <div className="mt-6 flex gap-2.5">
              {activeSocials.map(({ name, icon: Icon, key }) => (
                <a
                  key={key}
                  href={siteConfig.socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition-colors hover:bg-accent-500 hover:text-navy-950"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p>Practical skills for real opportunities.</p>
        </div>
      </div>
    </footer>
  );
}

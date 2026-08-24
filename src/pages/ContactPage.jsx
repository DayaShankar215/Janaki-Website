import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/ui/Reveal';
import { useContent } from '@/content/ContentContext';

function InfoCard({ icon: Icon, title, children, action }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-accent-400 shadow-soft">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">{title}</h3>
        <div className="mt-1 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
        {action}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { siteConfig } = useContent();
  useSeo(
    'Contact Us',
    'Contact Janaki Technical Training Center — phone, email, address and inquiry form for training program questions and enrollment.'
  );

  const [searchParams] = useSearchParams();
  const presetCourse = searchParams.get('course') || '';

  // Highlight the form when arriving via "Enquire Now"
  useEffect(() => {
    if (presetCourse) {
      const el = document.getElementById('inquiry-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [presetCourse]);

  const socialEntries = Object.entries(siteConfig.socialLinks).filter(([, url]) => url);

  // Map source: custom embed URL → auto OSM embed from coordinates → placeholder
  const lat = parseFloat(siteConfig.mapLat);
  const lng = parseFloat(siteConfig.mapLng);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  let mapSrc = siteConfig.mapEmbedUrl;
  if (!mapSrc && hasCoords) {
    const d = 0.012;
    mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - d).toFixed(5)}%2C${(lat - d).toFixed(5)}%2C${(lng + d).toFixed(5)}%2C${(lat + d).toFixed(5)}&layer=mapnik&marker=${lat}%2C${lng}`;
  }
  const directionsUrl =
    siteConfig.mapLinkUrl || (hasCoords ? `https://www.google.com/maps?q=${lat},${lng}` : '');

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Questions about a course, schedules or enrollment? Reach us by phone, email, or the inquiry form below."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="bg-white py-14 dark:bg-navy-950 sm:py-16">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Form */}
          <Reveal>
            <div id="inquiry-form" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-card dark:border-white/10 dark:bg-white/[0.03] sm:p-9">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
                Send an Inquiry
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Fields marked * are required. We usually respond within one to two working days.
              </p>
              <div className="mt-7">
                <ContactForm defaultCourse={presetCourse} />
              </div>
            </div>
          </Reveal>

          {/* Info column */}
          <div className="space-y-5 lg:sticky lg:top-24">
            <InfoCard icon={MapPin} title="Visit Us">
              {siteConfig.address}
            </InfoCard>

            <InfoCard
              icon={Phone}
              title="Call Us"
              action={
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 hover:underline dark:text-accent-400"
                >
                  Tap to call <ExternalLink className="h-3 w-3" />
                </a>
              }
            >
              {siteConfig.phone}
            </InfoCard>

            <InfoCard icon={Mail} title="Email Us">
              <a href={`mailto:${siteConfig.email}`} className="break-all transition-colors hover:text-accent-600 dark:hover:text-accent-400">
                {siteConfig.email}
              </a>
            </InfoCard>

            <InfoCard icon={Clock} title="Office Hours">
              {siteConfig.officeHours || 'Please contact us for current office hours.'}
            </InfoCard>

            {socialEntries.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
                  Follow Us
                </h3>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {socialEntries.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-3 py-2 text-xs font-bold capitalize text-navy-800 transition-colors hover:bg-accent-500 hover:text-navy-950 dark:bg-white/10 dark:text-slate-200"
                    >
                      {key} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-slate-100 bg-slate-50 py-14 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="container-x">
          <Reveal>
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
              Find Our Training Center
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-card dark:border-white/10">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title={`Map — ${siteConfig.name}`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full border-0"
                />
              ) : (
                <div className="relative flex h-[420px] flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_30%,rgba(74,123,208,0.25),transparent_55%),radial-gradient(circle_at_70%_65%,rgba(245,158,11,0.18),transparent_50%),linear-gradient(160deg,#101f3d_0%,#0A1730_100%)] text-center">
                  <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
                  <span className="relative flex h-16 w-16 animate-float items-center justify-center rounded-full bg-accent-500 text-navy-950 shadow-card-hover">
                    <MapPin className="h-8 w-8" />
                  </span>
                  <p className="relative max-w-md px-6 text-sm font-semibold leading-relaxed text-slate-200">
                    Map location coming soon.
                    <br />
                    <span className="mt-1 block text-xs font-normal text-slate-400">
                      Set your location in the Admin Panel → Site Settings → Map location,
                      and the interactive map will appear here automatically.
                    </span>
                  </p>
                </div>
              )}
            </div>
            {directionsUrl && (
              <div className="mt-4 flex justify-center">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-navy-700 dark:bg-accent-500 dark:text-navy-950 dark:hover:bg-accent-400"
                >
                  <MapPin className="h-4 w-4" /> Get Directions on Google Maps
                </a>
              </div>
            )}
          </Reveal>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Update address &amp; location anytime in{' '}
            <Link to="/admin" className="font-semibold underline-offset-2 hover:underline">
              the admin panel
            </Link>{' '}
            — see also{' '}
            <Link to="/admission" className="font-semibold underline-offset-2 hover:underline">
              admission info
            </Link>{' '}
            before visiting.
          </p>
        </div>
      </section>
    </>
  );
}


import { FileText, Phone } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ContactForm } from '@/components/forms/ContactForm';
import { admissionSteps, admissionDocuments } from '@/data/misc';
import { siteConfig } from '@/config/siteConfig';

export default function AdmissionPage() {
  useSeo(
    'Admission & Enrollment',
    'How to enroll at Janaki Technical Training Center — choose a program, check eligibility, and submit your inquiry in five simple steps.'
  );

  return (
    <>
      <PageHero
        title="Admission & Enrollment"
        description="Five simple steps between you and your first day of practical training."
        breadcrumb={[{ label: 'Admission' }]}
      />

      {/* Steps */}
      <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Process"
            title="How to Enroll"
            description="Follow these steps — or simply send an inquiry and our team will guide you through everything."
          />

          <ol className="relative mx-auto mt-14 max-w-3xl space-y-8 before:absolute before:bottom-6 before:left-[1.4rem] before:top-6 before:w-0.5 before:bg-gradient-to-b before:from-navy-300 before:via-navy-200 before:to-accent-400 dark:before:from-white/20 dark:before:via-white/10 dark:before:to-accent-500/60 sm:before:left-6">
            {admissionSteps.map((step, i) => (
              <li key={step.step} className="relative flex gap-5 sm:gap-7">
                <Reveal delay={i * 0.08} className="shrink-0">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-900 text-lg font-extrabold text-accent-400 shadow-card ring-4 ring-white dark:ring-navy-950">
                    {step.step}
                  </span>
                </Reveal>
                <Reveal delay={i * 0.08 + 0.05} y={16} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-navy-900 dark:text-white">
                    <DynamicIcon name={step.icon} className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Documents */}
          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-navy-900 dark:text-white">
                <FileText className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                Documents Typically Required
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {admissionDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Please confirm the exact document list with our office when enrolling — requirements can vary by
                program.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex justify-center">
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-3.5 text-base font-bold text-navy-950 shadow-soft transition-all hover:bg-accent-400 hover:shadow-card-hover"
            >
              Start Below — Submit Your Inquiry ↓
            </a>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply-form" className="scroll-mt-24 bg-slate-50 py-16 dark:bg-white/[0.02] sm:py-20">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] sm:p-9">
            <SectionHeading
              align="left"
              eyebrow="Apply / Enquire"
              title="Training Inquiry Form"
              description="Fill this in and we will get back to you about your chosen program."
              className="[&>p]:mt-2"
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="font-display text-base font-bold text-navy-900 dark:text-white">Need help deciding?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Talk to us before choosing — we will happily explain what each trade involves and which course fits
                your goals.
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-600 dark:bg-navy-500 dark:hover:bg-navy-400"
              >
                <Phone className="h-4 w-4" /> Call {siteConfig.phone}
              </a>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-6 text-slate-300 shadow-card">
              <h3 className="font-display text-base font-bold text-white">What happens next?</h3>
              <ol className="mt-3 space-y-2.5 text-sm leading-relaxed">
                <li>1. Our team reviews your inquiry.</li>
                <li>2. We contact you with course details and upcoming batch dates.</li>
                <li>3. You visit the center (optional but welcome).</li>
                <li>4. Complete enrollment and start training.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

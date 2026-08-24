import { Phone, ArrowRight, Send } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/** Final call-to-action band. */
export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-20">
      <div className="absolute inset-0 hero-grid bg-grid opacity-40" aria-hidden="true" />
      <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" aria-hidden="true" />

      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Build Your Future?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Choose a trade, learn it practically, and step confidently toward work you can be proud of.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Button to="/admission" variant="accent" size="lg" className="group">
                Apply Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button to="/contact" variant="white-outline" size="lg">
                <Send className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
            <a
              href={`tel:${siteConfig.phone}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-accent-400"
            >
              <Phone className="h-4 w-4" />
              Call us: {siteConfig.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

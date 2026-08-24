import { useSeo } from '@/hooks/useSeo';
import { HeroSection } from '@/sections/home/HeroSection';
import { QuickInfoBar } from '@/sections/home/QuickInfoBar';
import { AnnouncementsSection } from '@/sections/home/AnnouncementsSection';
import { FeaturedCourses } from '@/sections/home/FeaturedCourses';
import { WhyChooseUs } from '@/sections/home/WhyChooseUs';
import { PracticalBand } from '@/sections/home/PracticalBand';
import { MethodologySection } from '@/sections/home/MethodologySection';
import { CareersTeaser } from '@/sections/home/CareersTeaser';
import { TestimonialsSection } from '@/sections/home/TestimonialsSection';
import { CTASection } from '@/sections/home/CTASection';

export default function HomePage() {
  useSeo(
    undefined,
    'Janaki Technical Training Center Pvt. Ltd. offers practical technical and vocational training — electrician, plumbing, welding, construction, computer skills and more.'
  );

  return (
    <>
      <HeroSection />
      <QuickInfoBar />
      <AnnouncementsSection />
      <FeaturedCourses />
      <WhyChooseUs />
      <PracticalBand />
      <MethodologySection />
      <CareersTeaser />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

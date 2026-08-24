// Aggregates every piece of website content into one default object.
// The Admin Panel edits copies of this, stored in the browser.

import { siteConfig } from '@/config/siteConfig';
import { courses } from '@/data/courses';
import { categories } from '@/data/categories';
import { trainers } from '@/data/trainers';
import { testimonials } from '@/data/testimonials';
import { facilities } from '@/data/facilities';
import { galleryItems, galleryCategories } from '@/data/gallery';
import { faqs } from '@/data/faqs';
import { announcements } from '@/data/announcements';
import {
  whyChooseUs,
  values,
  methodologySteps,
  careerPathways,
  careerExamples,
  admissionSteps,
  admissionDocuments,
  educationLevels,
  preferredTimings,
} from '@/data/misc';

export const defaults = {
  siteConfig: JSON.parse(JSON.stringify(siteConfig)),
  courses,
  categories,
  trainers,
  testimonials,
  facilities,
  galleryItems,
  galleryCategories: [...galleryCategories],
  faqs,
  announcements,
  whyChooseUs,
  values,
  methodologySteps,
  careerPathways,
  careerExamples,
  admissionSteps,
  admissionDocuments,
  educationLevels,
  preferredTimings,
};

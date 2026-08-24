// ─────────────────────────────────────────────────────────────
// Shared TypeScript types for the whole website.
// ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  label: string;
  /** Lucide icon name component is assigned in the data file */
  icon: string;
}

export interface Course {
  slug: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  overview: string[];
  image: string;
  durationLabel: string;
  /** Approximate number of weeks — used only for sorting/filtering */
  durationWeeks: number;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  practicalFocus: boolean;
  /**
   * true = currently open for enrollment.
   * false = program exists but is NOT currently running.
   * Never present an inactive course as running.
   */
  active: boolean;
  skills: string[];
  practicalSkills: string[];
  eligibility: string[];
  tools: string[];
  careers: string[];
}

export interface Trainer {
  id: string;
  name: string;
  position: string;
  expertise: string[];
  bio: string;
  experience: string;
  /** When true the UI shows a small "Sample profile" badge */
  isSample: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  quote: string;
  rating: number;
  /** When true the UI shows a small "Sample" badge */
  isSample: boolean;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

export interface PracticeArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Training' | 'Workshops' | 'Students' | 'Events' | 'Facilities';
  image: string;
  alt: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: 'General' | 'Courses' | 'Admission';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  tag: 'Admission' | 'Notice' | 'Event' | 'Course';
  excerpt: string;
  pinned?: boolean;
  isSample?: boolean;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

export interface MethodStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface CareerPathway {
  title: string;
  description: string;
  icon: string;
}

export interface AdmissionStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

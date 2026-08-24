import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

// Code-split pages for faster initial load
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailsPage = lazy(() => import('@/pages/CourseDetailsPage'));
const FacilitiesPage = lazy(() => import('@/pages/FacilitiesPage'));
const PracticalTrainingPage = lazy(() => import('@/pages/PracticalTrainingPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const TrainersPage = lazy(() => import('@/pages/TrainersPage'));
const AdmissionPage = lazy(() => import('@/pages/AdmissionPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <Loader2 className="h-9 w-9 animate-spin text-navy-500 dark:text-accent-400" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/practical-training" element={<PracticalTrainingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}

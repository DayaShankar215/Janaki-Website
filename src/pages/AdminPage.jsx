import { useState } from 'react';
import {
  Settings, BookOpen, Users, Building2, Image as ImageIcon, MessageSquareQuote,
  Megaphone, HelpCircle, Download, Upload, LogOut, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import AdminLogin from '@/admin/AdminLogin';
import CollectionEditor from '@/admin/CollectionEditor';
import SiteSettingsTab from '@/admin/SiteSettingsTab';
import { useContent } from '@/content/ContentContext';

function Toast({ toast }) {
  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertTriangle : CheckCircle2;
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-[fadeUp_.25s_ease-out] ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-navy-800 dark:bg-navy-700 text-white'}`}>
      <Icon className="w-4 h-4 shrink-0" /> {toast.msg}
    </div>
  );
}

export default function AdminPage() {
  const content = useContent();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('jttc-admin') === '1');
  const [tab, setTab] = useState('settings');
  const [toast, setToast] = useState(null);
  const [importError, setImportError] = useState('');

  const notify = (msg, type = 'ok') => {
    setToast({ msg, type });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2600);
  };
  const guard = (ok) => {
    if (!ok) {
      notify('Storage is full — remove some photos or use image URLs instead.', 'error');
      return false;
    }
    return true;
  };

  const exportBackup = () => {
    const blob = new Blob([content.exportAll()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jttc-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup downloaded.');
  };

  const importBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const ok = content.importAll(String(reader.result));
        if (guard(ok)) notify('Backup restored successfully.');
      } catch {
        notify('Invalid backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const tabs = [
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'trainers', label: 'Trainers', icon: Users },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  const collectionProps = (sectionKey, extra = {}) => ({
    items: content[sectionKey],
    onSave: (list) => guard(content.updateSection(sectionKey, list)) && notify(`${extra.title || sectionKey} saved.`),
    onSaved: () => {},
    ...extra,
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-accent-500 text-navy-950 grid place-items-center font-black">J</span>
            <div className="min-w-0">
              <p className="font-bold leading-tight truncate">Admin Dashboard</p>
              <p className="text-[11px] text-slate-400 leading-tight truncate">{content.siteConfig.shortName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={exportBackup} title="Download all changes as a JSON backup"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition">
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <label title="Restore from a backup file"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Restore
              <input type="file" accept=".json,application/json" className="hidden" onChange={importBackup} />
            </label>
            <a href="/" target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-accent-500 text-navy-950 hover:bg-accent-400 transition">
              View site ↗
            </a>
            <button onClick={() => { sessionStorage.removeItem('jttc-admin'); setAuthed(false); }}
              title="Log out" className="p-2 rounded-md hover:bg-white/10 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="lg:w-56 shrink-0">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 lg:sticky lg:top-20">
            {tabs.map((t) => (
              <li key={t.id}>
                <button onClick={() => setTab(t.id)}
                  className={`w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t.id ? 'bg-navy-800 dark:bg-navy-700 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-7">
          {tab === 'settings' && <SiteSettingsTab notify={notify} guard={guard} />}
          {tab === 'courses' && (
            <CollectionEditor
              key="courses"
              title="Courses"
              description="Add, edit or remove training programs shown across the website."
              items={content.courses}
              idKey="slug"
              displayKey="title"
              subtitleFn={(c) => `${content.getCategoryLabel(c.categoryId)} · ${c.durationLabel || ''}`}
              imageKey="image"
              newItem={() => ({ slug: '', title: '', categoryId: content.categories[0]?.id || 'other', durationLabel: '', level: 'Beginner', active: true, practicalFocus: true, image: '', shortDescription: '', overview: [], skills: [], practicalSkills: [], eligibility: [], tools: [], careers: [] })}
              schema={[
                { key: 'title', label: 'Course title', required: true },
                { key: 'slug', label: 'URL slug', placeholder: 'e.g. building-electrician', required: true, help: 'Lowercase letters and dashes — used in the page link.' },
                { key: 'categoryId', label: 'Category', type: 'select', options: content.categories.map((c) => ({ value: c.id, label: c.label })) },
                { key: 'durationLabel', label: 'Duration', placeholder: 'e.g. 8–12 weeks' },
                { key: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'] },
                { key: 'image', label: 'Course photo', type: 'image' },
                { key: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2 },
                { key: 'overview', label: 'Overview paragraphs', type: 'lines', rows: 4 },
                { key: 'skills', label: 'Skills covered', type: 'lines', rows: 4 },
                { key: 'practicalSkills', label: 'Practical skills', type: 'lines', rows: 4 },
                { key: 'eligibility', label: 'Eligibility requirements', type: 'lines', rows: 3 },
                { key: 'tools', label: 'Tools & equipment', type: 'lines', rows: 3 },
                { key: 'careers', label: 'Career opportunities', type: 'lines', rows: 3 },
                { key: 'active', label: 'Visible on website (active)', type: 'bool' },
                { key: 'practicalFocus', label: 'Has strong practical focus', type: 'bool' },
              ]}
              onSave={(list) => guard(content.updateSection('courses', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'trainers' && (
            <CollectionEditor
              key="trainers"
              title="Trainers"
              description="Your instructor team, shown on the Trainers page."
              items={content.trainers}
              idKey="id"
              displayKey="name"
              subtitleFn={(t) => t.position}
              imageKey="photo"
              schema={[
                { key: 'name', label: 'Full name', required: true },
                { key: 'position', label: 'Position / role' },
                { key: 'experience', label: 'Experience', placeholder: 'e.g. 12 years field experience' },
                { key: 'photo', label: 'Photo', type: 'image', aspect: 'aspect-square' },
                { key: 'bio', label: 'Bio', type: 'textarea', rows: 3 },
                { key: 'expertise', label: 'Areas of expertise', type: 'lines', rows: 3 },
                { key: 'isSample', label: 'Show "Sample profile" badge', type: 'bool' },
              ]}
              newItem={() => ({ id: `tr-${Date.now().toString(36)}`, name: '', position: '', experience: '', bio: '', expertise: [], photo: '', isSample: false })}
              onSave={(list) => guard(content.updateSection('trainers', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'facilities' && (
            <CollectionEditor
              key="facilities"
              title='Facilities'
              description="Workshops, labs and campus facilities."
              items={content.facilities}
              idKey="id"
              displayKey="name"
              subtitleFn={() => ''}
              imageKey="image"
              schema={[
                { key: 'name', label: 'Facility name', required: true },
                { key: 'icon', label: 'Icon', type: 'select', options: ['wrench', 'zap', 'cpu', 'hammer', 'scissors', 'sparkles', 'car', 'monitor', 'flame', 'ruler', 'hard-hat', 'settings'] },
                { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
                { key: 'features', label: 'Features', type: 'lines', rows: 3 },
                { key: 'image', label: 'Photo', type: 'image' },
              ]}
              newItem={() => ({ id: `fa-${Date.now().toString(36)}`, name: '', icon: 'wrench', description: '', features: [], image: '' })}
              onSave={(list) => guard(content.updateSection('facilities', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'gallery' && (
            <CollectionEditor
              key="gallery"
              title="Gallery"
              description="Photos of training sessions, workshops and events."
              items={content.galleryItems}
              idKey="id"
              displayKey="title"
              subtitleFn={(g) => g.category}
              imageKey="image"
              schema={[
                { key: 'title', label: 'Title', required: true },
                { key: 'category', label: 'Category', type: 'select', options: content.galleryCategories.filter((c) => c !== 'All') },
                { key: 'alt', label: 'Alt text (accessibility)', placeholder: 'Describe the photo briefly' },
                { key: 'image', label: 'Photo', type: 'image' },
              ]}
              newItem={() => ({ id: `g-${Date.now().toString(36)}`, title: '', category: 'Training', alt: '', image: '' })}
              onSave={(list) => guard(content.updateSection('galleryItems', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'testimonials' && (
            <CollectionEditor
              key="testimonials"
              title="Testimonials"
              description="Quotes from graduates and trainees."
              items={content.testimonials}
              idKey="id"
              displayKey="name"
              subtitleFn={(t) => t.course}
              schema={[
                { key: 'name', label: 'Person name', required: true },
                { key: 'course', label: 'Course completed' },
                { key: 'quote', label: 'Quote', type: 'textarea', rows: 3 },
                { key: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5 },
                { key: 'isSample', label: 'Show "Sample" badge', type: 'bool' },
              ]}
              newItem={() => ({ id: `t-${Date.now().toString(36)}`, name: '', course: '', quote: '', rating: 5, isSample: false })}
              onSave={(list) => guard(content.updateSection('testimonials', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'announcements' && (
            <CollectionEditor
              key="announcements"
              title="Announcements"
              description="News & notices shown on the home page ticker and cards."
              items={content.announcements}
              idKey="id"
              displayKey="title"
              subtitleFn={(a) => a.tag}
              schema={[
                { key: 'title', label: 'Title', required: true },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'tag', label: 'Tag', type: 'select', options: ['Admission', 'Notice', 'Event', 'Achievement', 'Update'] },
                { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
                { key: 'pinned', label: 'Pinned (stays at top)', type: 'bool' },
                { key: 'isSample', label: 'Show "Sample" badge', type: 'bool' },
              ]}
              newItem={() => ({ id: `an-${Date.now().toString(36)}`, title: '', date: new Date().toISOString().slice(0, 10), tag: 'Notice', excerpt: '', pinned: false, isSample: false })}
              onSave={(list) => guard(content.updateSection('announcements', list))}
              onSaved={(m) => notify(m)}
            />
          )}
          {tab === 'faqs' && (
            <CollectionEditor
              key="faqs"
              title="FAQs"
              description="Frequently asked questions on the FAQ page."
              items={content.faqs}
              idKey="id"
              displayKey="question"
              subtitleFn={(f) => f.category}
              schema={[
                { key: 'question', label: 'Question', required: true },
                { key: 'category', label: 'Category', type: 'select', options: ['General', 'Courses', 'Admission'] },
                { key: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
              ]}
              newItem={() => ({ id: `f-${Date.now().toString(36)}`, question: '', category: 'General', answer: '' })}
              onSave={(list) => guard(content.updateSection('faqs', list))}
              onSaved={(m) => notify(m)}
            />
          )}

          {/* Reset zone */}
          <div className="mt-10 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400 max-w-md">
              Changes are stored in this browser. Use <span className="font-semibold">Backup</span> to save them to a file,
              and <span className="font-semibold">Restore</span> to load them on another device.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset ALL content back to the original code defaults? This removes every change made in the admin panel.')) {
                  content.resetAll();
                  notify('All content reset to defaults.');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Reset everything
            </button>
          </div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

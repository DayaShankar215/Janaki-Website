import { useEffect, useMemo, useState } from 'react';
import {
  Settings, BookOpen, Users, Building2, Image as ImageIcon, MessageSquareQuote,
  Megaphone, HelpCircle, Download, Upload, LogOut, CheckCircle2, AlertTriangle,
  LayoutDashboard, Search, Keyboard,
} from 'lucide-react';
import AdminLogin from '@/admin/AdminLogin';
import CollectionEditor from '@/admin/CollectionEditor';
import PopupReadiness from '@/admin/PopupReadiness';
import DashboardTab from '@/admin/DashboardTab';
import AdminSearchModal from '@/admin/AdminSearchModal';
import SiteSettingsTab from '@/admin/SiteSettingsTab';
import { downloadJson, backupFilename } from '@/utils/downloadJson';
import { useContent } from '@/content/ContentContext';
import { logActivity, markSaved } from '@/hooks/useAdminActivity';

function Toast({ toast }) {
  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertTriangle : CheckCircle2;
  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-[fadeUp_.25s_ease-out] ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-navy-800 dark:bg-navy-700 text-white'}`}>
      <Icon className="w-4 h-4 shrink-0" /> {toast.msg}
    </div>
  );
}

const SHORTCUTS = [
  ['Ctrl / Cmd + K', 'Search all content'],
  ['Ctrl / Cmd + S', 'Save the open entry'],
  ['Esc', 'Discard edits in the open entry'],
  ['/', 'Jump to the list search box'],
  ['↑ ↓', 'Move between search results'],
  ['?', 'Show this help'],
];

export default function AdminPage() {
  const content = useContent();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('jttc-admin') === '1');
  const [tab, setTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [autoSelect, setAutoSelect] = useState(null);
  const [dirtyTabs, setDirtyTabs] = useState([]);

  const notify = (msg, type = 'ok') => {
    setToast({ msg, type });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2600);
  };

  /** Toast + activity log for anything that changes stored content. */
  const saved = (msg, section = '') => {
    markSaved(section);
    notify(msg);
  };

  const galleryCategoryOptions = useMemo(() => {
    const seen = new Set(content.galleryCategories.filter((c) => c !== 'All'));
    (content.galleryItems || []).forEach((g) => g && g.category && seen.add(g.category));
    return [...seen];
  }, [content.galleryCategories, content.galleryItems]);

  const guard = (ok) => {
    if (!ok) {
      notify('Storage is full — remove some photos or use image URLs instead.', 'error');
      return false;
    }
    return true;
  };

  const exportBackup = () => {
    downloadJson(backupFilename(), content.exportAll());
    logActivity('Downloaded a full backup', 'backup');
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
        if (guard(ok)) saved('Backup restored successfully.', 'restore');
      } catch {
        notify('Invalid backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Global admin shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === '?' && !typing) {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'trainers', label: 'Trainers', icon: Users },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'announcements', label: 'News & Notices', icon: Megaphone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  /** Tab switch that never silently throws away unsaved edits. */
  const goTo = (id, opts = null) => {
    if (id === tab) {
      if (opts) setAutoSelect({ ...opts });
      return;
    }
    if (dirtyTabs.includes(tab)) {
      const name = tabs.find((t) => t.id === tab)?.label || tab;
      if (!window.confirm(`You have unsaved changes in "${name}". Switch tabs and discard them?`)) return;
    }
    setTab(id);
    setAutoSelect(opts ? { ...opts } : null);
  };

  const pickFromSearch = (row) => goTo(row.tab, row.id ? { id: row.id } : null);

  const setTabDirty = (id, isDirty) =>
    setDirtyTabs((list) => {
      const has = list.includes(id);
      if (has === isDirty) return list; // keep the same reference so we don't re-render in a loop
      return isDirty ? [...list, id] : list.filter((t) => t !== id);
    });

  const announcementBadge = (a) => {
    const base =
      a.status === 'published' ? { label: 'Published', tone: 'green' }
        : a.status === 'archived' ? { label: 'Archived', tone: 'gray' } : { label: 'Draft', tone: 'amber' };
    if (a.pinned) return { ...base, label: `Pinned · ${base.label}` };
    if (a.popup) return { ...base, label: `Popup on · ${base.label}` };
    return base;
  };

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
            <button onClick={() => setSearchOpen(true)} title="Search all content (Ctrl+K)"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition">
              <Search className="w-3.5 h-3.5" /> Search
              <span className="rounded border border-white/20 px-1 text-[10px] text-slate-300">Ctrl K</span>
            </button>
            <button onClick={() => setHelpOpen(true)} title="Keyboard shortcuts (?)" aria-label="Keyboard shortcuts"
              className="p-2 rounded-md hover:bg-white/10 transition"><Keyboard className="w-4 h-4" /></button>
            <button onClick={exportBackup} title="Download all changes as a JSON backup"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition">
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <label title="Restore from a backup file"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition cursor-pointer">
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
                <button onClick={() => goTo(t.id)}
                  className={`w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t.id ? 'bg-navy-800 dark:bg-navy-700 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                  {dirtyTabs.includes(t.id) && (
                    <span title="Unsaved changes" className="ml-auto h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-7">
          {tab === 'dashboard' && (
            <DashboardTab onNavigate={goTo} onBackup={exportBackup} onRestore={importBackup} notify={notify} />
          )}
          {tab === 'settings' && (
            <SiteSettingsTab
              notify={notify}
              guard={guard}
              onDirtyChange={(d) => setTabDirty('settings', d)}
              onSaved={(m) => saved(m, 'Site Settings')}
            />
          )}
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
              badgeFn={(c) => (c.active === false ? { label: 'Hidden', tone: 'gray' } : c.image ? { label: 'Live', tone: 'green' } : { label: 'No photo', tone: 'amber' })}
              previewUrlFn={(c) => (c.slug ? `/courses/${c.slug}` : null)}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('courses', d)}
              newItem={() => ({ slug: '', title: '', categoryId: content.categories[0]?.id || 'other', durationLabel: '', level: 'Beginner', active: true, practicalFocus: true, image: '', shortDescription: '', overview: [], skills: [], practicalSkills: [], eligibility: [], tools: [], careers: [] })}
              schema={[
                { key: 'title', label: 'Course title', required: true },
                { key: 'slug', label: 'URL slug', placeholder: 'e.g. building-electrician', required: true, help: 'Lowercase letters and dashes — used in the page link. Auto-filled from the title.' },
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
              onSaved={(m) => saved(m, 'Courses')}
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
              badgeFn={(t) => (t.isSample ? { label: 'Sample', tone: 'amber' } : { label: 'Real', tone: 'green' })}
              previewUrlFn={() => '/trainers'}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('trainers', d)}
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
              onSaved={(m) => saved(m, 'Trainers')}
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
              previewUrlFn={() => '/facilities'}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('facilities', d)}
              schema={[
                { key: 'name', label: 'Facility name', required: true },
                { key: 'icon', label: 'Icon', type: 'select', options: ['wrench', 'zap', 'cpu', 'hammer', 'scissors', 'sparkles', 'car', 'monitor', 'flame', 'ruler', 'hard-hat', 'settings'] },
                { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
                { key: 'features', label: 'Features', type: 'lines', rows: 3 },
                { key: 'image', label: 'Photo', type: 'image' },
              ]}
              newItem={() => ({ id: `fa-${Date.now().toString(36)}`, name: '', icon: 'wrench', description: '', features: [], image: '' })}
              onSave={(list) => guard(content.updateSection('facilities', list))}
              onSaved={(m) => saved(m, 'Facilities')}
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
              badgeFn={(g) => (g.alt ? { label: 'Alt text set', tone: 'green' } : { label: 'No alt text', tone: 'amber' })}
              previewUrlFn={() => '/gallery'}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('gallery', d)}
              schema={[
                { key: 'title', label: 'Title', required: true },
                { key: 'category', label: 'Category', type: 'select', options: galleryCategoryOptions },
                { key: 'alt', label: 'Alt text (accessibility)', placeholder: 'Describe the photo briefly' },
                { key: 'image', label: 'Photo', type: 'image' },
              ]}
              newItem={() => ({ id: `g-${Date.now().toString(36)}`, title: '', category: 'Training', alt: '', image: '' })}
              onSave={(list) => guard(content.updateSection('galleryItems', list))}
              onSaved={(m) => saved(m, 'Gallery')}
              bulkUpload={{
                label: 'Upload multiple photos for a course',
                hint: 'Pick a course, then select several photos at once — each becomes its own gallery item. Photos are auto-resized and compressed.',
                makeItem: (course) => ({ title: course.title, category: course.title, alt: '' }),
              }}
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
              badgeFn={(t) => (t.isSample ? { label: 'Sample', tone: 'amber' } : { label: 'Real', tone: 'green' })}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('testimonials', d)}
              schema={[
                { key: 'name', label: 'Person name', required: true },
                { key: 'course', label: 'Course completed' },
                { key: 'quote', label: 'Quote', type: 'textarea', rows: 3 },
                { key: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5 },
                { key: 'isSample', label: 'Show "Sample" badge', type: 'bool' },
              ]}
              newItem={() => ({ id: `t-${Date.now().toString(36)}`, name: '', course: '', quote: '', rating: 5, isSample: false })}
              onSave={(list) => guard(content.updateSection('testimonials', list))}
              onSaved={(m) => saved(m, 'Testimonials')}
            />
          )}
          {tab === 'announcements' && (
            <>
            <PopupReadiness announcements={content.announcements} />
            <CollectionEditor
              key="announcements"
              title="News & Notices"
              description="Admission notices, events and updates. Only Published items appear on the website; newest first."
              items={content.announcements}
              idKey="id"
              displayKey="title"
              subtitleFn={(a) => `${a.tag} · ${a.date || 'no date'}`}
              imageKey="image"
              badgeFn={announcementBadge}
              previewUrlFn={(a) => (a.status === 'published' ? `/news/${a.slug || a.id}` : null)}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('announcements', d)}
              schema={[
                { key: 'title', label: 'Title', required: true },
                { key: 'slug', label: 'URL slug', required: true, help: 'Used in the article link: /news/<slug>. Lowercase letters and dashes only. Auto-filled from the title.' },
                { key: 'date', label: 'Publication date', type: 'date', help: 'Newer dates are listed first.' },
                { key: 'tag', label: 'Category', type: 'select', options: ['Admission', 'Notice', 'Event', 'News', 'Achievement', 'Update'] },
                { key: 'status', label: 'Status', type: 'select', options: [
                  { value: 'published', label: 'Published — visible on website' },
                  { value: 'draft', label: 'Draft — hidden' },
                  { value: 'archived', label: 'Archived — hidden' },
                ], help: 'Only "Published" items are visible to visitors.' },
                { key: 'image', label: 'Featured photo', type: 'image', aspect: 'aspect-[16/9]', help: 'Shown on cards, the article header and the homepage popup.' },
                { key: 'images', label: 'Gallery photos', type: 'imageList', aspect: 'aspect-video', help: 'Extra photos shown inside the article.' },
                { key: 'excerpt', label: 'Short excerpt', type: 'textarea', rows: 2, help: 'One-liner used on cards and the popup.' },
                { key: 'description', label: 'Full article text', type: 'textarea', rows: 6, help: 'Separate paragraphs with a blank line.' },
                { key: 'popup', label: 'Show as homepage popup', type: 'bool', help: 'Floating announcement shown once per visit. Needs a featured photo.' },
                { key: 'pinned', label: 'Pinned (stays at top)', type: 'bool' },
                { key: 'isSample', label: 'Show "Sample" badge', type: 'bool' },
              ]}
              newItem={() => ({
                id: `an-${Date.now().toString(36)}`,
                slug: '',
                title: '',
                date: new Date().toISOString().slice(0, 10),
                tag: 'Notice',
                status: 'published',
                image: '',
                images: [],
                excerpt: '',
                description: '',
                popup: false,
                pinned: false,
                isSample: false,
              })}
              onSave={(list) => guard(content.updateSection('announcements', list))}
              onSaved={(m) => saved(m, 'News')}
            />
            </>
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
              previewUrlFn={() => '/faq'}
              autoSelect={autoSelect}
              onAutoSelectDone={() => setAutoSelect(null)}
              onDirtyChange={(d) => setTabDirty('faqs', d)}
              schema={[
                { key: 'question', label: 'Question', required: true },
                { key: 'category', label: 'Category', type: 'select', options: ['General', 'Courses', 'Admission'] },
                { key: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
              ]}
              newItem={() => ({ id: `f-${Date.now().toString(36)}`, question: '', category: 'General', answer: '' })}
              onSave={(list) => guard(content.updateSection('faqs', list))}
              onSaved={(m) => saved(m, 'FAQs')}
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
                  logActivity('Reset all content to defaults', 'reset');
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

      <AdminSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onPick={pickFromSearch} />

      {helpOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={() => setHelpOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-200">
              <Keyboard className="h-4 w-4 text-accent-500" /> Keyboard shortcuts
            </h3>
            <dl className="space-y-2 text-sm">
              {SHORTCUTS.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">{v}</dt>
                  <dd className="shrink-0 rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[11px] text-navy-800 dark:border-slate-600 dark:text-slate-200">{k}</dd>
                </div>
              ))}
            </dl>
            <button onClick={() => setHelpOpen(false)}
              className="mt-4 w-full rounded-md bg-navy-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-600">
              Close
            </button>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}

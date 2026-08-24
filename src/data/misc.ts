import type { AdmissionStep, MethodStep, ValueItem, WhyChooseItem, CareerPathway } from '@/types';

// ─── WHY CHOOSE US ─────────────────────────────────────────────
export const whyChooseUs: WhyChooseItem[] = [
  {
    title: 'Practical Training',
    description: 'Students learn by doing — working with real tools, materials and equipment instead of theory alone.',
    icon: 'hammer',
  },
  {
    title: 'Skilled Instructors',
    description: 'Training is guided by experienced instructors who demonstrate techniques and correct mistakes early.',
    icon: 'graduation-cap',
  },
  {
    title: 'Career-Oriented Skills',
    description: 'Courses focus on abilities that are genuinely useful in workplaces, workshops and self-employment.',
    icon: 'briefcase',
  },
  {
    title: 'Workshop-Based Learning',
    description: 'Practice happens in dedicated workshop environments that simulate real working conditions.',
    icon: 'settings',
  },
  {
    title: 'Diverse Training Programs',
    description: 'From electrical work to hospitality, learners can pick a trade that matches their interests and local demand.',
    icon: 'layers',
  },
  {
    title: 'Supportive Environment',
    description: 'A welcoming atmosphere where beginners can ask questions freely and progress at a steady pace.',
    icon: 'handshake',
  },
];

// ─── OUR VALUES (About page) ───────────────────────────────────
export const values: ValueItem[] = [
  { title: 'Practical Learning', description: 'Skills are developed through doing, practicing and repeating under guidance.', icon: 'hammer' },
  { title: 'Discipline', description: 'Punctuality, preparation and respect for the craft are part of every lesson.', icon: 'shield-check' },
  { title: 'Professionalism', description: 'We train not only hands but also attitudes employers value.', icon: 'badge-check' },
  { title: 'Safety', description: 'Safe habits around tools and equipment come before speed or output.', icon: 'shield-check' },
  { title: 'Quality', description: 'Work is checked against standards so trainees learn to take pride in results.', icon: 'award' },
  { title: 'Skill Development', description: 'Every learner should leave measurably more capable than they arrived.', icon: 'trending' },
  { title: 'Opportunity', description: 'Vocational skills open doors to jobs, trades and businesses of one’s own.', icon: 'lightbulb' },
];

// ─── TRAINING METHODOLOGY (Learn → Prepare) ────────────────────
export const methodologySteps: MethodStep[] = [
  { step: '01', title: 'Learn', description: 'Understand concepts and fundamentals through clear demonstrations.', icon: 'book-open' },
  { step: '02', title: 'Practice', description: 'Work directly with tools and equipment in supervised sessions.', icon: 'wrench' },
  { step: '03', title: 'Build', description: 'Complete practical tasks and exercises from start to finish.', icon: 'hard-hat' },
  { step: '04', title: 'Improve', description: 'Receive feedback, correct mistakes and refine technique.', icon: 'trending' },
  { step: '05', title: 'Prepare', description: 'Develop confidence and workplace-ready professional habits.', icon: 'briefcase' },
];

// ─── CAREER PATHWAYS ───────────────────────────────────────────
export const careerPathways: CareerPathway[] = [
  {
    title: 'Employment',
    description: 'Skilled workers are needed by construction firms, workshops, service centers, hotels, offices and factories.',
    icon: 'briefcase',
  },
  {
    title: 'Apprenticeship',
    description: 'Training can be a stepping stone into apprenticeship-style learning with experienced masters of a trade.',
    icon: 'graduation-cap',
  },
  {
    title: 'Self-Employment',
    description: 'Many trades support independent service work — wiring, plumbing, repairs, tailoring and more.',
    icon: 'users',
  },
  {
    title: 'Entrepreneurship',
    description: 'With experience and capital, skilled graduates establish shops, service businesses or small farms.',
    icon: 'lightbulb',
  },
  {
    title: 'Contract Work',
    description: 'Trades like masonry, welding and scaffolding offer project-based contract opportunities.',
    icon: 'clipboard',
  },
  {
    title: 'Further Technical Education',
    description: 'Vocational training can be a foundation for advanced technical study later on.',
    icon: 'book-open',
  },
];

// ─── CAREER EXAMPLES ───────────────────────────────────────────
export const careerExamples = [
  {
    course: 'An electrician may work in',
    roles: ['Residential electrical installation', 'Building construction projects', 'Maintenance teams', 'Industrial environments'],
    icon: 'zap',
  },
  {
    course: 'A plumber may work in',
    roles: ['Residential plumbing services', 'Commercial buildings', 'Construction projects', 'Maintenance services'],
    icon: 'droplets',
  },
];

// ─── ADMISSION PROCESS ─────────────────────────────────────────
export const admissionSteps: AdmissionStep[] = [
  { step: 1, title: 'Choose a Program', description: 'Browse our courses and pick the trade that fits your goals.', icon: 'search' },
  { step: 2, title: 'Check Eligibility', description: 'Review the eligibility notes for your chosen program.', icon: 'clipboard' },
  { step: 3, title: 'Contact Us', description: 'Call, message, or visit the center to discuss the course.', icon: 'phone' },
  { step: 4, title: 'Submit Inquiry / Application', description: 'Send your details through the inquiry form below.', icon: 'send' },
  { step: 5, title: 'Complete Enrollment', description: 'Follow the guidance of our team to finalize your seat.', icon: 'badge-check' },
];

// ─── ADMISSION DOCUMENTS (typical — confirm with office) ───────
export const admissionDocuments = [
  'Recent passport-size photographs',
  'Copy of citizenship certificate or birth certificate',
  'Copy of previous academic certificates (if available)',
  'Any additional documents specified by the center',
];

// ─── EDUCATION LEVEL OPTIONS (inquiry form) ────────────────────
export const educationLevels = [
  'School level (below SEE)',
  'SEE completed',
  '+2 / Higher secondary',
  "Bachelor's or above",
  'Other',
];

// ─── PREFERRED TRAINING TIME OPTIONS ───────────────────────────
export const preferredTimings = ['Regular (weekday)', 'Morning', 'Evening', 'Weekend'];

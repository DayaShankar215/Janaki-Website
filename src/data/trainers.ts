import type { Trainer } from '@/types';

// ═══════════════════════════════════════════════════════════════
//  ⚠️ SAMPLE TRAINER PROFILES — clearly marked as samples.
//  Replace with real instructor names, positions, and experience.
//  Set `isSample: false` only for REAL trainer entries.
//  Add a `photo` field later if you want to display photos — the
//  card currently shows initials avatars to avoid fake portraits.
// ═══════════════════════════════════════════════════════════════

export const trainers: Trainer[] = [
  {
    id: 'tr1',
    name: 'Instructor Name',
    position: 'Senior Electrical Trainer',
    expertise: ['Building wiring', 'Motor control', 'Electrical safety'],
    bio: 'An experienced electrical professional who guides trainees through wiring boards, panel work, and safe working habits step by step.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
  {
    id: 'tr2',
    name: 'Instructor Name',
    position: 'Construction Trades Trainer',
    expertise: ['Masonry', 'Formwork', 'Site safety'],
    bio: 'Leads hands-on construction practice sessions at the training yard, focusing on accuracy, speed, and site discipline.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
  {
    id: 'tr3',
    name: 'Instructor Name',
    position: 'Welding & Fabrication Trainer',
    expertise: ['ARC welding', 'Gas cutting', 'Fabrication'],
    bio: 'Demonstrates welding techniques and supervises individual practice, with strong emphasis on protective equipment and joint quality.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
  {
    id: 'tr4',
    name: 'Instructor Name',
    position: 'Computer Skills Trainer',
    expertise: ['PC hardware', 'Office applications', 'Basic networking'],
    bio: 'Takes learners from first switch-on to confident troubleshooting through guided lab practice and simple explanations.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
  {
    id: 'tr5',
    name: 'Instructor Name',
    position: 'Plumbing Trainer',
    expertise: ['Water supply systems', 'Sanitary fitting', 'Pipe joining'],
    bio: 'Specializes in teaching clean pipe work and leak-free joints through repeated supervised practice on demo installations.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
  {
    id: 'tr6',
    name: 'Instructor Name',
    position: 'Hospitality Trainer',
    expertise: ['Food production', 'F&B service', 'Kitchen hygiene'],
    bio: 'Combines kitchen discipline with friendly instruction so trainees are ready for the pace of commercial hospitality workplaces.',
    experience: 'Sample entry — years of experience field',
    isSample: true,
  },
];

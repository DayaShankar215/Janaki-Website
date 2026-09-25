// ═══════════════════════════════════════════════════════════════
//  NEWS & ANNOUNCEMENTS — EDITABLE CONTENT
//  ⚠️ Sample entries below are marked `isSample: true` and show a
//  "Sample" badge on the website. Set it to false only for real,
//  verified notices. Delete samples you don't need.
//
//  Content management is handled from the Admin Panel:
//    /admin  →  News & Notices
//
//  Fields:
//    slug        unique link (used in /news/<slug>)
//    status      'draft' | 'published' | 'archived'
//                (public site only ever shows 'published')
//    popup       true = show once as a homepage popup (needs image)
//    date        publication date — newer items are listed first
//    image       featured image
//    images[]    additional photos shown on the article page
// ═══════════════════════════════════════════════════════════════

export const announcements = [
  {
    id: 'a1',
    slug: 'new-training-batch-enrollment-opening-soon',
    title: 'New training batch enrollment opening soon',
    date: '2026-08-10',
    tag: 'Admission',
    status: 'published',
    pinned: true,
    popup: false,
    isSample: true,
    image: '',
    images: [],
    excerpt:
      'Enrollment for the upcoming batch of technical and vocational programs will open shortly. Submit an inquiry to be notified with exact dates.',
    description:
      'Enrollment for the upcoming batch of technical and vocational programs at Janaki Technical Training Center (JTTC) will open shortly.\n\nPrograms include electrical, plumbing, construction, welding, computer skills, hospitality, agriculture and tailoring. Each program follows a practical-first approach in our workshops.\n\nSubmit an inquiry through the contact page to be notified with exact dates, fee details and admission documents.',
  },
  {
    id: 'a2',
    slug: 'practical-skills-workshop-announcement',
    title: 'Practical skills workshop announcement',
    date: '2026-07-28',
    tag: 'Event',
    status: 'published',
    pinned: false,
    popup: false,
    isSample: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=70',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=70',
    ],
    excerpt:
      'A hands-on skills demonstration session for interested students is being planned. Contact us for details about participating.',
    description:
      'A hands-on skills demonstration session for interested students is being planned at the workshop.\n\nDuring the session, instructors will demonstrate real working techniques — wiring, pipe joining, welding and more — and answer questions about each trade. This is a free, open session for anyone curious about joining a training program.\n\nContact us for details about participating and the exact schedule.',
  },
  {
    id: 'a3',
    slug: 'course-schedule-updates',
    title: 'Course schedule updates',
    date: '2026-07-15',
    tag: 'Notice',
    status: 'published',
    pinned: false,
    popup: false,
    isSample: true,
    image: '',
    images: [],
    excerpt:
      'Training schedules may adjust around public holidays. Registered trainees will be informed directly; new applicants can ask us for current timings.',
    description:
      'Training schedules may adjust around public holidays and local events.\n\nRegistered trainees will be informed directly about any changes. New applicants are welcome to contact the center for current class timings and batch availability across programs.',
  },
  {
    id: 'a4',
    slug: 'admissions-open-new-batches',
    title: 'Admissions open — new batches are enrolling now',
    date: '2026-09-05',
    tag: 'Admission',
    status: 'published',
    pinned: true,
    popup: true,
    isSample: true,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=70',
    images: [],
    excerpt:
      'New batches are enrolling across all trades. Seats are limited — enquire today to reserve your place.',
    description:
      'New batches are now enrolling across all training programs at JTTC.\n\nEvery program combines structured theory with supervised workshop practice. Morning, daytime and evening batches are available to fit different schedules.\n\nSeats are limited. Enquire today through the contact page or visit the center to reserve your place and get the admission details.',
  },
];
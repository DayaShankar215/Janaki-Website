
// ═══════════════════════════════════════════════════════════════
//  GALLERY DATA — EDITABLE CONTENT
//  Replace sample images with real photos of training sessions,
//  workshops, students and events. Add/remove items freely.
//  Categories: 'Training' | 'Workshops' | 'Students' | 'Events' | 'Facilities'
// ═══════════════════════════════════════════════════════════════

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const galleryCategories = ['All', 'Training', 'Workshops', 'Students', 'Events', 'Facilities'];

export const galleryItems = [
  {
    id: 'g1',
    title: 'Electrical wiring practice session',
    category: 'Training',
    image: U('photo-1621905251189-08b45d6a269e'),
    alt: 'Trainee practicing electrical wiring under instructor guidance',
  },
  {
    id: 'g2',
    title: 'Welding practice in the workshop bay',
    category: 'Workshops',
    image: U('photo-1504328345606-18bbc8c9d7d1'),
    alt: 'Welder practicing arc welding with protective equipment',
  },
  {
    id: 'g3',
    title: 'Construction skills practice',
    category: 'Students',
    image: U('photo-1541888946425-d81bb19240f5'),
    alt: 'Students working at the construction practice yard',
  },
  {
    id: 'g4',
    title: 'Computer laboratory session',
    category: 'Training',
    image: U('photo-1522202176988-66273c2fd55f'),
    alt: 'Students learning together in the computer lab',
  },
  {
    id: 'g5',
    title: 'Planning a practical task',
    category: 'Workshops',
    image: U('photo-1503387762-592deb58ef4e'),
    alt: 'Technical drawing review before practical work',
  },
  {
    id: 'g6',
    title: 'Instructor demonstrating equipment',
    category: 'Training',
    image: U('photo-1581091226825-a6a2a5aee158'),
    alt: 'Instructor demonstrating technical equipment to students',
  },
  {
    id: 'g7',
    title: 'Kitchen practice — food production class',
    category: 'Training',
    image: U('photo-1556910103-1c02745aae4d'),
    alt: 'Cooking training session in the kitchen practice area',
  },
  {
    id: 'g8',
    title: 'Engineering fundamentals demonstration',
    category: 'Workshops',
    image: U('photo-1581092918056-0c4c3acd3789'),
    alt: 'Demonstration of mechanical equipment during class',
  },
];



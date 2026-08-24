
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  FACILITIES DATA â€” EDITABLE CONTENT
//  âš ï¸ Only keep entries for facilities that actually exist at the
//  center. Delete or edit anything that does not apply, and
//  replace the sample images with real photos of your workshops.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const facilities: Facility[] = [
  {
    id: 'electrical-workshop',
    name: 'Electrical Workshop',
    description:
      'Wiring demonstration boards, installation practice panels, and measuring instruments for hands-on electrical training.',
    image: U('photo-1621905251189-08b45d6a269e'),
    icon: 'zap',
    features: ['Wiring practice boards', 'Measuring instruments', 'Safety equipment'],
  },
  {
    id: 'plumbing-area',
    name: 'Plumbing Practice Area',
    description:
      'Demo water supply and drainage setups where trainees cut, join and fit pipes and sanitary ware.',
    image: U('photo-1607472586893-edb57bdc0e39'),
    icon: 'droplets',
    features: ['Pipe joining stations', 'Sanitary demo units', 'Leak-test setups'],
  },
  {
    id: 'welding-bay',
    name: 'Welding Bay',
    description:
      'Dedicated welding bays with machines, ventilation, screens and full personal protective equipment.',
    image: U('photo-1504328345606-18bbc8c9d7d1'),
    icon: 'flame',
    features: ['Arc welding machines', 'Gas cutting setup', 'PPE provided'],
  },
  {
    id: 'construction-yard',
    name: 'Construction Practice Yard',
    description:
      'Open practice area for masonry, bar bending and formwork exercises at realistic scale.',
    image: U('photo-1541888946425-d81bb19240f5'),
    icon: 'construction',
    features: ['Masonry practice walls', 'Bar cutting & bending', 'Formwork assembly'],
  },
  {
    id: 'computer-lab',
    name: 'Computer Laboratory',
    description:
      'Desktop computers with practice systems for hardware assembly, OS installation and office applications.',
    image: U('photo-1522202176988-66273c2fd55f'),
    icon: 'monitor',
    features: ['Practice PCs', 'Printer/scanner', 'Internet access'],
  },
  {
    id: 'classroom',
    name: 'Classrooms',
    description:
      'Comfortable classrooms for theory sessions, demonstrations, and group discussion before practical work.',
    image: U('photo-1509062522246-3755977927d7'),
    icon: 'book-open',
    features: ['Whiteboards & displays', 'Training materials', 'Group seating'],
  },
];


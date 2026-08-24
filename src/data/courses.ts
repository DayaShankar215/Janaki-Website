import type { Course } from '@/types';

// ═══════════════════════════════════════════════════════════════
//  COURSE DATA — EDITABLE CONTENT
//
//  ⚠️  All durations, descriptions, skills and eligibility notes
//  below are SAMPLE content based on common vocational curricula.
//  Verify and adjust every field to match the center's real,
//  current programs before going live.
//
//  `active: true`  → course is currently open for enrollment.
//  `active: false` → program is listed but NOT currently running.
// ═══════════════════════════════════════════════════════════════

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const courses: Course[] = [
  // ─── ELECTRICAL ──────────────────────────────────────────────
  {
    slug: 'building-electrician',
    title: 'Building Electrician',
    categoryId: 'electrical',
    shortDescription:
      'Learn residential and building electrical wiring, installation, safety practices, and troubleshooting from the ground up.',
    overview: [
      'The Building Electrician training prepares learners to install, maintain, and repair electrical systems in residential and commercial buildings. Trainees work with real wiring boards, tools, and materials under instructor guidance.',
      'Emphasis is placed on safe working habits, correct installation techniques, circuit fundamentals, and systematic fault-finding — the core abilities employers expect from an entry-level electrician.',
    ],
    image: U('photo-1621905251189-08b45d6a269e'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'House & building wiring fundamentals',
      'Electrical circuits and load basics',
      'Switchboard, socket & light installation',
      'Electrical safety and safe isolation',
      'Reading simple wiring diagrams',
      'Use and care of electrician hand tools',
      'Testing, maintenance & fault finding',
    ],
    practicalSkills: [
      'Wiring a demonstration board from start to finish',
      'Installing switches, sockets, and light fittings',
      'Continuity and insulation testing with a multimeter',
      'Locating open-circuit and short-circuit faults',
    ],
    eligibility: [
      'Minimum age as per center policy (typically 16+)',
      'Ability to read and write (basic literacy)',
      'Interest in hands-on technical work — no prior experience required',
    ],
    tools: ['Screwdriver set', 'Wire stripper & pliers', 'Multimeter', 'Test pen', 'Insulation tape', 'Safety gloves'],
    careers: [
      'Residential wiring projects',
      'Building construction companies',
      'Electrical maintenance teams',
      'Hardware & electrical shops',
      'Self-employment as a wiring contractor',
    ],
  },
  {
    slug: 'industrial-electrician',
    title: 'Industrial Electrician',
    categoryId: 'electrical',
    shortDescription:
      'Develop skills for industrial environments: motor control panels, three-phase systems, and equipment maintenance.',
    overview: [
      'Industrial Electrician training focuses on the electrical systems used in factories and workshops. Learners practice on control panels, motors, and industrial-grade components.',
      'The training builds toward maintaining and troubleshooting production machinery safely — a skill set in steady demand across manufacturing and processing industries.',
    ],
    image: U('photo-1621905252507-b35492cc74b4'),
    durationLabel: '10–13 weeks (sample)',
    durationWeeks: 12,
    level: 'Intermediate',
    practicalFocus: true,
    active: true,
    skills: [
      'Three-phase power fundamentals',
      'Motor starters & control circuits',
      'Control panel assembly and wiring',
      'Industrial safety procedures',
      'Preventive maintenance routines',
      'Fault diagnosis on machines',
    ],
    practicalSkills: [
      'Wiring DOL and star-delta starter panels',
      'Connecting and testing three-phase motors',
      'Using measuring instruments on live (supervised) panels',
      'Tracing control circuit diagrams',
    ],
    eligibility: [
      'Basic electrical knowledge recommended (e.g., Building Electrician training)',
      'Minimum age per center policy',
      'Physically comfortable with workshop work',
    ],
    tools: ['Multimeter & clamp meter', 'Screwdrivers & spanners', 'Crimping tools', 'Panel wiring kit', 'PPE (gloves, boots)'],
    careers: [
      'Factories & manufacturing plants',
      'Maintenance departments',
      'Generator & pump installations',
      'Industrial contractors',
    ],
  },
  {
    slug: 'electric-motor-rewinding',
    title: 'Electric Motor Rewinding',
    categoryId: 'electrical',
    shortDescription:
      'Specialized training in rewinding and repairing single-phase and three-phase electric motors.',
    overview: [
      'Motor Rewinding is a classic technical trade. Trainees learn to dismantle faulty motors, record winding data, rewind stators, and reassemble and test working machines.',
      'Graduates can serve local workshops, pumps, fans, and small industries — a trade with consistent local demand for repair services.',
    ],
    image: U('photo-1537462715879-360eeb61a0ad'),
    durationLabel: '6–10 weeks (sample)',
    durationWeeks: 8,
    level: 'All Levels',
    practicalFocus: true,
    active: true,
    skills: [
      'Motor types and construction',
      'Winding data recording',
      'Coil making and insertion techniques',
      'Varnishing and baking process',
      'Bearing replacement & assembly',
      'Testing rewound motors',
    ],
    practicalSkills: [
      'Rewinding a single-phase fan or pump motor',
      'Counting and mapping old windings accurately',
      'Balancing and reassembling a motor end-bell',
      'Running no-load tests before delivery',
    ],
    eligibility: [
      'Minimum age per center policy',
      'Patience and attention to detail',
      'No formal education prerequisites',
    ],
    tools: ['Winding machine', 'Coil winder & shims', 'Insulation paper & varnish', 'Puller & bearing tools', 'Megger tester'],
    careers: [
      'Motor rewinding workshops',
      'Pump & fan repair services',
      'Agro-processing mills',
      'Own repair business',
    ],
  },
  {
    slug: 'refrigerator-ac-mechanic',
    title: 'Refrigerator & AC Mechanic',
    categoryId: 'electrical',
    shortDescription:
      'Learn refrigeration principles, gas charging, and the servicing and repair of fridges and air conditioners.',
    overview: [
      'This training covers how cooling systems work and how to service them: compressors, refrigerant handling, leak detection, and electrical controls of domestic refrigerators and split-type AC units.',
      'Hands-on sessions include disassembly, diagnosis, brazing, vacuuming, and gas charging under instructor supervision.',
    ],
    image: U('photo-1581092918056-0c4c3acd3789'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Refrigeration cycle fundamentals',
      'Compressor, condenser & evaporator roles',
      'Leak detection & brazing',
      'Vacuuming and gas charging',
      'Fridge & AC electrical controls',
      'Installation of split AC units',
      'Customer service basics',
    ],
    practicalSkills: [
      'Diagnosing a non-cooling refrigerator',
      'Charging refrigerant with gauges correctly',
      'Mounting and commissioning a split AC',
      'Cleaning coils and replacing thermostats',
    ],
    eligibility: [
      'Minimum age per center policy',
      'Basic literacy; science background helpful but optional',
      'Willingness to handle tools carefully',
    ],
    tools: ['Gauge manifold set', 'Vacuum pump', 'Brazing torch', 'Flaring tool', 'Multimeter', 'Nitrogen cylinder'],
    careers: [
      'Appliance service centers',
      'AC installation crews',
      'Cold storage facilities',
      'Independent fridge/AC service business',
    ],
  },

  // ─── PLUMBING ────────────────────────────────────────────────
  {
    slug: 'plumber',
    title: 'Plumber',
    categoryId: 'plumbing',
    shortDescription:
      'Water supply, drainage systems, pipe fitting, sanitary installation, and repair — taught with hands-on practice.',
    overview: [
      'Plumbing training teaches learners to install and maintain water supply and drainage systems for homes and buildings. Practice covers cutting, joining, and fitting pipes, installing taps and sanitary ware, and finding leaks.',
      'Good plumbers are needed in nearly every construction project and household — this course builds dependable, employable skills quickly.',
    ],
    image: U('photo-1607472586893-edb57bdc0e39'),
    durationLabel: '6–10 weeks (sample)',
    durationWeeks: 8,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Water supply system layout',
      'Drainage & sewerage basics',
      'Pipe cutting, threading & jointing',
      'Tap, valve & trap installation',
      'Sanitary fixture fitting',
      'Leak detection & repair',
      'Tool safety',
    ],
    practicalSkills: [
      'Assembling a full demo bathroom water line',
      'Joining CPVC/PVC pipes with correct methods',
      'Installing and sealing a wash basin & pan',
      'Tracing and fixing hidden leaks',
    ],
    eligibility: [
      'Minimum age per center policy',
      'Physical fitness for manual work',
      'No prior experience needed',
    ],
    tools: ['Pipe wrenches', 'Threader & cutter', 'Hacksaw', 'Teflon tape & sealants', 'Spirit level'],
    careers: [
      'Building construction projects',
      'Plumbing contractors',
      'Maintenance departments (hotels, offices)',
      'Municipal water works support',
      'Independent plumbing services',
    ],
  },

  // ─── CONSTRUCTION ────────────────────────────────────────────
  {
    slug: 'mason',
    title: 'Mason',
    categoryId: 'construction',
    shortDescription:
      'Brickwork, plastering, concrete work, leveling, and finishing — the essential building trades skill.',
    overview: [
      'Masonry training develops the core skills of a builder: laying bricks to line and level, preparing mortar and concrete mixes, plastering walls, and curing work properly.',
      'Trainees practice on live-scale structures at the practice yard so that speed and accuracy grow together.',
    ],
    image: U('photo-1541888946425-d81bb19240f5'),
    durationLabel: '6–8 weeks (sample)',
    durationWeeks: 7,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Tools, materials & mortar preparation',
      'Bricklaying to line, level & plumb',
      'Wall plastering techniques',
      'Concrete mixing & placing',
      'Curing practices',
      'Site safety basics',
    ],
    practicalSkills: [
      'Building a straight brick wall segment',
      'Applying even plaster coats',
      'Checking work with level & plumb bob',
      'Preparing correct mortar ratios',
    ],
    eligibility: ['Minimum age per center policy', 'Able to perform physical site work', 'No formal schooling required'],
    tools: ['Trowel & spirit level', 'Plumb bob & line', 'Measuring tape', 'Mixing pans', 'Safety gear'],
    careers: ['Construction sites', 'Road & bridge projects', 'Home renovation services', 'Contractor teams'],
  },
  {
    slug: 'scaffolding',
    title: 'Scaffolding',
    categoryId: 'construction',
    shortDescription:
      'Safe erection, inspection, and dismantling of scaffolds used in construction and maintenance work.',
    overview: [
      'Scaffolding training teaches the correct assembly of working platforms: selecting components, base preparation, tying standards and ledgers, fitting guard rails, and inspecting completed scaffolds.',
      'Because scaffold mistakes cause serious accidents, safety rules are drilled into every session.',
    ],
    image: U('photo-1503387762-592deb58ef4e'),
    durationLabel: '4–6 weeks (sample)',
    durationWeeks: 5,
    level: 'Beginner',
    practicalFocus: true,
    active: false,
    skills: [
      'Scaffold components & types',
      'Safe erection sequence',
      'Load basics & platform rules',
      'Guard rails and toe boards',
      'Scaffold inspection checklists',
      'Dismantling safely',
    ],
    practicalSkills: [
      'Erecting a mobile tower scaffold',
      'Fitting bracing correctly',
      'Tagging and inspecting platforms',
      'Working-at-height safety habits',
    ],
    eligibility: [
      'Minimum age per center policy',
      'Comfortable working at height',
      'Physically fit',
    ],
    tools: ['Frame & tube scaffolds', 'Spanners & couplers', 'Level', 'Harness & lanyards', 'Tags'],
    careers: ['High-rise construction', 'Painting & maintenance crews', 'Industrial shutdown jobs', 'Rental scaffold firms'],
  },
  {
    slug: 'shuttering-carpenter',
    title: 'Shuttering Carpenter',
    categoryId: 'construction',
    shortDescription:
      'Formwork carpentry for columns, beams and slabs — measurement, cutting, assembly and striking times.',
    overview: [
      'Shuttering (formwork) carpenters shape the molds that hold fresh concrete. This course covers reading simple drawings, measuring and cutting timber/plywood, assembling column and beam forms, and removing them at the right time.',
      'It suits learners who want a construction trade with strong demand on reinforced-concrete projects.',
    ],
    image: U('photo-1503387762-592deb58ef4e'),
    durationLabel: '6–8 weeks (sample)',
    durationWeeks: 7,
    level: 'Beginner',
    practicalFocus: true,
    active: false,
    skills: [
      'Measurement & marking',
      'Hand & power saw use',
      'Column, beam & slab formwork',
      'Props, braces & ties',
      'De-shuttering timing basics',
      'Material care & reuse',
    ],
    practicalSkills: [
      'Fabricating a column box form',
      'Setting beam bottom with camber awareness',
      'Plumbing and bracing forms',
      'Stripping forms without damage',
    ],
    eligibility: ['Minimum age per center policy', 'Able to lift construction materials', 'No experience required'],
    tools: ['Saw & hammer', 'Measuring tape & square', 'Nails & wire', 'Props & clamps', 'PPE'],
    careers: ['RC building projects', 'Bridge construction', 'Shuttering contractor gangs', 'Abroad employment pathways'],
  },
  {
    slug: 'bar-bender',
    title: 'Bar Bender & Steel Fixer',
    categoryId: 'construction',
    shortDescription:
      'Cutting, bending, and fixing reinforcement steel bars accurately according to structural drawings.',
    overview: [
      'Reinforcement work gives concrete its strength. Trainees learn bar schedules, cutting lengths, hook and stirrup bending, spacing, tying wire technique, and cover blocks.',
      'Accuracy is emphasized — correct steel placement is critical to every RCC structure.',
    ],
    image: U('photo-1541888946425-d81bb19240f5'),
    durationLabel: '4–6 weeks (sample)',
    durationWeeks: 5,
    level: 'Beginner',
    practicalFocus: true,
    active: false,
    skills: [
      'Types of reinforcement bars',
      'Reading bar schedules',
      'Cutting & bending to size',
      'Stirrup & hook shapes',
      'Tying & spacing rules',
      'Cover and lap basics',
    ],
    practicalSkills: [
      'Bending stirrups to exact dimensions',
      'Fixing a slab mesh to schedule',
      'Maintaining correct cover all around',
      'Safe bar-cutting practice',
    ],
    eligibility: ['Minimum age per center policy', 'Physical stamina', 'No formal education required'],
    tools: ['Bar cutter & bender', 'Hooks & pliers', 'Measuring tape', 'Gloves & boots', 'Cover blocks'],
    careers: ['RCC building sites', 'Bridge & culvert works', 'Steel fixing gangs', 'Infrastructure contractors'],
  },

  // ─── MECHANICAL ──────────────────────────────────────────────
  {
    slug: 'welder',
    title: 'Welder (Arc & Gas)',
    categoryId: 'mechanical',
    shortDescription:
      'Arc welding, gas welding and cutting, joint types, electrode selection, and weld quality checks.',
    overview: [
      'Welding joins metal permanently — it is the backbone of fabrication and construction. Training starts with safety gear and machine setup, then progresses through bead running, butt and fillet joints in flat, horizontal, and vertical positions.',
      'Gas welding/cutting and basic weld inspection round out the skill set.',
    ],
    image: U('photo-1504328345606-18bbc8c9d7d1'),
    durationLabel: '6–10 weeks (sample)',
    durationWeeks: 8,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Welding safety essentials',
      'ARC/machine setup & polarity',
      'Striking & running beads',
      'Butt, lap & fillet joints',
      'Gas welding & flame cutting',
      'Common weld defects & fixes',
    ],
    practicalSkills: [
      'Laying uniform weld beads on plate',
      'Producing sound fillet welds in position',
      'Cutting steel cleanly with a gas torch',
      'Inspecting own welds visually',
    ],
    eligibility: [
      'Minimum age per center policy (typically 18+ for hot work)',
      'Good eyesight (with correction allowed)',
      'Not color-blind for gas work safety',
    ],
    tools: ['Welding machine & holders', 'Chipping hammer & brush', 'Goggles & face shield', 'Apron & gloves', 'Gas torch set'],
    careers: ['Fabrication workshops', 'Structural steel construction', 'Vehicle body shops', 'Pipeline & tank works', 'Overseas welding jobs'],
  },
  {
    slug: 'mobile-phone-repair',
    title: 'Mobile Phone Repair Technician',
    categoryId: 'computer',
    shortDescription:
      'Diagnose and repair smartphones: displays, batteries, charging ports, software flashing, and micro-soldering basics.',
    overview: [
      'Smartphone repair is one of the fastest-growing local service trades. Learners practice opening devices safely, replacing screens and batteries, repairing charging issues, and using software tools for flashing and unlocking workflows.',
      'The course balances hardware repairs with customer-facing service skills.',
    ],
    image: U('photo-1580910051074-3eb694886505'),
    durationLabel: '6–8 weeks (sample)',
    durationWeeks: 7,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Phone hardware architecture',
      'Safe opening & reassembly',
      'Display & battery replacement',
      'Charging port repair',
      'Software flashing & updates',
      'Troubleshooting workflow',
      'Customer handling & pricing',
    ],
    practicalSkills: [
      'Replacing a cracked display assembly',
      'Micro-soldering practice on scrap boards',
      'Diagnosing a dead phone systematically',
      'Flashing stock firmware safely',
    ],
    eligibility: ['Basic literacy', 'Steady hands & patience', 'Interest in electronics'],
    tools: ['Precision screwdriver kit', 'Hot air station & iron', 'Multimeter', 'Spudgers & suction', 'Flash cables'],
    careers: ['Mobile repair shops', 'Service centers', 'Accessories retail + repair', 'Own repair counter'],
  },
  {
    slug: 'computer-hardware-technician',
    title: 'Computer Hardware Technician',
    categoryId: 'computer',
    shortDescription:
      'Assemble, upgrade, troubleshoot and maintain desktop computers and common office IT equipment.',
    overview: [
      'Trainees learn PC internals hands-on: identifying components, assembling complete systems, installing operating systems, diagnosing faults, and performing upgrades and basic networking.',
      'Printer servicing and preventive maintenance make graduates useful to offices, schools, and service shops.',
    ],
    image: U('photo-1461749280684-dccba630e2f6'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'PC components identification',
      'Complete PC assembly',
      'BIOS/UEFI configuration',
      'OS installation & drivers',
      'Storage, RAM & PSU diagnostics',
      'Basic LAN setup',
      'Printer servicing basics',
    ],
    practicalSkills: [
      'Building a working PC from parts',
      'Installing Windows and drivers',
      'Diagnosing no-display problems step-by-step',
      'RAM/hard disk testing and replacement',
    ],
    eligibility: ['Basic literacy; computer interest', 'Minimum age per center policy', 'No prior IT study required'],
    tools: ['Screwdriver kits', 'POST cards', 'Thermal paste', 'Anti-static wrist strap', 'Diagnostic USB sticks'],
    careers: ['Computer sales & service shops', 'School/office IT support', 'Cyber café management', 'Freelance PC technician'],
  },
  {
    slug: 'computer-operator',
    title: 'Computer Operator',
    categoryId: 'computer',
    shortDescription:
      'Office computing skills: typing, documents, spreadsheets, presentations, email, and internet use.',
    overview: [
      'The Computer Operator course builds everyday digital competence required in offices, banks, cooperatives, and organizations. Learners practice structured typing, professional documents, spreadsheet formulas, and clean presentations.',
      'Digital records, email etiquette, printing, and file management complete the curriculum.',
    ],
    image: U('photo-1522202176988-66273c2fd55f'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Touch typing (English/Nepali)',
      'Word processing documents',
      'Spreadsheets & formulas',
      'Presentations',
      'Email & internet usage',
      'File/data management',
      'Printing & scanning',
    ],
    practicalSkills: [
      'Typing speed improvement drills',
      'Preparing formatted official letters',
      'Building budget sheets with formulas',
      'Managing organized folder structures',
    ],
    eligibility: ['Basic reading/writing ability', 'Minimum age per center policy', 'No computer background needed'],
    tools: ['Desktop PCs', 'Printer/scanner', 'Practice files & templates', 'Internet access'],
    careers: ['Offices & corporations', 'Banks & cooperatives', 'NGOs/INGOs admin support', 'Data entry roles'],
  },
  {
    slug: 'telecom-technician',
    title: 'Telecom Technician',
    categoryId: 'computer',
    shortDescription:
      'Fundamentals of telecom lines and networks: cabling, splicing, CPE installation, and fault rectification.',
    overview: [
      'Telecom Technician training introduces the infrastructure behind telephone, internet, and TV services. Topics include fiber/copper cabling, connectorization, customer-premises equipment installation, and signal troubleshooting.',
      'Note: This program is listed for information. Confirm availability with the center.',
    ],
    image: U('photo-1621905252507-b35492cc74b4'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Intermediate',
    practicalFocus: true,
    active: false,
    skills: [
      'Telecom network overview',
      'UTP & fiber cable handling',
      'Crimping & termination',
      'ONT/router installation',
      'Signal testing basics',
      'Tower/site safety awareness',
    ],
    practicalSkills: [
      'Making patch cords with RJ45/RJ11',
      'Fusion splicing demonstrations',
      'Configuring a home router',
      'Tracing line faults methodically',
    ],
    eligibility: ['Basic electrical/electronic aptitude', 'Minimum age per center policy', 'Comfortable with heights awareness'],
    tools: ['Crimping tools', 'Splicing kit (demo)', 'OTDR (demo)', 'Cable testers', 'PPE'],
    careers: ['ISP field teams', 'Telecom contractors', 'Network cabling services', 'FTTH rollout projects'],
  },

  // ─── HOSPITALITY ─────────────────────────────────────────────
  {
    slug: 'general-cook',
    title: 'General Cook',
    categoryId: 'hospitality',
    shortDescription:
      'Kitchen fundamentals: hygiene, knife skills, cooking methods, menu items, and professional kitchen discipline.',
    overview: [
      'General Cook training prepares learners for commercial kitchens — hotels, restaurants, cafés, and catering. Starting from kitchen hygiene and safety, trainees progress through knife skills, stocks and sauces, and popular menu preparations.',
      'Team coordination and timing under service pressure are practiced throughout.',
    ],
    image: U('photo-1556910103-1c02745aae4d'),
    durationLabel: '8–12 weeks (sample)',
    durationWeeks: 10,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Kitchen hygiene & food safety',
      'Knife cuts & preparation',
      'Cooking methods (boil/fry/sauté/bake)',
      'Stocks, sauces & gravies',
      'Local & popular continental dishes',
      'Kitchen equipment use & care',
      'Portion control & costing basics',
    ],
    practicalSkills: [
      'Producing standard dishes to recipe',
      'Consistent knife cut practice',
      'Plate presentation fundamentals',
      'Clean-as-you-go workstation discipline',
    ],
    eligibility: ['Minimum age per center policy', 'Medical fitness for food handling', 'Passion for cooking'],
    tools: ['Chef knife & paring knife', 'Cutting boards', 'Pots, pans & ladles', 'Uniform & apron'],
    careers: ['Hotels & restaurants', 'Catering services', 'Bakeries & cafés', 'Mess/canteen kitchens', 'Own food outlet'],
  },
  {
    slug: 'waiter-waitress',
    title: 'Waiter / Waitress (Food & Beverage Service)',
    categoryId: 'hospitality',
    shortDescription:
      'Restaurant service skills: table setting, order taking, serving etiquette, and guest handling.',
    overview: [
      'This course trains front-of-house hospitality staff in professional service: grooming and courtesy, table layouts, carrying trays correctly, taking orders accurately, and handling guest requests gracefully.',
      'Practical mock-services simulate real restaurant shifts.',
    ],
    image: U('photo-1577219491135-ce391730fb2c'),
    durationLabel: '6–8 weeks (sample)',
    durationWeeks: 7,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Personal grooming & hygiene',
      'Table setting & layouts',
      'Order-taking procedure',
      'Carrying & serving techniques',
      'Menu knowledge & suggestions',
      'Guest complaint handling',
      'Billing & cashiering basics',
    ],
    practicalSkills: [
      'Full table setup within time limits',
      'Serving plates with correct hand positions',
      'Role-played guest interactions',
      'Coordinated mock banquet service',
    ],
    eligibility: ['Minimum age per center policy', 'Well-groomed appearance commitment', 'Friendly communication attitude'],
    tools: ['Trays & service trolleys', 'Cutlery sets', 'Order pads/POS demo', 'Uniform'],
    careers: ['Restaurants & hotels', 'Banquets & events', 'Cafés & resorts', 'Airline/industrial catering'],
  },

  // ─── BEAUTY ──────────────────────────────────────────────────
  {
    slug: 'assistant-beautician',
    title: 'Assistant Beautician',
    categoryId: 'beauty',
    shortDescription:
      'Entry-level beauty care: facials, threading, waxing, manicure-pedicure, hair washing and basic styling.',
    overview: [
      'Assistant Beautician training provides foundation-level beauty salon skills with strong hygiene practice. Learners practice skin care treatments, hair removal techniques, nail care, and fundamental hair services on models.',
      'Client comfort, sanitation, and product knowledge are treated as seriously as technique.',
    ],
    image: U('photo-1560066984-138dadb4c035'),
    durationLabel: '6–10 weeks (sample)',
    durationWeeks: 8,
    level: 'Beginner',
    practicalFocus: true,
    active: false,
    skills: [
      'Salon hygiene & sterilization',
      'Skin analysis basics',
      'Facial steps',
      'Threading & waxing',
      'Manicure & pedicure',
      'Hair wash, conditioning & blow-dry',
      'Client consultation manners',
    ],
    practicalSkills: [
      'Performing a full facial routine',
      'Neat eyebrow threading',
      'Professional manicure steps',
      'Blow-dry styling basics',
    ],
    eligibility: ['Minimum age per center policy', 'Interest in personal care services', 'Willingness to practice on models'],
    tools: ['Facial kits', 'Sterilizer', 'Manicure sets', 'Dryers & brushes', 'Towels & disposables'],
    careers: ['Beauty salons', 'Bridal makeup assistance', 'Hotel spa support', 'Home service beautician'],
  },

  // ─── AGRICULTURE ─────────────────────────────────────────────
  {
    slug: 'poultry-farm-worker',
    title: 'Poultry Farm Worker',
    categoryId: 'agriculture',
    shortDescription:
      'Modern poultry keeping: housing, brooding, feeding, vaccination support, and farm hygiene.',
    overview: [
      'Poultry training covers day-to-day operations of broiler and layer farms: shed preparation, brooding chicks, feed and water management, litter care, bio-security, and recognizing common health warning signs.',
      'Record keeping and cost awareness prepare learners to run their own small farms too.',
    ],
    image: U('photo-1516467508483-a7212febe31a'),
    durationLabel: '4–6 weeks (sample)',
    durationWeeks: 5,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Poultry breeds & purposes',
      'Shed design & brooding',
      'Feed & water management',
      'Vaccination schedules (support role)',
      'Bio-security & sanitation',
      'Health monitoring basics',
      'Farm records & costing',
    ],
    practicalSkills: [
      'Preparing a brooding area correctly',
      'Weighing and mixing feed rations',
      'Spotting sick birds early',
      'Disinfection routines',
    ],
    eligibility: ['Minimum age per center policy', 'Interest in livestock farming', 'No formal education required'],
    tools: ['Feeders & drinkers', 'Brooder/heat source', 'Sprayers', 'Record registers', 'Protective wear'],
    careers: ['Commercial poultry farms', 'Hatcheries', 'Feed suppliers support', 'Starting own poultry unit'],
  },
  {
    slug: 'off-season-vegetable-production',
    title: 'Off-Season Vegetable Production',
    categoryId: 'agriculture',
    shortDescription:
      'Grow vegetables out of season using tunnels and improved techniques for better market prices.',
    overview: [
      'Off-season vegetable production teaches protected cultivation: plastic tunnel setup, nursery raising, transplanting, fertigation basics, pest management, and harvest/post-harvest handling.',
      'The goal is income-oriented farming — producing high-value vegetables when market prices are best.',
    ],
    image: U('photo-1416879595882-3373a0480b5b'),
    durationLabel: '4–6 weeks (sample)',
    durationWeeks: 5,
    level: 'Beginner',
    practicalFocus: true,
    active: true,
    skills: [
      'Crop season planning',
      'Tunnel construction basics',
      'Nursery & seedling care',
      'Soil prep & fertilization basics',
      'IPM pest control introduction',
      'Harvest & post-harvest care',
      'Market linkage ideas',
    ],
    practicalSkills: [
      'Raising healthy seedlings',
      'Transplanting with proper spacing',
      'Installing drip lines in tunnels',
      'Identifying common pests/diseases',
    ],
    eligibility: ['Interest in commercial farming', 'Minimum age per center policy', 'Access to small land preferred (not required)'],
    tools: ['Hand tools', 'Plastic tunnels', 'Drip irrigation kit', 'Knapsack sprayer', 'Seed trays'],
    careers: ['Commercial vegetable farming', 'Cooperative farming groups', 'Agro-input dealers support', 'Collection centers'],
  },

  // ─── TAILORING ───────────────────────────────────────────────
  {
    slug: 'tailor-master',
    title: 'Tailor Master',
    categoryId: 'tailoring',
    shortDescription:
      'Garment-making mastery: measurements, cutting, stitching, fitting, and finishing for custom clothing.',
    overview: [
      'Tailoring remains one of the most reliable self-employment trades. Trainees learn body measurement, pattern drafting, fabric cutting, machine operation, assembly, fitting corrections, and pressing/finishing.',
      'Practice progresses from simple items to full garments including traditional and modern styles.',
    ],
    image: U('photo-1558769132-cb1aea458c5e'),
    durationLabel: '10–13 weeks (sample)',
    durationWeeks: 12,
    level: 'All Levels',
    practicalFocus: true,
    active: true,
    skills: [
      'Body measurement technique',
      'Pattern drafting basics',
      'Fabric cutting economy',
      'Machine sewing control',
      'Assembly & fitting',
      'Finishing & pressing',
      'Alterations & repairs',
    ],
    practicalSkills: [
      'Stitching sample seams & hems',
      'Completing a shirt/kurta set',
      'Fitting adjustments on real clients (demo)',
      'Operating overlock machines',
    ],
    eligibility: ['Minimum age per center policy', 'Fine motor precision', 'Patience for detail work'],
    tools: ['Sewing machines', 'Measuring tape & rulers', 'Scissors & shears', 'Pins, chalk & threads', 'Iron & board'],
    careers: ['Tailoring shops', 'Garment workshops', 'Boutique services', 'School/uniform contracts', 'Own tailoring business'],
  },
];

export function getCourseBySlug(slug: string | undefined): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getActiveCourses(): Course[] {
  return courses.filter((c) => c.active);
}

export function getRelatedCourses(course: Course, max = 3): Course[] {
  const sameCategory = courses.filter((c) => c.categoryId === course.categoryId && c.slug !== course.slug);
  const others = courses.filter((c) => c.categoryId !== course.categoryId && c.slug !== course.slug && c.active);
  return [...sameCategory, ...others].slice(0, max);
}

export function courseCountForCategory(categoryId: string): number {
  return courses.filter((c) => c.categoryId === categoryId).length;
}

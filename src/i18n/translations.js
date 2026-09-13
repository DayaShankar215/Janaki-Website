// ═══════════════════════════════════════════════════════════════
//  BILINGUAL UI STRINGS — English + Nepali
//  `t('path.to.key')` resolves in the active language and falls
//  back to English. Add new UI strings here as the site evolves.
// ═══════════════════════════════════════════════════════════════

export const translations = {
  en: {
    /* ── Common ─────────────────────────────────────────────── */
    common: {
      home: 'Home',
      back: 'Back',
      learnMore: 'Learn more',
      viewAll: 'View all',
      contactUs: 'Contact us',
      applyNow: 'Apply Now',
      enquire: 'Enquire',
      enquireNow: 'Enquire Now',
      readMore: 'Read more',
      comingSoon: 'Coming soon',
      sample: 'Sample',
      sampleProfile: 'Sample profile',
      notEnrolling: 'Not currently enrolling',
      enrolling: 'Currently enrolling',
      handsOn: 'Hands-on practical',
      download: 'Download',
      save: 'Save',
      saved: 'Saved',
      cancel: 'Cancel',
      delete: 'Delete',
      search: 'Search',
      loading: 'Loading…',
      directions: 'Get Directions',
    },

    /* ── Navigation ─────────────────────────────────────────── */
    nav: {
      home: 'Home',
      about: 'About',
      courses: 'Courses',
      practicalTraining: 'Practical Training',
      facilities: 'Facilities',
      gallery: 'Gallery',
      institute: 'Institute',
      trainers: 'Trainers',
      faq: 'FAQ',
      admission: 'Admission',
      applyNow: 'Apply Now',
      applyMobile: 'Apply Now — Enroll in a Course',
      searchCourses: 'Search courses (Ctrl+K)',
      searchAria: 'Search courses',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      switchLight: 'Switch to light mode',
      switchDark: 'Switch to dark mode',
      skipToContent: 'Skip to main content',
      tagline: 'Training Center',
      searchShortcut: 'Ctrl+K',
    },

    /* ── Hero ───────────────────────────────────────────────── */
    hero: {
      badge: 'Technical & Vocational Training Institute',
      title1: 'Building Skills.',
      title2: 'Creating',
      title3: 'Opportunities.',
      explore: 'Explore Courses',
      trust: ['Hands-on workshop training', 'Instructor-guided learning', 'Short, focused programs'],
      statPrograms: 'Training programs',
      statCategories: 'Skill categories',
      statPractical: 'Practical-first learning',
      scrollMore: 'Scroll to learn more',
    },

    /* ── Quick info bar ─────────────────────────────────────── */
    quickInfo: [
      { title: 'Structured Programs', text: 'Defined hours and learning stages for every trade.' },
      { title: 'Comprehensive Training', text: 'Guided practice with real tools and materials.' },
      { title: 'Flexible Schedules', text: 'Regular, morning and evening batch options.' },
      { title: 'Beginner Friendly', text: 'No prior experience needed to start.' },
      { title: 'Practical Skills', text: 'Hands-on skills ready for real workplaces.' },
      { title: 'Expert Instructors', text: 'Learn under experienced, working professionals.' },
    ],

    /* ── Home sections ──────────────────────────────────────── */
    home: {
      aboutBody:
        'is a technical and vocational training institution focused on hands-on skill development. We prepare learners for real work — in workshops, on sites, and in service businesses.',
      aboutEyebrow: 'About Our Center',
      aboutImgAlt1: 'Instructor guiding trainees through technical practice',
      aboutImgAlt2: 'Welding practice at the workshop',
      aboutMission: 'Our Mission',
      aboutMissionDesc:
        'Equip learners with practical skills, technical competence, and the confidence to build careers.',
      aboutMissionPoints: [
        'Deliver practical, hands-on technical training',
        'Build employable, industry-relevant skills',
        'Develop technical competence and confidence',
        'Support career development for every learner',
        'Make quality vocational education accessible',
      ],
      aboutMore: 'More About Us',
      aboutTitle: 'A Center Dedicated to Practical Skill Development',
      aboutValuesLabel: 'Our values:',
      aboutVision: 'Our Vision',
      aboutVisionDesc: 'To produce skilled, capable human resources who strengthen communities and industries.',
      announcementsDesc: 'Admission notices, events and announcements from the training center.',
      announcementsEyebrow: 'Stay Informed',
      announcementsPinned: 'Pinned',
      announcementsTitle: 'News & Updates',
      featuredEyebrow: 'Training Programs',
      featuredTitle: 'Popular Vocational Courses',
      featuredDesc:
        'Practical, career-focused training programs taught in workshop environments by experienced instructors.',
      featuredViewAll: 'View All Courses',
      whyEyebrow: 'Why Janaki TTC',
      whyTitle: 'Why Students Choose Us',
      whyDesc:
        'A practical-first approach to learning that prepares trainees for real work, real jobs and real opportunities.',
      practicalEyebrow: 'Our Facilities',
      practicalTitle: 'Real Training, Real Facilities',
      practicalDesc:
        'Our dedicated training areas give you hands-on experience with the tools and materials used in real workplaces.',
      practicalButton: 'Explore Our Facilities',
      practicalImgAlt1: 'Welding training with protective equipment',
      practicalImgAlt2: 'Construction practice at the training yard',
      methodologyEyebrow: 'Training Methodology',
      methodologyTitle: 'How We Train',
      methodologyDesc:
        'Every course follows a proven learning path — understand, practice, build and refine until you are job-ready.',
      careersEyebrow: 'Career Pathways',
      careersTitle: 'What You Can Do With These Skills',
      careersDesc:
        'Vocational training opens doors across many workplaces — employment, self-employment and beyond.',
      careersNote:
        'These are common possibilities shared for guidance only — the center does not guarantee employment or income outcomes.',
      testimonialsEyebrow: 'Trainee Voices',
      testimonialsTitle: 'What Trainees Say',
      testimonialsDesc: 'Real experiences from the people who have learned with us.',
      recentEyebrow: 'Continue exploring',
      recentTitle: 'Recently viewed courses',
      recentDismiss: 'Dismiss recently viewed',
    },

    /* ── CTA / Newsletter ───────────────────────────────────── */
    cta: {
      title: 'Ready to Build Your Future?',
      desc: 'Choose a trade, learn it practically, and step confidently toward work you can be proud of.',
      applyNow: 'Apply Now',
      contact: 'Contact Us',
      callUs: 'Call us:',
      alertTitle: 'New batch alerts',
      alertPlaceholder: 'Your email for new-batch alerts',
      alertButton: 'Notify me',
      alertSuccess: "You're on the list! We'll email you when a new batch opens.",
      alertError: 'Please enter a valid email address.',
      alertSaveError: 'Could not save your email right now. Please try again.',
      alertPrivacy: 'We only use your email to notify you about admissions & batch openings.',
    },

    /* ── Footer ─────────────────────────────────────────────── */
    footer: {
      aboutHeading: 'About the Center',
      aboutText:
        'Practical technical and vocational training designed to equip learners with industry-relevant skills and real-world experience.',
      quickLinks: 'Quick Links',
      trainingAreas: 'Training Areas',
      contactInfo: 'Contact Info',
      rights: 'All rights reserved.',
      tagline: 'Practical skills for real opportunities.',
      admin: 'Admin',
      followUs: 'Follow us',
      trainingAreaLabels: {
        electrical: 'Electrical',
        plumbing: 'Plumbing',
        construction: 'Construction',
        computer: 'Computer & Technology',
        mechanical: 'Mechanical / Welding',
        hospitality: 'Hospitality',
        agriculture: 'Agriculture',
        tailoring: 'Tailoring & Garment',
      },
    },

    /* ── Search modal ───────────────────────────────────────── */
    search: {
      placeholder: 'Search courses… (training, welding, wiring…)',
      noResults: 'No courses match',
      resultsFor: 'Results for',
      navigate: 'navigate',
      open: 'open',
      close: 'close',
      ariaClose: 'Close search',
    },

    /* ── Courses page ───────────────────────────────────────── */
    courses: {
      heroTitle: 'Courses & Training Programs',
      heroDesc:
        'Hands-on vocational training across the trades that build our homes, businesses and communities.',
      searchPlaceholder: 'Search courses or skills…',
      sort: 'Sort courses',
      sortFeatured: 'Sort: Featured',
      sortName: 'Name (A–Z)',
      sortDurationAsc: 'Duration: Short → Long',
      sortDurationDesc: 'Duration: Long → Short',
      all: 'All',
      showing: 'Showing',
      of: 'of',
      programs: 'programs',
      myList: 'My List',
      emptyTitle: 'No courses found',
      emptyDesc: 'Try a different search term or category — or reset the filters to see every program.',
      resetFilters: 'Reset Filters',
      note: 'Note: Program availability changes between batches. Durations shown are typical samples — contact the center for current schedules and confirmed details.',
      viewDetails: 'View Details',
      durationLabel: 'Duration',
      levelLabel: 'Level',
      filterAria: 'Filter courses',
    },

    /* ── Course details ─────────────────────────────────────── */
    courseDetails: {
      youMayAlsoLike: 'You May Also Like',
      enquire: 'Enquire about this course',
      print: 'Print / save as PDF',
      printAria: 'Print this page',
      share: 'Share',
      copyLink: 'Copy link',
      copied: 'Copied!',
      notFoundTitle: 'Course Not Found',
      overview: 'Course Overview',
      skillsCovered: 'Skills Covered',
      practicalSkills: 'Practical Skills',
      eligibility: 'Eligibility',
      tools: 'Tools & Equipment',
      careers: 'Career Opportunities',
      schedule: 'Training Schedule',
      related: 'Related Courses',
      backToCourses: 'Back to Courses',
      inThisSection: 'In this course',
      recentlyViewed: 'Recently viewed',
      category: 'Category',
      format: 'Format',
      formatValue: 'Workshop-based practical training',
      status: 'Status',
      openForEnrollment: 'Open for enrollment',
      notRunning: 'Not currently running',
      inactiveNotice:
        'This program is listed for information only and is not currently open for enrollment. Contact us to ask about upcoming batches.',
      careersNote:
        'Career examples are informational — they describe common pathways in this trade, not guaranteed placements.',
      summary: 'Course Summary',
      admissionProcess: 'See Admission Process',
      viewAll: 'View all courses',
    },

    /* ── About page ─────────────────────────────────────────── */
    about: {
      heroTitle: 'About Janaki TTC',
      heroDesc:
        'A technical and vocational training center committed to practical, employment-ready skills for every learner.',
      storyTitle: 'Our Story',
      missionTitle: 'Our Approach',
      valuesEyebrow: 'Our Values',
      valuesTitle: 'What We Stand For',
      valuesDesc: 'The principles behind everything we teach and the way we teach it.',
      whyEyebrow: 'Why Janaki TTC',
      whyTitle: 'What Makes Us Different',
      whyDesc: 'Practical-first, instructor-guided, career-focused training.',
      ctevNote: 'Accreditation and affiliation details appear here when confirmed.',
      heroImageAlt: 'Technical instructor demonstrating equipment',
      badgeSkills: 'Skills +',
      badgeOpportunity: 'Opportunity',
      storyEyebrow: 'Who We Are',
      storyIntro: 'is a technical and vocational training institution dedicated to hands-on skill development.',
      storyTrades:
        'We offer training across trades such as electrical work, plumbing, construction, welding, computer skills, hospitality, agriculture and tailoring.',
      storyP2:
        'Every program is designed around workshop practice — trainees handle the tools, materials and equipment of their trade under the guidance of experienced instructors. The goal is simple: graduates who can do the work, not just describe it.',
      recognitionTitle: 'Recognition & Affiliation',
      directionEyebrow: 'Direction',
      missionVisionTitle: 'Our Mission & Vision',
      ourMission: 'Our Mission',
      ourVision: 'Our Vision',
      missionItem1: 'Deliver practical, employment-oriented technical training',
      missionItem2: 'Develop technical competence and workplace discipline',
      missionItem3: 'Support career development and self-employment pathways',
      missionItem4: 'Make quality vocational education accessible to all learners',
      visionP1:
        'To be a trusted center of vocational excellence — producing skilled, capable human resources who strengthen their families, communities and the industries they serve.',
      visionP2:
        'We envision every graduate leaving with more than a certificate: a trade they can practice with pride and confidence.',
    },

    /* ── Facilities ─────────────────────────────────────────── */
    facilities: {
      heroTitle: 'Our Facilities',
      heroDesc: 'Dedicated workshops and practice areas that simulate real working conditions.',
      features: 'Features',
      explore: 'Explore',
      learningEyebrow: 'Learning Spaces',
      learningTitle: 'Where Practical Training Happens',
      learningDesc:
        'Each facility supports hands-on learning for specific trades under instructor supervision.',
      sampleBefore: 'Facility details shown here are editable sample content. The center should update',
      sampleAfter: 'to reflect the actual workshops and equipment available.',
      trainingApproach: 'See Our Training Approach',
    },

    /* ── Practical training page ────────────────────────────── */
    practicalTraining: {
      heroDesc:
        'At our center, learning means doing. Here is how workshop-based training builds real, workplace-ready skills.',
      imageAlt: 'Trainee practicing with technical equipment under supervision',
      approachEyebrow: 'Our Approach',
      approachTitle: 'Skills Are Built in the Workshop, Not Just the Classroom',
      approachDesc:
        'Reading about wiring is not the same as wiring a board. Watching a weld is not the same as striking an arc. That is why every one of our programs is built around supervised practice with the actual tools and materials of the trade.',
      principle1: 'Every concept is demonstrated before it is practiced',
      principle2: 'Trainees repeat tasks until movements become confident habits',
      principle3: 'Instructors correct technique early, before errors become routine',
      principle4: 'Safety rules are practiced as seriously as the skills themselves',
      areasEyebrow: 'Practice Areas',
      areasTitle: 'Dedicated Spaces for Every Trade',
      areasDesc: 'Each area is set up for safe, repeated practice of core trade skills.',
      areaElectrical: 'Electrical Practice',
      areaElectricalDesc:
        'Wiring boards, installation panels and measuring instruments for safe, repeated hands-on practice.',
      areaPlumbing: 'Plumbing Practice',
      areaPlumbingDesc:
        'Water supply and drainage demo lines where trainees cut, join and test real pipework.',
      areaWelding: 'Welding Bays',
      areaWeldingDesc:
        'Individual bays with machines, ventilation and full protective equipment for arc and gas work.',
      areaConstruction: 'Construction Yard',
      areaConstructionDesc:
        'Masonry walls, bar-bending stations and formwork assembly at working scale.',
      areaComputer: 'Computer Laboratory',
      areaComputerDesc:
        'Practice systems for hardware assembly, OS installation and office applications.',
      areaKitchen: 'Kitchen & Service Practice',
      areaKitchenDesc:
        'Food production and service training that mirrors the pace of commercial hospitality.',
      photoButton: 'See Training Photos',
    },

    /* ── Gallery ────────────────────────────────────────────── */
    gallery: {
      heroTitle: 'Photo Gallery',
      heroDesc: 'Training sessions, workshops, students and events at the center.',
      viewLarger: 'View larger',
      filterAria: 'Filter gallery by category',
      sampleBefore:
        'Sample photos shown for design purposes — replace with real photos of the center in',
      categories: {
        All: 'All',
        Training: 'Training',
        Workshops: 'Workshops',
        Students: 'Students',
        Events: 'Events',
        Facilities: 'Facilities',
      },
    },

    /* ── Trainers ───────────────────────────────────────────── */
    trainers: {
      heroTitle: 'Our Trainers',
      heroDesc: 'Experienced instructors guide trainees step by step through every trade.',
      expertise: 'Expertise',
      sampleNote: 'These are sample profiles — real trainer details will appear here.',
      noteBefore:
        'Trainer profiles below are clearly-marked samples for design purposes. Real instructor profiles should replace them in',
      noteAfter: 'before launch.',
      joinTitle: 'Are you an experienced tradesperson?',
      joinDesc:
        'We are always interested in hearing from skilled professionals who enjoy teaching the next generation of technicians.',
    },

    /* ── Admission ──────────────────────────────────────────── */
    admission: {
      heroTitle: 'Admission & Enrollment',
      heroDesc: 'A simple, friendly process to join one of our training programs.',
      stepsTitle: 'How to Apply',
      stepsDesc: 'Follow these simple steps to secure your seat.',
      documentsTitle: 'Documents to Prepare',
      documentsDesc: 'Typical requirements — please confirm with the center when you apply.',
      contactLine: 'Questions about admission? Call us, message us, or send an inquiry.',
      noticeNote: 'Admission information shown is a general guide — confirm current details with the center.',
      stepsEyebrow: 'The Process',
      applyEyebrow: 'Apply / Enquire',
      inquiryFormTitle: 'Training Inquiry Form',
      formDesc: 'Fill this in and we will get back to you about your chosen program.',
      helpTitle: 'Need help deciding?',
      helpDesc:
        'Talk to us before choosing — we will happily explain what each trade involves and which course fits your goals.',
      nextTitle: 'What happens next?',
      next1: 'Our team reviews your inquiry.',
      next2: 'We contact you with course details and upcoming batch dates.',
      next3: 'You visit the center (optional but welcome).',
      next4: 'Complete enrollment and start training.',
      startInquiry: 'Start Below — Submit Your Inquiry',
    },

    /* ── FAQ ────────────────────────────────────────────────── */
    faq: {
      heroTitle: 'Frequently Asked Questions',
      heroDesc: 'Quick answers to the most common questions about courses and admission.',
      categoryGeneral: 'General',
      categoryCourses: 'Courses',
      categoryAdmission: 'Admission',
      otherQuestions: 'Still have questions?',
      otherQuestionsDesc: 'Get in touch — we’re happy to help.',
    },

    /* ── Contact ────────────────────────────────────────────── */
    contact: {
      heroTitle: 'Contact Us',
      heroDesc: 'Questions about a course, schedules or enrollment? Reach us by phone, email, or the inquiry form below.',
      breadcrumb: 'Contact',
      formTitle: 'Send an Inquiry',
      formHint: 'Fields marked * are required. We usually respond within one to two working days.',
      visitUs: 'Visit Us',
      callUs: 'Call Us',
      tapToCall: 'Tap to call',
      emailUs: 'Email Us',
      officeHours: 'Office Hours',
      hoursFallback: 'Please contact us for current office hours.',
      followUs: 'Follow Us',
      mapTitle: 'Find Our Training Center',
      directions: 'Get Directions on Google Maps',
    },

    /* ── Inquiry form ───────────────────────────────────────── */
    form: {
      name: 'Full name *',
      phone: 'Phone number *',
      email: 'Email address',
      course: 'Interested course',
      courseSelect: 'Select a course…',
      education: 'Education level',
      time: 'Preferred training time',
      message: 'Your message',
      messagePlaceholder: 'Tell us a little about your training goals…',
      namePlaceholder: 'e.g. Ramesh Shrestha',
      phonePlaceholder: 'Your mobile / contact number',
      emailPlaceholder: 'you@example.com',
      nameError: 'Please tell us your name.',
      phoneError: 'Please provide a contact number.',
      courseSelectHint: 'Choose the program you are interested in.',
      submit: 'Send Inquiry',
      sending: 'Sending…',
      successTitle: 'Inquiry sent!',
      successDesc: 'Thank you — we will get back to you within one to two working days.',
      demoNote: 'Demo mode: message will not actually be sent until EmailJS is configured in the .env file.',
      required: 'Required',
      address: 'Address',
      addressPlaceholder: 'City / district',
      educationSelect: 'Select education level…',
      emailError: 'Please enter a valid email address.',
      messageError: 'Please write a short message.',
      sendAnother: 'Send another inquiry',
      sendError:
        "We couldn't send your inquiry right now. Please try again or contact us directly by phone or email.",
      privacyNote: 'Your details are only used to respond to your inquiry.',
      ariaLabel: 'Training inquiry form',
    },

    /* ── WhatsApp ───────────────────────────────────────────── */
    whatsapp: {
      title: 'Chat with us on WhatsApp',
      desc: 'Ask about courses, schedules, fees or enrollment — we usually reply quickly during office hours.',
      start: 'Start a chat',
      greeting:
        'Hello Janaki TTC! I found your website and I would like to ask about your training programs.',
      open: 'Chat with us on WhatsApp',
      close: 'Close WhatsApp chat',
    },

    /* ── Not found ──────────────────────────────────────────── */
    notFound: {
      title: 'Page Not Found',
      desc: "Sorry, the page you're looking for doesn't exist or has been moved.",
      cta: 'Return Home',
      explore: 'Explore Courses',
    },

    /* ── Misc labels ────────────────────────────────────────── */
    tags: {
      Admission: 'Admission',
      Notice: 'Notice',
      Event: 'Event',
      Achievement: 'Achievement',
      Update: 'Update',
    },
  },

  ne: {
    /* ── Common ─────────────────────────────────────────────── */
    common: {
      home: 'गृहपृष्ठ',
      back: 'पछाडि',
      learnMore: 'थप जान्नुहोस्',
      viewAll: 'सबै हेर्नुहोस्',
      contactUs: 'सम्पर्क गर्नुहोस्',
      applyNow: 'अहिले दर्ता गर्नुहोस्',
      enquire: 'सोध्नुहोस्',
      enquireNow: 'अहिले सोध्नुहोस्',
      readMore: 'थप पढ्नुहोस्',
      comingSoon: 'चाँडै आउँदैछ',
      sample: 'नमूना',
      sampleProfile: 'नमूना प्रोफाइल',
      notEnrolling: 'हाल भर्ना खुला छैन',
      enrolling: 'हाल भर्ना खुला',
      handsOn: 'प्रयोगात्मक तालिम',
      download: 'डाउनलोड',
      save: 'सुरक्षित गर्नुहोस्',
      saved: 'सुरक्षित गरियो',
      cancel: 'रद्द गर्नुहोस्',
      delete: 'मेट्नुहोस्',
      search: 'खोज्नुहोस्',
      loading: 'लोड हुँदैछ…',
      directions: 'बाटो हेर्नुहोस्',
    },

    /* ── Navigation ─────────────────────────────────────────── */
    nav: {
      home: 'गृहपृष्ठ',
      about: 'हाम्रोबारे',
      courses: 'तालिमहरू',
      practicalTraining: 'प्रयोगात्मक तालिम',
      facilities: 'सुविधाहरू',
      gallery: 'फोटो ग्यालरी',
      institute: 'संस्था',
      trainers: 'प्रशिक्षकहरू',
      faq: 'प्रश्नहरू',
      admission: 'भर्ना',
      applyNow: 'अहिले दर्ता गर्नुहोस्',
      applyMobile: 'अहिले दर्ता — तालिममा भर्ना हुनुहोस्',
      searchCourses: 'तालिम खोज्नुहोस् (Ctrl+K)',
      searchAria: 'तालिम खोज्नुहोस्',
      openMenu: 'मेनु खोल्नुहोस्',
      closeMenu: 'मेनु बन्द गर्नुहोस्',
      switchLight: 'हल्का मोडमा जानुहोस्',
      switchDark: 'गाढा मोडमा जानुहोस्',
      skipToContent: 'मुख्य सामग्रीमा जानुहोस्',
      tagline: 'तालिम केन्द्र',
      searchShortcut: 'Ctrl+K',
    },

    /* ── Hero ───────────────────────────────────────────────── */
    hero: {
      badge: 'प्राविधिक तथा व्यावसायिक तालिम संस्था',
      title1: 'सीप विकास।',
      title2: 'अवसर सिर्जना।',
      title3: '',
      explore: 'तालिमहरू हेर्नुहोस्',
      trust: ['हातले गर्ने तालिम', 'प्रशिक्षकको मार्गदर्शन', 'छोटो, केन्द्रित तालिम'],
      statPrograms: 'तालिम विधाहरू',
      statCategories: 'सीप समूहहरू',
      statPractical: 'प्रयोगात्मक-पहिलो पठन',
      scrollMore: 'थप हेर्न तल सार्नुहोस्',
    },

    /* ── Quick info bar ─────────────────────────────────────── */
    quickInfo: [
      { title: 'व्यवस्थित तालिम', text: 'हरेक सीपका लागि निश्चित घण्टा र चरणहरू।' },
      { title: 'पूर्ण व्यावहारिक तालिम', text: 'वास्तविक औजार र सामग्रीसँग अभ्यास।' },
      { title: 'लचिलो समयतालिका', text: 'नियमित, बिहान र साँझको ब्याच।' },
      { title: 'सुरुवात गर्न सजिलो', text: 'कुनै पूर्व अनुभव आवश्यक छैन।' },
      { title: 'प्रयोगात्मक सीप', text: 'वास्तविक कार्यस्थलका लागि तयार सीप।' },
      { title: 'अनुभवी प्रशिक्षक', text: 'अनुभवी पेशेवरहरूबाट सिक्नुहोस्।' },
    ],

    /* ── Home sections ──────────────────────────────────────── */
    home: {
      aboutBody:
        'एउटा प्राविधिक तथा व्यावसायिक तालिम संस्था हो, जसले हातले गर्ने सीप विकासमा केन्द्रित काम गर्छ। हामी विद्यार्थीलाई वास्तविक कामका लागि तयार पार्छौं — कार्यशाला, कार्यस्थल र सेवा व्यवसायमा।',
      aboutEyebrow: 'हाम्रो तालिम केन्द्रबारे',
      aboutImgAlt1: 'प्राविधिक अभ्यासमा प्रशिक्षकले विद्यार्थीलाई मार्गदर्शन गर्दै',
      aboutImgAlt2: 'कार्यशालामा वेल्डिङ अभ्यास',
      aboutMission: 'हाम्रो लक्ष्य',
      aboutMissionDesc: 'विद्यार्थीलाई व्यावहारिक सीप, प्राविधिक दक्षता र करियर निर्माणको आत्मविश्वासले सुसज्जित पार्ने।',
      aboutMissionPoints: [
        'व्यावहारिक, हातले गर्ने प्राविधिक तालिम प्रदान गर्ने',
        'रोजगारयोग्य, उद्योग-सान्दर्भिक सीप निर्माण गर्ने',
        'प्राविधिक क्षमता र आत्मविश्वास विकास गर्ने',
        'हरेक विद्यार्थीको करियर विकासमा सहयोग गर्ने',
        'गुणस्तरीय व्यावसायिक शिक्षा सबैका लागि सुलभ बनाउने',
      ],
      aboutMore: 'थप जान्नुहोस्',
      aboutTitle: 'व्यावहारिक सीप विकासमा समर्पित केन्द्र',
      aboutValuesLabel: 'हाम्रा मूल्यहरू:',
      aboutVision: 'हाम्रो दृष्टिकोण',
      aboutVisionDesc: 'समुदाय र उद्योगलाई सुदृढ पार्ने सीपवान्, सक्षम जनशक्ति उत्पादन गर्ने।',
      announcementsDesc: 'तालिम केंद्रका भर्ना सूचना, कार्यक्रम र घोषणाहरू।',
      announcementsEyebrow: 'जानकारी रहनुहोस्',
      announcementsPinned: 'पिन गरिएको',
      announcementsTitle: 'समाचार र सूचना',
      featuredEyebrow: 'तालिम कार्यक्रम',
      featuredTitle: 'लोकप्रिय व्यावसायिक तालिमहरू',
      featuredDesc:
        'अनुभवी प्रशिक्षकहरूद्वारा कार्यशालामा सिकाइने व्यावहारिक, रोजगारमुखी तालिम कार्यक्रमहरू।',
      featuredViewAll: 'सबै तालिम हेर्नुहोस्',
      whyEyebrow: 'किन जानकी TTC',
      whyTitle: 'विद्यार्थीहरूले किन रोज्छन्',
      whyDesc:
        'वास्तविक काम, रोजगार र अवसरका लागि तयार पार्ने व्यावहारिक-पहिलो सिकाइ दृष्टिकोण।',
      practicalEyebrow: 'हाम्रा सुविधाहरू',
      practicalTitle: 'वास्तविक तालिम, वास्तविक सुविधा',
      practicalDesc:
        'हाम्रा समर्पित तालिम क्षेत्रहरूले तपाईंलाई वास्तविक कार्यस्थलमा प्रयोग हुने औजार र सामग्रीसँग व्यावहारिक अनुभव दिन्छन्।',
      practicalButton: 'हाम्रा सुविधाहरू हेर्नुहोस्',
      practicalImgAlt1: 'सुरक्षा उपकरणसहित वेल्डिङ तालिम',
      practicalImgAlt2: 'तालिम यार्डमा निर्माण अभ्यास',
      methodologyEyebrow: 'तालिम विधि',
      methodologyTitle: 'हामी कसरी सिकाउँछौं',
      methodologyDesc:
        'हरेक तालिमले प्रमाणित पठन-विधि पछ्याउँछ — बुझ्नुहोस्, अभ्यास गर्नुहोस्, बनाउनुहोस् र रोजगारका लागि तयार नहुँदासम्म सुधार गर्नुहोस्।',
      careersEyebrow: 'करियरका अवसर',
      careersTitle: 'यी सीपले तपाईंलाई के गर्न सक्छन्',
      careersDesc: 'व्यावसायिक तालिमले रोजगार, स्वरोजगार र त्यसभन्दा परसम्म अवसरहरू खोल्छ।',
      careersNote:
        'यी केवल मार्गदर्शनका लागि साझा गरिएका सामान्य सम्भावनाहरू हुन् — केन्द्रले रोजगारी वा आम्दानीको ग्यारेन्टी गर्दैन।',
      testimonialsEyebrow: 'विद्यार्थीका अनुभव',
      testimonialsTitle: 'विद्यार्थीहरू के भन्छन्',
      testimonialsDesc: 'हामीसँग सिकेका विद्यार्थीहरूका वास्तविक अनुभव।',
      recentEyebrow: 'पढाई जारी राख्नुहोस्',
      recentTitle: 'हालै हेरिएका तालिमहरू',
      recentDismiss: 'हालै हेरिएका बन्द गर्नुहोस्',
    },

    /* ── CTA / Newsletter ───────────────────────────────────── */
    cta: {
      title: 'आफ्नो भविष्य बनाउन तयार हुनुहुन्छ?',
      desc: 'एउटा सीप छान्नुहोस्, व्यावहारिक रूपमा सिक्नुहोस्, र गर्वका साथ कामतिर अघि बढ्नुहोस्।',
      applyNow: 'अहिले दर्ता गर्नुहोस्',
      contact: 'सम्पर्क गर्नुहोस्',
      callUs: 'फोन गर्नुहोस्:',
      alertTitle: 'नयाँ ब्याच सूचना',
      alertPlaceholder: 'नयाँ ब्याचका लागि तपाईंको इमेल',
      alertButton: 'सूचना पाउनुहोस्',
      alertSuccess: "तपाईं सूचीमा हुनुहुन्छ! नयाँ ब्याच खुल्दा हामी इमेल गर्नेछौं।",
      alertError: 'कृपया मान्य इमेल ठेगाना लेख्नुहोस्।',
      alertSaveError: 'अहिले इमेल सुरक्षित गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
      alertPrivacy: 'हामी तपाईंको इमेल केवल भर्ना र ब्याच सूचनाका लागि मात्र प्रयोग गर्छौं।',
    },

    /* ── Footer ─────────────────────────────────────────────── */
    footer: {
      aboutHeading: 'संस्थाकोबारे',
      aboutText:
        'विद्यार्थीलाई उद्योग-सान्दर्भिक सीप र वास्तविक जीवनको अनुभवले सुसज्जित पार्ने व्यावहारिक प्राविधिक तथा व्यावसायिक तालिम।',
      quickLinks: 'द्रुत लिंकहरू',
      trainingAreas: 'तालिम क्षेत्रहरू',
      contactInfo: 'सम्पर्क विवरण',
      rights: 'सर्वाधिकार सुरक्षित।',
      tagline: 'वास्तविक अवसरका लागि व्यावहारिक सीप।',
      admin: 'एडमिन',
      followUs: 'पछ्याउनुहोस्',
      trainingAreaLabels: {
        electrical: 'इलेक्ट्रिकल',
        plumbing: 'प्लम्बिङ',
        construction: 'निर्माण',
        computer: 'कम्प्युटर र प्रविधि',
        mechanical: 'मेकानिकल / वेल्डिङ',
        hospitality: 'होटल व्यवस्थापन',
        agriculture: 'कृषि',
        tailoring: 'सिलाई तथा गार्मेन्ट',
      },
    },

    /* ── Search modal ───────────────────────────────────────── */
    search: {
      placeholder: 'तालिम खोज्नुहोस्… (तालिम, वेल्डिङ, वायरिङ…)',
      noResults: 'कुनै तालिम मिलेन',
      resultsFor: 'खोज परिणाम',
      navigate: 'सार्नुहोस्',
      open: 'खोल्नुहोस्',
      close: 'बन्द गर्नुहोस्',
      ariaClose: 'खोज बन्द गर्नुहोस्',
    },

    /* ── Courses page ───────────────────────────────────────── */
    courses: {
      heroTitle: 'तालिमहरू तथा कार्यक्रमहरू',
      heroDesc:
        'हाम्रो घर, व्यवसाय र समुदाय निर्माण गर्ने सीपहरूको व्यावहारिक व्यावसायिक तालिम।',
      searchPlaceholder: 'तालिम वा सीप खोज्नुहोस्…',
      sort: 'क्रम मिलाउनुहोस्',
      sortFeatured: 'क्रम: विशेष',
      sortName: 'नाम (क–ज)',
      sortDurationAsc: 'अवधि: छोटो → लामो',
      sortDurationDesc: 'अवधि: लामो → छोटो',
      all: 'सबै',
      showing: 'देखाइँदै',
      of: 'मध्ये',
      programs: 'कार्यक्रमहरू',
      myList: 'मेरो सूची',
      emptyTitle: 'कुनै तालिम फेला परेन',
      emptyDesc: 'फरक खोज शब्द वा समूह प्रयास गर्नुहोस् — वा रिसेट गरेर सबै कार्यक्रम हेर्नुहोस्।',
      resetFilters: 'फिल्टर रिसेट गर्नुहोस्',
      note: 'नोट: कार्यक्रमको उपलब्धता ब्याचअनुसार फरक हुन सक्छ। देखाइएको अवधि सामान्य नमूना हो — वर्तमान समयतालिका र पुष्टि विवरणका लागि केंद्रसँग सम्पर्क गर्नुहोस्।',
      viewDetails: 'विवरण हेर्नुहोस्',
      durationLabel: 'अवधि',
      levelLabel: 'स्तर',
    },

    /* ── Course details ─────────────────────────────────────── */
    courseDetails: {
      youMayAlsoLike: 'तपाईंलाई यी पनि मन पर्न सक्छ',
      enquire: 'यस तालिमबारे सोध्नुहोस्',
      print: 'प्रिन्ट / PDF रूपमा सुरक्षित गर्नुहोस्',
      printAria: 'यो पृष्ठ प्रिन्ट गर्नुहोस्',
      share: 'सेयर गर्नुहोस्',
      copyLink: 'लिंक प्रतिलिपि गर्नुहोस्',
      copied: 'प्रतिलिपि भयो!',
      notFoundTitle: 'तालिम फेला परेन',
      overview: 'तालिमको सिंहावलोकन',
      skillsCovered: 'सिकाइने सीपहरू',
      practicalSkills: 'प्रयोगात्मक सीप',
      eligibility: 'योग्यता',
      tools: 'औजार र उपकरण',
      careers: 'रोजगारका अवसरहरू',
      schedule: 'तालिम समयतालिका',
      related: 'सम्बन्धित तालिमहरू',
      backToCourses: 'तालिमहरूमा फर्कनुहोस्',
      inThisSection: 'यस तालिममा',
      recentlyViewed: 'हालै हेरिएका',
    },

    /* ── About page ─────────────────────────────────────────── */
    about: {
      heroTitle: 'जानकी TTC बारेमा',
      heroDesc:
        'हरेक विद्यार्थीलाई व्यावहारिक तथा रोजगार-तयार सीप प्रदान गर्न प्रतिबद्ध प्राविधिक तथा व्यावसायिक तालिम केंद्र।',
      storyTitle: 'हाम्रो कथा',
      missionTitle: 'हाम्रो दृष्टिकोण',
      valuesEyebrow: 'हाम्रा मूल्यहरू',
      valuesTitle: 'हामी केका लागि खडा छौं',
      valuesDesc: 'हामी जे सिकाउँछौं र जसरी सिकाउँछौं त्यसका पछाडिका सिद्धान्त।',
      whyEyebrow: 'किन जानकी TTC',
      whyTitle: 'हामीलाई केले फरक बनाउँछ',
      whyDesc: 'व्यावहारिक-पहिलो, प्रशिक्षक-निर्देशित, रोजगार-केन्द्रित तालिम।',
      ctevNote: 'मान्यता र सम्बद्ध विवरण पुष्टि भएपछि यहाँ देखिनेछ।',
    },

    /* ── Facilities ─────────────────────────────────────────── */
    facilities: {
      heroTitle: 'हाम्रा सुविधाहरू',
      heroDesc: 'वास्तविक कार्यस्थलको अवस्था झल्काउने समर्पित कार्यशाला र अभ्यास क्षेत्रहरू।',
      features: 'विशेषताहरू',
      explore: 'हेर्नुहोस्',
    },

    /* ── Gallery ────────────────────────────────────────────── */
    gallery: {
      heroTitle: 'फोटो ग्यालरी',
      heroDesc: 'केंद्रमा भएका तालिम, कार्यशाला, विद्यार्थी र कार्यक्रमहरू।',
      viewLarger: 'ठूलो हेर्नुहोस्',
      categories: {
        All: 'सबै',
        Training: 'तालिम',
        Workshops: 'कार्यशालाहरू',
        Students: 'विद्यार्थीहरू',
        Events: 'कार्यक्रमहरू',
        Facilities: 'सुविधाहरू',
      },
    },

    /* ── Trainers ───────────────────────────────────────────── */
    trainers: {
      heroTitle: 'हाम्रा प्रशिक्षकहरू',
      heroDesc: 'अनुभवी प्रशिक्षकहरूले हरेक सीपमा विद्यार्थीलाई चरणबद्ध मार्गदर्शन गर्छन्।',
      expertise: 'विशेषज्ञता',
      sampleNote: 'यी नमूना प्रोफाइल हुन् — वास्तविक प्रशिक्षक विवरण यहाँ देखिनेछ।',
    },

    /* ── Admission ──────────────────────────────────────────── */
    admission: {
      heroTitle: 'भर्ना तथा नामांकन',
      heroDesc: 'हाम्रा तालिम कार्यक्रममा सामेल हुन सरल र सहज प्रक्रिया।',
      stepsTitle: 'कसरी आवेदन गर्ने',
      stepsDesc: 'यी सरल चरणहरू पछ्याएर आफ्नो सिट सुरक्षित गर्नुहोस्।',
      documentsTitle: 'तयार पार्नुपर्ने कागजातहरू',
      documentsDesc: 'सामान्य आवश्यकताहरू — आवेदन गर्दा केंद्रसँग पुष्टि गर्नुहोस्।',
      contactLine: 'भर्नाबारे प्रश्नहरू? फोन गर्नुहोस्, सन्देश पठाउनुहोस् वा सोधपुछ गर्नुहोस्।',
      noticeNote: 'देखाइएको भर्ना जानकारी सामान्य मार्गदर्शन हो — वर्तमान विवरण केंद्रसँग पुष्टि गर्नुहोस्।',
    },

    /* ── FAQ ────────────────────────────────────────────────── */
    faq: {
      heroTitle: 'बारम्बार सोधिने प्रश्नहरू',
      heroDesc: 'तालिम र भर्ना सम्बन्धी सामान्य प्रश्नहरूको छिटो उत्तर।',
      categoryGeneral: 'सामान्य',
      categoryCourses: 'तालिमहरू',
      categoryAdmission: 'भर्ना',
      otherQuestions: 'अझै प्रश्न छन्?',
      otherQuestionsDesc: 'सम्पर्क गर्नुहोस् — हामी मद्दत गर्न खुसी छौं।',
    },

    /* ── Contact ────────────────────────────────────────────── */
    contact: {
      heroTitle: 'सम्पर्क गर्नुहोस्',
      heroDesc:
        'तालिम, समयतालिका वा भर्नाबारे प्रश्न छ? फोन, इमेल वा तलको सोधपुछ फारमबाट सम्पर्क गर्नुहोस्।',
      breadcrumb: 'सम्पर्क',
      formTitle: 'सोधपुछ पठाउनुहोस्',
      formHint: '* चिन्ह लगाएका क्षेत्रहरू अनिवार्य छन्। हामी सामान्यतया १–२ कार्यदिनभित्र जवाफ दिन्छौं।',
      visitUs: 'भेट्नुहोस्',
      callUs: 'फोन गर्नुहोस्',
      tapToCall: 'फोन गर्न थिच्नुहोस्',
      emailUs: 'इमेल गर्नुहोस्',
      officeHours: 'कार्यालय समय',
      hoursFallback: 'वर्तमान कार्यालय समयका लागि कृपया सम्पर्क गर्नुहोस्।',
      followUs: 'पछ्याउनुहोस्',
      mapTitle: 'हाम्रो तालिम केंद्र पत्ता लगाउनुहोस्',
      directions: 'Google Maps मा बाटो हेर्नुहोस्',
    },

    /* ── Inquiry form ───────────────────────────────────────── */
    form: {
      name: 'पूरा नाम *',
      phone: 'फोन नम्बर *',
      email: 'इमेल ठेगाना',
      course: 'मनपर्ने तालिम',
      courseSelect: 'तालिम छान्नुहोस्…',
      education: 'शैक्षिक स्तर',
      time: 'मनपर्ने तालिम समय',
      message: 'तपाईंको सन्देश',
      messagePlaceholder: 'आफ्ना तालिम लक्ष्यहरूबारे केही लेख्नुहोस्…',
      namePlaceholder: 'जस्तै: रमेश श्रेष्ठ',
      phonePlaceholder: 'तपाईंको मोबाइल / सम्पर्क नम्बर',
      emailPlaceholder: 'tapaiko@example.com',
      nameError: 'कृपया आफ्नो नाम लेख्नुहोस्।',
      phoneError: 'कृपया सम्पर्क नम्बर प्रदान गर्नुहोस्।',
      courseSelectHint: 'तपाईंलाई चासो भएको कार्यक्रम छान्नुहोस्।',
      submit: 'सोधपुछ पठाउनुहोस्',
      sending: 'पठाउँदैछ…',
      successTitle: 'सोधपुछ पठाइयो!',
      successDesc: 'धन्यवाद — हामी १–२ कार्यदिनभित्र सम्पर्क गर्नेछौं।',
      demoNote: 'डेमो मोड: .env फाइलमा EmailJS कन्फिगर नभएसम्म सन्देश वास्तवमा पठाइने छैन।',
      required: 'अनिवार्य',
      address: 'ठेगाना',
      addressPlaceholder: 'शहर / जिल्ला',
      educationSelect: 'शैक्षिक स्तर छान्नुहोस्…',
      emailError: 'कृपया मान्य इमेल ठेगाना लेख्नुहोस्।',
      messageError: 'कृपया छोटो सन्देश लेख्नुहोस्।',
      sendAnother: 'अर्को सोधपुछ पठाउनुहोस्',
      sendError:
        'अहिले तपाईंको सोधपुछ पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस् वा फोन वा इमेलबाट सिधै सम्पर्क गर्नुहोस्।',
      privacyNote: 'तपाईंको विवरण केवल तपाईंको सोधपुछको जवाफ दिन मात्र प्रयोग गरिन्छ।',
      ariaLabel: 'तालिम सोधपुछ फारम',
    },

    /* ── WhatsApp ───────────────────────────────────────────── */
    whatsapp: {
      title: 'WhatsApp मा कुराकानी गर्नुहोस्',
      desc: 'तालिम, समयतालिका, शुल्क वा भर्नाबारे सोध्नुहोस् — हामी कार्यालय समयमा छिटो जवाफ दिन्छौं।',
      start: 'कुराकानी सुरु गर्नुहोस्',
      greeting:
        'नमस्ते जानकी TTC! मैले तपाईंको वेबसाइट देखें र तपाईंका तालिम कार्यक्रमहरूबारे जान्न चाहन्छु।',
      open: 'WhatsApp मा कुराकानी गर्नुहोस्',
      close: 'WhatsApp कुराकानी बन्द गर्नुहोस्',
    },

    /* ── Not found ──────────────────────────────────────────── */
    notFound: {
      title: 'पृष्ठ फेला परेन',
      desc: 'माफ गर्नुहोस्, तपाईंले खोज्नुभएको पृष्ठ अवस्थित छैन वा सारिएको छ।',
      cta: 'गृहपृष्ठमा फर्कनुहोस्',
      explore: 'तालिमहरू हेर्नुहोस्',
    },

    /* ── Misc labels ────────────────────────────────────────── */
    tags: {
      Admission: 'भर्ना',
      Notice: 'सूचना',
      Event: 'कार्यक्रम',
      Achievement: 'उपलब्धि',
      Update: 'अपडेट',
    },
  },
};
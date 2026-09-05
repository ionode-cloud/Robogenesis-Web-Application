// Robogenesis Contact Configuration & Data

export const CONTACT_INFO = {
  addressName: 'Robogenesis',
  addressLine1: 'Technology & Education Training Center',
  addressCountry: 'India',
  fullAddress: 'Robogenesis, Technology & Education Training Center, India',
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneCallable: '+910000000000',
  email: 'info@robogenesis.com',
  workingHours: 'Monday – Saturday, 9:00 AM – 6:00 PM',
  workingDays: 'Monday – Saturday',
  workingTime: '9:00 AM – 6:00 PM',
};

export const CONTACT_METHODS = [
  {
    id: 'course-enquiry',
    title: 'Course Enquiry',
    icon: '🎓',
    badge: 'Academics & Skills',
    enquiryType: 'Course Enquiry',
    desc: 'Get information about our short-term and long-term technology courses.',
    actionLabel: 'Enquire About Courses',
  },
  {
    id: 'project-enquiry',
    title: 'Project Enquiry',
    icon: '🔬',
    badge: 'Capstone & R&D',
    enquiryType: 'Project Enquiry',
    desc: 'Discuss IoT, AI/ML, Web Development, Embedded Systems, and Robotics projects.',
    actionLabel: 'Discuss a Project',
  },
  {
    id: 'product-enquiry',
    title: 'Product Enquiry',
    icon: '⚡',
    badge: 'Hardware & Kits',
    enquiryType: 'Product Enquiry',
    desc: 'Ask about development kits, IoT products, robotics kits, and embedded products.',
    actionLabel: 'Explore Hardware Kits',
  },
  {
    id: 'corporate-training',
    title: 'Corporate Training',
    icon: '🏢',
    badge: 'Institutional & Teams',
    enquiryType: 'Corporate Training',
    desc: 'Explore customized technology training programs for organizations and teams.',
    actionLabel: 'Request Team Training',
  },
];

export const ENQUIRY_TYPES = [
  'Course Enquiry',
  'Project Enquiry',
  'Product Enquiry',
  'Training Program',
  'Corporate Training',
  'General Enquiry',
];

export const DOMAIN_OPTIONS = [
  'IoT',
  'AI/ML',
  'Web Development',
  'Embedded Systems',
  'Robotics',
  'Other',
];

export const CONTACT_FAQS = [
  {
    q: 'What courses does Robogenesis offer?',
    a: 'Robogenesis offers comprehensive, project-based training in IoT, Embedded Systems, Microcontroller Programming, AI/ML, Modern Web Development, Robotics, and Computer Vision.',
  },
  {
    q: 'Can I enquire about a project?',
    a: 'Yes. Students, developers, and organizations can contact Robogenesis regarding academic capstone projects, technical consultancy, IoT prototypes, embedded firmware, robotics platforms, and web development applications.',
  },
  {
    q: 'Can organizations request customized training?',
    a: 'Yes. We provide customized corporate training, faculty development programs, and institutional workshops tailored to organizational learning objectives and industrial standards.',
  },
  {
    q: 'How can I enquire about a product?',
    a: 'Select "Product Enquiry" in our contact form and specify the development kit, IoT sensor board, or robotics platform you are interested in. Our hardware team will share datasheets, availability, and quotation details.',
  },
];

export const LOCATION_CONFIG = {
  title: 'Robogenesis Training Center',
  address: 'Robogenesis Technology & Education Training Center, India',
  latitude: null,
  longitude: null,
  mapUrl: '', // Configurable Google Maps or OpenStreetMap embed URL
  directionsUrl: '', // Optional directions link
  placeholderText: 'Location details coming soon.',
  placeholderSubtext: 'Our campus and training center visit schedule is available upon appointment.',
};

export const SOCIAL_LINKS = {
  facebook: '',
  instagram: '',
  linkedin: 'https://www.linkedin.com',
  youtube: '',
  github: 'https://github.com',
};

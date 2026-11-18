import { SectorDefinition, SubscriptionPlan, OrganizationConfig, CommunitySector } from '../types/onboarding';
import { NavItemKey } from '../types';

export const SECTOR_DEFINITIONS: Record<CommunitySector, SectorDefinition> = {
  'professional-business': {
    id: 'professional-business',
    name: 'Professional & Business',
    categoryTag: 'B2B & Innovation',
    tagline: 'Coworking Hubs, Incubators, Tech Parks & Business Alliances',
    description: 'Purpose-built for modern business campuses, innovation districts, accelerators, and business chambers managing hot desks, enterprise meeting suites, and venture summits.',
    memberTerm: { singular: 'Coworker / Tenant', plural: 'Teams & Tenants' },
    spaceTerm: { singular: 'Desk / Private Suite', plural: 'Workstations & Pods' },
    facilityDescriptor: 'Conference Suites & Meeting Pods',
    defaultFacilities: [
      'Executive Boardroom (24-seater AV)',
      'Podcast & Broadcast Studio',
      'Innovation Auditorium (450 seats)',
      'Flex Hot Desk Zone Alpha',
      'Venture Pitch Theatre'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management', 
      'facility-bookings', 'payments', 'invoices', 'announcements', 'reports', 'analytics', 'settings'
    ],
    defaultSampleOrgName: 'Apex Innovation Hub & Enterprise Park',
    defaultSampleCity: 'San Francisco, CA',
    accentColor: 'indigo',
    primaryAuditoriumName: 'Summit Innovation Amphitheatre',
    targetAudience: 'Startups, Venture Funds, Remote Companies & Corporate Campuses',
    sampleCustomFields: [
      { label: 'Company / Startup Entity', placeholder: 'e.g. Acme AI Technologies' },
      { label: 'Workstation / Desk Allocation', placeholder: 'e.g. Suite 402 - 12 Desks' }
    ]
  },

  'education-learning': {
    id: 'education-learning',
    name: 'Education & Learning',
    categoryTag: 'Academia & Training',
    tagline: 'Colleges, Academies, Research Campuses & Alumni Networks',
    description: 'Empowers universities, training institutes, student unions, and educational campuses to manage tiered lecture halls, academic convocations, student cohorts, and campus facilities.',
    memberTerm: { singular: 'Student / Scholar', plural: 'Students & Faculty' },
    spaceTerm: { singular: 'Batch / Department', plural: 'Lecture Theatres & Labs' },
    facilityDescriptor: 'Lecture Theatres & Research Labs',
    defaultFacilities: [
      'Grand Academic Convocation Auditorium (850 seats)',
      'Science & Robotics Research Lab',
      'Seminar Theatre Beta',
      'Campus Amphitheatre',
      'Athletic Turf & Sports Complex'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'facility-bookings', 'volunteers', 'polls', 'announcements', 'notifications', 'reports', 'analytics'
    ],
    defaultSampleOrgName: 'St. Jude Institute of Technology & Academy',
    defaultSampleCity: 'Boston, MA',
    accentColor: 'blue',
    primaryAuditoriumName: 'Centennial Academic Auditorium & Balcony',
    targetAudience: 'Universities, K-12 Academies, Coding Bootcamps & Alumni Chapters',
    sampleCustomFields: [
      { label: 'Student / Faculty ID', placeholder: 'e.g. STU-2026-8842' },
      { label: 'Academic Department / Major', placeholder: 'e.g. Computer Science & AI' }
    ]
  },

  'residential-local': {
    id: 'residential-local',
    name: 'Residential & Local',
    categoryTag: 'Townships & HOAs',
    tagline: 'Apartment Condos, Gated Estates, HOAs & Smart Townships',
    description: 'Complete operational ecosystem for residential welfare associations, housing societies, gated villas, and community committees handling maintenance, clubhouses, and family passes.',
    memberTerm: { singular: 'Resident / Owner', plural: 'Residents & Homeowners' },
    spaceTerm: { singular: 'Unit / Flat', plural: 'Blocks & Towers' },
    facilityDescriptor: 'Clubhouse Amenities & Sports Courts',
    defaultFacilities: [
      'Community Civic Hall & Stage (600 seats)',
      'Olympic Swimming Pool & Sun Deck',
      'Badminton Indoor Arena (Court 1 & 2)',
      'Tennis Clay Court Alpha',
      'Party Lawn & Pavilion'
    ],
    keyModules: [
      'dashboard', 'members', 'families', 'events', 'sports-areas', 'auditoriums', 
      'seat-management', 'facility-bookings', 'payments', 'invoices', 'announcements', 'polls'
    ],
    defaultSampleOrgName: 'Greenwood Heights Gated Residency & HOA',
    defaultSampleCity: 'Austin, TX',
    accentColor: 'emerald',
    primaryAuditoriumName: 'Greenwood Civic Auditorium & Cultural Hall',
    targetAudience: 'Condominium Boards, Resident Welfare Associations & Villa Enclaves',
    sampleCustomFields: [
      { label: 'Apartment / Villa Number', placeholder: 'e.g. Tower B - Flat 402' },
      { label: 'Vehicle RFID Tag', placeholder: 'e.g. RFID-KA-8812' }
    ]
  },

  'customer-brand': {
    id: 'customer-brand',
    name: 'Customer & Brand',
    categoryTag: 'VIP & Consumer Clubs',
    tagline: 'Brand Advocate Networks, Creator Collectives & VIP User Circles',
    description: 'Designed for consumer brands, hardware innovators, creator guilds, and developer ecosystems hosting product reveals, beta testing summits, and exclusive customer experiences.',
    memberTerm: { singular: 'VIP Member / Advocate', plural: 'VIP Members & Advocates' },
    spaceTerm: { singular: 'Tier / Circle', plural: 'Experience Lounges' },
    facilityDescriptor: 'Experience Centers & Showcase Studios',
    defaultFacilities: [
      'Brand Keynote Auditorium & Stage (500 seats)',
      'Creator Streaming & Content Studio',
      'VIP Founders Lounge',
      'Product Hands-On Demo Gallery',
      'Audio & Video Screening Suite'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'activities', 'media-gallery', 'polls', 'announcements', 'reports', 'analytics'
    ],
    defaultSampleOrgName: 'Luminary Creators & VIP Brand Collective',
    defaultSampleCity: 'New York, NY',
    accentColor: 'purple',
    primaryAuditoriumName: 'Keynote Showcase Stage & VIP Gallery',
    targetAudience: 'Hardware & Lifestyle Brands, Gaming Communities, Product Evangelists',
    sampleCustomFields: [
      { label: 'Brand Ambassador Tier', placeholder: 'e.g. Platinum Tier VIP' },
      { label: 'Handle / Creator Profile', placeholder: 'e.g. @luminary_creator' }
    ]
  },

  'interest-hobby': {
    id: 'interest-hobby',
    name: 'Interest & Hobby',
    categoryTag: 'Guilds & Makers',
    tagline: 'Maker Spaces, Cultural Guilds, Book Circles & Craft Societies',
    description: 'Empowers shared-interest communities, maker collectives, fine art societies, and hobby leagues with workshop reservation, equipment lockers, and exhibition spaces.',
    memberTerm: { singular: 'Guild Craftsman', plural: 'Guild Craftsmen & Makers' },
    spaceTerm: { singular: 'Workshop Bay', plural: 'Studios & Workshop Bays' },
    facilityDescriptor: 'Craft Workshops & Exhibition Bays',
    defaultFacilities: [
      'Community Performance Stage & Workshop (350 seats)',
      'Precision CNC & 3D Prototyping Bay',
      'Ceramics & Pottery Wheel Studio',
      'Darkroom & Photography Lab',
      'Woodworking & Artisan Workshop'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'activities', 'facility-bookings',
      'volunteers', 'donations', 'media-gallery', 'announcements'
    ],
    defaultSampleOrgName: 'Artisan Guild & Maker Collective',
    defaultSampleCity: 'Portland, OR',
    accentColor: 'amber',
    primaryAuditoriumName: 'Guild Showcase Theatre & Workshop Hall',
    targetAudience: 'Artists, Woodworkers, Hackerspaces, Amateur Astronomers, Culinary Guilds',
    sampleCustomFields: [
      { label: 'Primary Craft / Discipline', placeholder: 'e.g. Digital Fabrication & Woodcraft' },
      { label: 'Studio Bench Reservation', placeholder: 'e.g. Bench #14 - South Bay' }
    ]
  },

  'sports-fitness': {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    categoryTag: 'Athletics & Leagues',
    tagline: 'Sports Clubs, Stadiums, Fitness Academies & Racquet Centers',
    description: 'Comprehensive management for racquet clubs, football academies, aquatic centers, and athletic complexes featuring court time-slot reservations, tournaments, and spectator seating.',
    memberTerm: { singular: 'Athlete / Player', plural: 'Athletes & Players' },
    spaceTerm: { singular: 'Court / Lane', plural: 'Courts & Pitch Zones' },
    facilityDescriptor: 'Courts, Stadium Grandstands & Turfs',
    defaultFacilities: [
      'Championship Grandstand Arena (750 seats)',
      'Indoor Glass Squash Court 1 & 2',
      'FIBA Certified Basketball Arena',
      'Olympic 50m Heated Lap Pool',
      'All-Weather FIFA Turf Pitch'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'sports-areas', 'facility-bookings',
      'auditoriums', 'seat-management', 'payments', 'invoices', 'reports', 'analytics'
    ],
    defaultSampleOrgName: 'Titan Premier Sports Club & Academy',
    defaultSampleCity: 'Denver, CO',
    accentColor: 'rose',
    primaryAuditoriumName: 'Titan Arena Grandstand & Spectator Balcony',
    targetAudience: 'Tennis & Squash Clubs, Football Academies, Swim Clubs, Martial Arts Dojos',
    sampleCustomFields: [
      { label: 'Sporting Discipline / League', placeholder: 'e.g. Tennis Division 1' },
      { label: 'Locker & Kit Allocation', placeholder: 'e.g. Locker L-108' }
    ]
  },

  'social-networking': {
    id: 'social-networking',
    name: 'Social & Networking',
    categoryTag: 'Clubs & Brotherhoods',
    tagline: 'Rotary Clubs, City Clubs, Executive Circles & Fraternal Lodges',
    description: 'Designed for historic city clubs, fellowship associations, executive dining circles, and alumni fraternities hosting black-tie galas, democratic elections, and banquet dinners.',
    memberTerm: { singular: 'Fellow / Member', plural: 'Fellows & Members' },
    spaceTerm: { singular: 'Chapter / Committee', plural: 'Banquets & Private Lounges' },
    facilityDescriptor: 'Banquet Halls & Private Lounges',
    defaultFacilities: [
      'Gala Banquet Hall & Proscenium Stage (550 seats)',
      'Presidents Dining Suite',
      'Library & Reading Lounge',
      'Billiards & Cigar Room',
      'Terrace Cocktail Garden'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'food-programs', 'donations', 'polls', 'announcements', 'payments'
    ],
    defaultSampleOrgName: 'Metropolitan Rotary & Executive Circle',
    defaultSampleCity: 'Chicago, IL',
    accentColor: 'violet',
    primaryAuditoriumName: 'Metropolitan Gala Hall & Balcony Suite',
    targetAudience: 'Rotary, Lions Club, Historic Gentlemen’s Clubs, Executive Alumni Lodges',
    sampleCustomFields: [
      { label: 'Fellowship Chapter / Lodge', placeholder: 'e.g. Downtown Metro Chapter' },
      { label: 'Induction Year / Seniority', placeholder: 'e.g. Class of 2018' }
    ]
  },

  'non-profit-orgs': {
    id: 'non-profit-orgs',
    name: 'Non-Profit & Organizations',
    categoryTag: 'Charities & NGOs',
    tagline: 'Charitable Trusts, Volunteer Networks, NGOs & Relief Foundations',
    description: 'Empowers philanthropic organizations, food distribution networks, humanitarian relief trusts, and volunteer task forces with transparent donor ledgers and townhall assemblies.',
    memberTerm: { singular: 'Volunteer / Donor', plural: 'Volunteers & Donors' },
    spaceTerm: { singular: 'Mission Center', plural: 'Relief Hubs & Food Pantries' },
    facilityDescriptor: 'Distribution Centers & Townhalls',
    defaultFacilities: [
      'Humanitarian Townhall Hall (400 seats)',
      'Central Food Drive & Sorting Hub',
      'Relief Supplies Warehouse Zone B',
      'Volunteer Training Classroom',
      'Counseling & Community Support Suite'
    ],
    keyModules: [
      'dashboard', 'members', 'events', 'volunteers', 'donations',
      'food-programs', 'auditoriums', 'seat-management', 'announcements', 'reports'
    ],
    defaultSampleOrgName: 'Hope Horizon Humanitarian Foundation',
    defaultSampleCity: 'Seattle, WA',
    accentColor: 'teal',
    primaryAuditoriumName: 'Hope Assembly Townhall & Stage',
    targetAudience: 'NGOs, Relief Foundations, Food Banks, Animal Rescues, Disaster Response',
    sampleCustomFields: [
      { label: 'Volunteer Specialty / Skill', placeholder: 'e.g. Emergency Logistics & Medical Aid' },
      { label: 'Donor Tax Exemption ID', placeholder: 'e.g. 501(c)(3) Receipt Ref' }
    ]
  }
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Community',
    tierTag: 'For Emerging Associations & Clubs',
    monthlyPrice: 49,
    annualPrice: 39,
    memberLimit: 'Up to 250 Members',
    auditoriumLimit: '1 Auditorium / Hall',
    spaceLimit: '3 Bookable Facilities',
    storage: '10 GB Media Cloud Storage',
    features: [
      'Multi-block Seating & Ticket Allocation',
      'Facility & Court Time-slot Calendar',
      'Digital Member Passes & QR Verification',
      'Announcements & Broadcast Circulars',
      'Basic Financial Ledger & UPI Tracking',
      'Community Polls & Feedback Surveys'
    ],
    idealFor: 'Small societies, local clubs, hobby workshops and initial chapters.'
  },
  {
    id: 'growth',
    name: 'Growth & Professional',
    tierTag: 'Most Popular for Active Communities',
    monthlyPrice: 149,
    annualPrice: 119,
    memberLimit: 'Up to 2,500 Members',
    auditoriumLimit: 'Unlimited Auditoriums & Balconies',
    spaceLimit: 'Unlimited Facilities & Courts',
    storage: '100 GB High-Res Storage',
    isPopular: true,
    features: [
      'All Starter Features Included',
      'Full Multi-Tier Balcony Seating Layouts',
      'Automated Invoicing & Dues Collection',
      'Interactive Seat Inspector & VIP Passes',
      'Volunteer Hours & Shift Management',
      'Food Token Program & Meal Pass System',
      'Executive Analytics & Audit Reports',
      '7 Granular Admin Roles & Permissions'
    ],
    idealFor: 'Medium to large associations, residential complexes, academies & sports clubs.'
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Campus',
    tierTag: 'For Large Scale Campuses & Networks',
    monthlyPrice: 399,
    annualPrice: 319,
    memberLimit: 'Unlimited Members & Multi-Branch',
    auditoriumLimit: 'Unlimited Multi-Hall Complexes',
    spaceLimit: 'Unlimited Across All Campuses',
    storage: '1 TB Dedicated Cloud Storage',
    features: [
      'All Growth Features Included',
      'Multi-Chapter & Multi-Building Support',
      'Custom Domain & White-Label Theming',
      'SSO & Enterprise Active Directory Sync',
      'Automated Security Audit & Compliance Logs',
      'Custom API & Webhook Integrations',
      'Dedicated Customer Success Manager',
      '99.9% Uptime Guarantee & SLA'
    ],
    idealFor: 'Colleges, tech parks, large townships, and national organizations.'
  }
];

export const INITIAL_SECTOR_ORGS: Record<CommunitySector, OrganizationConfig> = {
  'professional-business': {
    id: 'org-biz-01',
    name: 'Apex Innovation Hub & Enterprise Park',
    slug: 'apex-innovation',
    sector: 'professional-business',
    memberTermSingular: 'Coworker',
    memberTermPlural: 'Teams & Tenants',
    spaceTermSingular: 'Hot Desk / Suite',
    spaceTermPlural: 'Desks & Meeting Suites',
    city: 'San Francisco',
    country: 'United States',
    contactEmail: 'concierge@apexinnovation.com',
    contactPhone: '+1 (415) 880-9921',
    accessPolicy: 'domain_restricted',
    allowedDomain: 'apexco.org',
    memberCountRange: '501 - 1,500',
    enabledModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'facility-bookings', 'payments', 'invoices', 'announcements', 'reports', 'analytics', 'settings'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'annual',
      amount: 1428,
      currency: 'USD ($)',
      status: 'active',
      startDate: '15 Jan 2026',
      nextBillingDate: '15 Jan 2027',
      paymentMethod: 'Corporate Visa ending in 4242'
    },
    primaryAdmin: {
      name: 'Elena Rostova',
      email: 'elena@apexinnovation.com',
      roleTitle: 'Director of Workplace & Community',
      phone: '+1 (415) 880-9900'
    }
  },

  'education-learning': {
    id: 'org-edu-01',
    name: 'St. Jude Institute of Technology & Academy',
    slug: 'stjude-tech',
    sector: 'education-learning',
    memberTermSingular: 'Student / Scholar',
    memberTermPlural: 'Students & Faculty',
    spaceTermSingular: 'Lecture Hall / Lab',
    spaceTermPlural: 'Lecture Theatres & Labs',
    city: 'Boston',
    country: 'United States',
    contactEmail: 'dean.operations@stjude.edu',
    contactPhone: '+1 (617) 492-3000',
    accessPolicy: 'domain_restricted',
    allowedDomain: 'stjude.edu',
    memberCountRange: '2,500+',
    enabledModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'facility-bookings', 'volunteers', 'polls', 'announcements', 'notifications', 'reports', 'analytics'
    ],
    subscription: {
      planId: 'enterprise',
      billingCycle: 'annual',
      amount: 3828,
      currency: 'USD ($)',
      status: 'active',
      startDate: '01 Feb 2026',
      nextBillingDate: '01 Feb 2027',
      paymentMethod: 'Campus Wire Transfer / PO'
    },
    primaryAdmin: {
      name: 'Dr. Arthur Pendelton',
      email: 'arthur.p@stjude.edu',
      roleTitle: 'Dean of Student Affairs & Facilities',
      phone: '+1 (617) 492-3012'
    }
  },

  'residential-local': {
    id: 'org-res-01',
    name: 'Greenwood Heights Gated Residency & HOA',
    slug: 'greenwood-heights',
    sector: 'residential-local',
    memberTermSingular: 'Resident',
    memberTermPlural: 'Residents & Homeowners',
    spaceTermSingular: 'Apartment / Villa',
    spaceTermPlural: 'Blocks & Towers',
    city: 'Austin',
    country: 'United States',
    contactEmail: 'admin@greenwoodheights.org',
    contactPhone: '+1 (512) 345-6789',
    accessPolicy: 'approval_required',
    memberCountRange: '501 - 1,500',
    enabledModules: [
      'dashboard', 'members', 'families', 'events', 'sports-areas', 'auditoriums',
      'seat-management', 'facility-bookings', 'payments', 'invoices', 'announcements', 'polls', 'settings'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'annual',
      amount: 1428,
      currency: 'USD ($)',
      status: 'active',
      startDate: '01 Jan 2026',
      nextBillingDate: '01 Jan 2027',
      paymentMethod: 'Association Checking ACH'
    },
    primaryAdmin: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@greenwood.org',
      roleTitle: 'Managing Committee President',
      phone: '+1 (512) 345-6701'
    }
  },

  'customer-brand': {
    id: 'org-brand-01',
    name: 'Luminary Creators & VIP Brand Collective',
    slug: 'luminary-vip',
    sector: 'customer-brand',
    memberTermSingular: 'Advocate',
    memberTermPlural: 'VIP Members & Advocates',
    spaceTermSingular: 'Experience Studio',
    spaceTermPlural: 'Creator Lounges & Pods',
    city: 'New York',
    country: 'United States',
    contactEmail: 'vip@luminarybrand.com',
    contactPhone: '+1 (212) 998-1200',
    accessPolicy: 'approval_required',
    memberCountRange: '101 - 500',
    enabledModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'activities', 'media-gallery', 'polls', 'announcements', 'reports', 'analytics'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'monthly',
      amount: 149,
      currency: 'USD ($)',
      status: 'active',
      startDate: '10 Feb 2026',
      nextBillingDate: '10 Mar 2026',
      paymentMethod: 'Mastercard ending in 9876'
    },
    primaryAdmin: {
      name: 'Sienna Blake',
      email: 'sienna@luminarybrand.com',
      roleTitle: 'Head of Global Brand Community',
      phone: '+1 (212) 998-1211'
    }
  },

  'interest-hobby': {
    id: 'org-hobby-01',
    name: 'Artisan Guild & Maker Collective',
    slug: 'artisan-guild',
    sector: 'interest-hobby',
    memberTermSingular: 'Craftsman',
    memberTermPlural: 'Guild Craftsmen & Makers',
    spaceTermSingular: 'Workshop Bench',
    spaceTermPlural: 'Workshop Bays & Studios',
    city: 'Portland',
    country: 'United States',
    contactEmail: 'guildmaster@artisanguild.org',
    contactPhone: '+1 (503) 771-4455',
    accessPolicy: 'open',
    memberCountRange: '101 - 500',
    enabledModules: [
      'dashboard', 'members', 'events', 'activities', 'facility-bookings',
      'volunteers', 'donations', 'media-gallery', 'announcements'
    ],
    subscription: {
      planId: 'starter',
      billingCycle: 'annual',
      amount: 468,
      currency: 'USD ($)',
      status: 'active',
      startDate: '20 Jan 2026',
      nextBillingDate: '20 Jan 2027',
      paymentMethod: 'Visa Debit ending in 1102'
    },
    primaryAdmin: {
      name: 'Rowan Vance',
      email: 'rowan@artisanguild.org',
      roleTitle: 'Lead Guild Curator',
      phone: '+1 (503) 771-4450'
    }
  },

  'sports-fitness': {
    id: 'org-sports-01',
    name: 'Titan Premier Sports Club & Academy',
    slug: 'titan-sports',
    sector: 'sports-fitness',
    memberTermSingular: 'Athlete',
    memberTermPlural: 'Athletes & Players',
    spaceTermSingular: 'Court / Turf',
    spaceTermPlural: 'Courts & Pitch Zones',
    city: 'Denver',
    country: 'United States',
    contactEmail: 'operations@titansports.club',
    contactPhone: '+1 (303) 882-9900',
    accessPolicy: 'approval_required',
    memberCountRange: '1,501 - 2,500',
    enabledModules: [
      'dashboard', 'members', 'events', 'sports-areas', 'facility-bookings',
      'auditoriums', 'seat-management', 'payments', 'invoices', 'reports', 'analytics'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'annual',
      amount: 1428,
      currency: 'USD ($)',
      status: 'active',
      startDate: '05 Jan 2026',
      nextBillingDate: '05 Jan 2027',
      paymentMethod: 'Amex Business ending in 3001'
    },
    primaryAdmin: {
      name: 'Coach Marcus Vance',
      email: 'marcus@titansports.club',
      roleTitle: 'Athletic Director & General Manager',
      phone: '+1 (303) 882-9905'
    }
  },

  'social-networking': {
    id: 'org-social-01',
    name: 'Metropolitan Rotary & Executive Circle',
    slug: 'metropolitan-rotary',
    sector: 'social-networking',
    memberTermSingular: 'Fellow',
    memberTermPlural: 'Fellows & Members',
    spaceTermSingular: 'Private Suite',
    spaceTermPlural: 'Banquets & Private Lounges',
    city: 'Chicago',
    country: 'United States',
    contactEmail: 'fellowship@metrorotary.org',
    contactPhone: '+1 (312) 664-8800',
    accessPolicy: 'approval_required',
    memberCountRange: '101 - 500',
    enabledModules: [
      'dashboard', 'members', 'events', 'auditoriums', 'seat-management',
      'food-programs', 'donations', 'polls', 'announcements', 'payments'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'annual',
      amount: 1428,
      currency: 'USD ($)',
      status: 'active',
      startDate: '01 Jan 2026',
      nextBillingDate: '01 Jan 2027',
      paymentMethod: 'JPMorgan Chase ACH'
    },
    primaryAdmin: {
      name: 'Hon. Alistair Sterling',
      email: 'alistair@metrorotary.org',
      roleTitle: 'Chapter President & Trustee',
      phone: '+1 (312) 664-8801'
    }
  },

  'non-profit-orgs': {
    id: 'org-ngo-01',
    name: 'Hope Horizon Humanitarian Foundation',
    slug: 'hope-horizon',
    sector: 'non-profit-orgs',
    memberTermSingular: 'Volunteer / Donor',
    memberTermPlural: 'Volunteers & Donors',
    spaceTermSingular: 'Relief Hub',
    spaceTermPlural: 'Relief Hubs & Food Pantries',
    city: 'Seattle',
    country: 'United States',
    contactEmail: 'info@hopehorizon.org',
    contactPhone: '+1 (206) 555-0199',
    accessPolicy: 'open',
    memberCountRange: '501 - 1,500',
    enabledModules: [
      'dashboard', 'members', 'events', 'volunteers', 'donations',
      'food-programs', 'auditoriums', 'seat-management', 'announcements', 'reports'
    ],
    subscription: {
      planId: 'growth',
      billingCycle: 'annual',
      amount: 1428,
      currency: 'USD ($)',
      status: 'active',
      startDate: '12 Jan 2026',
      nextBillingDate: '12 Jan 2027',
      paymentMethod: 'Charity Foundation Grant Fund'
    },
    primaryAdmin: {
      name: 'Dr. Miriam Patel',
      email: 'miriam@hopehorizon.org',
      roleTitle: 'Executive Director of Operations',
      phone: '+1 (206) 555-0180'
    }
  }
};

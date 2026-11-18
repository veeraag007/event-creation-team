import {
  CommunityEvent,
  PaymentTransaction,
  RefundRecord,
  Seat,
  Auditorium,
  SeatBlock,
  UserProfile
} from '../types';

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'ev-1',
    name: 'Diwali Grand Cultural & Arts Mahotsav 2026 (3-Day Multi-Session Festival)',
    category: 'Festival',
    date: '28 Sep - 30 Sep 2026',
    time: '3 Days • 5 Sessions • Multi-Venue',
    venue: 'Civic Auditorium, Kalakendra Amphitheatre & Sunset Meadow',
    venues: ['Main Auditorium', 'Grand Banquet Lawn', 'Open Promenade VIP Lounge'],
    bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    venueMap: {
      address: 'Grand Greenwood Boulevard, Gate 2, Sarjapur Main Road',
      landmark: 'Opposite Lakeview Tech Park Entrance',
      latitude: 12.9249,
      longitude: 77.6756,
      googleMapsUrl: 'https://maps.google.com/?q=12.9249,77.6756',
      gateEntrance: 'Gate 2 (East Boulevard)',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    registrations: 428,
    capacity: 500,
    revenue: 384500,
    pricePerSeat: 200,
    status: 'open',
    creationMode: 'advanced',
    audienceType: 'member_and_non_member',
    description: 'Annual flagship association gathering featuring executive elections, community award ceremonies, live entertainment and gala dinner.',
    hasSeatingMap: true,
    pricing: {
      memberAdult: 200,
      memberChild: 100,
      nonMemberAdult: 500,
      nonMemberChild: 250,
      isFreeForMembers: false,
      familyPackagePrice: 500
    },
    foodConfig: {
      type: 'paid_addon',
      mealTitle: 'Royal Multi-Cuisine Dinner Buffet',
      pricingMode: 'tiered',
      priceAdult: 350,
      priceChild: 200,
      memberPriceAdult: 300,
      memberPriceChild: 150,
      nonMemberPriceAdult: 450,
      nonMemberPriceChild: 250,
      dietaryOptions: ['Veg', 'Non-Veg', 'Jain'],
      cateringCutoffDate: '26 Sep 2026, 06:00 PM',
      catererName: 'Saffron Grand Caterers',
      notes: 'Live chaat counters, tandoori station, dum biryani and assortment of festive desserts.',
      menuCourses: [
        {
          course: 'Welcome Drinks & Starters',
          items: ['Paneer Tikka Angaar', 'Murgh Malai Kebab', 'Crispy Corn & Water Chestnuts', 'Fresh Mint Mojito', 'Guava Chilli Sip']
        },
        {
          course: 'Main Course Buffet',
          items: ['Paneer Butter Masala', 'Awadhi Chicken Biryani & Veg Dum Biryani', 'Dal Makhani Bukhara', 'Butter Naan, Roti & Laccha Paratha', 'Raita & Papad']
        },
        {
          course: 'Desserts & Sweet Showcase',
          items: ['Gulab Jamun with Rabdi', 'Live Artisan Kulfi Station', 'Warm Walnut Brownie with Gelato Ice Cream']
        }
      ]
    },
    parking: {
      enabled: true,
      zone: 'North Wing & Basement 2 Bays A-D',
      totalSlots: 180,
      slotsAvailable: 42,
      gate: 'Gate 2 (East Boulevard)',
      valet: true,
      evCharging: true,
      mapLocation: 'https://maps.google.com/?q=12.9716,77.5946',
      latitude: 12.9716,
      longitude: 77.5946,
      instructions: 'Display digital parking QR pass to security marshals at Gate 2. Valet desk near main portico.'
    },
    scheduleBlocks: [
      {
        id: 'blk-1',
        time: '06:00 PM - 06:45 PM',
        title: 'Welcome Drinks & Registration Check-in',
        venue: 'Grand Banquet Lawn',
        performerOrSpeaker: 'Welcome Hospitality Committee',
        description: 'Red carpet entry, digital badge scanning, welcome mocktails and photo booth.'
      },
      {
        id: 'blk-2',
        time: '06:45 PM - 08:00 PM',
        title: 'Presidential Address, Election Results & Cultural Acts',
        venue: 'Main Auditorium',
        performerOrSpeaker: 'Executive Board & Resident Artists',
        description: 'Annual report presentation, announcement of committee office bearers, and live classical fusion music.'
      },
      {
        id: 'blk-3',
        time: '08:00 PM - 09:30 PM',
        title: 'Royal Dinner Buffet & Live Acoustic Band',
        venue: 'Grand Banquet Lawn',
        performerOrSpeaker: 'The Bangalore Strings Ensemble',
        description: 'Multi-course dinner buffet, live cooking stations, and resident networking.'
      },
      {
        id: 'blk-4',
        time: '09:30 PM - 10:00 PM',
        title: 'Festive Fireworks Display & Vote of Thanks',
        venue: 'Open Promenade VIP Lounge',
        performerOrSpeaker: 'General Secretary',
        description: 'Eco-friendly sky lanterns and concluding thank-you ceremony.'
      }
    ],
    ticketChannels: ['whatsapp', 'email', 'sms', 'in_app'],
    rules: {
      allowNonMembers: true,
      maxGuestsPerMember: 4,
      childAgeLimit: 12,
      requireMemberIdCheck: true,
      earlyBirdDiscountPercent: 10,
      volunteerSlots: 12
    },
    // Multi-Session Core Model: Event -> Sessions -> Venue Spaces -> Inventory
    passOption: 'both',
    wholeEventPassPricing: {
      memberAdult: 850,
      memberChild: 450,
      nonMemberAdult: 1600,
      nonMemberChild: 850,
      isFreeForMembers: false,
      familyPackagePrice: 2200
    },
    wholeEventPassCapacity: 200,
    wholeEventPassSold: 165,
    uniqueAttendeesCount: 685,
    totalSessionRegistrationsCount: 1907,
    ownerName: 'Vikram Patel (Cultural Committee Chair)',
    sessions: [
      {
        id: 'sess-101',
        eventId: 'ev-1',
        name: 'Sitar & Sarod Maestro Recital (Ustad Zameer Khan)',
        description: 'Sublime evening classical sitar and sarod jugalbandi in the proscenium acoustics of the main hall.',
        date: '28 Sep 2026',
        startTime: '06:00 PM',
        endTime: '08:00 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-1',
        venueName: 'Main Civic Auditorium',
        spaceOrBlockId: 'Main Proscenium Hall',
        spaceName: 'Main Stage & Stalls',
        setupBufferMinutes: 45,
        teardownBufferMinutes: 30,
        attendanceMode: 'reserved_seating',
        venueOperatingLimit: 850,
        allocatedCapacity: 500,
        holds: { accessible: 12, staff: 16, sponsor: 20, safetyBuffer: 12 },
        sellableCapacity: 440,
        registrationsCount: 380,
        layoutVersion: 'v2.4 - Full Proscenium Standard',
        reservedBlockIds: ['blk-101', 'blk-102', 'blk-103'],
        audienceEligibility: 'member_and_non_member',
        isFree: false,
        pricing: {
          memberAdult: 300,
          memberChild: 150,
          nonMemberAdult: 600,
          nonMemberChild: 300,
          isFreeForMembers: false
        },
        registrationWindowStart: '01 Sep 2026',
        registrationWindowEnd: '28 Sep 2026, 05:00 PM',
        maxTicketsPerBooking: 6,
        status: 'published',
        auditLog: [
          {
            id: 'aud-s1',
            timestamp: '24 Sep 2026, 11:30 AM',
            action: 'Schedule Confirmed',
            author: 'Vikram Patel',
            changesSummary: 'Session published with 45m setup buffer and 3 reserved seat blocks allocated.',
            notifyAttendees: false
          }
        ]
      },
      {
        id: 'sess-102',
        eventId: 'ev-1',
        name: 'Classical Cinema & Heritage Retrospective: Satyajit Ray In Focus',
        description: 'Restored 4K print screening and resident panel discussion. Held in the same Civic Auditorium, but with general admission capacity seating (seat map hidden).',
        date: '28 Sep 2026',
        startTime: '08:30 PM',
        endTime: '10:30 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-1',
        venueName: 'Main Civic Auditorium',
        spaceOrBlockId: 'Cinema Screening Chamber',
        spaceName: 'Auditorium Hall (Floor & Balcony)',
        setupBufferMinutes: 30,
        teardownBufferMinutes: 30,
        attendanceMode: 'general_admission',
        venueOperatingLimit: 850,
        allocatedCapacity: 600,
        holds: { accessible: 10, staff: 10, sponsor: 10, safetyBuffer: 10 },
        sellableCapacity: 560,
        registrationsCount: 410,
        audienceEligibility: 'general',
        isFree: false,
        pricing: {
          memberAdult: 150,
          memberChild: 75,
          nonMemberAdult: 300,
          nonMemberChild: 150,
          isFreeForMembers: false
        },
        registrationWindowStart: '01 Sep 2026',
        registrationWindowEnd: '28 Sep 2026, 08:00 PM',
        status: 'published',
        auditLog: [
          {
            id: 'aud-s2',
            timestamp: '25 Sep 2026, 02:15 PM',
            action: 'Attendance Mode Configured',
            author: 'Facility Management Desk',
            changesSummary: 'Configured as General Admission mode. Seat map hidden for attendees.',
            notifyAttendees: false
          }
        ]
      },
      {
        id: 'sess-103',
        eventId: 'ev-1',
        name: 'Youth Folk Theatre & Dance: Yakshagana & Kathakali Showcase',
        description: 'Vibrant regional folk theatre under the stars. Lower stone steps are reserved seating, upper amphitheatre terrace is sold as general admission.',
        date: '29 Sep 2026',
        startTime: '05:30 PM',
        endTime: '08:00 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-2',
        venueName: 'Kalakendra Cultural Amphitheatre',
        spaceOrBlockId: 'Semi-Circular Thrust Stage',
        spaceName: 'Lower Stone Tier + Lawn Mound',
        setupBufferMinutes: 45,
        teardownBufferMinutes: 45,
        attendanceMode: 'mixed_seating',
        venueOperatingLimit: 350,
        allocatedCapacity: 320,
        holds: { accessible: 8, staff: 12, sponsor: 10, safetyBuffer: 10 },
        sellableCapacity: 280,
        registrationsCount: 245,
        layoutVersion: 'v1.8 - Radial Arc Stepped',
        reservedBlockIds: ['blk-201'],
        generalAdmissionCapacity: 180,
        audienceEligibility: 'member_and_non_member',
        isFree: false,
        pricing: {
          memberAdult: 250,
          memberChild: 120,
          nonMemberAdult: 450,
          nonMemberChild: 220,
          isFreeForMembers: false
        },
        status: 'published'
      },
      {
        id: 'sess-104',
        eventId: 'ev-1',
        name: 'Starlight Folk Fusion Concert & Multi-Cuisine Food Carnival',
        description: 'Festival grounds concert with live stage, food trucks, and artisan crafts. Managed as open space entry capacity without seat map.',
        date: '29 Sep 2026',
        startTime: '08:30 PM',
        endTime: '11:00 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-4',
        venueName: 'Sunset Meadow Festival Lawn',
        spaceOrBlockId: 'Main Meadow Arena',
        spaceName: 'Central Festival Grounds',
        setupBufferMinutes: 60,
        teardownBufferMinutes: 60,
        attendanceMode: 'open_space',
        venueOperatingLimit: 1200,
        allocatedCapacity: 1000,
        holds: { accessible: 20, staff: 30, sponsor: 30, safetyBuffer: 20 },
        sellableCapacity: 900,
        registrationsCount: 780,
        audienceEligibility: 'public',
        isFree: false,
        pricing: {
          memberAdult: 200,
          memberChild: 100,
          nonMemberAdult: 500,
          nonMemberChild: 250,
          isFreeForMembers: false
        },
        status: 'published'
      },
      {
        id: 'sess-105',
        eventId: 'ev-1',
        name: 'Morning Sunrise Pranayama & Sound Bath Meditation',
        description: 'Serene Sunday morning guided breathing and crystal singing bowl sound healing. Complimentary registration for society residents.',
        date: '30 Sep 2026',
        startTime: '06:30 AM',
        endTime: '08:00 AM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-4',
        venueName: 'Sunset Meadow Festival Lawn',
        spaceOrBlockId: 'Zen Pavilion & Shaded Pergola',
        spaceName: 'Morning Wellness Pavilion',
        setupBufferMinutes: 20,
        teardownBufferMinutes: 20,
        attendanceMode: 'registration_only',
        venueOperatingLimit: 200,
        allocatedCapacity: 120,
        holds: { accessible: 5, staff: 5, sponsor: 0, safetyBuffer: 5 },
        sellableCapacity: 105,
        registrationsCount: 92,
        audienceEligibility: 'only_member',
        isFree: true,
        pricing: {
          memberAdult: 0,
          memberChild: 0,
          nonMemberAdult: 0,
          nonMemberChild: 0,
          isFreeForMembers: true
        },
        status: 'published'
      }
    ],
    auditLog: [
      {
        id: 'aud-ev1-init',
        timestamp: '15 Sep 2026, 10:00 AM',
        action: 'Event Created',
        author: 'Vikram Patel',
        changesSummary: 'Created multi-session festival with 5 sessions across 3 venues.',
        notifyAttendees: false
      },
      {
        id: 'aud-ev1-pub',
        timestamp: '20 Sep 2026, 04:30 PM',
        action: 'Published Whole Event',
        author: 'Community Managing Committee',
        changesSummary: 'All sessions approved and published with whole-event pass enabled.',
        notifyAttendees: true,
        attendeesNotifiedCount: 685
      }
    ],
    attendeeStats: {
      memberAdults: 260,
      memberChildren: 88,
      nonMemberAdults: 56,
      nonMemberChildren: 24
    },
    foodStats: {
      adultMeals: 295,
      childMeals: 98,
      vegMeals: 254,
      nonVegMeals: 115,
      jainMeals: 24,
      veganMeals: 0
    },
    registrationsList: [
      {
        id: 'reg-101',
        eventId: 'ev-1',
        registeredByName: 'Raj Kumar',
        contactEmail: 'raj.kumar@greenwood.org',
        contactPhone: '+91 98450 23145',
        memberId: 'MEM-10284',
        isMember: true,
        adultsCount: 2,
        childrenCount: 2,
        foodOpted: true,
        adultMeals: 2,
        childMeals: 2,
        dietaryPreference: 'Veg',
        ticketPricePaid: 850,
        foodPricePaid: 1100,
        totalPaid: 1950,
        paymentStatus: 'paid',
        registrationDate: '15 Sep 2026',
        ticketCode: 'TKT-EV1-0421',
        specialRequests: 'Elderly guest seating requested near aisle',
        qrCodeData: 'EV1-TKT-0421|MEM-10284|RAJKUMAR|PASS:WHOLE-EVENT|SESS:ALL-5|FOOD:2AD+2CH-VEG|PARK:B2-048',
        deliveryChannels: ['whatsapp', 'email', 'in_app'],
        checkInStatus: 'checked_in',
        checkInTime: '06:12 PM',
        assignedSeat: 'Balcony Row A (Seats 12, 13)',
        parkingPassNumber: 'PARK-B2-048',
        passType: 'whole_event',
        sessionIds: ['sess-101', 'sess-102', 'sess-103', 'sess-104', 'sess-105'],
        assignedSeatsBySession: {
          'sess-101': 'Balcony Row A (Seats 12, 13)',
          'sess-103': 'Stone Pit Tier A (Seats 4, 5)'
        }
      },
      {
        id: 'reg-102',
        eventId: 'ev-1',
        registeredByName: 'Sunita Patel (Guest of Priya Sharma)',
        contactEmail: 'sunita.patel@designstudio.io',
        contactPhone: '+91 98860 11239',
        isMember: false,
        adultsCount: 2,
        childrenCount: 1,
        foodOpted: true,
        adultMeals: 2,
        childMeals: 1,
        dietaryPreference: 'Jain',
        ticketPricePaid: 1250,
        foodPricePaid: 900,
        totalPaid: 2150,
        paymentStatus: 'paid',
        registrationDate: '18 Sep 2026',
        ticketCode: 'TKT-EV1-0422',
        qrCodeData: 'EV1-TKT-0422|GUEST|SUNITAPATEL|PASS:SESSION|SESS:101|SEAT:FLOOR-C05|FOOD:2AD+1CH-JAIN|PARK:B2-092',
        deliveryChannels: ['whatsapp', 'sms'],
        checkInStatus: 'pending',
        assignedSeat: 'Floor Row C (Seats 5, 6, 7)',
        parkingPassNumber: 'PARK-B2-092',
        passType: 'session',
        sessionIds: ['sess-101'],
        assignedSeatsBySession: {
          'sess-101': 'Floor Row C (Seats 5, 6, 7)'
        }
      },
      {
        id: 'reg-103',
        eventId: 'ev-1',
        registeredByName: 'Vikram Malhotra',
        contactEmail: 'vikram.m@lawchambers.in',
        contactPhone: '+91 94480 77610',
        memberId: 'MEM-10288',
        isMember: true,
        adultsCount: 1,
        childrenCount: 0,
        foodOpted: false,
        adultMeals: 0,
        childMeals: 0,
        dietaryPreference: 'Veg',
        ticketPricePaid: 300,
        foodPricePaid: 0,
        totalPaid: 300,
        paymentStatus: 'paid',
        registrationDate: '20 Sep 2026',
        ticketCode: 'TKT-EV1-0423',
        qrCodeData: 'EV1-TKT-0423|MEM-10288|VIKRAMM|PASS:SESSION|SESS:101,102|SEAT:VIP-B01|NOFOOD|PARK:VALET-V09',
        deliveryChannels: ['email', 'in_app'],
        checkInStatus: 'checked_in',
        checkInTime: '06:28 PM',
        assignedSeat: 'VIP Box Row B (Seat 1)',
        parkingPassNumber: 'PARK-VALET-V09',
        passType: 'session',
        sessionIds: ['sess-101', 'sess-102'],
        assignedSeatsBySession: {
          'sess-101': 'VIP Box Row B (Seat 1)'
        }
      }
    ]
  },
  {
    id: 'ev-2',
    name: 'Independence Day Community Breakfast & Flag Hoisting',
    category: 'Festival',
    date: '15 Aug 2026',
    time: '8:00 AM - 11:30 AM',
    venue: 'Central Amphitheatre & Lawns',
    venues: ['Central Amphitheatre', 'North Promenade Lawns', 'Clubhouse Veranda'],
    bannerUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80',
    venueMap: {
      address: 'Central Amphitheatre & Greens, Greenwood Meadows Avenue 1',
      landmark: 'Next to Clubhouse Pavilion & Fountain',
      latitude: 12.9255,
      longitude: 77.6762,
      googleMapsUrl: 'https://maps.google.com/?q=12.9255,77.6762',
      gateEntrance: 'Gate 1 (Main Entrance)',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    registrations: 340,
    capacity: 400,
    revenue: 12000,
    pricePerSeat: 0,
    status: 'open',
    creationMode: 'simple',
    audienceType: 'only_member',
    description: 'Ceremonial flag hoisting followed by cultural patriotic songs and complimentary traditional South/North Indian breakfast buffet. Headcount required for kitchen prep.',
    hasSeatingMap: false,
    pricing: {
      memberAdult: 0,
      memberChild: 0,
      nonMemberAdult: 150,
      nonMemberChild: 75,
      isFreeForMembers: true
    },
    foodConfig: {
      type: 'free_with_count',
      mealTitle: 'Complimentary Community Breakfast Buffet',
      pricingMode: 'common',
      priceAdult: 0,
      priceChild: 0,
      dietaryOptions: ['Veg', 'Jain'],
      cateringCutoffDate: '13 Aug 2026, 08:00 PM',
      catererName: 'Annapurna Kitchen Services',
      notes: 'Food is 100% FREE for members and guests. Exact head-count of adults and children required to avoid food wastage.',
      menuCourses: [
        {
          course: 'Hot Breakfast Counter',
          items: ['Ghee Roast Idli & Medu Vada', 'Crispy Masala Dosa Live Counter', 'Poha with Roasted Peanuts', 'Upma & Sheera']
        },
        {
          course: 'Accompaniments & Beverages',
          items: ['Coconut Chutney (Green & Red)', 'Drumstick Sambar', 'Filter Coffee & Masala Chai', 'Fresh Tender Coconut Water']
        }
      ]
    },
    parking: {
      enabled: true,
      zone: 'East Lawn Open Bay & Clubhouse Surface Parking',
      totalSlots: 120,
      slotsAvailable: 85,
      gate: 'Gate 1 (Main Entrance)',
      valet: false,
      evCharging: true,
      mapLocation: 'https://maps.google.com/?q=12.9720,77.5950',
      latitude: 12.9720,
      longitude: 77.5950,
      instructions: 'Self-parking in open marked bays. Golf cart shuttles available for seniors from Gate 1.'
    },
    scheduleBlocks: [
      {
        id: 'blk-201',
        time: '08:00 AM - 08:30 AM',
        title: 'Community Assembly & Flag Hoisting Ceremony',
        venue: 'Central Amphitheatre',
        performerOrSpeaker: 'Community President & Veterans',
        description: 'National anthem, unfurling of the tricolor, and marching parade by youth cadet corps.'
      },
      {
        id: 'blk-202',
        time: '08:30 AM - 09:15 AM',
        title: 'Patriotic Songs & Resident Dance Performances',
        venue: 'Central Amphitheatre',
        performerOrSpeaker: 'Cultural Youth Troupe',
        description: 'Tribute medley to freedom fighters and traditional classical dances.'
      },
      {
        id: 'blk-203',
        time: '09:15 AM - 11:30 AM',
        title: 'Community Breakfast Buffet & Social Networking',
        venue: 'North Promenade Lawns',
        performerOrSpeaker: 'Annapurna Catering Guild',
        description: 'Hot breakfast buffet and live tea stations.'
      }
    ],
    ticketChannels: ['whatsapp', 'in_app'],
    rules: {
      allowNonMembers: false,
      maxGuestsPerMember: 0,
      childAgeLimit: 10,
      requireMemberIdCheck: true,
      volunteerSlots: 8
    },
    passOption: 'session_pass',
    uniqueAttendeesCount: 340,
    totalSessionRegistrationsCount: 340,
    ownerName: 'Dr. Meenakshi Sundaram (Civic Cell)',
    sessions: [
      {
        id: 'sess-201',
        eventId: 'ev-2',
        name: 'Ceremonial Flag Hoisting & Patriotic Cultural Morning',
        description: 'Tricolor unfurling, national anthem, freedom choir by youth group, followed by open seating breakfast.',
        date: '15 Aug 2026',
        startTime: '08:00 AM',
        endTime: '11:30 AM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-2',
        venueName: 'Central Amphitheatre & Greens',
        spaceOrBlockId: 'Amphitheatre Dais & Lawn',
        spaceName: 'Central Amphitheatre Stage & Lawns',
        setupBufferMinutes: 30,
        teardownBufferMinutes: 30,
        attendanceMode: 'open_space',
        venueOperatingLimit: 400,
        allocatedCapacity: 400,
        holds: { accessible: 10, staff: 20, sponsor: 0, safetyBuffer: 10 },
        sellableCapacity: 360,
        registrationsCount: 340,
        audienceEligibility: 'only_member',
        isFree: true,
        pricing: {
          memberAdult: 0,
          memberChild: 0,
          nonMemberAdult: 150,
          nonMemberChild: 75,
          isFreeForMembers: true
        },
        status: 'published'
      }
    ],
    attendeeStats: {
      memberAdults: 215,
      memberChildren: 75,
      nonMemberAdults: 35,
      nonMemberChildren: 15
    },
    foodStats: {
      adultMeals: 245,
      childMeals: 85,
      vegMeals: 298,
      nonVegMeals: 0,
      jainMeals: 32,
      veganMeals: 0
    },
    registrationsList: [
      {
        id: 'reg-201',
        eventId: 'ev-2',
        registeredByName: 'Dr. Meenakshi Sundaram',
        contactEmail: 'meenakshi.s@heritagehospital.org',
        contactPhone: '+91 94801 33499',
        memberId: 'MEM-10289',
        isMember: true,
        adultsCount: 2,
        childrenCount: 0,
        foodOpted: true,
        adultMeals: 2,
        childMeals: 0,
        dietaryPreference: 'Jain',
        ticketPricePaid: 0,
        foodPricePaid: 0,
        totalPaid: 0,
        paymentStatus: 'complimentary',
        registrationDate: '10 Aug 2026',
        ticketCode: 'TKT-EV2-0105',
        qrCodeData: 'EV2-TKT-0105|MEM-10289|DRMEENAKSHI|FREE-BREAKFAST-2AD-JAIN|PARK:G1-SURFACE',
        deliveryChannels: ['whatsapp', 'in_app'],
        checkInStatus: 'checked_in',
        checkInTime: '07:55 AM',
        parkingPassNumber: 'PARK-G1-018',
        passType: 'session',
        sessionIds: ['sess-201']
      }
    ]
  },
  {
    id: 'ev-3',
    name: 'Youth Classical Fusion & Musical Night',
    category: 'Cultural',
    date: '12 Oct 2026',
    time: '7:00 PM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    venues: ['Open Air Amphitheatre', 'Clubhouse Veranda'],
    bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
    venueMap: {
      address: 'Open Air Amphitheatre, South Pavilion, Phase 2',
      landmark: 'Behind Olympic Swimming Pool',
      latitude: 12.9238,
      longitude: 77.6749,
      googleMapsUrl: 'https://maps.google.com/?q=12.9238,77.6749',
      gateEntrance: 'Gate 3 (South Pavilion)',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    registrations: 215,
    capacity: 350,
    revenue: 96500,
    pricePerSeat: 350,
    status: 'published',
    audienceType: 'general',
    description: 'An evening of classical Indian ragas harmonized with modern acoustic rhythm ensembles. Ticket price includes gourmet Hi-Tea and refreshment hamper.',
    hasSeatingMap: true,
    pricing: {
      memberAdult: 350,
      memberChild: 200,
      nonMemberAdult: 650,
      nonMemberChild: 350,
      isFreeForMembers: false,
      familyPackagePrice: 900
    },
    foodConfig: {
      type: 'included_in_ticket',
      mealTitle: 'Gourmet Hi-Tea & Evening Snack Hamper (Included)',
      priceAdult: 0,
      priceChild: 0,
      dietaryOptions: ['Veg', 'Non-Veg', 'Jain', 'Vegan'],
      cateringCutoffDate: '10 Oct 2026, 05:00 PM',
      catererName: 'Artisan Bakers & Delights',
      notes: 'Included with every adult & child ticket. Select dietary preference during checkout.'
    },
    rules: {
      allowNonMembers: true,
      maxGuestsPerMember: 6,
      childAgeLimit: 14,
      requireMemberIdCheck: true,
      earlyBirdDiscountPercent: 15,
      volunteerSlots: 6
    },
    passOption: 'session_pass',
    uniqueAttendeesCount: 215,
    totalSessionRegistrationsCount: 215,
    ownerName: 'Sunita Rao (Youth Arts Coordinator)',
    sessions: [
      {
        id: 'sess-301',
        eventId: 'ev-3',
        name: 'Classical Fusion Acoustic Concert',
        description: 'Sitar, tabla, cello, and percussion synthesis under the evening stars.',
        date: '12 Oct 2026',
        startTime: '07:00 PM',
        endTime: '10:00 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-2',
        venueName: 'Kalakendra Cultural Amphitheatre',
        spaceOrBlockId: 'Concentric Stone Tiers',
        spaceName: 'Amphitheatre Pit & Upper Lawn',
        setupBufferMinutes: 45,
        teardownBufferMinutes: 30,
        attendanceMode: 'mixed_seating',
        venueOperatingLimit: 350,
        allocatedCapacity: 350,
        holds: { accessible: 10, staff: 15, sponsor: 15, safetyBuffer: 10 },
        sellableCapacity: 300,
        registrationsCount: 215,
        reservedBlockIds: ['blk-201'],
        generalAdmissionCapacity: 150,
        audienceEligibility: 'general',
        isFree: false,
        pricing: {
          memberAdult: 350,
          memberChild: 200,
          nonMemberAdult: 650,
          nonMemberChild: 350,
          isFreeForMembers: false
        },
        status: 'published'
      }
    ],
    attendeeStats: {
      memberAdults: 140,
      memberChildren: 45,
      nonMemberAdults: 22,
      nonMemberChildren: 8
    },
    foodStats: {
      adultMeals: 162,
      childMeals: 53,
      vegMeals: 145,
      nonVegMeals: 50,
      jainMeals: 15,
      veganMeals: 5
    }
  },
  {
    id: 'ev-4',
    name: 'Kids Robotics & STEM Weekend Workshop',
    category: 'Workshop',
    date: '18 Oct 2026',
    time: '9:30 AM - 1:30 PM',
    venue: 'Clubhouse Activity Hall 1',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    venueMap: {
      address: 'Clubhouse First Floor, Activity Hall 1, Main Avenue',
      landmark: 'Next to Indoor Badminton Complex',
      latitude: 12.9261,
      longitude: 77.6770,
      googleMapsUrl: 'https://maps.google.com/?q=12.9261,77.6770',
      gateEntrance: 'Gate 1 (Clubhouse Entrance)',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    registrations: 45,
    capacity: 60,
    revenue: 27000,
    pricePerSeat: 600,
    status: 'open',
    audienceType: 'only_member',
    description: 'Hands-on robotics, drone basics, and block coding for juniors aged 6-14. Members only program. Includes nutritious snack box and kid drink.',
    hasSeatingMap: false,
    pricing: {
      memberAdult: 0,
      memberChild: 600,
      nonMemberAdult: 0,
      nonMemberChild: 0,
      isFreeForMembers: false
    },
    foodConfig: {
      type: 'free_with_count',
      mealTitle: 'Junior STEM Snack Box & Fresh Fruit Smoothie',
      priceAdult: 0,
      priceChild: 0,
      dietaryOptions: ['Veg', 'Jain'],
      cateringCutoffDate: '17 Oct 2026, 12:00 PM',
      catererName: 'FreshBites Kids Kitchen',
      notes: 'Free snack pack for each registered child participant. Accompanied guardian snacks self-service at cafeteria.'
    },
    rules: {
      allowNonMembers: false,
      maxGuestsPerMember: 0,
      childAgeLimit: 14,
      requireMemberIdCheck: true
    },
    passOption: 'session_pass',
    uniqueAttendeesCount: 45,
    totalSessionRegistrationsCount: 45,
    ownerName: 'STEM Club Mentors',
    sessions: [
      {
        id: 'sess-401',
        eventId: 'ev-4',
        name: 'Junior Robotics Lab: Autonomous Rover Building',
        description: 'Microcontroller programming, ultrasonic sensors, and chassis assembly.',
        date: '18 Oct 2026',
        startTime: '09:30 AM',
        endTime: '01:30 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-3',
        venueName: 'Clubhouse Activity Hall 1',
        spaceOrBlockId: 'STEM Maker Studio',
        spaceName: 'Activity Hall 1',
        setupBufferMinutes: 30,
        teardownBufferMinutes: 30,
        attendanceMode: 'registration_only',
        venueOperatingLimit: 60,
        allocatedCapacity: 60,
        holds: { accessible: 2, staff: 4, sponsor: 0, safetyBuffer: 2 },
        sellableCapacity: 52,
        registrationsCount: 45,
        audienceEligibility: 'only_member',
        isFree: false,
        pricing: {
          memberAdult: 0,
          memberChild: 600,
          nonMemberAdult: 0,
          nonMemberChild: 0,
          isFreeForMembers: false
        },
        status: 'published'
      }
    ],
    attendeeStats: {
      memberAdults: 42,
      memberChildren: 45,
      nonMemberAdults: 0,
      nonMemberChildren: 0
    },
    foodStats: {
      adultMeals: 0,
      childMeals: 45,
      vegMeals: 41,
      nonVegMeals: 0,
      jainMeals: 4,
      veganMeals: 0
    }
  },
  {
    id: 'ev-5',
    name: 'Diwali Lantern Festival & Artisan Street Food Bazaar',
    category: 'Festival',
    date: '31 Oct 2026',
    time: '5:30 PM - 10:30 PM',
    venue: 'Central Promenade & Greens',
    bannerUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=200&q=80',
    venueMap: {
      address: 'Central Promenade & Greens, East Walkway',
      landmark: 'Between Tower B and Community Gazebo',
      latitude: 12.9242,
      longitude: 77.6752,
      googleMapsUrl: 'https://maps.google.com/?q=12.9242,77.6752',
      gateEntrance: 'Gate 2 & Pedestrian Gate 4',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    registrations: 620,
    capacity: 800,
    revenue: 82000,
    pricePerSeat: 100,
    status: 'draft',
    audienceType: 'public',
    description: 'Traditional artisan pop-ups, eco-friendly fireworks display, live folk dancers and self-service food stalls across the promenade.',
    hasSeatingMap: false,
    pricing: {
      memberAdult: 100,
      memberChild: 50,
      nonMemberAdult: 250,
      nonMemberChild: 125,
      isFreeForMembers: false
    },
    foodConfig: {
      type: 'none',
      mealTitle: 'Self-Serve Independent Food Stalls',
      dietaryOptions: ['Veg', 'Non-Veg', 'Jain'],
      notes: 'No central catering provided. Over 15 artisan food trucks and stalls available on direct pay-as-you-eat basis.'
    },
    rules: {
      allowNonMembers: true,
      maxGuestsPerMember: 10,
      childAgeLimit: 12,
      requireMemberIdCheck: false
    },
    passOption: 'session_pass',
    uniqueAttendeesCount: 620,
    totalSessionRegistrationsCount: 620,
    ownerName: 'Community Cultural Guild',
    sessions: [
      {
        id: 'sess-501',
        eventId: 'ev-5',
        name: 'Lantern Illumination, Bazaar & Starlight Fireworks',
        description: 'Open promenade gathering with 1500 eco-lanterns released over the central reflecting pond.',
        date: '31 Oct 2026',
        startTime: '05:30 PM',
        endTime: '10:30 PM',
        timezone: 'IST (UTC+5:30)',
        venueId: 'fac-aud-4',
        venueName: 'Central Promenade & Greens',
        spaceOrBlockId: 'Promenade Strip',
        spaceName: 'Central Promenade Walking Plaza',
        setupBufferMinutes: 60,
        teardownBufferMinutes: 60,
        attendanceMode: 'open_space',
        venueOperatingLimit: 800,
        allocatedCapacity: 800,
        holds: { accessible: 20, staff: 30, sponsor: 20, safetyBuffer: 30 },
        sellableCapacity: 700,
        registrationsCount: 620,
        audienceEligibility: 'public',
        isFree: false,
        pricing: {
          memberAdult: 100,
          memberChild: 50,
          nonMemberAdult: 250,
          nonMemberChild: 125,
          isFreeForMembers: false
        },
        status: 'draft'
      }
    ],
    attendeeStats: {
      memberAdults: 380,
      memberChildren: 140,
      nonMemberAdults: 70,
      nonMemberChildren: 30
    },
    foodStats: {
      adultMeals: 0,
      childMeals: 0,
      vegMeals: 0,
      nonVegMeals: 0,
      jainMeals: 0,
      veganMeals: 0
    }
  }
];


export const INITIAL_AUDITORIUMS: Auditorium[] = [
  {
    id: 'fac-aud-1',
    name: 'Main Civic Auditorium',
    code: 'AUD-MAIN-850',
    venueType: 'auditorium',
    seatingTopology: 'standard_grid',
    capacity: 850,
    location: 'Central Cultural & Civic Complex, Level 1 & 2',
    todayBookings: 3,
    utilization: 91,
    revenueMonthly: 284000,
    hourlyRate: 4000,
    minBookingHours: 3,
    securityDeposit: 25000,
    status: 'operational',
    stageDimensions: '18m x 12m Proscenium Stage with Motorized Rigging & Orchestra Pit',
    stageType: 'proscenium',
    acousticRating: 'ISO 3382 Acoustic Certified (RT60: 0.95s)',
    greenRoomsCount: 4,
    lightingSystem: 'Motorized DMX LED Moving Heads & Followspots',
    facilities: [
      'Laser Projector 4K Ultra-HD with Cinema Scope',
      'Dolby Atmos 7.1.4 Surround Sound Array',
      'Motorized Hydraulic Stage & Fly Tower',
      'Central Climate Control & HEPA Filtration',
      'VIP Green Rooms (x4) with Ensuite Showers',
      'Live 4K Broadcast Cabling & Audio Matrix'
    ],
    rules: 'Sound amplification must conclude by 10:00 PM per municipal environmental guidelines. Statutory security deposit of ₹25,000 required for non-resident events.',
    operatingSafetyLimit: 850,
    setupBufferMinutesDefault: 45,
    teardownBufferMinutesDefault: 30,
    rentalTariffHourly: 4000,
    rentalTariffDaily: 32000,
    layoutVersions: [
      {
        id: 'lay-101',
        version: 'v2.4',
        name: 'Full Proscenium Standard (Orchestra + Balcony + Boxes)',
        isDefault: true,
        totalSeats: 850,
        description: 'Complete multi-tier seating configuration for flagship productions.'
      },
      {
        id: 'lay-102',
        version: 'v2.1',
        name: 'Intimate Lower Stalls Only (Balconies Curtained)',
        isDefault: false,
        totalSeats: 480,
        description: 'Acoustically condensed for medium-sized lectures and recitals.'
      }
    ],
    blocks: [
      {
        id: 'blk-101',
        auditoriumId: 'fac-aud-1',
        name: 'Front Stalls (Platinum)',
        tier: 'floor',
        level: 'Ground Level - Orchestra',
        startRow: 'A',
        rowCount: 3,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Platinum',
        basePrice: 1500,
        totalSeats: 36,
        status: 'active',
        elevation: 1,
        colorTheme: 'indigo',
        description: 'Closest stage proximity with direct sightline and plush velvet orchestra armchairs.',
        wheelchairAccessible: true
      },
      {
        id: 'blk-102',
        auditoriumId: 'fac-aud-1',
        name: 'Rear Stalls (Gold)',
        tier: 'floor',
        level: 'Ground Level - Mid Floor',
        startRow: 'D',
        rowCount: 4,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Gold',
        basePrice: 900,
        totalSeats: 48,
        status: 'active',
        elevation: 1,
        colorTheme: 'amber',
        description: 'Central auditorium seating with balanced sound dispersion and convenient dual aisle exits.',
        wheelchairAccessible: true
      },
      {
        id: 'blk-103',
        auditoriumId: 'fac-aud-1',
        name: 'Grand Balcony Tier 1',
        tier: 'balcony',
        level: 'Level 1 Overhang (Elevated)',
        startRow: 'H',
        rowCount: 4,
        seatsPerRow: 14,
        aislePositions: [4, 10],
        pricingCategory: 'Premium',
        basePrice: 1200,
        totalSeats: 56,
        status: 'active',
        elevation: 2,
        hasBalconyRailing: true,
        colorTheme: 'purple',
        description: 'Elevated cantilevered balcony tier offering sweeping proscenium view with padded safety railing.',
        wheelchairAccessible: false
      },
      {
        id: 'blk-104',
        auditoriumId: 'fac-aud-1',
        name: 'Upper Balcony Gallery',
        tier: 'balcony',
        level: 'Level 2 Upper Tier',
        startRow: 'M',
        rowCount: 3,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Silver',
        basePrice: 650,
        totalSeats: 36,
        status: 'active',
        elevation: 3,
        hasBalconyRailing: true,
        colorTheme: 'teal',
        description: 'Tiered amphitheatre-style upper balcony with direct surround sound immersion.',
        wheelchairAccessible: false
      },
      {
        id: 'blk-105',
        auditoriumId: 'fac-aud-1',
        name: 'Royal VIP Balcony Box',
        tier: 'vip_box',
        level: 'Level 1 Wing Box',
        startRow: 'V',
        rowCount: 2,
        seatsPerRow: 6,
        aislePositions: [3],
        pricingCategory: 'VIP',
        basePrice: 2400,
        totalSeats: 12,
        status: 'active',
        elevation: 2,
        hasBalconyRailing: true,
        colorTheme: 'rose',
        description: 'Exclusive private box tier flanking the stage with butler service access and velvet curtain dividers.',
        wheelchairAccessible: false
      }
    ]
  },
  {
    id: 'fac-aud-2',
    name: 'Kalakendra Cultural Amphitheatre',
    code: 'AUD-AMPHI-350',
    venueType: 'open_theatre',
    seatingTopology: 'radial_arc',
    capacity: 350,
    lawnCapacity: 120,
    location: 'North Garden Pavilion & Lake Courtyard',
    todayBookings: 1,
    utilization: 74,
    revenueMonthly: 142000,
    hourlyRate: 2500,
    minBookingHours: 2,
    securityDeposit: 15000,
    status: 'operational',
    stageDimensions: '16m x 12m Semi-Circular Natural Stone Dais with Granite Acoustic Backdrop',
    stageType: 'semi_circular_thrust',
    acousticRating: 'Acoustic Shell Amplified (Ambient Optimized)',
    greenRoomsCount: 2,
    lightingSystem: 'Architectural Wash Lighting, Low-Voltage Warm Bollards & Canopy Fairy Lights',
    weatherContingency: {
      hasRetractableCanopy: true,
      rainFallbackVenue: 'Main Civic Auditorium',
      sunsetOrientation: 'Facing West (Sunset View)',
      windProtection: true
    },
    facilities: [
      'High-Lumen Architectural Wash Lighting & Dimmer Bank',
      'Weather-resistant JBL Outdoor Acoustic Line Arrays',
      'Semi-Circular Natural Granite Stone Tiering (140° Arc)',
      'Greenroom Gazebo with Private Washrooms (x2)',
      'Motorized Starlight Retractable Rain Canopy',
      'Ambient Fire-Pits & Evening Flame Torches'
    ],
    rules: 'Evening cultural events permitted up to 10:30 PM with low-frequency acoustic limiter activated. Biodegradable props and zero open litter strictly enforced.',
    operatingSafetyLimit: 350,
    setupBufferMinutesDefault: 45,
    teardownBufferMinutesDefault: 45,
    rentalTariffHourly: 2500,
    rentalTariffDaily: 20000,
    layoutVersions: [
      {
        id: 'lay-201',
        version: 'v1.8',
        name: 'Radial Arc Stepped (Stone Pit + Terrace)',
        isDefault: true,
        totalSeats: 350,
        description: 'Standard natural amphitheatre setup with acoustic thrust shell.'
      }
    ],
    blocks: [
      {
        id: 'blk-201',
        auditoriumId: 'fac-aud-2',
        name: 'Lower Stone Stepped Pit (Tiers A-C)',
        tier: 'stone_steps',
        level: 'Stone Pit Amphitheatre Ground',
        startRow: 'A',
        rowCount: 3,
        seatsPerRow: 10,
        aislePositions: [5],
        pricingCategory: 'Platinum',
        basePrice: 1000,
        totalSeats: 30,
        status: 'active',
        elevation: 1,
        curvatureAngle: 130,
        seatingMaterial: 'Handcrafted Polished Granite Stone Bench with Cushioning',
        colorTheme: 'indigo',
        description: 'Direct semi-circular stone steps embracing the thrust stage with 130° radial sweep.',
        wheelchairAccessible: true
      },
      {
        id: 'blk-202',
        auditoriumId: 'fac-aud-2',
        name: 'Concentric Amphitheatre Arc (Tiers D-F)',
        tier: 'amphitheatre_tier',
        level: 'Middle Terrace Tier',
        startRow: 'D',
        rowCount: 3,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Gold',
        basePrice: 850,
        totalSeats: 36,
        status: 'active',
        elevation: 2,
        curvatureAngle: 150,
        seatingMaterial: 'Teakwood Slatted Curved Arc Benches',
        hasBalconyRailing: true,
        colorTheme: 'amber',
        description: 'Elevated concentric semi-circle arc rows with unobstructed panoramic sightlines.',
        wheelchairAccessible: false
      },
      {
        id: 'blk-203',
        auditoriumId: 'fac-aud-2',
        name: 'Upper Starlight Terrace & Lawn Steps',
        tier: 'lawn_mound',
        level: 'Upper Garden Tier',
        startRow: 'G',
        rowCount: 2,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Silver',
        basePrice: 500,
        totalSeats: 24,
        status: 'active',
        elevation: 3,
        curvatureAngle: 160,
        seatingMaterial: 'Stepped Grass Mound & Picnic Terrace (Blanket Seating)',
        hasBalconyRailing: false,
        colorTheme: 'emerald',
        description: 'Upper terrace adjacent to picnic lawn perimeter with starlight canopy views.',
        wheelchairAccessible: false
      }
    ]
  },
  {
    id: 'fac-aud-3',
    name: 'Silver Jubilee Recital Hall',
    code: 'AUD-CHAMBER-200',
    venueType: 'auditorium',
    seatingTopology: 'standard_grid',
    capacity: 200,
    location: 'Clubhouse West Wing, 2nd Floor',
    todayBookings: 2,
    utilization: 68,
    revenueMonthly: 96000,
    hourlyRate: 1800,
    minBookingHours: 2,
    securityDeposit: 10000,
    status: 'operational',
    stageDimensions: '10m x 6m Acoustic Chamber Platform with Steinway Grand Piano',
    stageType: 'in_the_round',
    acousticRating: 'Wood Acoustic Panelled Chamber (RT60: 1.1s Classical)',
    greenRoomsCount: 1,
    lightingSystem: 'Acoustic Ceiling Warm Spotlights',
    facilities: [
      'Steinway Concert Model D Grand Piano',
      'Acoustic Wooden Diffuser Panelling',
      'Crestron Integrated Conference & AV Switcher',
      'High-Definition PTZ Robotic Streaming Cameras'
    ],
    rules: 'Strictly classical music, chamber recitals, townhalls, and academic seminars only.',
    blocks: [
      {
        id: 'blk-301',
        auditoriumId: 'fac-aud-3',
        name: 'Chamber Stalls (Ground)',
        tier: 'floor',
        level: 'Chamber Floor',
        startRow: 'A',
        rowCount: 4,
        seatsPerRow: 8,
        aislePositions: [4],
        pricingCategory: 'Silver',
        basePrice: 600,
        totalSeats: 32,
        status: 'active',
        elevation: 1,
        colorTheme: 'indigo',
        description: 'Intimate acoustic listening seating on parquet floor.',
        wheelchairAccessible: true
      },
      {
        id: 'blk-302',
        auditoriumId: 'fac-aud-3',
        name: 'Mezzanine Balcony Gallery',
        tier: 'balcony',
        level: 'Level 2 Mezzanine',
        startRow: 'E',
        rowCount: 2,
        seatsPerRow: 10,
        aislePositions: [5],
        pricingCategory: 'Gold',
        basePrice: 900,
        totalSeats: 20,
        status: 'active',
        elevation: 2,
        hasBalconyRailing: true,
        colorTheme: 'purple',
        description: 'Overlooking mezzanine balcony with brass balustrade railing.',
        wheelchairAccessible: false
      }
    ]
  },
  {
    id: 'fac-aud-4',
    name: 'Sunset Meadow Open Theatre & Pavilion',
    code: 'OAT-MEADOW-450',
    venueType: 'open_theatre',
    seatingTopology: 'radial_arc',
    capacity: 450,
    lawnCapacity: 200,
    location: 'South Lake Promenade & Pine Grove Lawn',
    todayBookings: 0,
    utilization: 52,
    revenueMonthly: 110000,
    hourlyRate: 2200,
    minBookingHours: 3,
    securityDeposit: 18000,
    status: 'operational',
    stageDimensions: '15m x 10m Wooden Deck Thrust Stage on Water Edge',
    stageType: 'semi_circular_thrust',
    acousticRating: 'Natural Ambient Amphitheatre Bowl with Water Reflection',
    greenRoomsCount: 2,
    lightingSystem: 'Solar-Assisted Sunset Dimmers & LED Tree Uplights',
    weatherContingency: {
      hasRetractableCanopy: false,
      rainFallbackVenue: 'Silver Jubilee Recital Hall',
      sunsetOrientation: 'Facing West (Direct Sunset Panorama)',
      windProtection: true
    },
    facilities: [
      'Wooden Stage Deck Extending Over Lake Edge',
      'Stepped Grass Bowl Seating with Natural Acoustic Mound',
      'Acoustic Delay Towers for Rear Meadow Sound',
      'Food Truck & Refreshment Kiosk Bays (x4)',
      'Solar-Powered Night Walkway Illumination'
    ],
    rules: 'Unplugged acoustic performances, theatre drama, sunset poetry, and yoga festivals. Sound levels restricted after 10:00 PM.',
    blocks: [
      {
        id: 'blk-401',
        auditoriumId: 'fac-aud-4',
        name: 'Lakeside Radial Deck (Tiers A-C)',
        tier: 'amphitheatre_tier',
        level: 'Boardwalk Level',
        startRow: 'A',
        rowCount: 3,
        seatsPerRow: 12,
        aislePositions: [6],
        pricingCategory: 'Platinum',
        basePrice: 750,
        totalSeats: 36,
        status: 'active',
        elevation: 1,
        curvatureAngle: 140,
        seatingMaterial: 'Weatherproof Teakwood Benches',
        colorTheme: 'teal',
        description: 'Front radial curve benches with direct lake breeze and thrust stage sightline.',
        wheelchairAccessible: true
      },
      {
        id: 'blk-402',
        auditoriumId: 'fac-aud-4',
        name: 'Stepped Grass Terrace (Tiers D-F)',
        tier: 'stone_steps',
        level: 'Natural Mound Slope',
        startRow: 'D',
        rowCount: 3,
        seatsPerRow: 14,
        aislePositions: [7],
        pricingCategory: 'Gold',
        basePrice: 500,
        totalSeats: 42,
        status: 'active',
        elevation: 2,
        curvatureAngle: 155,
        seatingMaterial: 'Terraced Natural Turf Stone Steps',
        colorTheme: 'emerald',
        description: 'Concentric stone-edged grass steps overlooking the sunset amphitheatre bowl.',
        wheelchairAccessible: false
      }
    ]
  },
  {
    id: 'fac-aud-5',
    name: 'Grand Heritage Banquet & Community Ballroom',
    code: 'BNQ-HERITAGE-500',
    venueType: 'banquet_hall',
    seatingTopology: 'lawn_cluster',
    capacity: 500,
    location: 'East Wing Ground & Celebration Courtyard',
    todayBookings: 2,
    utilization: 85,
    revenueMonthly: 340000,
    hourlyRate: 5000,
    minBookingHours: 4,
    securityDeposit: 35000,
    status: 'operational',
    stageDimensions: '12m x 6m Flexible Modular Presentation Stage',
    stageType: 'platform',
    acousticRating: 'Double-glazed Banquet Sound Isolation with Ceiling Baffles',
    greenRoomsCount: 2,
    lightingSystem: 'Crystal Chandeliers with RGB Scene Illumination',
    facilities: [
      'Pre-function Cocktail Foyer (150 Pax)',
      'Dedicated Commercial Kitchen & Buffet Galleys',
      'Integrated High-Lumen Dual Video Walls',
      'Partitionable Acoustic Air-Walls for 2 Independent Salons'
    ],
    rules: 'Catering vendor cleanup must conclude within 90 minutes post-event. Alcohol service requires statutory municipal excise permit.',
    blocks: [
      {
        id: 'blk-501',
        auditoriumId: 'fac-aud-5',
        name: 'Main Ballroom Cluster A',
        tier: 'floor',
        level: 'Grand Ballroom Ground',
        startRow: 'T',
        rowCount: 4,
        seatsPerRow: 10,
        aislePositions: [5],
        pricingCategory: 'Gold',
        basePrice: 1200,
        totalSeats: 40,
        status: 'active',
        elevation: 1,
        colorTheme: 'amber',
        description: 'Flexible round banquet table clusters seating 10 per table.',
        wheelchairAccessible: true
      }
    ]
  }
];

export const AUDITORIUM_DATA = {
  id: 'fac-aud-1',
  name: 'Main Civic Auditorium',
  capacity: 850,
  todayBookings: 3,
  utilization: 91,
  revenueMonthly: 284000,
  facilities: [
    'Laser Projector 4K Ultra-HD with Cinema Scope',
    'Dolby Atmos 7.1.4 Surround Sound Array',
    'Motorized Hydraulic Stage & Fly Tower',
    'Central Climate Control & HEPA Filtration',
    'VIP Green Rooms (x4) with Ensuite Showers',
    'Live 4K Broadcast Cabling & Audio Matrix'
  ],
  hourlyRate: 4000,
  rules: 'Sound amplification must conclude by 10:00 PM per municipal environmental guidelines. Statutory security deposit of ₹25,000 required for non-resident events.'
};

export const generateSeatsForAuditorium = (auditorium: Auditorium): Seat[] => {
  const seats: Seat[] = [];
  const isOpenTheatre = auditorium.venueType === 'open_theatre' || auditorium.seatingTopology === 'radial_arc';

  auditorium.blocks.forEach((block) => {
    const startCharCode = block.startRow.charCodeAt(0);
    const sweepAngle = block.curvatureAngle || 140;
    const halfSweep = sweepAngle / 2;
    const startAngle = 90 - halfSweep; // Centered around 90 degrees (facing straight up towards stage)

    for (let r = 0; r < block.rowCount; r++) {
      const rowLetter = block.startRow.length > 1 
        ? `${block.startRow[0]}${r + 1}` 
        : String.fromCharCode(startCharCode + r);

      for (let c = 1; c <= block.seatsPerRow; c++) {
        // Pre-determine some booked/reserved demo states
        const isBooked = (r === 0 && (c === 3 || c === 4 || c === 5)) || (block.tier === 'floor' && r === 1 && c === 6);
        const isReserved = block.tier === 'vip_box' || (block.tier === 'balcony' && r === 0 && (c === 1 || c === 2));
        const isDisabled = block.status === 'maintenance' || (r === block.rowCount - 1 && c === block.seatsPerRow);

        const seatId = `${rowLetter}${c}`;

        // Polar angle for open theatre
        const angle = isOpenTheatre 
          ? startAngle + ((c - 0.5) / block.seatsPerRow) * sweepAngle 
          : 90;

        const sightline = Math.abs(angle - 90) < 22 
          ? 'Direct Centerline Focus' 
          : Math.abs(angle - 90) < 48 
          ? 'Panoramic Arc Sightline' 
          : 'Lateral Wing Angle';

        seats.push({
          id: seatId,
          auditoriumId: auditorium.id,
          blockId: block.id,
          blockName: block.name,
          row: rowLetter,
          col: c,
          section: block.pricingCategory,
          price: block.basePrice,
          status: isBooked ? 'booked' : isReserved ? 'reserved' : isDisabled ? 'disabled' : 'available',
          assignedTo: isBooked ? 'Raj Kumar (MEM-10284)' : isReserved && block.tier === 'vip_box' ? 'Managing Committee VIP' : undefined,
          hasBalconyView: block.tier === 'balcony' || block.tier === 'vip_box',
          isRadial: isOpenTheatre,
          angleDegrees: Math.round(angle),
          sightlineToStage: sightline
        });
      }
    }
  });
  return seats;
};

export const INITIAL_SEATS: Seat[] = (() => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  rows.forEach((row, rIdx) => {
    let section: 'Platinum' | 'Premium' | 'Gold' | 'Silver' = 'Silver';
    let price = 600;
    if (rIdx < 2) {
      section = 'Platinum';
      price = 1500;
    } else if (rIdx < 4) {
      section = 'Premium';
      price = 1000;
    } else if (rIdx < 6) {
      section = 'Gold';
      price = 800;
    }

    for (let c = 1; c <= 10; c++) {
      const isBooked = (rIdx === 0 && c <= 6) || (rIdx === 2 && (c === 4 || c === 5));
      const isReserved = rIdx === 1 && (c === 1 || c === 2);
      const isDisabled = rIdx === 7 && (c === 1 || c === 10);
      seats.push({
        id: `${row}${c}`,
        row,
        col: c,
        section,
        price,
        status: isBooked ? 'booked' : isReserved ? 'reserved' : isDisabled ? 'disabled' : 'available',
        assignedTo: isBooked ? 'Raj Kumar (MEM-10284)' : undefined
      });
    }
  });
  return seats;
})();


const ALL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    transactionId: 'TXN-9028419',
    memberId: 'MEM-10284',
    memberName: 'Raj Kumar',
    module: 'Events',
    amount: 3500,
    paymentMethod: 'UPI',
    date: '16 Sep 2026, 09:48 AM',
    status: 'successful',
    invoiceNumber: 'INV-2026-0891',
    description: 'Annual Meet Banquet Tickets (x4) - Villa B-14',
    customerEmail: 'raj.kumar@greenwood.org'
  },
  {
    id: 'tx-1002',
    transactionId: 'TXN-9028420',
    memberId: 'MEM-10285',
    memberName: 'Priya Sharma',
    module: 'Membership',
    amount: 12000,
    paymentMethod: 'Credit Card',
    date: '16 Sep 2026, 08:15 AM',
    status: 'successful',
    invoiceNumber: 'INV-2026-0892',
    description: 'Annual Standard Membership Renewal 2026-27',
    customerEmail: 'priya.sharma@techcorp.in'
  },
  {
    id: 'tx-1003',
    transactionId: 'TXN-9028421',
    memberId: 'MEM-10287',
    memberName: 'Sunita Patel',
    module: 'Bookings',
    amount: 300,
    paymentMethod: 'UPI',
    date: '15 Sep 2026, 06:22 PM',
    status: 'refunded',
    invoiceNumber: 'INV-2026-0885',
    description: 'Refund for cancelled Badminton Court 2 booking',
    customerEmail: 'sunita.patel@designstudio.io'
  },
  {
    id: 'tx-1004',
    transactionId: 'TXN-9028422',
    memberId: 'MEM-10288',
    memberName: 'Vikram Malhotra',
    module: 'Bookings',
    amount: 2500,
    paymentMethod: 'Net Banking',
    date: '15 Sep 2026, 02:40 PM',
    status: 'pending',
    invoiceNumber: 'INV-2026-0888',
    description: 'Football Ground 2-Hour Reservation Fee',
    customerEmail: 'vikram.m@lawchambers.in'
  },
  {
    id: 'tx-1005',
    transactionId: 'TXN-9028423',
    memberId: 'MEM-10290',
    memberName: 'Kavita Chawla',
    module: 'Membership',
    amount: 12000,
    paymentMethod: 'Credit Card',
    date: '14 Sep 2026, 11:10 AM',
    status: 'failed',
    invoiceNumber: 'INV-2026-0879',
    description: 'Standard Membership Renewal Payment Failure - Card Declined',
    customerEmail: 'kavita.c@horizonfin.com'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = ALL_PAYMENTS;

export const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 'rfd-101',
    refundId: 'RFD-2026-4819',
    originalTransactionId: 'TXN-9028421',
    originalInvoiceNumber: 'INV-2026-0885',
    memberId: 'MEM-10287',
    memberName: 'Sunita Patel',
    memberUnit: 'Tower C-1104',
    amount: 300,
    reason: 'Booking Cancellation',
    requestedDate: '15 Sep 2026, 06:15 PM',
    processedDate: '15 Sep 2026, 06:22 PM',
    status: 'completed',
    paymentMode: 'UPI',
    gatewayRef: 'UPI/2026/894102941',
    approvedBy: 'Auto-System (Policy <24h)',
    notes: 'Member cancelled synthetic court reservation within free cancellation window.'
  },
  {
    id: 'rfd-102',
    refundId: 'RFD-2026-4820',
    originalTransactionId: 'TXN-9028390',
    originalInvoiceNumber: 'INV-2026-0862',
    memberId: 'MEM-10288',
    memberName: 'Vikram Malhotra',
    memberUnit: 'Villa A-08',
    amount: 900,
    reason: 'Event Rescheduled',
    requestedDate: '14 Sep 2026, 11:30 AM',
    processedDate: '14 Sep 2026, 03:45 PM',
    status: 'completed',
    paymentMode: 'Net Banking',
    gatewayRef: 'UTR-HDFC-99210481',
    approvedBy: 'Raj Admin (Super Admin)',
    notes: 'Partial ticket cancellation for Annual Meet Banquet due to overseas travel.'
  },
  {
    id: 'rfd-103',
    refundId: 'RFD-2026-4821',
    originalTransactionId: 'TXN-9028114',
    originalInvoiceNumber: 'INV-2026-0810',
    memberId: 'MEM-10285',
    memberName: 'Priya Sharma',
    memberUnit: 'Tower A-402',
    amount: 25000,
    reason: 'Security Deposit Return',
    requestedDate: '16 Sep 2026, 09:10 AM',
    status: 'pending',
    paymentMode: 'Original Source',
    gatewayRef: 'Pending Treasury Release',
    notes: 'Auditorium post-event inspection verified zero damage. Awaiting treasurer counter-signature.'
  },
  {
    id: 'rfd-104',
    refundId: 'RFD-2026-4822',
    originalTransactionId: 'TXN-9028350',
    originalInvoiceNumber: 'INV-2026-0844',
    memberId: 'MEM-10286',
    memberName: 'Arvind Rao',
    memberUnit: 'Villa C-09',
    amount: 18500,
    reason: 'Duplicate Payment',
    requestedDate: '16 Sep 2026, 10:05 AM',
    status: 'processing',
    paymentMode: 'Credit Card',
    gatewayRef: 'PG-REVERSAL-REQ-77821',
    approvedBy: 'Finance Desk',
    notes: 'Resident double swiped via payment gateway during server timeout. Bank reversal batch submitted.'
  },
  {
    id: 'rfd-105',
    refundId: 'RFD-2026-4823',
    originalTransactionId: 'TXN-9028205',
    originalInvoiceNumber: 'INV-2026-0822',
    memberId: 'MEM-10289',
    memberName: 'Deepak Nambiar',
    memberUnit: 'Tower B-302',
    amount: 250,
    reason: 'Booking Cancellation',
    requestedDate: '13 Sep 2026, 04:20 PM',
    processedDate: '13 Sep 2026, 04:25 PM',
    status: 'completed',
    paymentMode: 'UPI',
    gatewayRef: 'UPI/2026/778102911',
    approvedBy: 'Auto-System',
    notes: 'Table Tennis slot cancelled 6 hours before slot start.'
  }
];



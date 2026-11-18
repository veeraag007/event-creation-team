import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Users, 
  Utensils, 
  Ticket, 
  ShieldCheck, 
  Baby, 
  Sparkles,
  Info,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  AlertCircle,
  Zap,
  Sliders,
  Car,
  QrCode,
  Send,
  Plus,
  Trash2,
  Navigation,
  ExternalLink,
  MessageSquare,
  Mail,
  Smartphone,
  Layers,
  ChefHat,
  Image as ImageIcon,
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  Compass,
  Map,
  Eye,
  RefreshCw,
  Globe,
  FileUp,
  X,
  Edit3,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { 
  CommunityEvent, 
  EventFoodType, 
  EventDietaryOption, 
  EventAudienceType,
  TicketDeliveryChannel,
  EventScheduleBlock,
  FoodMenuCourse,
  EventVenueMap,
  EventSession,
  AttendanceMode,
  EventPassOption
} from '../types';

interface CreateEventWizardProps {
  onCancel: () => void;
  onSave: (newEvent: Partial<CommunityEvent>) => void;
}

// Curated Banner Presets by Sector / Theme
const BANNER_PRESETS = [
  {
    name: 'Cultural Gala & Ballroom',
    category: 'Cultural',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Sports Championship & Arena',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Patriotic & Outdoor Gathering',
    category: 'Festival',
    url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Acoustic Concert & Night Lights',
    category: 'Cultural',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Robotics & STEM Workshop',
    category: 'Workshop',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Diwali Lanterns & Night Sky',
    category: 'Festival',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80'
  }
];

// Curated Logo / Badge Presets
const LOGO_PRESETS = [
  {
    name: 'Golden Crest Badge',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Floral Tricolor Emblem',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Music Rhythm Note',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Cyber STEM Circuit',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Diwali Diya Light',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=200&q=80'
  }
];

// Preset Venue Geolocation Maps
const VENUE_MAP_PRESETS = [
  {
    venue: 'Main Auditorium & Banquet Lawn',
    address: 'Grand Greenwood Boulevard, Gate 2, Sarjapur Main Road',
    landmark: 'Opposite Lakeview Tech Park Entrance',
    latitude: 12.9249,
    longitude: 77.6756,
    gateEntrance: 'Gate 2 (East Boulevard)',
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  {
    venue: 'Central Amphitheatre & Greens',
    address: 'Central Amphitheatre & Greens, Greenwood Meadows Avenue 1',
    landmark: 'Next to Clubhouse Pavilion & Fountain',
    latitude: 12.9255,
    longitude: 77.6762,
    gateEntrance: 'Gate 1 (Main Entrance)',
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  {
    venue: 'Sports Complex Courts 1 & 2',
    address: 'Greenwood Sports Complex, West Wing Arena',
    landmark: 'Behind Tennis Pavilion & Olympic Pool',
    latitude: 12.9268,
    longitude: 77.6742,
    gateEntrance: 'Gate 4 (Sports West)',
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  {
    venue: 'Clubhouse Activity Hall 1',
    address: 'Clubhouse First Floor, Activity Hall 1, Main Avenue',
    landmark: 'Next to Indoor Badminton Complex',
    latitude: 12.9261,
    longitude: 77.6770,
    gateEntrance: 'Gate 1 (Clubhouse Entrance)',
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  {
    venue: 'Central Promenade & Greens',
    address: 'Central Promenade & Greens, East Walkway',
    landmark: 'Between Tower B and Community Gazebo',
    latitude: 12.9242,
    longitude: 77.6752,
    gateEntrance: 'Gate 2 & Pedestrian Gate 4',
    city: 'Bengaluru',
    state: 'Karnataka'
  }
];

export const CreateEventWizard: React.FC<CreateEventWizardProps> = ({
  onCancel,
  onSave
}) => {
  // Mode selection: 'simple' vs 'advanced'
  const [creationMode, setCreationMode] = useState<'simple' | 'advanced'>('advanced');
  const [step, setStep] = useState(1);

  // Available community venues for multi-select
  const AVAILABLE_VENUES = [
    'Main Auditorium',
    'Grand Banquet Lawn',
    'Open Promenade VIP Lounge',
    'Central Amphitheatre',
    'North Promenade Lawns',
    'Clubhouse Activity Hall 1',
    'Sports Complex Courts 1 & 2',
    'Poolside Deck & Pavilion'
  ];

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    // Basic Details
    name: 'Diwali Cultural Night & Grand Gala 2026',
    category: 'Cultural' as CommunityEvent['category'],
    description: 'A grand celebration featuring traditional classical dance performances, musical bands, kids fashion show, and a royal festive multi-cuisine buffet.',
    date: '31 Oct 2026',
    time: '06:00 PM - 10:30 PM',
    venue: 'Main Auditorium & Banquet Lawn',
    venues: ['Main Auditorium', 'Grand Banquet Lawn', 'Open Promenade VIP Lounge'] as string[],
    capacity: 450,
    hasSeatingMap: true,
    notifyAllMembers: true,

    // Banner & Logo Media Facility
    bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',

    // Venue Location Map Facility
    venueMap: {
      address: 'Grand Greenwood Boulevard, Gate 2, Sarjapur Main Road',
      landmark: 'Opposite Lakeview Tech Park Entrance',
      latitude: 12.9249,
      longitude: 77.6756,
      googleMapsUrl: 'https://maps.google.com/?q=12.9249,77.6756',
      gateEntrance: 'Gate 2 (East Boulevard)',
      city: 'Bengaluru',
      state: 'Karnataka',
      zoomLevel: 15
    } as EventVenueMap,

    // Program Schedule / Itinerary Blocks
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
    ] as EventScheduleBlock[],

    // Audience Type & Rules
    audienceType: 'member_and_non_member' as EventAudienceType,
    allowNonMembers: true,
    maxGuestsPerMember: 4,
    childAgeLimit: 12,
    requireMemberIdCheck: true,
    earlyBirdDiscountPercent: 10,
    volunteerSlots: 8,

    // Parking & Location
    parkingEnabled: true,
    parkingZone: 'North Wing & Basement 2 Bays A-D',
    parkingTotalSlots: 180,
    parkingGate: 'Gate 2 (East Boulevard)',
    parkingValet: true,
    parkingEvCharging: true,
    parkingMapLocation: 'https://maps.google.com/?q=12.9249,77.6756',
    parkingLatitude: 12.9249,
    parkingLongitude: 77.6756,
    parkingInstructions: 'Display digital parking QR pass to security marshals at Gate 2. Valet desk near main portico.',

    // Admission Pricing Matrix
    isFreeForMembers: false,
    memberAdultPrice: 200,
    memberChildPrice: 100,
    nonMemberAdultPrice: 450,
    nonMemberChildPrice: 220,
    familyPackagePrice: 550,
    // General & Public Admission Fields
    generalAdultPrice: 250,
    generalChildPrice: 125,
    isFreeAdmission: false,

    // Food & Catering
    foodType: 'paid_addon' as EventFoodType,
    mealTitle: 'Royal Festive Multi-Cuisine Dinner Buffet',
    foodPricingMode: 'tiered' as 'common' | 'tiered',
    foodPriceAdult: 350,
    foodPriceChild: 200,
    foodMemberPriceAdult: 300,
    foodMemberPriceChild: 150,
    foodNonMemberPriceAdult: 450,
    foodNonMemberPriceChild: 250,
    dietaryOptions: ['Veg', 'Non-Veg', 'Jain'] as EventDietaryOption[],
    cateringCutoffDate: '29 Oct 2026, 06:00 PM',
    catererName: 'Saffron Heritage Caterers',
    cateringNotes: 'Live tandoori counters, dum biryani, chaat stall, and signature dessert station.',

    // Food Menu Courses
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
    ] as FoodMenuCourse[],

    // Ticket Delivery Channels
    ticketChannels: ['whatsapp', 'email', 'sms', 'in_app'] as TicketDeliveryChannel[]
  });

  // State for map view mode in UI
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite'>('roadmap');
  const [mapZoom, setMapZoom] = useState(15);
  const [customBannerInput, setCustomBannerInput] = useState('');
  const [customLogoInput, setCustomLogoInput] = useState('');

  // Media Upload Refs & States
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [bannerActiveTab, setBannerActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [logoActiveTab, setLogoActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [bannerUploadInfo, setBannerUploadInfo] = useState<{ name: string; size: string } | null>(null);
  const [logoUploadInfo, setLogoUploadInfo] = useState<{ name: string; size: string } | null>(null);
  const [isBannerDragging, setIsBannerDragging] = useState(false);
  const [isLogoDragging, setIsLogoDragging] = useState(false);

  // Audience Types Definition
  const AUDIENCE_TYPES: {
    id: EventAudienceType;
    title: string;
    tagline: string;
    badge: string;
    badgeColor: string;
    description: string;
    icon: any;
  }[] = [
    {
      id: 'only_member',
      title: 'Only Members',
      tagline: 'Exclusive Society Residents',
      badge: 'Exclusive',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Strictly restricted to registered community residents. Outsiders and non-members cannot register.',
      icon: ShieldCheck
    },
    {
      id: 'member_and_non_member',
      title: 'Member & Non-Member',
      tagline: 'Tiered Pricing & Guests',
      badge: 'Most Popular',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Members enjoy subsidized privilege rates while outside non-member guests can also register.',
      icon: Users
    },
    {
      id: 'general',
      title: 'General Audience',
      tagline: 'Uniform Open Ticketing',
      badge: 'Standard',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Uniform admission for everyone. No distinction between members and non-members.',
      icon: Ticket
    },
    {
      id: 'public',
      title: 'Open Public',
      tagline: 'City-Wide Public Event',
      badge: 'Public Entry',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Open to the entire public city-wide. Great for cultural melas, exhibitions, and charity drives.',
      icon: Globe
    }
  ];

  // Helper to handle banner file selection (supports drag & drop and browse)
  const handleBannerFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData(prev => ({
          ...prev,
          bannerUrl: e.target!.result as string
        }));
        setBannerUploadInfo({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to handle logo file selection
  const handleLogoFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData(prev => ({
          ...prev,
          logoUrl: e.target!.result as string
        }));
        setLogoUploadInfo({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // State for adding a new schedule block
  const [newBlock, setNewBlock] = useState({
    time: '07:00 PM - 07:30 PM',
    title: '',
    venue: formData.venues[0] || 'Main Auditorium',
    performerOrSpeaker: '',
    description: ''
  });

  // State for adding menu items
  const [newMenuItem, setNewMenuItem] = useState('');
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  // Venue Spaces Catalog with Operating Limits and Supported Attendance Modes
  const VENUE_SPACES_CATALOG = [
    {
      venueId: 'fac-aud-1',
      venueName: 'Main Auditorium',
      spaces: ['Stage & Orchestra Stalls', 'Balcony Tier A', 'Full Auditorium Hall'],
      operatingLimit: 350,
      hasSeatMap: true,
      supportsModes: ['reserved_seating', 'general_admission', 'mixed_seating', 'registration_only'] as AttendanceMode[]
    },
    {
      venueId: 'fac-lawn-1',
      venueName: 'Grand Banquet Lawn',
      spaces: ['Open Meadow & Catering Pavilion', 'VIP Gazebo Zone', 'East Lawn Arena'],
      operatingLimit: 600,
      hasSeatMap: false,
      supportsModes: ['open_space', 'general_admission', 'registration_only'] as AttendanceMode[]
    },
    {
      venueId: 'fac-amphi-1',
      venueName: 'Central Amphitheatre',
      spaces: ['Stepped Stone Tiers & Stage', 'Upper Grass Bank', 'Full Amphitheatre Bowl'],
      operatingLimit: 280,
      hasSeatMap: true,
      supportsModes: ['mixed_seating', 'reserved_seating', 'general_admission', 'open_space'] as AttendanceMode[]
    },
    {
      venueId: 'fac-meadow-1',
      venueName: 'Sunset Meadow',
      spaces: ['Open Lawn Perimeter', 'Starlight Stage Area'],
      operatingLimit: 500,
      hasSeatMap: false,
      supportsModes: ['open_space', 'general_admission', 'registration_only'] as AttendanceMode[]
    },
    {
      venueId: 'fac-zen-1',
      venueName: 'Zen Pavilion',
      spaces: ['Yoga & Meditation Studio', 'Veranda'],
      operatingLimit: 60,
      hasSeatMap: false,
      supportsModes: ['registration_only', 'general_admission'] as AttendanceMode[]
    },
    {
      venueId: 'fac-hall-1',
      venueName: 'Clubhouse Activity Hall 1',
      spaces: ['Main Multipurpose Hall', 'Breakout Room 1'],
      operatingLimit: 120,
      hasSeatMap: false,
      supportsModes: ['general_admission', 'registration_only', 'mixed_seating'] as AttendanceMode[]
    }
  ];

  // Attendance Mode Definitions
  const ATTENDANCE_MODE_CONFIGS: {
    id: AttendanceMode;
    title: string;
    badge: string;
    color: string;
    iconColor: string;
    description: string;
  }[] = [
    {
      id: 'reserved_seating',
      title: 'Reserved Seating',
      badge: 'Seat Map',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      description: 'Attendee selects or is assigned specific numbered seats from the auditorium seat map.'
    },
    {
      id: 'general_admission',
      title: 'General Admission',
      badge: 'Capacity Pool',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
      description: 'Attendees register/buy against a capacity pool. Seat numbers and seat map are hidden.'
    },
    {
      id: 'mixed_seating',
      title: 'Mixed Seating',
      badge: 'Blocks + GA',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
      description: 'Selected seat blocks use reserved seating, while remaining capacity is general admission.'
    },
    {
      id: 'open_space',
      title: 'Open Space',
      badge: 'Outdoor Zone',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
      description: 'Manage entry capacity for an outdoor lawn or open zone without seat layout.'
    },
    {
      id: 'registration_only',
      title: 'Registration Only',
      badge: 'Capped Headcount',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      iconColor: 'text-cyan-600',
      description: 'Free or paid registration with capacity limit; seat selection is optional.'
    }
  ];

  // Multi-Session Architecture State
  const [sessions, setSessions] = useState<EventSession[]>([
    {
      id: 'sess-cfg-1',
      eventId: 'ev-new',
      name: 'Classical Sitar & Sarod Recital (Inaugural)',
      description: 'Opening classical performance by resident maestros.',
      date: '31 Oct 2026',
      startTime: '06:00 PM',
      endTime: '08:00 PM',
      timezone: 'IST (UTC+5:30)',
      venueId: 'fac-aud-1',
      venueName: 'Main Auditorium',
      spaceName: 'Stage & Orchestra Stalls',
      setupBufferMinutes: 60,
      teardownBufferMinutes: 30,
      attendanceMode: 'reserved_seating',
      venueOperatingLimit: 350,
      allocatedCapacity: 350,
      holds: { accessible: 8, staff: 12, sponsor: 15, safetyBuffer: 15 },
      sellableCapacity: 300,
      registrationsCount: 0,
      audienceEligibility: 'member_and_non_member',
      isFree: false,
      pricing: { memberAdult: 200, memberChild: 100, nonMemberAdult: 450, nonMemberChild: 220, isFreeForMembers: false },
      status: 'published'
    },
    {
      id: 'sess-cfg-2',
      eventId: 'ev-new',
      name: 'Classical Heritage Cinema Screening',
      description: 'Curated heritage cinema retrospective in the auditorium.',
      date: '31 Oct 2026',
      startTime: '08:45 PM',
      endTime: '10:45 PM',
      timezone: 'IST (UTC+5:30)',
      venueId: 'fac-aud-1',
      venueName: 'Main Auditorium',
      spaceName: 'Main Screen Hall',
      setupBufferMinutes: 15,
      teardownBufferMinutes: 30,
      attendanceMode: 'general_admission',
      venueOperatingLimit: 350,
      allocatedCapacity: 320,
      holds: { accessible: 6, staff: 10, sponsor: 10, safetyBuffer: 14 },
      sellableCapacity: 280,
      registrationsCount: 0,
      audienceEligibility: 'general',
      isFree: false,
      pricing: { memberAdult: 100, memberChild: 50, nonMemberAdult: 200, nonMemberChild: 100, isFreeForMembers: false },
      status: 'published'
    },
    {
      id: 'sess-cfg-3',
      eventId: 'ev-new',
      name: 'Starlight Folk Fusion Musical Concert',
      description: 'Under the starlight night musical concert with live acoustic percussion.',
      date: '01 Nov 2026',
      startTime: '07:00 PM',
      endTime: '10:00 PM',
      timezone: 'IST (UTC+5:30)',
      venueId: 'fac-lawn-1',
      venueName: 'Grand Banquet Lawn',
      spaceName: 'Open Meadow & Catering Pavilion',
      setupBufferMinutes: 60,
      teardownBufferMinutes: 45,
      attendanceMode: 'open_space',
      venueOperatingLimit: 600,
      allocatedCapacity: 500,
      holds: { accessible: 10, staff: 20, sponsor: 20, safetyBuffer: 20 },
      sellableCapacity: 430,
      registrationsCount: 0,
      audienceEligibility: 'public',
      isFree: false,
      pricing: { memberAdult: 250, memberChild: 125, nonMemberAdult: 450, nonMemberChild: 225, isFreeForMembers: false },
      status: 'published'
    }
  ]);

  const [passOption, setPassOption] = useState<EventPassOption>('both');
  const [wholePassPricing, setWholePassPricing] = useState({
    memberAdult: 350,
    memberChild: 175,
    nonMemberAdult: 650,
    nonMemberChild: 325,
    isFreeForMembers: false
  });
  const [wholePassCapacity, setWholePassCapacity] = useState(150);

  // Session Add / Edit Modal in Wizard
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(null);
  const [sessionForm, setSessionForm] = useState<EventSession>({
    id: `sess-${Date.now()}`,
    eventId: 'ev-new',
    name: 'New Festival Session',
    description: 'Session description and highlights.',
    date: '31 Oct 2026',
    startTime: '05:00 PM',
    endTime: '07:00 PM',
    timezone: 'IST (UTC+5:30)',
    venueId: 'fac-aud-1',
    venueName: 'Main Auditorium',
    spaceName: 'Stage & Orchestra Stalls',
    setupBufferMinutes: 45,
    teardownBufferMinutes: 30,
    attendanceMode: 'reserved_seating',
    venueOperatingLimit: 350,
    allocatedCapacity: 300,
    holds: { accessible: 6, staff: 10, sponsor: 10, safetyBuffer: 10 },
    sellableCapacity: 264,
    registrationsCount: 0,
    audienceEligibility: 'member_and_non_member',
    isFree: false,
    pricing: { memberAdult: 200, memberChild: 100, nonMemberAdult: 400, nonMemberChild: 200, isFreeForMembers: false },
    status: 'published'
  });

  // Open modal to add a new session
  const handleOpenAddSession = () => {
    const venueCat = VENUE_SPACES_CATALOG[0];
    setSessionForm({
      id: `sess-${Date.now()}`,
      eventId: 'ev-new',
      name: `Session ${sessions.length + 1}: `,
      description: 'Session description and program outline.',
      date: formData.date || '31 Oct 2026',
      startTime: '06:00 PM',
      endTime: '08:00 PM',
      timezone: 'IST (UTC+5:30)',
      venueId: venueCat.venueId,
      venueName: venueCat.venueName,
      spaceName: venueCat.spaces[0],
      setupBufferMinutes: 45,
      teardownBufferMinutes: 30,
      attendanceMode: 'reserved_seating',
      venueOperatingLimit: venueCat.operatingLimit,
      allocatedCapacity: venueCat.operatingLimit,
      holds: { accessible: 8, staff: 12, sponsor: 10, safetyBuffer: 10 },
      sellableCapacity: Math.max(0, venueCat.operatingLimit - 40),
      registrationsCount: 0,
      audienceEligibility: formData.audienceType,
      isFree: false,
      pricing: {
        memberAdult: formData.memberAdultPrice || 200,
        memberChild: formData.memberChildPrice || 100,
        nonMemberAdult: formData.nonMemberAdultPrice || 400,
        nonMemberChild: formData.nonMemberChildPrice || 200,
        isFreeForMembers: false
      },
      status: 'published'
    });
    setEditingSessionIndex(null);
    setIsSessionModalOpen(true);
  };

  // Open modal to edit existing session
  const handleOpenEditSession = (index: number) => {
    setSessionForm({ ...sessions[index] });
    setEditingSessionIndex(index);
    setIsSessionModalOpen(true);
  };

  // Save session from modal
  const handleSaveSessionForm = () => {
    if (!sessionForm.name?.trim()) {
      alert('Please enter a session name.');
      return;
    }
    const cat = VENUE_SPACES_CATALOG.find(v => v.venueName === sessionForm.venueName);
    const opLimit = cat ? cat.operatingLimit : 300;
    const alloc = Math.min(sessionForm.allocatedCapacity || opLimit, opLimit);
    const totalHolds = (sessionForm.holds?.accessible || 0) + (sessionForm.holds?.staff || 0) + (sessionForm.holds?.sponsor || 0) + (sessionForm.holds?.safetyBuffer || 0);
    const sellable = Math.max(0, alloc - totalHolds);

    const completeSession: EventSession = {
      ...sessionForm,
      venueOperatingLimit: opLimit,
      allocatedCapacity: alloc,
      sellableCapacity: sellable,
      id: sessionForm.id || `sess-${Date.now()}`
    } as EventSession;

    if (editingSessionIndex !== null) {
      const updated = [...sessions];
      updated[editingSessionIndex] = completeSession;
      setSessions(updated);
    } else {
      setSessions([...sessions, completeSession]);
    }
    setIsSessionModalOpen(false);
  };

  // Remove session
  const handleRemoveSession = (index: number) => {
    if (sessions.length <= 1) {
      alert('An event must have at least one session.');
      return;
    }
    setSessions(sessions.filter((_, i) => i !== index));
  };

  // Check if any two sessions conflict in the same venue space
  const sessionConflicts = sessions.flatMap((s1, idx1) => {
    return sessions.slice(idx1 + 1).filter(s2 => {
      return s1.date === s2.date && s1.venueName === s2.venueName && s1.spaceName === s2.spaceName;
    }).map(s2 => ({ s1, s2 }));
  });

  // Advanced Steps definition
  const advancedSteps = [
    { num: 1, title: 'Basics & Branding', icon: Layers },
    { num: 2, title: 'Venue Location Map', icon: MapPin },
    { num: 3, title: 'Multi-Session Architect', icon: Clock },
    { num: 4, title: 'Passes & Ticketing', icon: Ticket },
    { num: 5, title: 'Food & Menu', icon: ChefHat },
    { num: 6, title: 'Parking Logistics', icon: Car },
    { num: 7, title: 'Channels & QR', icon: QrCode },
    { num: 8, title: 'Review All Sessions', icon: Check }
  ];

  // Helper to apply venue preset map
  const applyVenuePreset = (preset: typeof VENUE_MAP_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      venue: preset.venue,
      venues: [preset.venue],
      venueMap: {
        address: preset.address,
        landmark: preset.landmark,
        latitude: preset.latitude,
        longitude: preset.longitude,
        gateEntrance: preset.gateEntrance,
        city: preset.city,
        state: preset.state,
        googleMapsUrl: `https://maps.google.com/?q=${preset.latitude},${preset.longitude}`,
        zoomLevel: 15
      },
      parkingGate: preset.gateEntrance,
      parkingLatitude: preset.latitude,
      parkingLongitude: preset.longitude,
      parkingMapLocation: `https://maps.google.com/?q=${preset.latitude},${preset.longitude}`
    }));
  };

  // Toggle venue multi-select
  const toggleVenue = (v: string) => {
    if (formData.venues.includes(v)) {
      if (formData.venues.length > 1) {
        const updated = formData.venues.filter(x => x !== v);
        setFormData({ ...formData, venues: updated, venue: updated.join(' • ') });
      }
    } else {
      const updated = [...formData.venues, v];
      setFormData({ ...formData, venues: updated, venue: updated.join(' • ') });
    }
  };

  // Toggle dietary options
  const toggleDietaryOption = (opt: EventDietaryOption) => {
    if (formData.dietaryOptions.includes(opt)) {
      if (formData.dietaryOptions.length > 1) {
        setFormData({
          ...formData,
          dietaryOptions: formData.dietaryOptions.filter(d => d !== opt)
        });
      }
    } else {
      setFormData({
        ...formData,
        dietaryOptions: [...formData.dietaryOptions, opt]
      });
    }
  };

  // Toggle ticket delivery channels
  const toggleTicketChannel = (ch: TicketDeliveryChannel) => {
    if (formData.ticketChannels.includes(ch)) {
      if (formData.ticketChannels.length > 1) {
        setFormData({
          ...formData,
          ticketChannels: formData.ticketChannels.filter(c => c !== ch)
        });
      }
    } else {
      setFormData({
        ...formData,
        ticketChannels: [...formData.ticketChannels, ch]
      });
    }
  };

  // Add schedule block
  const handleAddScheduleBlock = () => {
    if (!newBlock.title.trim()) return;
    const block: EventScheduleBlock = {
      id: `blk-${Date.now()}`,
      time: newBlock.time,
      title: newBlock.title,
      venue: newBlock.venue,
      performerOrSpeaker: newBlock.performerOrSpeaker || undefined,
      description: newBlock.description || undefined
    };
    setFormData({
      ...formData,
      scheduleBlocks: [...formData.scheduleBlocks, block]
    });
    setNewBlock({
      time: '08:00 PM - 08:30 PM',
      title: '',
      venue: formData.venues[0] || 'Main Auditorium',
      performerOrSpeaker: '',
      description: ''
    });
  };

  // Remove schedule block
  const handleRemoveScheduleBlock = (id: string) => {
    setFormData({
      ...formData,
      scheduleBlocks: formData.scheduleBlocks.filter(b => b.id !== id)
    });
  };

  // Add menu item
  const handleAddMenuItem = () => {
    if (!newMenuItem.trim()) return;
    const courses = [...formData.menuCourses];
    if (courses[selectedCourseIndex]) {
      courses[selectedCourseIndex].items.push(newMenuItem.trim());
      setFormData({ ...formData, menuCourses: courses });
      setNewMenuItem('');
    }
  };

  // Remove menu item
  const handleRemoveMenuItem = (cIndex: number, itemIndex: number) => {
    const courses = [...formData.menuCourses];
    if (courses[cIndex]) {
      courses[cIndex].items.splice(itemIndex, 1);
      setFormData({ ...formData, menuCourses: courses });
    }
  };

  // Save event handler
  const handleCompleteSave = () => {
    const isSimple = creationMode === 'simple';
    
    let foodPriceAdult = formData.foodPriceAdult;
    let foodPriceChild = formData.foodPriceChild;
    let memberPriceAdult = formData.foodMemberPriceAdult;
    let memberPriceChild = formData.foodMemberPriceChild;
    let nonMemberPriceAdult = formData.foodNonMemberPriceAdult;
    let nonMemberPriceChild = formData.foodNonMemberPriceChild;

    if (formData.foodPricingMode === 'common') {
      memberPriceAdult = foodPriceAdult;
      memberPriceChild = foodPriceChild;
      nonMemberPriceAdult = foodPriceAdult;
      nonMemberPriceChild = foodPriceChild;
    }

    const isOnlyMember = formData.audienceType === 'only_member';
    const isGeneralOrPublic = formData.audienceType === 'general' || formData.audienceType === 'public';

    let memberAdultRate = formData.memberAdultPrice;
    let memberChildRate = formData.memberChildPrice;
    let nonMemberAdultRate = formData.nonMemberAdultPrice;
    let nonMemberChildRate = formData.nonMemberChildPrice;
    let isFreeMembers = formData.isFreeForMembers;
    let allowNonMembers = formData.allowNonMembers;

    if (isOnlyMember) {
      allowNonMembers = false;
      nonMemberAdultRate = 0;
      nonMemberChildRate = 0;
    } else if (isGeneralOrPublic) {
      allowNonMembers = true;
      isFreeMembers = formData.isFreeAdmission;
      memberAdultRate = formData.isFreeAdmission ? 0 : formData.generalAdultPrice;
      memberChildRate = formData.isFreeAdmission ? 0 : formData.generalChildPrice;
      nonMemberAdultRate = formData.isFreeAdmission ? 0 : formData.generalAdultPrice;
      nonMemberChildRate = formData.isFreeAdmission ? 0 : formData.generalChildPrice;
    }

    const pricePerSeat = isGeneralOrPublic 
      ? (formData.isFreeAdmission ? 0 : formData.generalAdultPrice)
      : (formData.isFreeForMembers ? 0 : formData.memberAdultPrice);

    const newEvent: Partial<CommunityEvent> = {
      id: `ev-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue || formData.venues.join(' • '),
      venues: formData.venues.length > 0 ? formData.venues : [formData.venue],
      bannerUrl: formData.bannerUrl,
      logoUrl: formData.logoUrl,
      venueMap: formData.venueMap,
      capacity: formData.capacity,
      hasSeatingMap: isSimple ? false : formData.hasSeatingMap,
      registrations: 0,
      revenue: 0,
      pricePerSeat: pricePerSeat,
      status: 'open',
      creationMode: creationMode,
      audienceType: formData.audienceType,
      pricing: {
        memberAdult: isFreeMembers ? 0 : memberAdultRate,
        memberChild: isFreeMembers ? 0 : memberChildRate,
        nonMemberAdult: allowNonMembers ? nonMemberAdultRate : 0,
        nonMemberChild: allowNonMembers ? nonMemberChildRate : 0,
        isFreeForMembers: isFreeMembers,
        familyPackagePrice: formData.familyPackagePrice > 0 ? formData.familyPackagePrice : undefined
      },
      foodConfig: {
        type: formData.foodType,
        mealTitle: formData.mealTitle,
        pricingMode: formData.foodPricingMode,
        priceAdult: formData.foodType === 'paid_addon' ? foodPriceAdult : 0,
        priceChild: formData.foodType === 'paid_addon' ? foodPriceChild : 0,
        memberPriceAdult: formData.foodType === 'paid_addon' ? memberPriceAdult : 0,
        memberPriceChild: formData.foodType === 'paid_addon' ? memberPriceChild : 0,
        nonMemberPriceAdult: formData.foodType === 'paid_addon' ? nonMemberPriceAdult : 0,
        nonMemberPriceChild: formData.foodType === 'paid_addon' ? nonMemberPriceChild : 0,
        dietaryOptions: formData.dietaryOptions,
        cateringCutoffDate: formData.cateringCutoffDate,
        catererName: formData.catererName,
        notes: formData.cateringNotes,
        menuCourses: isSimple ? undefined : formData.menuCourses
      },
      parking: {
        enabled: formData.parkingEnabled,
        zone: formData.parkingZone,
        totalSlots: formData.parkingTotalSlots,
        slotsAvailable: formData.parkingTotalSlots,
        gate: formData.parkingGate,
        valet: formData.parkingValet,
        evCharging: formData.parkingEvCharging,
        mapLocation: formData.parkingMapLocation,
        latitude: formData.parkingLatitude,
        longitude: formData.parkingLongitude,
        instructions: formData.parkingInstructions
      },
      scheduleBlocks: isSimple ? undefined : formData.scheduleBlocks,
      ticketChannels: formData.ticketChannels,
      rules: {
        allowNonMembers: allowNonMembers,
        maxGuestsPerMember: isOnlyMember ? 0 : formData.maxGuestsPerMember,
        childAgeLimit: formData.childAgeLimit,
        requireMemberIdCheck: isOnlyMember ? true : formData.requireMemberIdCheck,
        earlyBirdDiscountPercent: formData.earlyBirdDiscountPercent,
        volunteerSlots: formData.volunteerSlots
      },
      attendeeStats: {
        memberAdults: 0,
        memberChildren: 0,
        nonMemberAdults: 0,
        nonMemberChildren: 0
      },
      foodStats: {
        adultMeals: 0,
        childMeals: 0,
        vegMeals: 0,
        nonVegMeals: 0,
        jainMeals: 0,
        veganMeals: 0
      },
      registrationsList: [],
      // Multi-session architecture saved from user configured sessions
      sessions: sessions.map(s => ({
        ...s,
        eventId: s.eventId || `ev-${Date.now()}`
      })),
      passOption: passOption,
      wholeEventPassPricing: wholePassPricing,
      wholeEventPassCapacity: wholePassCapacity,
      wholeEventPassSold: 0,
      uniqueAttendeesCount: 0,
      totalSessionRegistrationsCount: 0,
      ownerName: 'Community Event Manager',
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          action: 'Event & Initial Session Provisioned',
          author: 'Event Manager Persona',
          changesSummary: `Provisioned event with multi-session architecture using ${creationMode} flow.`,
          notifyAttendees: false
        }
      ]
    };

    onSave(newEvent);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">
      {/* Top Bar with Simple vs Advanced Mode Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel Setup
        </button>

        {/* Toggle Mode Segment Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setCreationMode('simple');
              setStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              creationMode === 'simple'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simple Quick Flow</span>
          </button>

          <button
            onClick={() => setCreationMode('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              creationMode === 'advanced'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Advanced Community Flow</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SIMPLE FLOW (STREAMLINED 1-PAGE CREATION WITH AUDIENCE, UPLOAD & MAP)   */}
      {/* ========================================================================= */}
      {creationMode === 'simple' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                ⚡ Quick 1-Minute Launch
              </span>
              <h2 className="text-base font-bold text-slate-900">Simple Event Setup</h2>
              <p className="text-xs text-slate-500">
                Select audience type, upload banner & logo, pin venue map, and publish instantly.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">Ready to Publish</span>
            </div>
          </div>

          {/* AUDIENCE TYPE SELECTOR IN SIMPLE MODE */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Select Event Audience Type *
              </label>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Flow continues based on this selection
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AUDIENCE_TYPES.map(at => {
                const Icon = at.icon;
                const isSelected = formData.audienceType === at.id;
                return (
                  <button
                    key={at.id}
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      audienceType: at.id,
                      allowNonMembers: at.id !== 'only_member'
                    })}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? at.badgeColor : 'bg-slate-100 text-slate-500'
                        }`}>
                          {at.badge}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{at.title}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{at.tagline}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hidden File Inputs for Banner & Logo Upload */}
          <input
            type="file"
            ref={bannerFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleBannerFile(e.target.files[0])}
          />
          <input
            type="file"
            ref={logoFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleLogoFile(e.target.files[0])}
          />

          {/* Quick Banner & Logo Visual Box with Upload & Drag-and-Drop */}
          <div 
            onDragOver={e => { e.preventDefault(); setIsBannerDragging(true); }}
            onDragLeave={() => setIsBannerDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsBannerDragging(false);
              if (e.dataTransfer.files?.[0]) handleBannerFile(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl overflow-hidden border transition shadow-xs group ${
              isBannerDragging ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-slate-300'
            }`}
          >
            <div className="h-48 w-full bg-slate-900 relative">
              {formData.bannerUrl ? (
                <img 
                  src={formData.bannerUrl} 
                  alt="Event Banner" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No banner selected
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/30" />

              {/* Upload Banner Button Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded-lg shadow-md backdrop-blur-md flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Banner</span>
                </button>
              </div>

              {/* Drag & Drop Hint */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  📁 Drag & drop image here or click Upload
                </span>
              </div>
            </div>

            {/* Overlaid Logo with Direct Upload Trigger */}
            <div className="absolute left-5 bottom-4 flex items-end gap-3.5 z-20">
              <div 
                onClick={() => logoFileInputRef.current?.click()}
                className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl ring-2 ring-white/90 overflow-hidden relative group/logo cursor-pointer"
                title="Click to Upload Custom Logo"
              >
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    LOGO
                  </div>
                )}
                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-black/50 text-white rounded-xl opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center transition text-[9px] font-bold">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Upload</span>
                </div>
              </div>

              <div className="text-white pb-0.5 drop-shadow-md">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                    {AUDIENCE_TYPES.find(a => a.id === formData.audienceType)?.title}
                  </span>
                  {bannerUploadInfo && (
                    <span className="text-[10px] font-semibold bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded text-white flex items-center gap-1">
                      <Check className="w-3 h-3" /> Uploaded: {bannerUploadInfo.name} ({bannerUploadInfo.size})
                    </span>
                  )}
                  {logoUploadInfo && (
                    <span className="text-[10px] font-semibold bg-indigo-500/80 backdrop-blur-md px-2 py-0.5 rounded text-white">
                      Logo: {logoUploadInfo.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/90 font-medium">Click logo badge or buttons below to customize images</p>
              </div>
            </div>

            {/* Media Presets & Quick Actions Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Preset Banners:</span>
                {BANNER_PRESETS.slice(0, 4).map(bp => (
                  <button
                    key={bp.name}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, bannerUrl: bp.url });
                      setBannerUploadInfo(null);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      formData.bannerUrl === bp.url && !bannerUploadInfo
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {bp.name.split('&')[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 flex items-center gap-1 transition"
                >
                  <Camera className="w-3 h-3 text-indigo-600" />
                  <span>Upload Logo Badge</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Monsoon Badminton Tournament 2026"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="Festival">Festival</option>
                  <option value="General Body">General Body (AGM)</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Charity">Charity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Max Attendees)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 15 Nov 2026"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. 06:00 PM - 09:30 PM"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Venue & Pinned Location Map Preview in Simple Mode */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Venue Selection & Pinned Map
                </label>
                <span className="text-[10px] text-slate-500">
                  GPS: {formData.venueMap.latitude.toFixed(4)}, {formData.venueMap.longitude.toFixed(4)}
                </span>
              </div>

              <select
                value={formData.venue}
                onChange={e => {
                  const sel = e.target.value;
                  const found = VENUE_MAP_PRESETS.find(p => p.venue.includes(sel) || sel.includes(p.venue));
                  if (found) {
                    applyVenuePreset(found);
                  } else {
                    setFormData({ ...formData, venue: sel, venues: [sel] });
                  }
                }}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
              >
                {AVAILABLE_VENUES.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              {/* Mini Map Card */}
              <div className="bg-slate-900 rounded-xl p-3 text-white flex items-center justify-between">
                <div className="space-y-0.5 text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    📍 Pinned Gate Entrance: {formData.venueMap.gateEntrance || 'Main Gate'}
                  </span>
                  <p className="text-slate-300 text-[11px] truncate max-w-sm">{formData.venueMap.address}</p>
                </div>
                <a
                  href={formData.venueMap.googleMapsUrl || `https://maps.google.com/?q=${formData.venueMap.latitude},${formData.venueMap.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] text-indigo-300 hover:text-white font-semibold flex items-center gap-1 transition"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Dynamic Admission Pricing based on Audience Type */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {formData.audienceType === 'only_member' && 'Member Admission Pricing'}
                    {formData.audienceType === 'member_and_non_member' && 'Member & Guest Admission Pricing'}
                    {formData.audienceType === 'general' && 'General Admission Pricing'}
                    {formData.audienceType === 'public' && 'Public Entry Pricing'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formData.audienceType === 'only_member' && 'Ticket fee per member resident (non-members blocked)'}
                    {formData.audienceType === 'member_and_non_member' && 'Subsidized price for members vs non-member guests'}
                    {formData.audienceType === 'general' && 'Standard uniform ticket fee for any attendee'}
                    {formData.audienceType === 'public' && 'Public admission fee for city visitors'}
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      formData.audienceType === 'general' || formData.audienceType === 'public'
                        ? formData.isFreeAdmission
                        : formData.isFreeForMembers
                    }
                    onChange={e => {
                      if (formData.audienceType === 'general' || formData.audienceType === 'public') {
                        setFormData({ ...formData, isFreeAdmission: e.target.checked });
                      } else {
                        setFormData({ ...formData, isFreeForMembers: e.target.checked });
                      }
                    }}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className="text-xs font-bold text-emerald-700">Free Entry</span>
                </label>
              </div>

              {/* ONLY MEMBER PRICING FLOW */}
              {formData.audienceType === 'only_member' && !formData.isFreeForMembers && (
                <div className="space-y-2">
                  <div className="max-w-xs">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Member Price (₹)</label>
                    <input
                      type="number"
                      value={formData.memberAdultPrice}
                      onChange={e => setFormData({ ...formData, memberAdultPrice: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Exclusive Members Only Event: Non-members cannot purchase tickets or register.</span>
                  </p>
                </div>
              )}

              {/* MEMBER AND NON-MEMBER PRICING FLOW */}
              {formData.audienceType === 'member_and_non_member' && !formData.isFreeForMembers && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Member Price (₹)</label>
                    <input
                      type="number"
                      value={formData.memberAdultPrice}
                      onChange={e => setFormData({ ...formData, memberAdultPrice: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Guest / Non-Member Price (₹)</label>
                    <input
                      type="number"
                      value={formData.nonMemberAdultPrice}
                      onChange={e => setFormData({ ...formData, nonMemberAdultPrice: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {/* GENERAL AUDIENCE PRICING FLOW */}
              {formData.audienceType === 'general' && !formData.isFreeAdmission && (
                <div className="max-w-xs">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Standard Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={formData.generalAdultPrice}
                    onChange={e => setFormData({ ...formData, generalAdultPrice: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Uniform admission rate for all attendees.</span>
                </div>
              )}

              {/* PUBLIC EVENT PRICING FLOW */}
              {formData.audienceType === 'public' && !formData.isFreeAdmission && (
                <div className="max-w-xs">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Public Entry Ticket (₹)</label>
                  <input
                    type="number"
                    value={formData.generalAdultPrice}
                    onChange={e => setFormData({ ...formData, generalAdultPrice: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Public pass rate for general visitors.</span>
                </div>
              )}
            </div>

            {/* Simple Food Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Food & Refreshments Scheme</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'No Food' },
                  { id: 'free_with_count', label: 'Free Food (Counted Headcount)' },
                  { id: 'paid_addon', label: 'Paid Food Buffet' },
                  { id: 'included_in_ticket', label: 'Included in Ticket' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, foodType: f.id as EventFoodType })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      formData.foodType === f.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Send QR Tickets via Channels:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'whatsapp' as TicketDeliveryChannel, label: 'WhatsApp', icon: MessageSquare },
                  { id: 'email' as TicketDeliveryChannel, label: 'Email', icon: Mail },
                  { id: 'sms' as TicketDeliveryChannel, label: 'SMS', icon: Smartphone }
                ].map(ch => {
                  const Icon = ch.icon;
                  const isChecked = formData.ticketChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleTicketChannel(ch.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MULTI-SESSION PANEL IN SIMPLE QUICK FLOW */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Configured Sessions & Attendance Modes ({sessions.length})
                </label>
                <p className="text-[11px] text-slate-500">
                  Each session independently configures its schedule, space, and attendance mode.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSession}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Session</span>
              </button>
            </div>

            {/* Sessions Cards List in Simple Mode */}
            <div className="space-y-2">
              {sessions.map((sess, idx) => {
                const modeCfg = ATTENDANCE_MODE_CONFIGS.find(m => m.id === sess.attendanceMode) || ATTENDANCE_MODE_CONFIGS[0];
                return (
                  <div 
                    key={sess.id || idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{sess.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${modeCfg.color}`}>
                          {modeCfg.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {sess.isFree ? 'Free' : `₹${sess.pricing.memberAdult} (Mem) / ₹${sess.pricing.nonMemberAdult} (Guest)`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <span>🗓️ {sess.date}</span>
                        <span>⏰ {sess.startTime} - {sess.endTime}</span>
                        <span>📍 {sess.venueName} • {sess.spaceName}</span>
                        <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          Sellable: {sess.sellableCapacity} seats
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSession(idx)}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          title="Remove session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simple Save Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleOpenAddSession}
                className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>+ Add another session</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreationMode('advanced');
                  setStep(3);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" /> Full Advanced Multi-Session Architect
              </button>
            </div>

            <button
              type="button"
              onClick={handleCompleteSave}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Publish Simple Event Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADVANCED FLOW (FULL COMMUNITY SYSTEM WITH BANNER, LOGO & VENUE MAP)     */}
      {/* ========================================================================= */}
      {creationMode === 'advanced' && (
        <div className="space-y-5">
          {/* Advanced Stepper Indicator */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {advancedSteps.map(s => {
              const Icon = s.icon;
              const isDone = s.num < step;
              const isCurrent = s.num === step;
              return (
                <button
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`text-left space-y-1 p-2 rounded-xl border transition ${
                    isCurrent 
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10' 
                      : isDone 
                      ? 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer' 
                      : 'bg-slate-50 border-transparent opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isCurrent ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isDone ? <Check className="w-2.5 h-2.5" /> : s.num}
                    </div>
                    <Icon className={`w-3.5 h-3.5 hidden sm:block ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <p className={`text-[10px] font-bold truncate leading-tight ${isCurrent ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {s.title}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Advanced Step Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">

            {/* STEP 1: Audience Type, Basics, Banner & Logo Branding */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Event Overview, Audience & Media Branding</h3>
                  <p className="text-xs text-slate-500">
                    Select your event's target audience to customize the flow, upload official cover banner and logo, and set basic event details.
                  </p>
                </div>

                {/* 1. AUDIENCE TYPE SELECTOR */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-600" />
                        1. Select Event Audience Type *
                      </span>
                      <span className="text-[11px] text-slate-500">Pricing, guest quotas, and attendee registration adapt dynamically</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {AUDIENCE_TYPES.find(a => a.id === formData.audienceType)?.title} Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {AUDIENCE_TYPES.map(at => {
                      const Icon = at.icon;
                      const isSelected = formData.audienceType === at.id;
                      return (
                        <div
                          key={at.id}
                          onClick={() => setFormData({ 
                            ...formData, 
                            audienceType: at.id,
                            allowNonMembers: at.id !== 'only_member'
                          })}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                              : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected ? at.badgeColor : 'bg-slate-100 text-slate-500'
                              }`}>
                                {at.badge}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-900 block mb-0.5">{at.title}</span>
                            <span className="text-[10px] font-semibold text-indigo-600 block mb-1.5">{at.tagline}</span>
                            <p className="text-[11px] text-slate-500 leading-tight">{at.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. BANNER & LOGO VISUAL MEDIA UPLOADER */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        2. Event Cover Banner & Logo Media Facility
                      </span>
                      <span className="text-[11px] text-slate-500">Upload your own files, choose high-res presets, or paste web image links</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Banner: 16:9 • Logo: 1:1</span>
                  </div>

                  {/* Visual Live Preview Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-900 group">
                    <div className="h-48 sm:h-56 w-full relative">
                      <img 
                        src={formData.bannerUrl} 
                        alt="Event Banner" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />
                    </div>

                    {/* Logo Badge layered on bottom left */}
                    <div className="absolute left-5 bottom-4 flex items-end gap-3.5 z-10">
                      <div 
                        onClick={() => logoFileInputRef.current?.click()}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-xl ring-2 ring-white/90 overflow-hidden relative cursor-pointer group/badge"
                        title="Click to Upload Logo"
                      >
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo" 
                          className="w-full h-full object-cover rounded-xl" 
                        />
                        <div className="absolute inset-0 bg-black/50 text-white rounded-xl opacity-0 group-hover/badge:opacity-100 flex flex-col items-center justify-center transition text-[9px] font-bold">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Change</span>
                        </div>
                      </div>

                      <div className="text-white pb-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded text-white inline-block">
                            {formData.category} OFFICIAL EVENT
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/80 backdrop-blur-md px-2 py-0.5 rounded text-white">
                            {AUDIENCE_TYPES.find(a => a.id === formData.audienceType)?.title}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-sm">{formData.name || 'Your Event Title'}</h4>
                        <p className="text-[11px] text-white/80">{formData.date} • {formData.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Banner Upload / Presets / URL Tabs */}
                  <div className="space-y-2 pt-1 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Event Cover Banner</span>
                      
                      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => setBannerActiveTab('upload')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            bannerActiveTab === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerActiveTab('presets')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            bannerActiveTab === 'presets' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Presets Gallery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerActiveTab('url')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            bannerActiveTab === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>Web URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Banner Upload Tab */}
                    {bannerActiveTab === 'upload' && (
                      <div 
                        onDragOver={e => { e.preventDefault(); setIsBannerDragging(true); }}
                        onDragLeave={() => setIsBannerDragging(false)}
                        onDrop={e => {
                          e.preventDefault();
                          setIsBannerDragging(false);
                          if (e.dataTransfer.files?.[0]) handleBannerFile(e.dataTransfer.files[0]);
                        }}
                        className={`p-4 rounded-xl border-2 border-dashed transition text-center bg-white ${
                          isBannerDragging ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileUp className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Drag and drop your event banner image here, or{' '}
                              <button
                                type="button"
                                onClick={() => bannerFileInputRef.current?.click()}
                                className="text-indigo-600 hover:underline font-bold"
                              >
                                browse files
                              </button>
                            </p>
                            <p className="text-[10px] text-slate-400">Supports PNG, JPG, JPEG, WebP, SVG up to 10MB (Optimal ratio: 16:9)</p>
                          </div>

                          {bannerUploadInfo && (
                            <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active Banner: <strong>{bannerUploadInfo.name}</strong> ({bannerUploadInfo.size})</span>
                              <button
                                type="button"
                                onClick={() => bannerFileInputRef.current?.click()}
                                className="text-indigo-600 hover:underline ml-2"
                              >
                                Replace
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Banner Presets Tab */}
                    {bannerActiveTab === 'presets' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BANNER_PRESETS.map(bp => (
                          <div
                            key={bp.name}
                            onClick={() => {
                              setFormData({ ...formData, bannerUrl: bp.url });
                              setBannerUploadInfo(null);
                            }}
                            className={`p-2 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                              formData.bannerUrl === bp.url && !bannerUploadInfo
                                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <img src={bp.url} alt={bp.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="overflow-hidden">
                              <span className="text-[11px] font-bold text-slate-800 block truncate">{bp.name}</span>
                              <span className="text-[10px] text-slate-400">{bp.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Banner URL Tab */}
                    {bannerActiveTab === 'url' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste public image URL (e.g. https://images.unsplash.com/...)"
                          value={customBannerInput}
                          onChange={e => setCustomBannerInput(e.target.value)}
                          className="text-xs p-2 border border-slate-200 rounded-lg bg-white flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customBannerInput) {
                              setFormData({ ...formData, bannerUrl: customBannerInput });
                              setBannerUploadInfo(null);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                        >
                          Apply URL
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logo Upload / Presets / URL Tabs */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Event Logo / Crest Badge</span>
                      
                      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => setLogoActiveTab('upload')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            logoActiveTab === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Logo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoActiveTab('presets')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            logoActiveTab === 'presets' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Presets</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoActiveTab('url')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                            logoActiveTab === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          <span>Web URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Logo Upload Tab */}
                    {logoActiveTab === 'upload' && (
                      <div 
                        onDragOver={e => { e.preventDefault(); setIsLogoDragging(true); }}
                        onDragLeave={() => setIsLogoDragging(false)}
                        onDrop={e => {
                          e.preventDefault();
                          setIsLogoDragging(false);
                          if (e.dataTransfer.files?.[0]) handleLogoFile(e.dataTransfer.files[0]);
                        }}
                        className={`p-3.5 rounded-xl border-2 border-dashed transition text-center bg-white ${
                          isLogoDragging ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs font-bold text-slate-800">
                              Upload Square 1:1 Badge Icon
                            </p>
                            <p className="text-[10px] text-slate-400">PNG, SVG or JPG format with transparent or solid background</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shrink-0 flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Browse Logo</span>
                          </button>
                        </div>
                        {logoUploadInfo && (
                          <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-md border border-emerald-200 inline-block">
                            ✅ Uploaded: {logoUploadInfo.name} ({logoUploadInfo.size})
                          </div>
                        )}
                      </div>
                    )}

                    {/* Logo Presets Tab */}
                    {logoActiveTab === 'presets' && (
                      <div className="flex flex-wrap gap-2">
                        {LOGO_PRESETS.map(lp => (
                          <div
                            key={lp.name}
                            onClick={() => {
                              setFormData({ ...formData, logoUrl: lp.url });
                              setLogoUploadInfo(null);
                            }}
                            className={`p-1.5 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                              formData.logoUrl === lp.url && !logoUploadInfo
                                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <img src={lp.url} alt={lp.name} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-[11px] font-semibold text-slate-700 pr-1">{lp.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Logo URL Tab */}
                    {logoActiveTab === 'url' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste public logo badge image URL..."
                          value={customLogoInput}
                          onChange={e => setCustomLogoInput(e.target.value)}
                          className="text-xs p-2 border border-slate-200 rounded-lg bg-white flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customLogoInput) {
                              setFormData({ ...formData, logoUrl: customLogoInput });
                              setLogoUploadInfo(null);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                        >
                          Apply URL
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Title & Classification */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="Cultural">Cultural & Arts</option>
                        <option value="Festival">Festival & Celebration</option>
                        <option value="Sports">Sports & Fitness</option>
                        <option value="General Body">General Body (AGM)</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Charity">Charity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Expected Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Multiple Venues Selection */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        Select Multiple Reserved Venues / Facilities
                      </label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        {formData.venues.length} Venues Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {AVAILABLE_VENUES.map(v => {
                        const isSelected = formData.venues.includes(v);
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => toggleVenue(v)}
                            className={`p-2 rounded-lg text-[11px] font-semibold border text-left transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{v}</span>
                            {isSelected && <Check className="w-3 h-3 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Highlights</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Venue Location Map Facility */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Venue Location Map Facility</h3>
                  <p className="text-xs text-slate-500">
                    Pin the exact GPS coordinates and gate entrance on the interactive community map so attendees receive navigation links on their passes.
                  </p>
                </div>

                {/* Preset Venue Geolocation Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-700 block">Quick Preset Locations:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {VENUE_MAP_PRESETS.map(preset => (
                      <button
                        key={preset.venue}
                        type="button"
                        onClick={() => applyVenuePreset(preset)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          formData.venueMap.latitude === preset.latitude
                            ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{preset.venue}</span>
                          <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                            {preset.gateEntrance.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{preset.landmark}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Map Visual Simulator */}
                <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-sm space-y-0">
                  {/* Map Header Controls */}
                  <div className="bg-slate-900 text-white p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Interactive Geolocation Map Canvas</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        Lat: {formData.venueMap.latitude.toFixed(4)}, Long: {formData.venueMap.longitude.toFixed(4)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Map Style Toggle */}
                      <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setMapStyle('roadmap')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mapStyle === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          Roadmap
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapStyle('satellite')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mapStyle === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          Satellite
                        </button>
                      </div>

                      {/* Zoom Buttons */}
                      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setMapZoom(z => Math.max(12, z - 1))}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] px-1 text-slate-300 font-mono">{mapZoom}x</span>
                        <button
                          type="button"
                          onClick={() => setMapZoom(z => Math.min(18, z + 1))}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simulated SVG Interactive Map Grid with Pulsing Pin */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width;
                      const y = (e.clientY - rect.top) / rect.height;
                      // Update lat/long slightly based on click position
                      const newLat = 12.9230 + (1 - y) * 0.005;
                      const newLng = 77.6730 + x * 0.005;
                      setFormData(prev => ({
                        ...prev,
                        venueMap: {
                          ...prev.venueMap,
                          latitude: parseFloat(newLat.toFixed(4)),
                          longitude: parseFloat(newLng.toFixed(4)),
                          googleMapsUrl: `https://maps.google.com/?q=${newLat.toFixed(4)},${newLng.toFixed(4)}`
                        }
                      }));
                    }}
                    className={`h-72 w-full relative cursor-crosshair overflow-hidden ${
                      mapStyle === 'satellite' 
                        ? 'bg-slate-900' 
                        : 'bg-[#e5e3df]'
                    }`}
                  >
                    {/* Map Graphic Layer */}
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {mapStyle === 'roadmap' ? (
                        <>
                          {/* Park Green Areas */}
                          <rect x="5%" y="10%" width="30%" height="45%" rx="12" fill="#c8e6c9" opacity="0.8"/>
                          <rect x="65%" y="40%" width="30%" height="50%" rx="12" fill="#c8e6c9" opacity="0.8"/>
                          {/* Water Body / Lake */}
                          <path d="M 40% 15% Q 55% 5%, 65% 20% T 55% 35% Z" fill="#b3e5fc" opacity="0.9"/>
                          {/* Road Networks */}
                          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ffffff" strokeWidth="16"/>
                          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ffcc80" strokeWidth="6"/>
                          <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#ffffff" strokeWidth="18"/>
                          <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#ffe082" strokeWidth="8"/>
                          <line x1="10%" y1="90%" x2="90%" y2="20%" stroke="#ffffff" strokeWidth="10"/>
                          {/* Buildings / Facility Footprints */}
                          <rect x="48%" y="45%" width="22%" height="25%" rx="6" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2"/>
                          <text x="50%" y="58%" fill="#37474f" fontSize="11" fontWeight="bold">Main Auditorium</text>
                          <rect x="10%" y="55%" width="20%" height="22%" rx="6" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2"/>
                          <text x="12%" y="67%" fill="#37474f" fontSize="10" fontWeight="bold">Sports Complex</text>
                        </>
                      ) : (
                        <>
                          {/* Satellite Terrain Grid */}
                          <rect width="100%" height="100%" fill="#1a2e1a"/>
                          <circle cx="20%" cy="25%" r="15%" fill="#143614" opacity="0.8"/>
                          <circle cx="80%" cy="70%" r="20%" fill="#143614" opacity="0.8"/>
                          <path d="M 0 40% Q 50% 38% 100% 42%" stroke="#424242" strokeWidth="12" fill="none"/>
                          <path d="M 45% 0 Q 46% 50% 44% 100%" stroke="#424242" strokeWidth="14" fill="none"/>
                          <rect x="48%" y="45%" width="22%" height="25%" rx="4" fill="#37474f" opacity="0.9"/>
                          <text x="50%" y="58%" fill="#eceff1" fontSize="11" fontWeight="bold">Auditorium Complex</text>
                        </>
                      )}
                    </svg>

                    {/* Centered Pulsing Map Pin Marker */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none z-20">
                      <div className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-slate-700 flex items-center gap-1 whitespace-nowrap mb-1 animate-bounce">
                        <MapPin className="w-3 h-3 text-rose-500 fill-rose-500" />
                        <span>{formData.venueMap.gateEntrance || 'Venue Entrance Pin'}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-rose-600/30 flex items-center justify-center animate-ping absolute top-4" />
                      <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Map Overlaid Guide */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-slate-700 font-semibold shadow-xs border border-slate-200">
                      💡 Click anywhere on map to drop custom pin
                    </div>
                  </div>

                  {/* Geolocation Input Fields */}
                  <div className="p-4 bg-white space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Venue Full Address</label>
                        <input
                          type="text"
                          value={formData.venueMap.address}
                          onChange={e => setFormData({
                            ...formData,
                            venueMap: { ...formData.venueMap, address: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Prominent Landmark</label>
                        <input
                          type="text"
                          value={formData.venueMap.landmark}
                          onChange={e => setFormData({
                            ...formData,
                            venueMap: { ...formData.venueMap, landmark: e.target.value }
                          })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={formData.venueMap.latitude}
                          onChange={e => setFormData({
                            ...formData,
                            venueMap: { 
                              ...formData.venueMap, 
                              latitude: parseFloat(e.target.value) || 0,
                              googleMapsUrl: `https://maps.google.com/?q=${e.target.value},${formData.venueMap.longitude}`
                            }
                          })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={formData.venueMap.longitude}
                          onChange={e => setFormData({
                            ...formData,
                            venueMap: { 
                              ...formData.venueMap, 
                              longitude: parseFloat(e.target.value) || 0,
                              googleMapsUrl: `https://maps.google.com/?q=${formData.venueMap.latitude},${e.target.value}`
                            }
                          })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Designated Gate Entrance</label>
                        <input
                          type="text"
                          value={formData.venueMap.gateEntrance}
                          onChange={e => setFormData({
                            ...formData,
                            venueMap: { ...formData.venueMap, gateEntrance: e.target.value },
                            parkingGate: e.target.value
                          })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Multi-Session Architecture & Schedule */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                        Core Model
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Event → Sessions → Venue Spaces → Ticket Inventory
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Multi-Session Architecture & Schedule</h3>
                    <p className="text-xs text-slate-500">
                      Configure multiple sessions across different dates, times, and venue spaces. Each session independently defines its attendance mode.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddSession}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Session</span>
                  </button>
                </div>

                {/* Overlap Conflict Engine Warning */}
                {sessionConflicts.length > 0 && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Venue Space Booking Conflict Detected ({sessionConflicts.length})</span>
                    </div>
                    {sessionConflicts.map((c, i) => (
                      <p key={i} className="text-[11px] text-rose-800">
                        • <strong>{c.s1.name}</strong> and <strong>{c.s2.name}</strong> both reserve <strong>{c.s1.spaceName}</strong> ({c.s1.venueName}) on {c.s1.date}. Verify setup and teardown turnaround buffers!
                      </p>
                    ))}
                  </div>
                )}

                {/* Pass Options Configurator */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                        Event Pass & Ticketing Model
                      </h4>
                      <p className="text-[11px] text-slate-500">Choose how attendees gain admission across sessions</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                      Pass Mode: {passOption === 'both' ? 'Whole & Session Pass' : passOption === 'whole_event_pass' ? 'Whole Event Pass Only' : 'Session Pass Only'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'both' as EventPassOption,
                        title: 'Both (Recommended)',
                        desc: 'Offer an all-access whole-event festival pass + single session passes.'
                      },
                      {
                        id: 'whole_event_pass' as EventPassOption,
                        title: 'Whole-Event Pass Only',
                        desc: 'One pass grants admission to every session in this multi-session event.'
                      },
                      {
                        id: 'session_pass' as EventPassOption,
                        title: 'Individual Session Passes',
                        desc: 'Attendees purchase or register for individual sessions separately.'
                      }
                    ].map(opt => {
                      const isSelected = passOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPassOption(opt.id)}
                          className={`p-3 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Whole Event Pass Pricing Row */}
                  {(passOption === 'both' || passOption === 'whole_event_pass') && (
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Whole Pass Member (Adult)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                          <input
                            type="number"
                            value={wholePassPricing.memberAdult}
                            onChange={e => setWholePassPricing({ ...wholePassPricing, memberAdult: parseInt(e.target.value) || 0 })}
                            className="w-full pl-6 p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Whole Pass Member (Child)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                          <input
                            type="number"
                            value={wholePassPricing.memberChild}
                            onChange={e => setWholePassPricing({ ...wholePassPricing, memberChild: parseInt(e.target.value) || 0 })}
                            className="w-full pl-6 p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Whole Pass Guest (Adult)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                          <input
                            type="number"
                            value={wholePassPricing.nonMemberAdult}
                            onChange={e => setWholePassPricing({ ...wholePassPricing, nonMemberAdult: parseInt(e.target.value) || 0 })}
                            className="w-full pl-6 p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Whole Pass Guest (Child)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                          <input
                            type="number"
                            value={wholePassPricing.nonMemberChild}
                            onChange={e => setWholePassPricing({ ...wholePassPricing, nonMemberChild: parseInt(e.target.value) || 0 })}
                            className="w-full pl-6 p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pass Inventory Cap</label>
                        <input
                          type="number"
                          value={wholePassCapacity}
                          onChange={e => setWholePassCapacity(parseInt(e.target.value) || 0)}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Configured Sessions List Grouped by Day */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      Scheduled Sessions ({sessions.length})
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Total Sellable Capacity: {sessions.reduce((acc, s) => acc + s.sellableCapacity, 0)} seats
                    </span>
                  </div>

                  {(() => {
                    // Group sessions by date
                    const grouped: Record<string, EventSession[]> = {};
                    sessions.forEach(s => {
                      if (!grouped[s.date]) grouped[s.date] = [];
                      grouped[s.date].push(s);
                    });

                    return Object.entries(grouped).map(([dateStr, daySessions], dayIdx) => (
                      <div key={dateStr} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px]">
                            Day {dayIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{dateStr}</span>
                          <span className="text-[10px] text-slate-400">({daySessions.length} sessions)</span>
                        </div>

                        <div className="space-y-2.5">
                          {daySessions.map((sess) => {
                            const originalIdx = sessions.findIndex(s => s.id === sess.id);
                            const modeCfg = ATTENDANCE_MODE_CONFIGS.find(m => m.id === sess.attendanceMode) || ATTENDANCE_MODE_CONFIGS[0];

                            return (
                              <div
                                key={sess.id}
                                className="p-4 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-xl transition shadow-xs space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-xs text-slate-900">{sess.name}</span>
                                      {/* Attendance Mode Badge */}
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${modeCfg.color}`}>
                                        {modeCfg.title}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-500">
                                        {sess.isFree ? (
                                          <span className="text-emerald-700 font-bold">100% Free Entry</span>
                                        ) : (
                                          `Mem: ₹${sess.pricing.memberAdult} • Guest: ₹${sess.pricing.nonMemberAdult}`
                                        )}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {sess.startTime} - {sess.endTime} ({sess.timezone})
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-rose-500" />
                                        <strong>{sess.venueName}</strong> • {sess.spaceName}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditSession(originalIdx)}
                                      className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSession(originalIdx)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                      title="Remove session"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Capacity & Turnaround Buffer Breakdown */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500 block text-[10px]">Operating Safety Limit</span>
                                    <span className="font-bold text-slate-800">{sess.venueOperatingLimit} seats</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500 block text-[10px]">Reserved Holds</span>
                                    <span className="font-semibold text-slate-700">
                                      Staff: {sess.holds.staff} • Access: {sess.holds.accessible} • Safety: {sess.holds.safetyBuffer}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-indigo-50/70 border border-indigo-100 rounded-lg">
                                    <span className="text-indigo-800 block text-[10px] font-bold">Sellable Capacity</span>
                                    <span className="font-extrabold text-indigo-950">{sess.sellableCapacity} tickets</span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <span className="text-slate-500 block text-[10px]">Turnaround Buffers</span>
                                    <span className="font-semibold text-slate-700">
                                      Setup: {sess.setupBufferMinutes}m • Teardown: {sess.teardownBufferMinutes}m
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* STEP 4: Audience Governance & Parking */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Audience Governance & Parking Management</h3>
                  <p className="text-xs text-slate-500">
                    Review admission eligibility based on your selected audience type, and configure parking bays.
                  </p>
                </div>

                {/* Audience Governance Info Banner based on Audience Type */}
                {formData.audienceType === 'only_member' && (
                  <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-purple-700" />
                      <span className="text-xs font-bold text-purple-950">
                        Restricted: Only Community Members / Residents
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-700">
                      Non-member registration is permanently locked for this event. Attendees will be required to verify their Resident Member ID or apartment unit upon booking and at the gate check-in point.
                    </p>
                  </div>
                )}

                {formData.audienceType === 'member_and_non_member' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData({ ...formData, allowNonMembers: false })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        !formData.allowNonMembers
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">Members Priority Only</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Strictly reserve seats for community residents first.</p>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, allowNonMembers: true })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        formData.allowNonMembers
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">Members & Non-Member Guests</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Allows residents to invite outside guests at tiered pricing.</p>
                    </div>
                  </div>
                )}

                {formData.audienceType === 'general' && (
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-amber-700" />
                      <span className="text-xs font-bold text-amber-950">
                        General Audience Event
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Standard registration rules apply to all attendees. There is no distinction or restriction between members and non-members.
                    </p>
                  </div>
                )}

                {formData.audienceType === 'public' && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-950">
                        Open Public Festival & City Event
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Registration is open to the public without community boundary. Great for large exhibitions, concerts, or charity drives.
                    </p>
                  </div>
                )}

                {/* Parking Area */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Designated Parking Area & Gate Access</span>
                        <span className="text-[11px] text-slate-500">Generate parking pass on digital tickets</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.parkingEnabled}
                        onChange={e => setFormData({ ...formData, parkingEnabled: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-xs font-bold text-slate-800">Enable Parking Pass</span>
                    </label>
                  </div>

                  {formData.parkingEnabled && (
                    <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Parking Zone / Bay Name</label>
                          <input
                            type="text"
                            value={formData.parkingZone}
                            onChange={e => setFormData({ ...formData, parkingZone: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gate Entrance</label>
                          <input
                            type="text"
                            value={formData.parkingGate}
                            onChange={e => setFormData({ ...formData, parkingGate: e.target.value })}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Total Parking Slots</label>
                          <input
                            type="number"
                            value={formData.parkingTotalSlots}
                            onChange={e => setFormData({ ...formData, parkingTotalSlots: parseInt(e.target.value) || 0 })}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.parkingValet}
                              onChange={e => setFormData({ ...formData, parkingValet: e.target.checked })}
                              className="rounded border-slate-300 text-indigo-600"
                            />
                            <span className="font-semibold text-slate-800">Valet Service</span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.parkingEvCharging}
                              onChange={e => setFormData({ ...formData, parkingEvCharging: e.target.checked })}
                              className="rounded border-slate-300 text-indigo-600"
                            />
                            <span className="font-semibold text-slate-800">EV Charging Bay</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Admission Ticket Pricing Matrix */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Admission Ticket Pricing Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Configure ticket rates customized for your selected audience type (
                    <strong className="text-indigo-600">{AUDIENCE_TYPES.find(a => a.id === formData.audienceType)?.title}</strong>).
                  </p>
                </div>

                {/* 1. ONLY MEMBERS FLOW */}
                {formData.audienceType === 'only_member' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Complimentary Free Event for Members</span>
                        <span className="text-[11px] text-emerald-700">Members pay ₹0 admission fee</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFreeForMembers}
                          onChange={e => setFormData({ ...formData, isFreeForMembers: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 text-xs">
                        <span className="font-bold text-indigo-900 block">Member Resident Admission Rates</span>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Member Adult Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeForMembers}
                            value={formData.isFreeForMembers ? 0 : formData.memberAdultPrice}
                            onChange={e => setFormData({ ...formData, memberAdultPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Member Child Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeForMembers}
                            value={formData.isFreeForMembers ? 0 : formData.memberChildPrice}
                            onChange={e => setFormData({ ...formData, memberChildPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/60 space-y-2 text-xs flex flex-col justify-center items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-purple-600 mb-1" />
                        <span className="font-bold text-purple-950">Non-Member Ticketing Disabled</span>
                        <p className="text-[11px] text-purple-700 max-w-xs">
                          Because this event is set to <strong>Only Members</strong>, non-member ticket sales and outside registrations are omitted from the flow.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MEMBER & NON-MEMBER FLOW */}
                {formData.audienceType === 'member_and_non_member' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Complimentary Free Event for Members</span>
                        <span className="text-[11px] text-emerald-700">Members pay ₹0 admission fee</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFreeForMembers}
                          onChange={e => setFormData({ ...formData, isFreeForMembers: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 text-xs">
                        <span className="font-bold text-indigo-900 block">Member Admission Rates</span>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Member Adult Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeForMembers}
                            value={formData.isFreeForMembers ? 0 : formData.memberAdultPrice}
                            onChange={e => setFormData({ ...formData, memberAdultPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Member Child Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeForMembers}
                            value={formData.isFreeForMembers ? 0 : formData.memberChildPrice}
                            onChange={e => setFormData({ ...formData, memberChildPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                        <span className="font-bold text-slate-900 block">Non-Member Guest Admission Rates</span>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Guest Adult Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={!formData.allowNonMembers}
                            value={formData.nonMemberAdultPrice}
                            onChange={e => setFormData({ ...formData, nonMemberAdultPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Guest Child Ticket (₹)</label>
                          <input
                            type="number"
                            disabled={!formData.allowNonMembers}
                            value={formData.nonMemberChildPrice}
                            onChange={e => setFormData({ ...formData, nonMemberChildPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. GENERAL AUDIENCE FLOW */}
                {formData.audienceType === 'general' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">100% Free General Admission Event</span>
                        <span className="text-[11px] text-emerald-700">All attendees receive complimentary tickets</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFreeAdmission}
                          onChange={e => setFormData({ ...formData, isFreeAdmission: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3 text-xs">
                      <span className="font-bold text-amber-950 block">Standard General Admission Rates</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Adult Ticket Price (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeAdmission}
                            value={formData.isFreeAdmission ? 0 : formData.generalAdultPrice}
                            onChange={e => setFormData({ ...formData, generalAdultPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Child Ticket Price (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeAdmission}
                            value={formData.isFreeAdmission ? 0 : formData.generalChildPrice}
                            onChange={e => setFormData({ ...formData, generalChildPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. OPEN PUBLIC EVENT FLOW */}
                {formData.audienceType === 'public' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">100% Free Public Entry Festival</span>
                        <span className="text-[11px] text-emerald-700">Open to public visitors without ticket fee</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFreeAdmission}
                          onChange={e => setFormData({ ...formData, isFreeAdmission: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 text-xs">
                      <span className="font-bold text-emerald-950 block">Public Entry Pass Pricing</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Public Adult Entry Fee (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeAdmission}
                            value={formData.isFreeAdmission ? 0 : formData.generalAdultPrice}
                            onChange={e => setFormData({ ...formData, generalAdultPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">Public Child Entry Fee (₹)</label>
                          <input
                            type="number"
                            disabled={formData.isFreeAdmission}
                            value={formData.isFreeAdmission ? 0 : formData.generalChildPrice}
                            onChange={e => setFormData({ ...formData, generalChildPrice: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: Food & Catering Logistics + Food Menu */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Food Catering Scheme & Course Menu</h3>
                  <p className="text-xs text-slate-500">
                    Configure whether food is common or tiered by membership, and build the course-by-course menu.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'free_with_count', title: 'Free with Count', sub: '100% Free, Headcount Tracked' },
                    { id: 'paid_addon', title: 'Paid Food Buffet', sub: 'Meal tickets purchased' },
                    { id: 'included_in_ticket', title: 'Included in Ticket', sub: 'Refreshments bundled' },
                    { id: 'none', title: 'No Food', sub: 'Self-serve / stalls' }
                  ].map(ft => (
                    <button
                      key={ft.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, foodType: ft.id as EventFoodType })}
                      className={`p-3 rounded-xl border text-left transition ${
                        formData.foodType === ft.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900 block">{ft.title}</span>
                      <span className="text-[10px] text-slate-500">{ft.sub}</span>
                    </button>
                  ))}
                </div>

                {formData.foodType === 'paid_addon' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Food Pricing Mode:</span>
                      
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, foodPricingMode: 'common' })}
                          className={`px-2.5 py-1 rounded-md transition ${
                            formData.foodPricingMode === 'common'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Common Food Price for All
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, foodPricingMode: 'tiered' })}
                          className={`px-2.5 py-1 rounded-md transition ${
                            formData.foodPricingMode === 'tiered'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Separate Member vs Non-Member Rate
                        </button>
                      </div>
                    </div>

                    {formData.foodPricingMode === 'common' ? (
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Common Adult Meal Rate (₹ per plate)
                          </label>
                          <input
                            type="number"
                            value={formData.foodPriceAdult}
                            onChange={e => setFormData({ ...formData, foodPriceAdult: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Common Child Meal Rate (₹ per plate)
                          </label>
                          <input
                            type="number"
                            value={formData.foodPriceChild}
                            onChange={e => setFormData({ ...formData, foodPriceChild: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg space-y-2">
                          <span className="font-bold text-indigo-900 block text-[11px]">Subsidized Member Food Rate</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Adult (₹):</span>
                              <input
                                type="number"
                                value={formData.foodMemberPriceAdult}
                                onChange={e => setFormData({ ...formData, foodMemberPriceAdult: parseInt(e.target.value) || 0 })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Child (₹):</span>
                              <input
                                type="number"
                                value={formData.foodMemberPriceChild}
                                onChange={e => setFormData({ ...formData, foodMemberPriceChild: parseInt(e.target.value) || 0 })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg space-y-2">
                          <span className="font-bold text-amber-900 block text-[11px]">Guest / Non-Member Food Rate</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Adult (₹):</span>
                              <input
                                type="number"
                                value={formData.foodNonMemberPriceAdult}
                                onChange={e => setFormData({ ...formData, foodNonMemberPriceAdult: parseInt(e.target.value) || 0 })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Child (₹):</span>
                              <input
                                type="number"
                                value={formData.foodNonMemberPriceChild}
                                onChange={e => setFormData({ ...formData, foodNonMemberPriceChild: parseInt(e.target.value) || 0 })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Food Menu Courses Builder */}
                {formData.foodType !== 'none' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-indigo-600" />
                        Detailed Food Menu Courses
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {formData.menuCourses.map((course, cIdx) => (
                        <div key={course.course} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{course.course}</span>
                            <span className="text-[10px] text-slate-400">{course.items.length} items</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {course.items.map((item, iIdx) => (
                              <span 
                                key={item}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] transition"
                              >
                                <span>{item}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMenuItem(cIdx, iIdx)}
                                  className="text-slate-400 hover:text-rose-600 ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <select
                        value={selectedCourseIndex}
                        onChange={e => setSelectedCourseIndex(parseInt(e.target.value))}
                        className="text-xs p-2 border border-slate-200 rounded-lg bg-white"
                      >
                        {formData.menuCourses.map((c, i) => (
                          <option key={c.course} value={i}>{c.course}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Add dish / item name..."
                        value={newMenuItem}
                        onChange={e => setNewMenuItem(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMenuItem())}
                        className="text-xs p-2 border border-slate-200 rounded-lg bg-white flex-1"
                      />

                      <button
                        type="button"
                        onClick={handleAddMenuItem}
                        className="px-3 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: Channels to Send Tickets & QR Code System */}
            {step === 7 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Channels to Send Tickets & Digital QR Code System</h3>
                  <p className="text-xs text-slate-500">
                    Configure multi-channel e-ticket delivery and preview the attendee digital boarding pass with scannable QR.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">Enabled Ticket Dispatch Channels</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'whatsapp' as TicketDeliveryChannel,
                        title: 'WhatsApp Instant PDF',
                        desc: 'Sends high-res PDF ticket with scannable QR code directly to attendee WhatsApp.',
                        icon: MessageSquare,
                        badge: 'Recommended'
                      },
                      {
                        id: 'email' as TicketDeliveryChannel,
                        title: 'Email E-Ticket (.ics)',
                        desc: 'Formatted HTML email ticket with calendar invite and Google Wallet pass.',
                        icon: Mail,
                        badge: 'Official'
                      },
                      {
                        id: 'sms' as TicketDeliveryChannel,
                        title: 'SMS Fast Pass',
                        desc: 'Short SMS link with gate check-in PIN and parking directions.',
                        icon: Smartphone,
                        badge: 'Reliable'
                      },
                      {
                        id: 'in_app' as TicketDeliveryChannel,
                        title: 'In-App Resident Wallet',
                        desc: 'Saved directly in the resident mobile portal under "My Event Passes".',
                        icon: Layers,
                        badge: 'Seamless'
                      },
                      {
                        id: 'badge_kiosk' as TicketDeliveryChannel,
                        title: 'Gate Kiosk Badge Print',
                        desc: 'Allows attendees to tap RFID or enter code at reception for physical badge.',
                        icon: QrCode,
                        badge: 'On-Site'
                      }
                    ].map(ch => {
                      const Icon = ch.icon;
                      const isSelected = formData.ticketChannels.includes(ch.id);
                      return (
                        <div
                          key={ch.id}
                          onClick={() => toggleTicketChannel(ch.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                {ch.badge}
                              </span>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded text-emerald-600"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                              <Icon className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{ch.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">{ch.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Review & Final Launch */}
            {step === 8 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Review & Final Confirmation</h3>
                  <p className="text-xs text-slate-500">
                    Verify all configurations, media banner, and pinned venue map before publishing into the live schedule.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Media & Venue Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">Media & Venue Location</span>
                    <div className="flex items-center gap-2 pb-1">
                      <img src={formData.bannerUrl} alt="Banner" className="w-16 h-10 object-cover rounded-lg border border-slate-300" />
                      <img src={formData.logoUrl} alt="Logo" className="w-8 h-8 object-cover rounded-lg border border-slate-300" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate">{formData.name}</span>
                        <span className="text-[10px] text-indigo-600">Branding Active</span>
                      </div>
                    </div>
                    <div className="flex justify-between"><span className="text-slate-500">Address:</span> <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">{formData.venueMap.address}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Gate Entrance:</span> <span className="font-semibold text-slate-800">{formData.venueMap.gateEntrance}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">GPS Pin:</span> <span className="font-mono text-emerald-700">{formData.venueMap.latitude}, {formData.venueMap.longitude}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Date/Time:</span> <span className="font-semibold text-slate-800">{formData.date} • {formData.time}</span></div>
                  </div>

                  {/* Pricing & Catering Summary */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">Audience, Pricing & Food</span>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Target Audience:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px]">
                        {AUDIENCE_TYPES.find(a => a.id === formData.audienceType)?.title}
                      </span>
                    </div>

                    {formData.audienceType === 'only_member' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Member Admission:</span> 
                        <span className="font-bold text-emerald-700">
                          {formData.isFreeForMembers ? 'FREE' : `₹${formData.memberAdultPrice} (Ad) / ₹${formData.memberChildPrice} (Ch)`}
                        </span>
                      </div>
                    )}

                    {formData.audienceType === 'member_and_non_member' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Member Ticket:</span> 
                          <span className="font-bold text-emerald-700">
                            {formData.isFreeForMembers ? 'FREE' : `₹${formData.memberAdultPrice} (Ad) / ₹${formData.memberChildPrice} (Ch)`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Guest Ticket:</span> 
                          <span className="font-semibold text-slate-800">
                            {formData.allowNonMembers ? `₹${formData.nonMemberAdultPrice} (Ad) / ₹${formData.nonMemberChildPrice} (Ch)` : 'Members Only'}
                          </span>
                        </div>
                      </>
                    )}

                    {(formData.audienceType === 'general' || formData.audienceType === 'public') && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          {formData.audienceType === 'public' ? 'Public Entry Pass:' : 'General Admission:'}
                        </span> 
                        <span className="font-bold text-emerald-700">
                          {formData.isFreeAdmission ? 'FREE' : `₹${formData.generalAdultPrice} (Ad) / ₹${formData.generalChildPrice} (Ch)`}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-500">Food Scheme:</span> 
                      <span className="font-bold text-indigo-700 capitalize">{formData.foodType.replace(/_/g, ' ')}</span>
                    </div>
                    {formData.foodType === 'paid_addon' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Food Pricing:</span>
                        <span className="font-semibold text-slate-800">
                          {formData.audienceType === 'only_member'
                            ? `Mem: ₹${formData.foodMemberPriceAdult} / Adult • ₹${formData.foodMemberPriceChild} / Child`
                            : formData.foodPricingMode === 'common' || formData.audienceType === 'general' || formData.audienceType === 'public'
                            ? `Common: ₹${formData.foodPriceAdult}/Ad • ₹${formData.foodPriceChild}/Ch`
                            : `Mem: ₹${formData.foodMemberPriceAdult} / Guest: ₹${formData.foodNonMemberPriceAdult}`
                          }
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery Channels:</span> 
                      <span className="font-semibold text-slate-800 capitalize">{formData.ticketChannels.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Session-by-Session Review & Attendance Modes */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        Session-by-Session Schedule & Inventory Review ({sessions.length})
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Pass coverage: <strong className="text-slate-800">{passOption === 'both' ? 'Whole-Event Pass + Single Session Passes' : passOption === 'whole_event_pass' ? 'Whole-Event Pass Only' : 'Single Session Passes Only'}</strong>
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      ✓ {sessions.reduce((acc, s) => acc + s.sellableCapacity, 0)} Total Sellable Seats
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white overflow-hidden">
                    {sessions.map((sess, idx) => {
                      const modeCfg = ATTENDANCE_MODE_CONFIGS.find(m => m.id === sess.attendanceMode) || ATTENDANCE_MODE_CONFIGS[0];
                      return (
                        <div key={sess.id || idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900">{sess.name}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modeCfg.color}`}>
                                {modeCfg.title}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {sess.isFree ? 'Free' : `₹${sess.pricing.memberAdult} / ₹${sess.pricing.nonMemberAdult}`}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                              <span>🗓️ {sess.date}</span>
                              <span>⏰ {sess.startTime} - {sess.endTime}</span>
                              <span>📍 {sess.venueName} • {sess.spaceName}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-indigo-900">{sess.sellableCapacity} sellable seats</div>
                            <div className="text-[10px] text-slate-400">Op Limit: {sess.venueOperatingLimit}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <label className="flex items-center gap-2 text-xs font-semibold text-indigo-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifyAllMembers}
                      onChange={e => setFormData({ ...formData, notifyAllMembers: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    <span>Broadcast instant announcement and push QR ticket links with pinned venue map to residents</span>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setStep(s => Math.max(s - 1, 1))}
                disabled={step === 1}
                className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                Previous Step
              </button>

              {step < 8 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <span>Continue to {advancedSteps[step].title}</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteSave}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Complete Community Event</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Session Add/Edit Modal */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                  Session Architect
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSessionIndex !== null ? 'Edit Session Details' : 'Add New Event Session'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Session Name & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title *</label>
                  <input
                    type="text"
                    value={sessionForm.name}
                    onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })}
                    placeholder="e.g. Day 1: Classical Sitar & Sarod Recital"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Description</label>
                  <textarea
                    rows={2}
                    value={sessionForm.description}
                    onChange={e => setSessionForm({ ...sessionForm, description: e.target.value })}
                    placeholder="Brief description of this session..."
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Date, Time & Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date *</label>
                  <input
                    type="text"
                    value={sessionForm.date}
                    onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                    placeholder="31 Oct 2026"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    value={sessionForm.startTime}
                    onChange={e => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                    placeholder="06:00 PM"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="text"
                    value={sessionForm.endTime}
                    onChange={e => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                    placeholder="08:00 PM"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
                  <input
                    type="text"
                    value={sessionForm.timezone}
                    onChange={e => setSessionForm({ ...sessionForm, timezone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-600 bg-slate-50"
                  />
                </div>
              </div>

              {/* Venue & Specific Space Selection */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <span className="font-bold text-slate-800 text-xs block">Venue & Space Mapping</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Venue Facility *</label>
                    <select
                      value={sessionForm.venueName}
                      onChange={e => {
                        const selectedVenue = e.target.value;
                        const cat = VENUE_SPACES_CATALOG.find(v => v.venueName === selectedVenue) || VENUE_SPACES_CATALOG[0];
                        setSessionForm({
                          ...sessionForm,
                          venueName: cat.venueName,
                          venueId: cat.venueId,
                          spaceName: cat.spaces[0],
                          venueOperatingLimit: cat.operatingLimit,
                          allocatedCapacity: cat.operatingLimit,
                          attendanceMode: cat.supportsModes.includes(sessionForm.attendanceMode) ? sessionForm.attendanceMode : cat.supportsModes[0]
                        });
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    >
                      {VENUE_SPACES_CATALOG.map(v => (
                        <option key={v.venueId} value={v.venueName}>
                          {v.venueName} (Limit: {v.operatingLimit} seats)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Specific Space / Block *</label>
                    <select
                      value={sessionForm.spaceName}
                      onChange={e => setSessionForm({ ...sessionForm, spaceName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                    >
                      {(() => {
                        const cat = VENUE_SPACES_CATALOG.find(v => v.venueName === sessionForm.venueName) || VENUE_SPACES_CATALOG[0];
                        return cat.spaces.map(sp => (
                          <option key={sp} value={sp}>{sp}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                {/* Turnaround Buffers */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-0.5">Setup Buffer (Minutes)</label>
                    <input
                      type="number"
                      value={sessionForm.setupBufferMinutes}
                      onChange={e => setSessionForm({ ...sessionForm, setupBufferMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-0.5">Teardown Buffer (Minutes)</label>
                    <input
                      type="number"
                      value={sessionForm.teardownBufferMinutes}
                      onChange={e => setSessionForm({ ...sessionForm, teardownBufferMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Mode Selector (5 Modes) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 block">Attendance Mode for this Session *</label>
                  <span className="text-[10px] text-slate-500">Mode belongs to the session, not the venue</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ATTENDANCE_MODE_CONFIGS.map(m => {
                    const isSelected = sessionForm.attendanceMode === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSessionForm({ ...sessionForm, attendanceMode: m.id })}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-slate-900">{m.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${m.color}`}>
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{m.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Capacity Calculation & Holds */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Capacity Calculation & Holds</span>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Sellable: {Math.max(0, (sessionForm.allocatedCapacity || 300) - ((sessionForm.holds?.accessible || 0) + (sessionForm.holds?.staff || 0) + (sessionForm.holds?.sponsor || 0) + (sessionForm.holds?.safetyBuffer || 0)))} seats
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Allocated Cap</label>
                    <input
                      type="number"
                      value={sessionForm.allocatedCapacity}
                      onChange={e => setSessionForm({ ...sessionForm, allocatedCapacity: parseInt(e.target.value) || 0 })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Accessible Holds</label>
                    <input
                      type="number"
                      value={sessionForm.holds?.accessible || 0}
                      onChange={e => setSessionForm({
                        ...sessionForm,
                        holds: { ...sessionForm.holds, accessible: parseInt(e.target.value) || 0, staff: sessionForm.holds?.staff || 0, sponsor: sessionForm.holds?.sponsor || 0, safetyBuffer: sessionForm.holds?.safetyBuffer || 0 }
                      })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Staff Holds</label>
                    <input
                      type="number"
                      value={sessionForm.holds?.staff || 0}
                      onChange={e => setSessionForm({
                        ...sessionForm,
                        holds: { ...sessionForm.holds, accessible: sessionForm.holds?.accessible || 0, staff: parseInt(e.target.value) || 0, sponsor: sessionForm.holds?.sponsor || 0, safetyBuffer: sessionForm.holds?.safetyBuffer || 0 }
                      })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Sponsor Holds</label>
                    <input
                      type="number"
                      value={sessionForm.holds?.sponsor || 0}
                      onChange={e => setSessionForm({
                        ...sessionForm,
                        holds: { ...sessionForm.holds, accessible: sessionForm.holds?.accessible || 0, staff: sessionForm.holds?.staff || 0, sponsor: parseInt(e.target.value) || 0, safetyBuffer: sessionForm.holds?.safetyBuffer || 0 }
                      })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Safety Buffer</label>
                    <input
                      type="number"
                      value={sessionForm.holds?.safetyBuffer || 0}
                      onChange={e => setSessionForm({
                        ...sessionForm,
                        holds: { ...sessionForm.holds, accessible: sessionForm.holds?.accessible || 0, staff: sessionForm.holds?.staff || 0, sponsor: sessionForm.holds?.sponsor || 0, safetyBuffer: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing for Session Pass */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Session Ticket Pricing</span>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionForm.isFree}
                      onChange={e => setSessionForm({ ...sessionForm, isFree: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>100% Free Entry for this Session</span>
                  </label>
                </div>

                {!sessionForm.isFree && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div>
                      <label className="block text-slate-600 mb-0.5">Member Adult (₹)</label>
                      <input
                        type="number"
                        value={sessionForm.pricing.memberAdult}
                        onChange={e => setSessionForm({
                          ...sessionForm,
                          pricing: { ...sessionForm.pricing, memberAdult: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Member Child (₹)</label>
                      <input
                        type="number"
                        value={sessionForm.pricing.memberChild}
                        onChange={e => setSessionForm({
                          ...sessionForm,
                          pricing: { ...sessionForm.pricing, memberChild: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Guest Adult (₹)</label>
                      <input
                        type="number"
                        value={sessionForm.pricing.nonMemberAdult}
                        onChange={e => setSessionForm({
                          ...sessionForm,
                          pricing: { ...sessionForm.pricing, nonMemberAdult: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-0.5">Guest Child (₹)</label>
                      <input
                        type="number"
                        value={sessionForm.pricing.nonMemberChild}
                        onChange={e => setSessionForm({
                          ...sessionForm,
                          pricing: { ...sessionForm.pricing, nonMemberChild: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full p-1.5 border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSessionForm}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingSessionIndex !== null ? 'Save Session Changes' : 'Add Session to Event'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

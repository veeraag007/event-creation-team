export type Role = 
  | 'Super Admin' 
  | 'Community Admin' 
  | 'Event Manager' 
  | 'Facility Manager' 
  | 'Volunteer Lead' 
  | 'Finance Manager' 
  | 'Content Manager';

export type NavSection = 
  | 'COMMUNITY' 
  | 'ENGAGEMENT' 
  | 'FACILITIES' 
  | 'PROGRAMS' 
  | 'FINANCE' 
  | 'COMMUNICATION' 
  | 'INSIGHTS' 
  | 'SYSTEM';

export type NavItemKey = 
  | 'dashboard'
  | 'members'
  | 'families'
  | 'events'
  | 'polls'
  | 'volunteers'
  | 'activities'
  | 'sports-areas'
  | 'auditoriums'
  | 'facility-bookings'
  | 'food-programs'
  | 'donations'
  | 'payments'
  | 'refunds'
  | 'invoices'
  | 'announcements'
  | 'notifications'
  | 'media-gallery'
  | 'reports'
  | 'analytics'
  | 'roles-permissions'
  | 'settings'
  | 'audit-logs'
  | 'seat-management'
  | 'my-tickets';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  community: string;
}

export type StatusType = 
  | 'active' 
  | 'pending' 
  | 'suspended' 
  | 'expired' 
  | 'draft' 
  | 'scheduled' 
  | 'published' 
  | 'cancelled' 
  | 'completed' 
  | 'successful' 
  | 'failed' 
  | 'refunded'
  | 'approved'
  | 'rejected'
  | 'maintenance'
  | 'open';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'Standard' | 'Premium' | 'Life' | 'Senior' | 'Honorary';
  status: 'active' | 'pending' | 'suspended' | 'expired';
  familyMembersCount: number;
  familyMembers?: { name: string; relation: string; age: number }[];
  joinedDate: string;
  expiryDate: string;
  lastActivity: string;
  location: string;
  profession: string;
  avatarUrl?: string;
  address?: string;
  emergencyContact?: string;
  paymentHistory?: { id: string; amount: number; date: string; description: string; status: string }[];
  eventAttendance?: { id: string; name: string; date: string; status: string }[];
  bookingsCount?: number;
}

export interface FamilyMemberDependent {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  phone?: string;
  rfidPassNumber?: string;
  isRegisteredVoter?: boolean;
}

export interface FamilyUnit {
  id: string;
  familyCode: string;
  familyName: string;
  headOfFamily: string;
  headRelation: string;
  contactPhone: string;
  contactEmail: string;
  addressUnit: string;
  blockOrTower: string;
  membershipTier: 'Standard' | 'Premium' | 'Life' | 'Senior';
  status: 'active' | 'pending' | 'suspended';
  duesStatus: 'paid' | 'overdue' | 'due-soon';
  balanceDues: number;
  vehicleSlotsCount: number;
  vehicleNumbers: string[];
  members: FamilyMemberDependent[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  residentSince: string;
  lastAccessDate: string;
  facilitiesSubscribed: string[];
  notes?: string;
}

export type EventDietaryOption = 'Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Halal';

export type EventFoodType = 
  | 'none'                // No food provided
  | 'free_with_count'    // Food is free, but headcount (adults & children) is collected for catering
  | 'paid_addon'          // Food is an optional or required paid add-on (adult & child meal prices)
  | 'included_in_ticket'; // Food is included in ticket price, but headcount & dietary preferences are tracked

export type EventAudienceType = 
  | 'general'                // Open to all attendees with single standard admission & food pricing
  | 'member_and_non_member'  // Tiered differential rates for community members vs non-members/guests
  | 'only_member'            // Strictly exclusive to verified community members only
  | 'public';                // Open public festival / city gathering with public registration

export type TicketDeliveryChannel = 'whatsapp' | 'email' | 'sms' | 'in_app' | 'badge_kiosk';

export interface FoodMenuCourse {
  course: string; // e.g., 'Starters & Mocktails', 'Main Course Buffet', 'Desserts & Sweets'
  items: string[];
}

export interface EventPricingTiers {
  memberAdult: number;
  memberChild: number;
  nonMemberAdult: number;
  nonMemberChild: number;
  isFreeForMembers: boolean;
  familyPackagePrice?: number;
}

export interface EventFoodConfig {
  type: EventFoodType;
  mealTitle: string;
  // Food pricing mode: 'common' (same rate for all) or 'tiered' (separate member vs non-member food rates)
  pricingMode?: 'common' | 'tiered';
  // Common rates
  priceAdult?: number;
  priceChild?: number;
  // Tiered rates (member vs non-member)
  memberPriceAdult?: number;
  memberPriceChild?: number;
  nonMemberPriceAdult?: number;
  nonMemberPriceChild?: number;
  dietaryOptions: EventDietaryOption[];
  cateringCutoffDate?: string;
  catererName?: string;
  notes?: string;
  menuCourses?: FoodMenuCourse[];
}

export interface EventParkingConfig {
  enabled: boolean;
  zone: string;
  totalSlots: number;
  slotsAvailable: number;
  gate: string;
  valet: boolean;
  evCharging: boolean;
  mapLocation: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface EventScheduleBlock {
  id: string;
  time: string;
  title: string;
  venue: string;
  performerOrSpeaker?: string;
  description?: string;
}

export interface EventRulesConfig {
  allowNonMembers: boolean;
  maxGuestsPerMember: number;
  childAgeLimit: number;
  requireMemberIdCheck: boolean;
  earlyBirdDiscountPercent?: number;
  volunteerSlots?: number;
}

export interface EventAttendeeStats {
  memberAdults: number;
  memberChildren: number;
  nonMemberAdults: number;
  nonMemberChildren: number;
}

export interface EventFoodStats {
  adultMeals: number;
  childMeals: number;
  vegMeals: number;
  nonVegMeals: number;
  jainMeals: number;
  veganMeals: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  registeredByName: string;
  contactEmail: string;
  contactPhone: string;
  memberId?: string;
  isMember: boolean;
  adultsCount: number;
  childrenCount: number;
  foodOpted: boolean;
  adultMeals: number;
  childMeals: number;
  dietaryPreference: EventDietaryOption;
  totalPaid: number;
  ticketPricePaid: number;
  foodPricePaid: number;
  paymentStatus: 'paid' | 'complimentary' | 'pending';
  registrationDate: string;
  ticketCode: string;
  specialRequests?: string;
  qrCodeData?: string;
  deliveryChannels?: TicketDeliveryChannel[];
  checkInStatus?: 'checked_in' | 'pending';
  checkInTime?: string;
  assignedSeat?: string;
  parkingPassNumber?: string;
  // Multi-session support
  passType?: 'whole_event' | 'session';
  sessionIds?: string[];
  assignedSeatsBySession?: Record<string, string>;
}

export type AttendanceMode = 
  | 'reserved_seating'     // Attendee selects/assigned specific seats from selected auditorium seat map
  | 'general_admission'    // Capacity pool without seat selection (hides seat map even in auditorium)
  | 'mixed_seating'        // Selected blocks reserved seating, remaining capacity in GA pool
  | 'open_space'           // Entry capacity for outdoor area/zone without seat map
  | 'registration_only';   // Free or paid registration with capacity limit (seat selection optional)

export type SessionStatus = 
  | 'draft' 
  | 'ready_for_review' 
  | 'published' 
  | 'registration_closed' 
  | 'completed';

export type EventPassOption = 
  | 'whole_event_pass' 
  | 'session_pass' 
  | 'both';

export interface SessionCapacityHolds {
  accessible: number;
  staff: number;
  sponsor: number;
  safetyBuffer: number;
}

export interface SessionAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  changesSummary: string;
  notifyAttendees: boolean;
  attendeesNotifiedCount?: number;
}

export interface EventSession {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  date: string;               // e.g. "2026-10-16" or "16 Oct 2026"
  startTime: string;          // e.g. "10:00 AM"
  endTime: string;            // e.g. "01:00 PM"
  timezone: string;           // e.g. "IST (UTC+5:30)"
  
  // Venue space, building, and buffer configuration
  venueId: string;
  venueName: string;
  spaceOrBlockId?: string;    // specific room, stage or space
  spaceName?: string;
  setupBufferMinutes: number;    // buffer before start (e.g. 45 min)
  teardownBufferMinutes: number; // buffer after end (e.g. 45 min)
  
  // Attendance mode (required attribute per session)
  attendanceMode: AttendanceMode;
  
  // Capacity and inventory
  venueOperatingLimit: number;   // Maximum operating safety limit for this venue/space
  allocatedCapacity: number;     // Capacity allocated to this session
  holds: SessionCapacityHolds;   // Accessible, staff, sponsor, and safety holds
  sellableCapacity: number;      // allocatedCapacity - sum(holds)
  registrationsCount: number;    // Current tickets/registrations booked
  
  // Reserved / Mixed seating layout selection
  layoutVersion?: string;        // e.g. "v2.4 - Full Proscenium Standard"
  reservedBlockIds?: string[];   // For reserved/mixed modes: blocks assigned to reserved seating
  generalAdmissionCapacity?: number; // In mixed mode: capacity sold as general admission
  
  // Audience eligibility & registration
  audienceEligibility: EventAudienceType;
  isFree: boolean;
  pricing?: EventPricingTiers;
  registrationWindowStart?: string;
  registrationWindowEnd?: string;
  maxTicketsPerBooking?: number;
  
  // Optional add-ons
  foodConfig?: EventFoodConfig;
  parking?: EventParkingConfig;
  accessibilityNotes?: string;
  checkInInstructions?: string;
  
  // Status & audit trail
  status: SessionStatus;
  auditLog?: SessionAuditEntry[];
}

export interface EventVenueMap {
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  zoomLevel?: number;
  gateEntrance?: string;
  city?: string;
  state?: string;
}

export interface CommunityEvent {
  id: string;
  name: string;
  category: 'Cultural' | 'Sports' | 'General Body' | 'Workshop' | 'Charity' | 'Festival';
  date: string;
  time: string;
  venue: string;
  venues?: string[]; // Multiple venues support
  bannerUrl?: string; // Event Banner Cover Image
  logoUrl?: string;   // Event Logo / Badge Icon
  venueMap?: EventVenueMap; // Venue location map facility
  registrations: number;
  capacity: number;
  revenue: number;
  pricePerSeat?: number;
  status: 'draft' | 'scheduled' | 'published' | 'open' | 'completed' | 'cancelled';
  description: string;
  hasSeatingMap?: boolean;
  creationMode?: 'simple' | 'advanced';
  audienceType?: EventAudienceType;
  pricing?: EventPricingTiers;
  foodConfig?: EventFoodConfig;
  parking?: EventParkingConfig;
  scheduleBlocks?: EventScheduleBlock[];
  ticketChannels?: TicketDeliveryChannel[];
  rules?: EventRulesConfig;
  attendeeStats?: EventAttendeeStats;
  foodStats?: EventFoodStats;
  registrationsList?: EventRegistration[];
  
  // Core Multi-Session Model: Event -> Sessions -> Venue spaces -> Inventory
  sessions: EventSession[];
  passOption: EventPassOption; // 'whole_event_pass' | 'session_pass' | 'both'
  wholeEventPassPricing?: EventPricingTiers;
  wholeEventPassCapacity?: number;
  wholeEventPassSold?: number;
  uniqueAttendeesCount: number; // distinct human attendees across whole event
  totalSessionRegistrationsCount: number; // sum of session admissions
  ownerName?: string;
  auditLog?: SessionAuditEntry[];
}

export type VenueType = 
  | 'open_theatre'    // Open-Air Amphitheatre / OAT / Stepped Stone Terrace
  | 'auditorium'      // Indoor Proscenium Theatre / Concert Hall
  | 'banquet_hall'    // Community Ballroom & Banquet Suite
  | 'open_lawn'       // Outdoor Festival Grounds & Meadow
  | 'stadium_arena';  // Sports Arena / Grandstand Bleachers

export type SeatBlockTier = 
  | 'amphitheatre_tier' 
  | 'stone_steps' 
  | 'lawn_mound' 
  | 'balcony' 
  | 'floor' 
  | 'mezzanine' 
  | 'vip_box' 
  | 'gallery';

export interface SeatBlock {
  id: string;
  auditoriumId: string;
  name: string;
  tier: SeatBlockTier;
  level: string;
  startRow: string;
  rowCount: number;
  seatsPerRow: number;
  aislePositions?: number[];
  pricingCategory: 'Platinum' | 'Premium' | 'Gold' | 'Silver' | 'VIP';
  basePrice: number;
  totalSeats: number;
  status: 'active' | 'maintenance' | 'closed';
  elevation?: number;
  hasBalconyRailing?: boolean;
  colorTheme?: string;
  description?: string;
  wheelchairAccessible?: boolean;
  curvatureAngle?: number; // Radial curvature sweep in degrees for open theatre (e.g. 140)
  seatingMaterial?: string; // e.g., 'Handcrafted Stone Bench', 'Cushioned Theatre Armchair', 'Lawn Blanket'
}

export interface VenueWeatherConfig {
  hasRetractableCanopy: boolean;
  rainFallbackVenue?: string;
  sunsetOrientation?: string;
  windProtection?: boolean;
}

export interface Auditorium {
  id: string;
  name: string;
  code: string;
  venueType?: VenueType;
  seatingTopology?: 'radial_arc' | 'standard_grid' | 'lawn_cluster';
  capacity: number;
  location: string;
  todayBookings: number;
  utilization: number;
  revenueMonthly: number;
  hourlyRate: number;
  minBookingHours?: number;
  securityDeposit?: number;
  status: 'operational' | 'maintenance' | 'booked';
  facilities: string[];
  rules: string;
  stageDimensions?: string;
  stageType?: 'semi_circular_thrust' | 'proscenium' | 'in_the_round' | 'elevated_stone_dais' | 'festival_stage' | 'platform';
  acousticRating?: string;
  weatherContingency?: VenueWeatherConfig;
  lawnCapacity?: number;
  lightingSystem?: string;
  greenRoomsCount?: number;
  bannerUrl?: string;
  blocks: SeatBlock[];
  // Facility Manager configuration
  operatingSafetyLimit?: number;
  setupBufferMinutesDefault?: number;
  teardownBufferMinutesDefault?: number;
  rentalTariffHourly?: number;
  rentalTariffDaily?: number;
  layoutVersions?: {
    id: string;
    version: string;
    name: string;
    isDefault: boolean;
    totalSeats: number;
    description: string;
  }[];
}

export type Venue = Auditorium;

export interface Seat {
  id: string;
  auditoriumId?: string;
  blockId?: string;
  blockName?: string;
  row: string;
  col: number;
  section: 'Platinum' | 'Premium' | 'Gold' | 'Silver' | 'VIP' | string;
  price: number;
  status: 'available' | 'reserved' | 'disabled' | 'booked';
  assignedTo?: string;
  isAisle?: boolean;
  hasBalconyView?: boolean;
  isRadial?: boolean;
  angleDegrees?: number;
  sightlineToStage?: string;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'Badminton' | 'Tennis' | 'Auditorium' | 'Football' | 'Basketball' | 'Clubhouse';
  memberId: string;
  memberName: string;
  memberPhone: string;
  date: string;
  timeSlot: string;
  duration: string;
  participants: number;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'checked-in';
  paymentStatus: 'successful' | 'pending' | 'refunded';
  notes: string;
}

export interface SportsArea {
  id: string;
  name: string;
  sport: string;
  location: string;
  capacity: number;
  todayBookings: number;
  utilization: number;
  status: 'active' | 'maintenance' | 'closed';
  hourlyRate: number;
  openHours: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  requiredVolunteers: number;
  registered: number;
  status: 'open' | 'filled' | 'completed';
  hoursCredited: number;
  description: string;
  applicants: {
    id: string;
    name: string;
    phone: string;
    skills: string[];
    hoursLogged: number;
    status: 'pending' | 'approved' | 'assigned' | 'attended';
  }[];
}

export interface FoodProgram {
  id: string;
  name: string;
  date: string;
  time: string;
  menu: string[];
  registrations: number;
  quantityAvailable: number;
  mealsDistributed: number;
  price: number;
  distributionStatus: 'scheduled' | 'active' | 'completed';
  rules: string;
}

export interface Poll {
  id: string;
  title: string;
  category: string;
  audience: string;
  startDate: string;
  endDate: string;
  totalVotes: number;
  eligibleVoters: number;
  status: 'active' | 'scheduled' | 'completed';
  questionType: 'single-choice' | 'multiple-choice' | 'yes-no' | 'rating';
  questions: {
    text: string;
    options: { text: string; votes: number }[];
  }[];
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  memberId: string;
  memberName: string;
  module: 'Membership' | 'Events' | 'Bookings' | 'Food' | 'Donations' | 'Vendor';
  amount: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash' | 'Cheque';
  date: string;
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  invoiceNumber: string;
  description: string;
  customerEmail: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  channel: 'Push' | 'Email' | 'SMS';
  audience: string;
  recipientCount: number;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed' | 'scheduled';
  deliveryRate?: number;
  openRate?: number;
  sender?: string;
  priority?: 'high' | 'normal' | 'low';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  audience: string;
  publishDate: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  views: number;
  engagementRate: number;
  category: string;
  author?: string;
  isPinned?: boolean;
  attachments?: string[];
  priority?: 'urgent' | 'high' | 'normal';
}

export interface RefundRecord {
  id: string;
  refundId: string;
  originalTransactionId: string;
  originalInvoiceNumber: string;
  memberId: string;
  memberName: string;
  memberUnit: string;
  amount: number;
  reason: 'Booking Cancellation' | 'Event Rescheduled' | 'Duplicate Payment' | 'Security Deposit Return' | 'Overcharge Adjustment';
  requestedDate: string;
  processedDate?: string;
  status: 'completed' | 'pending' | 'rejected' | 'processing';
  paymentMode: 'UPI' | 'Credit Card' | 'Net Banking' | 'Original Source';
  gatewayRef: string;
  approvedBy?: string;
  notes?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberUnit: string;
  memberEmail: string;
  category: 'Quarterly Maintenance' | 'Facility Rental' | 'Event Passes' | 'Sinking Fund' | 'Utility & Water';
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxGst: number;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'overdue' | 'due' | 'draft' | 'cancelled';
  paymentDate?: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
}

export interface AuditLogItem {
  id: string;
  dateTime: string;
  user: string;
  role: string;
  action: string;
  module: string;
  record: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'warning' | 'failed';
}

export interface ResidentActivity {
  id: string;
  name: string;
  category: 'Wellness' | 'Sports' | 'Arts & Culture' | 'Hobbies' | 'Youth' | 'Seniors';
  leadCoordinator: string;
  coordinatorContact: string;
  venue: string;
  schedule: string;
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  membersCount: number;
  maxCapacity?: number;
  status: 'active' | 'seasonal' | 'open';
  description: string;
  tags: string[];
  nextSession: string;
  registeredMembers: { id: string; name: string; unit: string; joinedDate: string }[];
}

export interface DonationCampaign {
  id: string;
  title: string;
  category: 'Welfare Trust' | 'Staff Support' | 'Festive Drive' | 'Infrastructure' | 'Emergency Relief';
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'scheduled';
  description: string;
  taxExemptionEligible: boolean;
  beneficiary: string;
  bankAccountDetails: string;
}

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorUnit: string;
  donorPhone: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  date: string;
  paymentMethod: 'UPI' | 'Net Banking' | 'Credit Card' | 'Cheque' | 'Cash';
  status: 'successful' | 'verified' | 'pending';
  taxReceiptIssued: boolean;
  notes?: string;
}

export interface MediaAlbum {
  id: string;
  title: string;
  eventDate: string;
  category: string;
  photosCount: number;
  coverImage: string;
  description: string;
  views: number;
  downloads: number;
}

export interface GeneratedReport {
  id: string;
  reportCode: string;
  title: string;
  category: 'Financial & Statutory' | 'Facility & Operations' | 'Demographics & Census' | 'Maintenance & AMC' | 'Security & Compliance';
  period: string;
  generatedDate: string;
  generatedBy: string;
  fileFormat: 'PDF' | 'XLSX' | 'CSV';
  fileSize: string;
  status: 'ready' | 'generating' | 'scheduled';
  description: string;
  isStatutoryCompliance?: boolean;
  downloadCount: number;
  summaryMetrics?: { label: string; value: string }[];
  tableHeaders?: string[];
  tableRows?: (string | number)[][];
}

export interface ScheduledReportConfig {
  id: string;
  title: string;
  category: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  recipients: string[];
  format: 'PDF' | 'XLSX';
  nextRun: string;
  status: 'active' | 'paused';
}


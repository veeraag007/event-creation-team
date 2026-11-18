import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  List, 
  Search, 
  MapPin, 
  Clock, 
  LayoutGrid,
  Utensils,
  Users,
  Ticket,
  ShieldCheck,
  Baby,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Printer,
  UserPlus,
  Car,
  QrCode,
  Send,
  Navigation,
  ExternalLink,
  MessageSquare,
  Mail,
  Smartphone,
  Layers,
  ChefHat,
  Share2,
  Scan,
  Compass,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Map,
  ChevronRight
} from 'lucide-react';
import { 
  CommunityEvent, 
  EventRegistration, 
  EventDietaryOption, 
  TicketDeliveryChannel,
  EventScheduleBlock 
} from '../types';
import { StatusBadge } from '../ui/UIComponents';
import { EventDetailView } from '../events/EventDetailView';

interface EventsViewProps {
  events: CommunityEvent[];
  initialEventId?: string | null;
  onSelectEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onOpenSeatManagement: (eventId: string) => void;
  onUpdateEvent?: (updatedEvent: CommunityEvent) => void;
  /**
   * 'manage' – organiser side (create, sessions, seat layout; no ticket purchase)
   * 'book'   – attendee / box-office side (browse, register, e-ticket; no authoring)
   */
  mode?: 'manage' | 'book';
}

export const EventsView: React.FC<EventsViewProps> = ({
  events: initialEvents,
  initialEventId = null,
  onSelectEvent,
  onCreateEvent,
  onOpenSeatManagement,
  onUpdateEvent,
  mode = 'manage'
}) => {
  const canManage = mode === 'manage';
  const canBook = mode === 'book';
  const [eventsList, setEventsList] = useState<CommunityEvent[]>(initialEvents);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [foodFilter, setFoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Full Event Detail & Multi-Session Portal State
  const [selectedDetailEventId, setSelectedDetailEventId] = useState<string | null>(initialEventId || null);

  // Sync if initialEventId prop changes
  React.useEffect(() => {
    if (initialEventId) {
      setSelectedDetailEventId(initialEventId);
    }
  }, [initialEventId]);

  // Modals / Drawers State
  const [selectedDrawerEventId, setSelectedDrawerEventId] = useState<string | null>(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'schedule' | 'menu' | 'venue_map' | 'parking' | 'catering' | 'registrations'>('schedule');
  const [drawerMapStyle, setDrawerMapStyle] = useState<'roadmap' | 'satellite'>('roadmap');
  const [registerModalEventId, setRegisterModalEventId] = useState<string | null>(null);

  // Digital QR Ticket Modal State
  const [viewingTicketModal, setViewingTicketModal] = useState<{
    event: CommunityEvent;
    registration: EventRegistration;
  } | null>(null);
  const [scanSuccessFeedback, setScanSuccessFeedback] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98450 11223',
    isMember: true,
    adultsCount: 2,
    childrenCount: 1,
    foodOpted: true,
    adultMeals: 2,
    childMeals: 1,
    dietaryPreference: 'Veg' as EventDietaryOption,
    selectedChannels: ['whatsapp', 'email'] as TicketDeliveryChannel[],
    specialRequests: ''
  });

  // Sync when initialEvents change
  React.useEffect(() => {
    setEventsList(initialEvents);
  }, [initialEvents]);

  const activeDetailEvent = selectedDetailEventId 
    ? eventsList.find(e => e.id === selectedDetailEventId) 
    : null;

  const activeDrawerEvent = selectedDrawerEventId 
    ? eventsList.find(e => e.id === selectedDrawerEventId) 
    : null;

  const activeRegisterEvent = registerModalEventId 
    ? eventsList.find(e => e.id === registerModalEventId) 
    : null;

  // Audience type resolution helper
  const getAudienceType = (event: CommunityEvent): 'only_member' | 'member_and_non_member' | 'general' | 'public' => {
    if (event.audienceType) return event.audienceType;
    if (event.rules?.allowNonMembers === false) return 'only_member';
    return 'member_and_non_member';
  };

  // Dark overlay badge for Event Cards and Drawer Header
  const renderAudienceBadge = (event: CommunityEvent) => {
    const audType = getAudienceType(event);
    switch (audType) {
      case 'only_member':
        return (
          <span className="text-[10px] font-bold flex items-center gap-1 bg-purple-950/80 text-purple-200 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-purple-400/40 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-purple-300" /> Only Members
          </span>
        );
      case 'member_and_non_member':
        return (
          <span className="text-[10px] font-bold flex items-center gap-1 bg-blue-950/80 text-blue-200 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-blue-400/40 shadow-xs">
            <Users className="w-3 h-3 text-blue-300" /> Members & Guests
          </span>
        );
      case 'general':
        return (
          <span className="text-[10px] font-bold flex items-center gap-1 bg-emerald-950/80 text-emerald-200 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
            <Ticket className="w-3 h-3 text-emerald-300" /> General Audience
          </span>
        );
      case 'public':
        return (
          <span className="text-[10px] font-bold flex items-center gap-1 bg-amber-950/80 text-amber-200 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/40 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" /> Open Public
          </span>
        );
    }
  };

  // Light pill for table list and compact views
  const renderAudiencePill = (event: CommunityEvent) => {
    const audType = getAudienceType(event);
    switch (audType) {
      case 'only_member':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3 text-purple-600" /> Only Members
          </span>
        );
      case 'member_and_non_member':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-3 h-3 text-blue-600" /> Members & Guests
          </span>
        );
      case 'general':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Ticket className="w-3 h-3 text-emerald-600" /> General Audience
          </span>
        );
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" /> Open Public
          </span>
        );
    }
  };

  // Calculate live registration pricing handling common vs tiered food pricing & audience types
  const calculateRegistrationCost = (event: CommunityEvent, form: typeof regForm) => {
    const isMember = form.isMember;
    const isGeneralOrPublic = event.audienceType === 'general' || event.audienceType === 'public';
    const isOnlyMember = event.audienceType === 'only_member';
    const isFree = isGeneralOrPublic 
      ? event.pricing?.isFreeForMembers 
      : (event.pricing?.isFreeForMembers && isMember);
    
    // Ticket Price
    let adultTicketRate = 0;
    let childTicketRate = 0;

    if (isFree) {
      adultTicketRate = 0;
      childTicketRate = 0;
    } else if (isGeneralOrPublic) {
      adultTicketRate = event.pricing?.memberAdult ?? event.pricePerSeat ?? 0;
      childTicketRate = event.pricing?.memberChild ?? Math.round(adultTicketRate * 0.5);
    } else if (isOnlyMember || isMember) {
      adultTicketRate = event.pricing?.memberAdult ?? event.pricePerSeat ?? 0;
      childTicketRate = event.pricing?.memberChild ?? Math.round(adultTicketRate * 0.5);
    } else {
      adultTicketRate = event.pricing?.nonMemberAdult ?? (event.pricePerSeat ? event.pricePerSeat * 1.5 : 200);
      childTicketRate = event.pricing?.nonMemberChild ?? Math.round(adultTicketRate * 0.5);
    }

    const ticketTotal = (form.adultsCount * adultTicketRate) + (form.childrenCount * childTicketRate);

    // Food Price calculation (checks common vs tiered food pricing)
    let foodTotal = 0;
    let adultMealRate = 0;
    let childMealRate = 0;

    if (form.foodOpted && event.foodConfig && event.foodConfig.type === 'paid_addon') {
      if (isGeneralOrPublic || event.foodConfig.pricingMode === 'common') {
        adultMealRate = event.foodConfig.priceAdult ?? 0;
        childMealRate = event.foodConfig.priceChild ?? 0;
      } else if (isOnlyMember || isMember) {
        adultMealRate = event.foodConfig.memberPriceAdult ?? event.foodConfig.priceAdult ?? 0;
        childMealRate = event.foodConfig.memberPriceChild ?? event.foodConfig.priceChild ?? 0;
      } else {
        adultMealRate = event.foodConfig.nonMemberPriceAdult ?? event.foodConfig.priceAdult ?? 0;
        childMealRate = event.foodConfig.nonMemberPriceChild ?? event.foodConfig.priceChild ?? 0;
      }

      foodTotal = (form.adultMeals * adultMealRate) + (form.childMeals * childMealRate);
    }

    return {
      adultTicketRate,
      childTicketRate,
      adultMealRate,
      childMealRate,
      ticketTotal,
      foodTotal,
      grandTotal: ticketTotal + foodTotal
    };
  };

  // Submit Attendee Registration
  const handleConfirmRegistration = () => {
    if (!activeRegisterEvent) return;

    const costs = calculateRegistrationCost(activeRegisterEvent, regForm);
    const totalPeople = regForm.adultsCount + regForm.childrenCount;
    const ticketCode = `TKT-${activeRegisterEvent.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const parkingPassNo = activeRegisterEvent.parking?.enabled 
      ? `PARK-BAY-${Math.floor(10 + Math.random() * 90)}`
      : undefined;

    const qrData = `${activeRegisterEvent.id}|${ticketCode}|${regForm.name}|${regForm.isMember ? 'MEMBER' : 'GUEST'}|PARTY:${regForm.adultsCount}AD+${regForm.childrenCount}CH|FOOD:${regForm.foodOpted ? `${regForm.adultMeals}AD+${regForm.childMeals}CH-${regForm.dietaryPreference}` : 'NONE'}|PARK:${parkingPassNo || 'NONE'}`;

    const newRegRecord: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: activeRegisterEvent.id,
      registeredByName: regForm.name,
      contactEmail: regForm.email,
      contactPhone: regForm.phone,
      isMember: regForm.isMember,
      memberId: regForm.isMember ? 'MEM-' + Math.floor(10000 + Math.random() * 90000) : undefined,
      adultsCount: regForm.adultsCount,
      childrenCount: regForm.childrenCount,
      foodOpted: regForm.foodOpted,
      adultMeals: regForm.foodOpted ? regForm.adultMeals : 0,
      childMeals: regForm.foodOpted ? regForm.childMeals : 0,
      dietaryPreference: regForm.dietaryPreference,
      ticketPricePaid: costs.ticketTotal,
      foodPricePaid: costs.foodTotal,
      totalPaid: costs.grandTotal,
      paymentStatus: costs.grandTotal === 0 ? 'complimentary' : 'paid',
      registrationDate: 'Just now',
      ticketCode,
      specialRequests: regForm.specialRequests,
      qrCodeData: qrData,
      deliveryChannels: regForm.selectedChannels,
      checkInStatus: 'pending',
      assignedSeat: activeRegisterEvent.hasSeatingMap ? 'General Reserved Seating' : undefined,
      parkingPassNumber: parkingPassNo
    };

    // Update Event Stats
    const updatedAttendeeStats = {
      memberAdults: (activeRegisterEvent.attendeeStats?.memberAdults || 0) + (regForm.isMember ? regForm.adultsCount : 0),
      memberChildren: (activeRegisterEvent.attendeeStats?.memberChildren || 0) + (regForm.isMember ? regForm.childrenCount : 0),
      nonMemberAdults: (activeRegisterEvent.attendeeStats?.nonMemberAdults || 0) + (!regForm.isMember ? regForm.adultsCount : 0),
      nonMemberChildren: (activeRegisterEvent.attendeeStats?.nonMemberChildren || 0) + (!regForm.isMember ? regForm.childrenCount : 0),
    };

    const updatedFoodStats = {
      adultMeals: (activeRegisterEvent.foodStats?.adultMeals || 0) + (regForm.foodOpted ? regForm.adultMeals : 0),
      childMeals: (activeRegisterEvent.foodStats?.childMeals || 0) + (regForm.foodOpted ? regForm.childMeals : 0),
      vegMeals: (activeRegisterEvent.foodStats?.vegMeals || 0) + (regForm.foodOpted && regForm.dietaryPreference === 'Veg' ? (regForm.adultMeals + regForm.childMeals) : 0),
      nonVegMeals: (activeRegisterEvent.foodStats?.nonVegMeals || 0) + (regForm.foodOpted && regForm.dietaryPreference === 'Non-Veg' ? (regForm.adultMeals + regForm.childMeals) : 0),
      jainMeals: (activeRegisterEvent.foodStats?.jainMeals || 0) + (regForm.foodOpted && regForm.dietaryPreference === 'Jain' ? (regForm.adultMeals + regForm.childMeals) : 0),
      veganMeals: (activeRegisterEvent.foodStats?.veganMeals || 0) + (regForm.foodOpted && regForm.dietaryPreference === 'Vegan' ? (regForm.adultMeals + regForm.childMeals) : 0),
    };

    const updatedEvent: CommunityEvent = {
      ...activeRegisterEvent,
      registrations: activeRegisterEvent.registrations + totalPeople,
      revenue: activeRegisterEvent.revenue + costs.grandTotal,
      attendeeStats: updatedAttendeeStats,
      foodStats: updatedFoodStats,
      registrationsList: [newRegRecord, ...(activeRegisterEvent.registrationsList || [])]
    };

    const updatedList = eventsList.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEventsList(updatedList);
    if (onUpdateEvent) onUpdateEvent(updatedEvent);

    setRegisterModalEventId(null);

    // Open the generated ticket modal immediately to show off QR Code system!
    setViewingTicketModal({
      event: updatedEvent,
      registration: newRegRecord
    });
  };

  // Simulate Door QR Check-in Scan
  const handleSimulateDoorScan = () => {
    if (!viewingTicketModal) return;
    const { event, registration } = viewingTicketModal;

    const updatedReg: EventRegistration = {
      ...registration,
      checkInStatus: 'checked_in',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedRegistrations = (event.registrationsList || []).map(r => 
      r.id === updatedReg.id ? updatedReg : r
    );

    const updatedEvent: CommunityEvent = {
      ...event,
      registrationsList: updatedRegistrations
    };

    const updatedList = eventsList.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEventsList(updatedList);
    if (onUpdateEvent) onUpdateEvent(updatedEvent);

    setViewingTicketModal({
      event: updatedEvent,
      registration: updatedReg
    });

    setScanSuccessFeedback(true);
    setTimeout(() => setScanSuccessFeedback(false), 3000);
  };

  // Filter logic
  const filtered = eventsList.filter(e => {
    const q = searchQuery.toLowerCase();
    const venuesMatch = e.venues ? e.venues.some(v => v.toLowerCase().includes(q)) : false;
    const matchesQ = !q || e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || venuesMatch;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    
    // Audience filter
    const eventAudience = e.audienceType || (e.rules?.allowNonMembers === false ? 'only_member' : 'member_and_non_member');
    const matchesAudience = audienceFilter === 'all' 
      ? true 
      : audienceFilter === eventAudience;

    // Food filter
    const matchesFood = foodFilter === 'all' 
      ? true 
      : e.foodConfig?.type === foodFilter;

    return matchesQ && matchesStatus && matchesAudience && matchesFood;
  });

  // If viewing dedicated full event detail view with 5 tabs
  if (activeDetailEvent) {
    return (
      <EventDetailView
        event={activeDetailEvent}
        onBack={() => setSelectedDetailEventId(null)}
        onUpdateEvent={(updatedEv) => {
          setEventsList(prev => prev.map(e => e.id === updatedEv.id ? updatedEv : e));
          if (onUpdateEvent) onUpdateEvent(updatedEv);
        }}
        onOpenSeatManagement={onOpenSeatManagement}
      />
    );
  }

  return (
    <div className="space-y-4">
      {canManage && (<>
      {/* Multi-Session Model Spotlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider">
              Multi-Session Architecture
            </span>
            <span className="text-xs font-bold text-amber-300">
              Event → Sessions → Venue Spaces → Inventory
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Diwali Grand Cultural & Arts Mahotsav 2026 (3-Day Multi-Session Festival)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Configured with <strong>5 distinct sessions</strong> across <strong>3 venues</strong> featuring independent attendance modes: Reserved Seating (Auditorium), General Admission (Auditorium), Mixed Seating (Amphitheatre), Open Space (Lawn), and Registration Only (Pavilion).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSelectedDetailEventId('ev-1')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-200" />
            <span>Open Multi-Session Festival (5 Sessions)</span>
          </button>
        </div>
      </div>
      </>)}

      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, multi-venues, or food menu..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {canManage && (<button
              onClick={onCreateEvent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>)}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Filters:</span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="open">Registration Open</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Audiences</option>
            <option value="only_member">👥 Only Members</option>
            <option value="member_and_non_member">🏷️ Member & Non-Member</option>
            <option value="general">🎟️ General Audience</option>
            <option value="public">🌐 Open Public</option>
          </select>

          <select
            value={foodFilter}
            onChange={(e) => setFoodFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Food Schemes</option>
            <option value="free_with_count">Free Food (Counted Headcount)</option>
            <option value="paid_addon">Paid Food Buffet</option>
            <option value="included_in_ticket">Food Included in Ticket</option>
            <option value="none">No Food</option>
          </select>

          {(statusFilter !== 'all' || audienceFilter !== 'all' || foodFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setAudienceFilter('all');
                setFoodFilter('all');
                setSearchQuery('');
              }}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(event => {
            const isFreeForMembers = event.pricing?.isFreeForMembers;
            const allowNonMembers = event.rules?.allowNonMembers ?? true;
            const foodConfig = event.foodConfig;
            const parking = event.parking;
            const scheduleBlocks = event.scheduleBlocks || [];

            return (
              <div 
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                {/* Event Cover Banner & Floating Logo Facility */}
                <div className="relative h-40 w-full bg-slate-900 overflow-hidden group/card cursor-pointer" onClick={() => {
                  setSelectedDrawerEventId(event.id);
                  setDrawerActiveTab('schedule');
                }}>
                  {event.bannerUrl ? (
                    <img 
                      src={event.bannerUrl} 
                      alt={event.name} 
                      className="w-full h-full object-cover group-hover/card:scale-105 transition duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-slate-950 flex items-center justify-center text-white/50 text-xs font-semibold">
                      {event.category} Event
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-black/30" />

                  {/* Top Category and Status over banner */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="text-[10px] font-bold tracking-wider text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded uppercase border border-white/20">
                      {event.category}
                    </span>
                    <StatusBadge status={event.status} size="sm" />
                  </div>

                  {/* Floating Logo Badge on bottom left */}
                  <div className="absolute left-3.5 bottom-2.5 flex items-end gap-2.5 z-10">
                    <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-lg ring-2 ring-white/90 overflow-hidden shrink-0">
                      {event.logoUrl ? (
                        <img src={event.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs rounded-lg">
                          {event.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-white drop-shadow-md pb-0.5">
                      {renderAudienceBadge(event)}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Multi-Session & Pass Architecture Badge */}
                    {event.sessions && event.sessions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center gap-1">
                          <Layers className="w-3 h-3 text-indigo-600" />
                          {event.sessions.length} {event.sessions.length === 1 ? 'Session' : 'Sessions'}
                        </span>
                        {event.passOption === 'both' ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">
                            Whole Pass & Single
                          </span>
                        ) : event.passOption === 'whole_event_pass' ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">
                            Whole Pass Only
                          </span>
                        ) : null}
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {event.uniqueAttendeesCount || event.registrations} Attendees
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 
                      onClick={() => setSelectedDetailEventId(event.id)}
                      className="text-sm font-bold text-slate-900 mb-2 leading-snug hover:text-indigo-600 transition cursor-pointer flex items-center justify-between group"
                    >
                      <span>{event.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </h3>

                    {/* Date, Time & Multi-Venues */}
                    <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{event.date}</span>
                        <span className="text-slate-300">•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-tight">
                          {event.venues && event.venues.length > 1 
                            ? event.venues.join(' • ') 
                            : event.venue}
                        </span>
                      </div>
                    </div>

                    {/* Venue Location Map Facility Tag */}
                    {event.venueMap && (
                      <div className="mb-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 flex items-center gap-1 font-medium truncate max-w-[200px]">
                          📍 Gate: <strong className="text-slate-800">{event.venueMap.gateEntrance || 'Main Gate'}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedDrawerEventId(event.id);
                            setDrawerActiveTab('venue_map');
                          }}
                          className="text-indigo-600 font-bold hover:underline shrink-0 flex items-center gap-0.5 text-[10px]"
                        >
                          <Navigation className="w-2.5 h-2.5" /> View Map
                        </button>
                      </div>
                    )}

                    {/* Admission Pricing Box */}
                    {(() => {
                      const audType = getAudienceType(event);
                      if (audType === 'general' || audType === 'public') {
                        const isFree = isFreeForMembers || (event.pricing && event.pricing.memberAdult === 0 && event.pricing.memberChild === 0);
                        return (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 mb-2.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-600">
                                {audType === 'public' ? 'Public Entry Pass:' : 'General Admission:'}
                              </span>
                              <span className="font-bold text-slate-900">
                                {isFree ? (
                                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">100% FREE ENTRY</span>
                                ) : event.pricing ? (
                                  `₹${event.pricing.memberAdult} / ₹${event.pricing.memberChild}`
                                ) : (
                                  `₹${event.pricePerSeat || 0}`
                                )}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Uniform rate for all attendees (Adult / Child)
                            </div>
                          </div>
                        );
                      }
                      
                      if (audType === 'only_member') {
                        return (
                          <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 space-y-1 mb-2.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-purple-900">Member Admission:</span>
                              <span className="font-bold text-purple-950">
                                {isFreeForMembers ? (
                                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">FREE (MEMBERS)</span>
                                ) : event.pricing ? (
                                  `₹${event.pricing.memberAdult} / ₹${event.pricing.memberChild}`
                                ) : (
                                  `₹${event.pricePerSeat || 0}`
                                )}
                              </span>
                            </div>
                            <div className="text-[10px] text-purple-700 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Exclusive to verified members & residents
                            </div>
                          </div>
                        );
                      }

                      // Default: member_and_non_member
                      return (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 mb-2.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-600">Member Admission:</span>
                            <span className="font-bold text-slate-900">
                              {isFreeForMembers ? (
                                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">FREE</span>
                              ) : event.pricing ? (
                                `₹${event.pricing.memberAdult} / ₹${event.pricing.memberChild}`
                              ) : (
                                `₹${event.pricePerSeat || 0}`
                              )}
                            </span>
                          </div>

                          {event.pricing && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-600">Guest Admission:</span>
                              <span className="font-bold text-slate-800">
                                ₹{event.pricing.nonMemberAdult} / ₹{event.pricing.nonMemberChild}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Food / Catering Status Chip */}
                    <div className="mb-3">
                      {foodConfig?.type === 'paid_addon' ? (
                        <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-950 flex items-center gap-1">
                              <Utensils className="w-3 h-3 text-indigo-600" />
                              <span>Paid Buffet</span>
                            </span>
                            <span className="text-[10px] text-indigo-700 font-semibold">
                              {foodConfig.pricingMode === 'tiered' ? 'Tiered Member/Guest' : 'Common Rate'}
                            </span>
                          </div>
                          <div className="text-[10px] text-indigo-800">
                            {foodConfig.pricingMode === 'tiered' ? (
                              <span>Mem: ₹{foodConfig.memberPriceAdult}/₹{foodConfig.memberPriceChild} • Guest: ₹{foodConfig.nonMemberPriceAdult}/₹{foodConfig.nonMemberPriceChild}</span>
                            ) : (
                              <span>₹{foodConfig.priceAdult} (Adult) / ₹{foodConfig.priceChild} (Child)</span>
                            )}
                          </div>
                        </div>
                      ) : foodConfig?.type === 'free_with_count' ? (
                        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] flex items-center justify-between">
                          <span className="font-bold text-emerald-950 flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-emerald-600" />
                            <span>Free Food (Headcount Tracked)</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">100% Free</span>
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 text-[10px]">
                          No Central Food • Stalls on site
                        </div>
                      )}
                    </div>

                    {/* Attendance Progress */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-600">Registrations</span>
                        <span className="text-slate-900">{event.registrations} / {event.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (event.registrations / event.capacity) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {canManage && (<button
                        onClick={() => setSelectedDetailEventId(event.id)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Sessions ({event.sessions?.length || 1})</span>
                      </button>)}
                      <button
                        onClick={() => {
                          setSelectedDrawerEventId(event.id);
                          setDrawerActiveTab('schedule');
                        }}
                        className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>360</span>
                      </button>
                    </div>

                    {canBook && (<button
                      onClick={() => {
                        setRegisterModalEventId(event.id);
                        setRegForm({
                          name: 'Radhika Deshmukh',
                          email: 'radhika.d@community.in',
                          phone: '+91 98200 44103',
                          isMember: true,
                          adultsCount: 2,
                          childrenCount: 1,
                          foodOpted: event.foodConfig?.type !== 'none',
                          adultMeals: 2,
                          childMeals: 1,
                          dietaryPreference: 'Veg',
                          selectedChannels: event.ticketChannels || ['whatsapp', 'email'],
                          specialRequests: ''
                        });
                      }}
                      className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition flex items-center gap-1 shadow-xs"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Register</span>
                    </button>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Event & Media</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Date & Multi-Venues</th>
                  <th className="p-3.5">Venue Location Map</th>
                  <th className="p-3.5">Pricing</th>
                  <th className="p-3.5">Food Scheme</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={event.bannerUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'} 
                          alt="Banner" 
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <div 
                            onClick={() => {
                              setSelectedDrawerEventId(event.id);
                              setDrawerActiveTab('schedule');
                            }}
                            className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                          >
                            {event.name}
                          </div>
                          <div className="mt-0.5">
                            {renderAudiencePill(event)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">{event.category}</td>
                    <td className="p-3.5 text-slate-600">
                      <div>{event.date} • {event.time}</div>
                      <div className="text-[11px] text-indigo-600 truncate max-w-xs">
                        {event.venues ? event.venues.join(' • ') : event.venue}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {event.venueMap ? (
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {event.venueMap.gateEntrance || 'Main Gate'}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{event.venueMap.landmark}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700">
                      {(() => {
                        const audType = getAudienceType(event);
                        const isFree = event.pricing?.isFreeForMembers || (event.pricing && event.pricing.memberAdult === 0 && event.pricing.memberChild === 0);
                        if (isFree) {
                          return <span className="text-emerald-700 font-bold">100% Free Entry</span>;
                        }
                        if (audType === 'general' || audType === 'public') {
                          return <span>₹{event.pricing?.memberAdult ?? event.pricePerSeat ?? 0} / ₹{event.pricing?.memberChild ?? 0}</span>;
                        }
                        if (audType === 'only_member') {
                          return <span>₹{event.pricing?.memberAdult ?? event.pricePerSeat ?? 0} (Member)</span>;
                        }
                        return (
                          <span>₹{event.pricing?.memberAdult ?? 0} (Mem) / ₹{event.pricing?.nonMemberAdult ?? 0} (Guest)</span>
                        );
                      })()}
                    </td>
                    <td className="p-3.5">
                      {event.foodConfig?.type === 'paid_addon' ? (
                        <span className="text-indigo-700 font-semibold text-[11px]">Paid Buffet</span>
                      ) : event.foodConfig?.type === 'free_with_count' ? (
                        <span className="text-emerald-700 font-semibold text-[11px]">Free with Count</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Food</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {canManage && (<button
                        onClick={() => setSelectedDetailEventId(event.id)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition cursor-pointer"
                      >
                        Sessions ({event.sessions?.length || 1})
                      </button>)}
                      <button
                        onClick={() => {
                          setSelectedDrawerEventId(event.id);
                          setDrawerActiveTab('schedule');
                        }}
                        className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                      >
                        360
                      </button>
                      {canBook && (<button
                        onClick={() => {
                          setRegisterModalEventId(event.id);
                          setRegForm({
                            name: 'Arvind Rao',
                            email: 'arvind.rao@consulting.com',
                            phone: '+91 99001 44521',
                            isMember: true,
                            adultsCount: 2,
                            childrenCount: 0,
                            foodOpted: event.foodConfig?.type !== 'none',
                            adultMeals: 2,
                            childMeals: 0,
                            dietaryPreference: 'Veg',
                            selectedChannels: event.ticketChannels || ['whatsapp', 'email'],
                            specialRequests: ''
                          });
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                      >
                        Register
                      </button>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 360 EVENT DETAILS & PROGRAM SCHEDULE / VENUE MAP / MENU DRAWER            */}
      {/* ========================================================================= */}
      {activeDrawerEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Hero Cover Banner Header with Event Logo */}
            <div className="relative h-44 w-full bg-slate-900 shrink-0 overflow-hidden">
              {activeDrawerEvent.bannerUrl ? (
                <img 
                  src={activeDrawerEvent.bannerUrl} 
                  alt={activeDrawerEvent.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-900 to-slate-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/30" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDrawerEventId(null)}
                className="absolute top-4 right-4 p-1.5 text-white bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md z-20 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Overlaid Logo & Event Title */}
              <div className="absolute left-5 bottom-3.5 right-5 flex items-end gap-3 z-10">
                <div className="w-14 h-14 rounded-xl bg-white p-0.5 shadow-xl ring-2 ring-white/90 overflow-hidden shrink-0">
                  {activeDrawerEvent.logoUrl ? (
                    <img src={activeDrawerEvent.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs rounded-lg">
                      {activeDrawerEvent.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-white overflow-hidden pb-0.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded uppercase">
                      {activeDrawerEvent.category}
                    </span>
                    <StatusBadge status={activeDrawerEvent.status} size="sm" />
                    {renderAudienceBadge(activeDrawerEvent)}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight truncate">{activeDrawerEvent.name}</h2>
                  <p className="text-[11px] text-white/80">
                    {activeDrawerEvent.date} • {activeDrawerEvent.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setDrawerActiveTab('schedule')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'schedule'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Program Schedule</span>
              </button>

              {/* Dedicated Venue Location Map Tab */}
              <button
                onClick={() => setDrawerActiveTab('venue_map')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'venue_map'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Venue Location Map</span>
              </button>

              <button
                onClick={() => setDrawerActiveTab('menu')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'menu'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Food Menu</span>
              </button>

              <button
                onClick={() => setDrawerActiveTab('parking')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'parking'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Parking Bay</span>
              </button>

              <button
                onClick={() => setDrawerActiveTab('catering')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'catering'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Kitchen Catering</span>
              </button>

              <button
                onClick={() => setDrawerActiveTab('registrations')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 shrink-0 transition ${
                  drawerActiveTab === 'registrations'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Bookings & QR ({activeDrawerEvent.registrationsList?.length || 0})</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* TAB 1: Program Schedule & Timeline Blocks */}
              {drawerActiveTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Program Itinerary Timeline
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {activeDrawerEvent.scheduleBlocks?.length || 0} Agenda Blocks
                    </span>
                  </div>

                  {(!activeDrawerEvent.scheduleBlocks || activeDrawerEvent.scheduleBlocks.length === 0) ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No schedule blocks defined yet for this event.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                      {activeDrawerEvent.scheduleBlocks.map((blk) => (
                        <div key={blk.id} className="relative group">
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50 border border-white" />
                          
                          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {blk.time}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                                {blk.venue}
                              </span>
                            </div>

                            <h5 className="text-xs font-bold text-slate-900">{blk.title}</h5>

                            {blk.performerOrSpeaker && (
                              <p className="text-[11px] text-slate-600">
                                Performer / Speaker: <strong className="text-slate-800">{blk.performerOrSpeaker}</strong>
                              </p>
                            )}

                            {blk.description && (
                              <p className="text-[11px] text-slate-500">{blk.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Venue Location Map Facility */}
              {drawerActiveTab === 'venue_map' && (
                <div className="space-y-4">
                  {activeDrawerEvent.venueMap ? (
                    <div className="space-y-4">
                      {/* Venue Location Address Card */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <h4 className="text-xs font-bold text-slate-900">
                              {activeDrawerEvent.venueMap.address}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                            {activeDrawerEvent.venueMap.gateEntrance || 'Main Gate'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-400 block">Prominent Landmark:</span>
                            <span className="font-semibold text-slate-800">{activeDrawerEvent.venueMap.landmark || 'Greenwood Campus'}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">GPS Coordinates:</span>
                            <span className="font-mono text-emerald-700 font-semibold">{activeDrawerEvent.venueMap.latitude}° N, {activeDrawerEvent.venueMap.longitude}° E</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Simulated Map Canvas */}
                      <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                        <div className="bg-slate-900 text-white p-3 flex items-center justify-between text-xs">
                          <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                            <Compass className="w-3.5 h-3.5" /> Interactive Venue Map Pin
                          </span>

                          <div className="flex items-center gap-2">
                            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[10px]">
                              <button
                                type="button"
                                onClick={() => setDrawerMapStyle('roadmap')}
                                className={`px-2 py-0.5 rounded font-bold ${drawerMapStyle === 'roadmap' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                              >
                                Roadmap
                              </button>
                              <button
                                type="button"
                                onClick={() => setDrawerMapStyle('satellite')}
                                className={`px-2 py-0.5 rounded font-bold ${drawerMapStyle === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                              >
                                Satellite
                              </button>
                            </div>

                            <a
                              href={activeDrawerEvent.venueMap.googleMapsUrl || `https://maps.google.com/?q=${activeDrawerEvent.venueMap.latitude},${activeDrawerEvent.venueMap.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[10px] text-indigo-300 hover:text-white font-semibold flex items-center gap-1 transition"
                            >
                              <span>Google Maps</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        <div className={`h-64 w-full relative overflow-hidden ${drawerMapStyle === 'satellite' ? 'bg-slate-900' : 'bg-[#e5e3df]'}`}>
                          <svg width="100%" height="100%" className="absolute inset-0">
                            {drawerMapStyle === 'roadmap' ? (
                              <>
                                <rect x="5%" y="10%" width="30%" height="45%" rx="12" fill="#c8e6c9" opacity="0.8"/>
                                <rect x="65%" y="40%" width="30%" height="50%" rx="12" fill="#c8e6c9" opacity="0.8"/>
                                <path d="M 40% 15% Q 55% 5%, 65% 20% T 55% 35% Z" fill="#b3e5fc" opacity="0.9"/>
                                <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#ffffff" strokeWidth="16"/>
                                <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#ffcc80" strokeWidth="6"/>
                                <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#ffffff" strokeWidth="18"/>
                                <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#ffe082" strokeWidth="8"/>
                                <rect x="48%" y="50%" width="22%" height="25%" rx="6" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2"/>
                                <text x="50%" y="62%" fill="#37474f" fontSize="11" fontWeight="bold">Event Venue</text>
                              </>
                            ) : (
                              <>
                                <rect width="100%" height="100%" fill="#1a2e1a"/>
                                <circle cx="20%" cy="25%" r="15%" fill="#143614" opacity="0.8"/>
                                <circle cx="80%" cy="70%" r="20%" fill="#143614" opacity="0.8"/>
                                <path d="M 0 45% Q 50% 43% 100% 47%" stroke="#424242" strokeWidth="12" fill="none"/>
                                <path d="M 45% 0 Q 46% 50% 44% 100%" stroke="#424242" strokeWidth="14" fill="none"/>
                                <rect x="48%" y="50%" width="22%" height="25%" rx="4" fill="#37474f" opacity="0.9"/>
                                <text x="50%" y="62%" fill="#eceff1" fontSize="11" fontWeight="bold">Event Venue</text>
                              </>
                            )}
                          </svg>

                          {/* Pulsing Pin */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none z-20">
                            <div className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-slate-700 flex items-center gap-1 whitespace-nowrap mb-1">
                              <MapPin className="w-3 h-3 text-rose-500 fill-rose-500" />
                              <span>{activeDrawerEvent.venueMap.gateEntrance}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-rose-600/30 flex items-center justify-center animate-ping absolute top-4" />
                            <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No precise geolocation map pinned for this venue.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Food Menu & Course Breakdown */}
              {drawerActiveTab === 'menu' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Catered Menu Title</span>
                    <h4 className="text-sm font-bold text-indigo-950">
                      {activeDrawerEvent.foodConfig?.mealTitle || 'Complimentary Refreshments'}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Caterer: <strong className="text-slate-800">{activeDrawerEvent.foodConfig?.catererName || 'In-House'}</strong>
                    </p>
                  </div>

                  {activeDrawerEvent.foodConfig?.menuCourses && activeDrawerEvent.foodConfig.menuCourses.length > 0 ? (
                    <div className="space-y-3">
                      {activeDrawerEvent.foodConfig.menuCourses.map((c, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                          <h5 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                            <span>{c.course}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{c.items.length} items</span>
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {c.items.map(item => (
                              <span key={item} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No course-by-course menu uploaded for this event.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Parking Area with Map Location */}
              {drawerActiveTab === 'parking' && (
                <div className="space-y-4">
                  {activeDrawerEvent.parking?.enabled ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-indigo-600" />
                          <h4 className="text-xs font-bold text-slate-900">
                            {activeDrawerEvent.parking.zone}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {activeDrawerEvent.parking.slotsAvailable} Slots Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Gate Entrance:</span>
                          <span className="font-semibold text-slate-800">{activeDrawerEvent.parking.gate}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">Total Capacity:</span>
                          <span className="font-semibold text-slate-800">{activeDrawerEvent.parking.totalSlots} Vehicles</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">Valet Assistance:</span>
                          <span className="font-semibold text-slate-800">{activeDrawerEvent.parking.valet ? 'Available at Portico' : 'Self-Park'}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">EV Fast Charging:</span>
                          <span className="font-semibold text-slate-800">{activeDrawerEvent.parking.evCharging ? 'Available in Bay B' : 'Standard'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No designated parking bay allocated for this event.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Catering Kitchen Sheet */}
              {drawerActiveTab === 'catering' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Food Catering Scheme</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {activeDrawerEvent.foodConfig?.mealTitle || 'No Central Catering'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Vendor: <strong className="text-slate-700">{activeDrawerEvent.foodConfig?.catererName || 'In-House'}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase">
                        {activeDrawerEvent.foodConfig?.type.replace(/_/g, ' ') || 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Kitchen Numbers */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50">
                      <span className="text-[11px] font-semibold text-indigo-600 block">Total Plates Needed</span>
                      <span className="text-xl font-bold text-indigo-900">
                        {(activeDrawerEvent.foodStats?.adultMeals || 0) + (activeDrawerEvent.foodStats?.childMeals || 0)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[11px] font-semibold text-slate-600 block">Adult Meals</span>
                      <span className="text-xl font-bold text-slate-900">
                        {activeDrawerEvent.foodStats?.adultMeals || 0}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[11px] font-semibold text-slate-600 block flex items-center gap-1">
                        <Baby className="w-3.5 h-3.5 text-indigo-500" /> Child Meals
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {activeDrawerEvent.foodStats?.childMeals || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Registered Bookings & Digital E-Tickets */}
              {drawerActiveTab === 'registrations' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Confirmed Registered Bookings ({activeDrawerEvent.registrationsList?.length || 0})
                    </span>
                    <span className="text-[10px] text-slate-500">Click pass to view scannable digital QR</span>
                  </div>

                  {(!activeDrawerEvent.registrationsList || activeDrawerEvent.registrationsList.length === 0) ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No registrations logged yet. Click "Register New Attendee" to add the first booking.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeDrawerEvent.registrationsList.map(reg => (
                        <div 
                          key={reg.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{reg.registeredByName}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                reg.isMember ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {reg.isMember ? (reg.memberId || 'Member') : 'Guest'}
                              </span>
                              {reg.checkInStatus === 'checked_in' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Checked In ({reg.checkInTime || 'Gate'})
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                  Pending Check-in
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => setViewingTicketModal({
                                event: activeDrawerEvent,
                                registration: reg
                              })}
                              className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View E-Ticket & QR</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span>Party: <strong>{reg.adultsCount} Adults</strong>, <strong>{reg.childrenCount} Kids</strong></span>
                            {reg.foodOpted ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Utensils className="w-3 h-3" /> Food: {reg.adultMeals} Ad, {reg.childMeals} Ch ({reg.dietaryPreference})
                              </span>
                            ) : (
                              <span className="text-slate-400">No Food</span>
                            )}
                            {reg.parkingPassNumber && (
                              <span className="text-indigo-600 font-medium">🚗 {reg.parkingPassNumber}</span>
                            )}
                            <span className="text-slate-400 ml-auto font-mono">{reg.ticketCode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedDrawerEventId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close Drawer
              </button>

              {canBook && (<button
                onClick={() => {
                  const evId = activeDrawerEvent.id;
                  setSelectedDrawerEventId(null);
                  setRegisterModalEventId(evId);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Attendee</span>
              </button>)}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTER ATTENDEE / RSVP MODAL                                            */}
      {/* ========================================================================= */}
      {activeRegisterEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Attendee Registration & QR Pass</span>
                <h3 className="text-sm font-bold text-slate-900">{activeRegisterEvent.name}</h3>
              </div>
              <button
                onClick={() => setRegisterModalEventId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Attendee Name *</label>
                  <input
                    type="text"
                    value={regForm.name}
                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone (WhatsApp) *</label>
                  <input
                    type="text"
                    value={regForm.phone}
                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Audience Type Context & Affiliation */}
              {(() => {
                const audType = getAudienceType(activeRegisterEvent);

                if (audType === 'only_member') {
                  return (
                    <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-purple-950 text-xs">Members-Only Private Event</div>
                        <div className="text-[11px] text-purple-700 leading-relaxed">
                          Registration is restricted to verified community members & residents. Outside guest registrations are disabled.
                        </div>
                      </div>
                    </div>
                  );
                }

                if (audType === 'general') {
                  return (
                    <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Ticket className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-emerald-950 block text-xs">General Audience Event</span>
                          <span className="text-[10px] text-emerald-700">Open to all community members, families, and guests at standard uniform pricing.</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] shrink-0">
                        {activeRegisterEvent.pricing?.isFreeForMembers ? 'FREE PASS' : `₹${activeRegisterEvent.pricing?.memberAdult || 0} / adult`}
                      </span>
                    </div>
                  );
                }

                if (audType === 'public') {
                  return (
                    <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-950 block text-xs">Open Public Admission</span>
                          <span className="text-[10px] text-amber-700">Open to general public attendees, visitors & city residents without restriction.</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] shrink-0">
                        {activeRegisterEvent.pricing?.isFreeForMembers ? 'FREE PUBLIC ENTRY' : `₹${activeRegisterEvent.pricing?.memberAdult || 0} / adult`}
                      </span>
                    </div>
                  );
                }

                // Default: member_and_non_member
                return (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Affiliation</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRegForm({ ...regForm, isMember: true })}
                        className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                          regForm.isMember 
                            ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">Community Member</span>
                          <span className="text-[10px] text-slate-500">Subsidized Resident Rate</span>
                        </div>
                        {regForm.isMember && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>

                      <button
                        type="button"
                        disabled={activeRegisterEvent.rules?.allowNonMembers === false}
                        onClick={() => setRegForm({ ...regForm, isMember: false })}
                        className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                          !regForm.isMember 
                            ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        } ${activeRegisterEvent.rules?.allowNonMembers === false ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">Non-Member Guest</span>
                          <span className="text-[10px] text-slate-500">Outside Attendee</span>
                        </div>
                        {!regForm.isMember && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Adults & Children */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block text-xs">Party Size</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Adults (Age {activeRegisterEvent.rules?.childAgeLimit || 12}+)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const n = Math.max(1, regForm.adultsCount - 1);
                          setRegForm({ ...regForm, adultsCount: n, adultMeals: regForm.foodOpted ? n : regForm.adultMeals });
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{regForm.adultsCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const n = regForm.adultsCount + 1;
                          setRegForm({ ...regForm, adultsCount: n, adultMeals: regForm.foodOpted ? n : regForm.adultMeals });
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Baby className="w-3.5 h-3.5 text-indigo-500" />
                      Children (Under {activeRegisterEvent.rules?.childAgeLimit || 12})
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const n = Math.max(0, regForm.childrenCount - 1);
                          setRegForm({ ...regForm, childrenCount: n, childMeals: regForm.foodOpted ? n : regForm.childMeals });
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{regForm.childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const n = regForm.childrenCount + 1;
                          setRegForm({ ...regForm, childrenCount: n, childMeals: regForm.foodOpted ? n : regForm.childMeals });
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Food Selection */}
              {activeRegisterEvent.foodConfig && activeRegisterEvent.foodConfig.type !== 'none' && (
                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-bold text-indigo-950 block text-xs">
                          {activeRegisterEvent.foodConfig.mealTitle}
                        </span>
                        <span className="text-[10px] text-indigo-700">
                          {activeRegisterEvent.foodConfig.type === 'free_with_count'
                            ? '100% Free! Exact headcount collected for catering.'
                            : activeRegisterEvent.foodConfig.type === 'paid_addon'
                            ? `Paid Addon (${activeRegisterEvent.foodConfig.pricingMode === 'tiered' ? (regForm.isMember ? `Mem: ₹${activeRegisterEvent.foodConfig.memberPriceAdult}/Ad` : `Guest: ₹${activeRegisterEvent.foodConfig.nonMemberPriceAdult}/Ad`) : `₹${activeRegisterEvent.foodConfig.priceAdult}/Ad`})`
                            : 'Included in ticket'}
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regForm.foodOpted}
                        onChange={e => {
                          const opted = e.target.checked;
                          setRegForm({
                            ...regForm,
                            foodOpted: opted,
                            adultMeals: opted ? regForm.adultsCount : 0,
                            childMeals: opted ? regForm.childrenCount : 0
                          });
                        }}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span className="font-bold text-indigo-900 text-[11px]">Opt In</span>
                    </label>
                  </div>

                  {regForm.foodOpted && (
                    <div className="space-y-3 pt-2 border-t border-indigo-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Dietary Preference
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(activeRegisterEvent.foodConfig.dietaryOptions || ['Veg', 'Non-Veg', 'Jain']).map(diet => (
                            <button
                              key={diet}
                              type="button"
                              onClick={() => setRegForm({ ...regForm, dietaryPreference: diet })}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition ${
                                regForm.dietaryPreference === diet
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {diet}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-600 block mb-1">Adult Meals:</span>
                          <input
                            type="number"
                            min={0}
                            value={regForm.adultMeals}
                            onChange={e => setRegForm({ ...regForm, adultMeals: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <span className="text-slate-600 block mb-1">Child Meals:</span>
                          <input
                            type="number"
                            min={0}
                            value={regForm.childMeals}
                            onChange={e => setRegForm({ ...regForm, childMeals: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Channels */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 block">Send QR Ticket Pass Via:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'whatsapp' as TicketDeliveryChannel, label: 'WhatsApp' },
                    { id: 'email' as TicketDeliveryChannel, label: 'Email (.ics)' },
                    { id: 'sms' as TicketDeliveryChannel, label: 'SMS PIN' }
                  ].map(ch => {
                    const isSel = regForm.selectedChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => {
                          const updated = isSel 
                            ? regForm.selectedChannels.filter(c => c !== ch.id)
                            : [...regForm.selectedChannels, ch.id];
                          setRegForm({ ...regForm, selectedChannels: updated });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          isSel
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Cost Summary */}
              {(() => {
                const costs = calculateRegistrationCost(activeRegisterEvent, regForm);
                return (
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1.5">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Ticket Subtotal:</span>
                      <span className="font-semibold text-white">₹{costs.ticketTotal}</span>
                    </div>

                    {activeRegisterEvent.foodConfig?.type === 'paid_addon' && regForm.foodOpted && (
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Food Catering Subtotal:</span>
                        <span className="font-semibold text-white">₹{costs.foodTotal}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-xs">Total Amount:</span>
                      <span className="text-base font-bold text-emerald-400">
                        {costs.grandTotal === 0 ? 'FREE ENTRY' : `₹${costs.grandTotal}`}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRegisterModalEventId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRegistration}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Generate QR Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIGITAL E-TICKET WITH SCANNABLE QR CODE MODAL                             */}
      {/* ========================================================================= */}
      {viewingTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Top Pass Brand Header with Event Banner & Logo */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
              {viewingTicketModal.event.bannerUrl && (
                <div className="absolute inset-0">
                  <img src={viewingTicketModal.event.bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-950/90 to-slate-900/90" />
                </div>
              )}
              <div className="p-5 relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {viewingTicketModal.event.logoUrl && (
                      <img src={viewingTicketModal.event.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/80 shrink-0" />
                    )}
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase block mb-0.5">
                        OFFICIAL COMMUNITY DIGITAL GATE PASS
                      </span>
                      <h3 className="text-base font-bold leading-tight">{viewingTicketModal.event.name}</h3>
                      <p className="text-xs text-indigo-200 mt-0.5">
                        {viewingTicketModal.event.date} • {viewingTicketModal.event.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingTicketModal(null)}
                    className="p-1 text-indigo-200 hover:text-white rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    viewingTicketModal.registration.checkInStatus === 'checked_in'
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-amber-400 text-amber-950'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>
                      {viewingTicketModal.registration.checkInStatus === 'checked_in' 
                        ? `CHECKED IN AT ${viewingTicketModal.registration.checkInTime || 'GATE'}` 
                        : 'VALID • READY FOR CHECK-IN'
                      }
                    </span>
                  </span>
                  <span className="text-[10px] text-indigo-200 ml-auto font-mono">
                    {viewingTicketModal.registration.ticketCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Tear Perforation Visual */}
            <div className="relative h-4 bg-slate-100 flex items-center justify-between px-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 -ml-6" />
              <div className="border-b-2 border-dashed border-slate-300 w-full mx-2" />
              <div className="w-6 h-6 rounded-full bg-slate-900 -mr-6" />
            </div>

            {/* Ticket Body Details */}
            <div className="p-5 space-y-4 bg-white text-xs">
              {/* Attendee Info */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Attendee Name</span>
                  <p className="font-bold text-slate-900 text-sm">{viewingTicketModal.registration.registeredByName}</p>
                  <span className="text-[10px] text-slate-500">{viewingTicketModal.registration.isMember ? 'Community Resident Member' : 'Non-Member Guest'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Admit Party Size</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {viewingTicketModal.registration.adultsCount} Adults, {viewingTicketModal.registration.childrenCount} Kids
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">Total Paid: ₹{viewingTicketModal.registration.totalPaid}</span>
                </div>
              </div>

              {/* Venues & Parking Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Reserved Venues</span>
                  <p className="font-semibold text-indigo-900 text-[11px] leading-tight">
                    {viewingTicketModal.event.venues ? viewingTicketModal.event.venues.join(' • ') : viewingTicketModal.event.venue}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Parking Pass & Gate</span>
                  <p className="font-semibold text-slate-900 text-[11px]">
                    {viewingTicketModal.registration.parkingPassNumber || viewingTicketModal.event.parking?.gate || 'Standard Parking'}
                  </p>
                  {viewingTicketModal.event.venueMap?.googleMapsUrl && (
                    <a
                      href={viewingTicketModal.event.venueMap.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold mt-0.5"
                    >
                      <Navigation className="w-2.5 h-2.5" /> Navigate to Gate
                    </a>
                  )}
                </div>
              </div>

              {/* Food Catering Token */}
              {viewingTicketModal.registration.foodOpted && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="font-bold text-amber-950 block text-xs">Catering Meal Token Active</span>
                      <span className="text-[10px] text-amber-800">
                        {viewingTicketModal.registration.adultMeals} Adult + {viewingTicketModal.registration.childMeals} Child ({viewingTicketModal.registration.dietaryPreference})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded uppercase">
                    Verified Food Voucher
                  </span>
                </div>
              )}

              {/* High-Resolution SVG Scannable QR Code */}
              <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                <div className="p-3.5 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center shadow-inner relative">
                  {scanSuccessFeedback && (
                    <div className="absolute inset-0 bg-emerald-600/90 rounded-2xl flex flex-col items-center justify-center text-white animate-in zoom-in-90 duration-150">
                      <CheckCircle2 className="w-12 h-12 text-white mb-1" />
                      <span className="font-bold text-sm">DOOR ACCESS GRANTED</span>
                      <span className="text-[10px] text-emerald-100">Checked-in Successfully</span>
                    </div>
                  )}

                  <svg width="140" height="140" viewBox="0 0 100 100" className="text-slate-900">
                    {/* Position Markers */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="5"/>
                    <rect x="12" y="12" width="14" height="14" fill="currentColor"/>
                    <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="5"/>
                    <rect x="74" y="12" width="14" height="14" fill="currentColor"/>
                    <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="5"/>
                    <rect x="12" y="74" width="14" height="14" fill="currentColor"/>
                    {/* Pattern Matrix */}
                    <rect x="38" y="10" width="6" height="6" fill="currentColor"/>
                    <rect x="48" y="15" width="6" height="6" fill="currentColor"/>
                    <rect x="56" y="8" width="6" height="6" fill="currentColor"/>
                    <rect x="40" y="24" width="6" height="6" fill="currentColor"/>
                    <rect x="52" y="28" width="6" height="6" fill="currentColor"/>
                    <rect x="10" y="42" width="6" height="6" fill="currentColor"/>
                    <rect x="22" y="48" width="6" height="6" fill="currentColor"/>
                    <rect x="38" y="42" width="10" height="10" fill="currentColor"/>
                    <rect x="54" y="44" width="8" height="8" fill="currentColor"/>
                    <rect x="70" y="40" width="6" height="6" fill="currentColor"/>
                    <rect x="84" y="48" width="6" height="6" fill="currentColor"/>
                    <rect x="40" y="62" width="6" height="6" fill="currentColor"/>
                    <rect x="54" y="66" width="6" height="6" fill="currentColor"/>
                    <rect x="68" y="60" width="6" height="6" fill="currentColor"/>
                    <rect x="80" y="74" width="10" height="10" fill="currentColor"/>
                    <rect x="44" y="82" width="6" height="6" fill="currentColor"/>
                    <rect x="58" y="86" width="6" height="6" fill="currentColor"/>
                  </svg>
                  <span className="text-[10px] font-mono font-bold text-slate-700 tracking-wider mt-1">
                    {viewingTicketModal.registration.ticketCode}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Scan at Gate 2 Kiosk or Security Marshal scanner for door admission
                </span>
              </div>
            </div>

            {/* Ticket Actions & Simulation Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => alert(`Ticket dispatched to WhatsApp (${viewingTicketModal.registration.contactPhone}) successfully with PDF attachment!`)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  title="Resend WhatsApp Pass"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Email E-Ticket re-sent to ${viewingTicketModal.registration.contactEmail} with calendar invite (.ics)!`)}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  title="Resend Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Email</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSimulateDoorScan}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Simulate Gate Door Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

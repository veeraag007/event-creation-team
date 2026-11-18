import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  QrCode,
  Share2,
  Edit3,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  DollarSign,
  Car,
  Utensils,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Filter,
  UserCheck,
  Send,
  ExternalLink,
  History,
  Lock,
  Unlock,
  Sliders,
  BadgeAlert
} from 'lucide-react';
import {
  CommunityEvent,
  EventSession,
  AttendanceMode,
  SessionStatus,
  EventRegistration,
  Auditorium,
  EventAudienceType,
  SessionAuditEntry
} from '../types';
import { INITIAL_AUDITORIUMS } from '../data/eventData';

interface EventDetailViewProps {
  event: CommunityEvent;
  onBack: () => void;
  onUpdateEvent: (updatedEvent: CommunityEvent) => void;
  onOpenSeatManagement?: (eventId: string, sessionBlockId?: string) => void;
  onNotify?: (msg: string) => void;
  currentRole?: string;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event: initialEvent,
  onBack,
  onUpdateEvent,
  onOpenSeatManagement,
  onNotify,
  currentRole = 'Event Manager'
}) => {
  const [event, setEvent] = useState<CommunityEvent>(initialEvent);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'tickets' | 'attendees' | 'audit'>('overview');

  // Modals
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [changeImpactSession, setChangeImpactSession] = useState<{
    original: EventSession;
    updated: EventSession;
    reason: string;
    notifyChannels: string[];
  } | null>(null);
  const [selectedAttendeeTicket, setSelectedAttendeeTicket] = useState<{
    registration: EventRegistration;
  } | null>(null);

  // Attendees tab filters
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [attendeeSessionFilter, setAttendeeSessionFilter] = useState<string>('all');
  const [attendeePassFilter, setAttendeePassFilter] = useState<'all' | 'whole_event' | 'session'>('all');

  // Sync with initialEvent
  React.useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  // Helper for attendance mode metadata
  const getAttendanceModeBadge = (mode: AttendanceMode) => {
    switch (mode) {
      case 'reserved_seating':
        return {
          label: 'Reserved Seating',
          desc: 'Attendee selects or is assigned specific seats from auditorium seat map',
          pillBg: 'bg-purple-100 text-purple-800 border-purple-200',
          badgeBg: 'bg-purple-700 text-white',
          icon: <Layers className="w-3.5 h-3.5" />
        };
      case 'general_admission':
        return {
          label: 'General Admission',
          desc: 'Capacity pool; no seat selection or seat numbers (seat map hidden)',
          pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-emerald-700 text-white',
          icon: <Users className="w-3.5 h-3.5" />
        };
      case 'mixed_seating':
        return {
          label: 'Mixed Seating',
          desc: 'Selected blocks reserved, remaining capacity sold as general admission',
          pillBg: 'bg-blue-100 text-blue-800 border-blue-200',
          badgeBg: 'bg-blue-700 text-white',
          icon: <Sliders className="w-3.5 h-3.5" />
        };
      case 'open_space':
        return {
          label: 'Open Space',
          desc: 'Outdoor/open lawn entry capacity pool without auditorium seat map',
          pillBg: 'bg-amber-100 text-amber-800 border-amber-200',
          badgeBg: 'bg-amber-700 text-white',
          icon: <Sparkles className="w-3.5 h-3.5" />
        };
      case 'registration_only':
        return {
          label: 'Registration Only',
          desc: 'Free or paid registration against capacity limit; seat selection optional',
          pillBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          badgeBg: 'bg-cyan-700 text-white',
          icon: <ShieldCheck className="w-3.5 h-3.5" />
        };
      default:
        return {
          label: 'Standard',
          desc: '',
          pillBg: 'bg-slate-100 text-slate-800 border-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          icon: <Ticket className="w-3.5 h-3.5" />
        };
    }
  };

  const getSessionStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">Draft</span>;
      case 'ready_for_review':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 border border-amber-200">Ready for Review</span>;
      case 'published':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Published</span>;
      case 'registration_closed':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-100 text-rose-800 border border-rose-200">Registration Closed</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">Completed</span>;
    }
  };

  // Group sessions by Day
  const sessionsByDay = (event.sessions || []).reduce<Record<string, EventSession[]>>((acc, session) => {
    const dayKey = session.date || 'TBD';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(session);
    return acc;
  }, {});

  // Pre-publish Overlap / Conflict Validation Engine
  const validateSessionConflicts = (sessions: EventSession[]) => {
    const issues: { sessionId: string; sessionName: string; type: 'overlap' | 'capacity' | 'buffer'; message: string }[] = [];

    for (let i = 0; i < sessions.length; i++) {
      const s1 = sessions[i];

      // Capacity validation
      if (s1.allocatedCapacity > s1.venueOperatingLimit) {
        issues.push({
          sessionId: s1.id,
          sessionName: s1.name,
          type: 'capacity',
          message: `Allocated capacity (${s1.allocatedCapacity}) exceeds venue safety limit (${s1.venueOperatingLimit})!`
        });
      }

      const totalHolds = (s1.holds.accessible || 0) + (s1.holds.staff || 0) + (s1.holds.sponsor || 0) + (s1.holds.safetyBuffer || 0);
      if (totalHolds >= s1.allocatedCapacity) {
        issues.push({
          sessionId: s1.id,
          sessionName: s1.name,
          type: 'capacity',
          message: `Total holds (${totalHolds}) exceed or equal allocated capacity (${s1.allocatedCapacity})!`
        });
      }

      // Check overlap with other sessions on same date and same venue space
      for (let j = i + 1; j < sessions.length; j++) {
        const s2 = sessions[j];
        if (s1.date === s2.date && s1.venueId === s2.venueId) {
          // If times overlap (including setup/teardown buffers)
          const s1Start = parseTimeToMinutes(s1.startTime) - s1.setupBufferMinutes;
          const s1End = parseTimeToMinutes(s1.endTime) + s1.teardownBufferMinutes;
          const s2Start = parseTimeToMinutes(s2.startTime) - s2.setupBufferMinutes;
          const s2End = parseTimeToMinutes(s2.endTime) + s2.teardownBufferMinutes;

          if (s1Start < s2End && s2Start < s1End) {
            issues.push({
              sessionId: s1.id,
              sessionName: s1.name,
              type: 'overlap',
              message: `Venue time conflict with "${s2.name}" at ${s1.venueName} (including ${s1.setupBufferMinutes}m setup & ${s1.teardownBufferMinutes}m teardown buffer)!`
            });
          }
        }
      }
    }

    return issues;
  };

  const validationIssues = validateSessionConflicts(event.sessions || []);

  // Time conversion utility
  function parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const clean = timeStr.trim();
    const parts = clean.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!parts) return 0;
    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const modifier = parts[3]?.toUpperCase();
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Handle Save Session (Add or Edit)
  const handleSaveSession = (newOrUpdatedSession: EventSession) => {
    const existingIndex = (event.sessions || []).findIndex(s => s.id === newOrUpdatedSession.id);
    const existingSession = existingIndex >= 0 ? event.sessions[existingIndex] : null;

    // Check if session is already published and has registrations, and critical fields changed!
    if (
      existingSession && 
      existingSession.status === 'published' && 
      existingSession.registrationsCount > 0 &&
      (existingSession.date !== newOrUpdatedSession.date ||
       existingSession.startTime !== newOrUpdatedSession.startTime ||
       existingSession.endTime !== newOrUpdatedSession.endTime ||
       existingSession.venueId !== newOrUpdatedSession.venueId ||
       existingSession.attendanceMode !== newOrUpdatedSession.attendanceMode)
    ) {
      // Prompt Attendee Notification Impact Review Dialog!
      setChangeImpactSession({
        original: existingSession,
        updated: newOrUpdatedSession,
        reason: 'Schedule/Venue adjustment for enhanced production quality.',
        notifyChannels: ['whatsapp', 'email', 'in_app']
      });
      setEditingSession(null);
      setIsAddSessionOpen(false);
      return;
    }

    // Otherwise apply directly
    let updatedSessions: EventSession[];
    if (existingIndex >= 0) {
      updatedSessions = event.sessions.map((s, idx) => idx === existingIndex ? newOrUpdatedSession : s);
    } else {
      updatedSessions = [...(event.sessions || []), newOrUpdatedSession];
    }

    const totalRegs = updatedSessions.reduce((sum, s) => sum + s.registrationsCount, 0);
    const updatedEvent: CommunityEvent = {
      ...event,
      sessions: updatedSessions,
      totalSessionRegistrationsCount: totalRegs,
      capacity: updatedSessions.reduce((sum, s) => sum + s.sellableCapacity, 0)
    };

    setEvent(updatedEvent);
    onUpdateEvent(updatedEvent);
    setEditingSession(null);
    setIsAddSessionOpen(false);
    notify(`Session "${newOrUpdatedSession.name}" saved successfully.`);
  };

  // Confirm Attendee Notification Dialog & Apply Change
  const handleConfirmChangeImpact = () => {
    if (!changeImpactSession) return;
    const { original, updated, reason, notifyChannels } = changeImpactSession;

    const auditEntry: SessionAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      action: 'Session Schedule/Venue Rescheduled',
      author: `${currentRole} Persona`,
      changesSummary: `Rescheduled "${updated.name}" from ${original.date} ${original.startTime} (${original.venueName}) to ${updated.date} ${updated.startTime} (${updated.venueName}). Reason: ${reason}`,
      notifyAttendees: true,
      attendeesNotifiedCount: original.registrationsCount
    };

    const sessionWithAudit: EventSession = {
      ...updated,
      auditLog: [auditEntry, ...(updated.auditLog || [])]
    };

    const updatedSessions = event.sessions.map(s => s.id === updated.id ? sessionWithAudit : s);
    const updatedEvent: CommunityEvent = {
      ...event,
      sessions: updatedSessions,
      auditLog: [auditEntry, ...(event.auditLog || [])]
    };

    setEvent(updatedEvent);
    onUpdateEvent(updatedEvent);
    setChangeImpactSession(null);
    notify(`Broadcasting update to ${original.registrationsCount} attendees via ${notifyChannels.join(', ')}.`);
  };

  // One-click Check-in
  const handleToggleCheckIn = (regId: string) => {
    const list = event.registrationsList || [];
    const updatedList = list.map(reg => {
      if (reg.id === regId) {
        const isNowChecked = reg.checkInStatus !== 'checked_in';
        return {
          ...reg,
          checkInStatus: isNowChecked ? ('checked_in' as const) : ('pending' as const),
          checkInTime: isNowChecked ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return reg;
    });

    const updatedEvent = {
      ...event,
      registrationsList: updatedList
    };

    setEvent(updatedEvent);
    onUpdateEvent(updatedEvent);
    notify(`Registration ${regId} check-in status updated.`);
  };

  // Filter attendees
  const filteredAttendees = (event.registrationsList || []).filter(reg => {
    const matchSearch =
      reg.registeredByName.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      reg.contactEmail.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      reg.ticketCode.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      (reg.memberId && reg.memberId.toLowerCase().includes(attendeeSearchQuery.toLowerCase()));

    const matchPass =
      attendeePassFilter === 'all' ||
      (attendeePassFilter === 'whole_event' && reg.passType === 'whole_event') ||
      (attendeePassFilter === 'session' && reg.passType === 'session');

    const matchSession =
      attendeeSessionFilter === 'all' ||
      (reg.sessionIds && reg.sessionIds.includes(attendeeSessionFilter));

    return matchSearch && matchPass && matchSession;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Navigation & Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events Portal</span>
        </button>

        <div className="flex items-center gap-2">
          {validationIssues.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{validationIssues.length} Scheduling Issue(s)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Sessions Verified & Conflict-Free</span>
            </span>
          )}

          <button
            onClick={() => {
              notify(`Exporting comprehensive Event Roster & Session Badges (CSV)...`);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Header Banner & Event Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.name}
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-xs font-bold border border-indigo-300/30">
                Multi-Session Architecture
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                {event.status}
              </span>
            </div>
          </div>

          {/* Bottom Title & Details */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-start gap-4">
              {event.logoUrl ? (
                <img
                  src={event.logoUrl}
                  alt="Badge"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xl bg-white shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-2 border-white flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0">
                  {event.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {event.name}
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl line-clamp-1 drop-shadow-xs">
                  {event.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-indigo-300" /> {event.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-indigo-300" /> {Object.keys(sessionsByDay).length} Scheduled Days
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Layers className="w-3.5 h-3.5 text-indigo-300" /> {event.sessions?.length || 0} Sessions
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-amber-300">
                    <Ticket className="w-3.5 h-3.5 text-amber-300" /> Pass Option: {event.passOption === 'both' ? 'Whole Event & Session Passes' : event.passOption === 'whole_event_pass' ? 'Whole Event Pass Only' : 'Session Passes Only'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddSessionOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* Core KPI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50 p-4 border-t border-slate-100">
          <div className="p-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Unique Attendees</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{event.uniqueAttendeesCount || 0}</span>
              <span className="text-xs font-semibold text-emerald-600">distinct humans</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Deduped across all sessions</span>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Session Admissions</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-indigo-900">{event.totalSessionRegistrationsCount || 0}</span>
              <span className="text-xs font-semibold text-indigo-600">check-ins</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Sum of session seats & entries</span>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Gross Revenue</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900">₹{(event.revenue || 0).toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Passes + Food add-ons</span>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Sellable Capacity</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {(event.sessions || []).reduce((sum, s) => sum + s.sellableCapacity, 0)}
              </span>
              <span className="text-xs text-slate-500">seats/slots</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">After accessibility & staff holds</span>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Event Organizer</span>
            <div className="mt-1">
              <span className="text-xs font-bold text-slate-800 line-clamp-1">{event.ownerName || 'Managing Committee'}</span>
              <span className="text-[10px] text-slate-500 block">Lead Coordinator</span>
            </div>
          </div>
        </div>

        {/* Five Tab Header */}
        <div className="flex border-t border-slate-200 bg-white px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule & Sessions ({event.sessions?.length || 0})</span>
            {validationIssues.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Tickets & Registration</span>
          </button>

          <button
            onClick={() => setActiveTab('attendees')}
            className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'attendees'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Attendees & Check-in ({event.registrationsList?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity Log</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Multi-Session Model Callout */}
            <div className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Event → Sessions → Venue Spaces → Inventory</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    This event is configured with <strong>{event.sessions?.length || 0} independent sessions</strong> across{' '}
                    <strong>{Object.keys(sessionsByDay).length} days</strong> and multiple spaces. Attendance modes belong to sessions, allowing the same auditorium or lawn to host reserved seating for one session and general admission for another.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Session Schedule Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Program Sessions Glance</span>
                </h3>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {(event.sessions || []).map((session, idx) => {
                  const modeBadge = getAttendanceModeBadge(session.attendanceMode);
                  return (
                    <div
                      key={session.id || idx}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{session.name}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${modeBadge.pillBg}`}>
                            {modeBadge.icon}
                            {modeBadge.label}
                          </span>
                          {getSessionStatusBadge(session.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {session.date} • {session.startTime} - {session.endTime}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {session.venueName} ({session.spaceName || 'Main Space'})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-800">
                            {session.registrationsCount} / {session.sellableCapacity}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Booked seats</span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingSession(session);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white cursor-pointer"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passes & Pricing Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span>Ticketing & Pass Options</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Whole-Event Pass
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                      ₹{event.wholeEventPassPricing?.memberAdult || 850} / ₹{event.wholeEventPassPricing?.nonMemberAdult || 1600}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    Grants all-session access across all 3 days. Draws inventory evenly across all 5 sessions while locking capacity to prevent overselling.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 pt-2 border-t border-indigo-100">
                    <span>Sold / Allocated:</span>
                    <span className="font-bold text-indigo-900">{event.wholeEventPassSold || 165} / {event.wholeEventPassCapacity || 200}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-slate-600" /> Individual Session Passes
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                      Per Session Pricing
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    Attendees can register specifically for individual morning or evening performances based on their schedule.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200">
                    <span>Active Session Tickets:</span>
                    <span className="font-bold text-slate-900">
                      {(event.totalSessionRegistrationsCount || 0) - ((event.wholeEventPassSold || 165) * 5)} Single Passes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Venue Maps & Info */}
          <div className="space-y-6">
            {/* Venue Location Map Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Venue & Access Gates</span>
              </h3>
              <p className="text-xs text-slate-600">
                {event.venueMap?.address || event.venue}
              </p>
              {event.venueMap?.gateEntrance && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Entrance: </span>
                  {event.venueMap.gateEntrance}
                </div>
              )}
              {event.venueMap?.googleMapsUrl && (
                <a
                  href={event.venueMap.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              )}
            </div>

            {/* Food & Catering Summary */}
            {event.foodConfig && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Food & Hospitality</span>
                </h3>
                <div className="text-xs space-y-1.5">
                  <div className="font-bold text-slate-800">{event.foodConfig.mealTitle}</div>
                  <div className="text-slate-500">{event.foodConfig.notes}</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {event.foodConfig.dietaryOptions.map(opt => (
                      <span key={opt} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Parking Configuration */}
            {event.parking?.enabled && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Parking & Valet</span>
                </h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Zone:</strong> {event.parking.zone}</div>
                  <div><strong>Capacity:</strong> {event.parking.totalSlots} slots ({event.parking.slotsAvailable} available)</div>
                  {event.parking.valet && <div className="text-blue-600 font-semibold">✓ Valet marshals stationed at Gate 2</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Schedule & Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Scheduling Top Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Program Sessions by Day</h2>
              <p className="text-xs text-slate-500">
                Configure attendance modes, setup/teardown buffers, and sellable capacity per session.
              </p>
            </div>

            <button
              onClick={() => setIsAddSessionOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Session</span>
            </button>
          </div>

          {/* Validation Conflicts Alert if any */}
          {validationIssues.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Scheduling Warnings & Conflict Detection</span>
              </div>
              <ul className="text-xs text-amber-800 list-disc list-inside space-y-1">
                {validationIssues.map((issue, idx) => (
                  <li key={idx}>
                    <strong>[{issue.sessionName}]: </strong>{issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Day Grouped Sessions */}
          {(Object.entries(sessionsByDay) as [string, EventSession[]][]).map(([dayDate, sessions]) => (
            <div key={dayDate} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{dayDate}</span>
                </div>
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs font-medium text-slate-400">
                  {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sessions.map(session => {
                  const modeBadge = getAttendanceModeBadge(session.attendanceMode);
                  const isAuditoriumVenue = session.venueName.toLowerCase().includes('auditorium');
                  const hasSeatMapOption = session.attendanceMode === 'reserved_seating' || session.attendanceMode === 'mixed_seating';

                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">{session.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border flex items-center gap-1 ${modeBadge.pillBg}`}>
                              {modeBadge.icon}
                              {modeBadge.label}
                            </span>
                            {getSessionStatusBadge(session.status)}
                          </div>
                          {session.description && (
                            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                              {session.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {hasSeatMapOption ? (
                            <button
                              onClick={() => {
                                if (onOpenSeatManagement) onOpenSeatManagement(event.id, session.reservedBlockIds?.[0]);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              <span>Interactive Seat Map</span>
                            </button>
                          ) : session.attendanceMode === 'general_admission' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                              <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Seat Selection Hidden (GA Pool)</span>
                            </span>
                          ) : null}

                          <button
                            onClick={() => setEditingSession(session)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit Session</span>
                          </button>
                        </div>
                      </div>

                      {/* Detail Metrics Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl text-xs border border-slate-100">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Schedule & Buffers</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {session.setupBufferMinutes}m setup • {session.teardownBufferMinutes}m teardown
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Venue & Space</span>
                          <span className="font-bold text-slate-800 block mt-0.5 line-clamp-1">{session.venueName}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">
                            {session.spaceName || 'Main Area'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Capacity Calculation</span>
                          <span className="font-bold text-slate-900 block mt-0.5">
                            {session.allocatedCapacity} - {session.holds.accessible + session.holds.staff + session.holds.sponsor + session.holds.safetyBuffer} holds = {session.sellableCapacity} sellable
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            {session.registrationsCount} booked ({session.sellableCapacity - session.registrationsCount} left)
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Eligibility & Pricing</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {session.isFree ? 'Free Admission' : `₹${session.pricing?.memberAdult || 0} / ₹${session.pricing?.nonMemberAdult || 0}`}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 capitalize">
                            {session.audienceEligibility.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Holds Breakdown Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-500 text-[10px] uppercase">Capacity Holds:</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-100">
                          ♿ {session.holds.accessible} Accessible (ADA)
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          Staff: {session.holds.staff}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-100">
                          Sponsors: {session.holds.sponsor}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-100">
                          Safety Buffer: {session.holds.safetyBuffer}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Tickets & Registration */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pass Coverage & Multi-Session Inventory</h2>
              <p className="text-xs text-slate-500">
                Prevent overselling across sessions when whole-event passes draw inventory from multiple sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Whole-event pass */}
              <div className="border border-indigo-200 rounded-2xl p-4 bg-linear-to-br from-indigo-50/40 to-purple-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Whole-Event Pass Pool
                  </span>
                  <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-lg">
                    ₹{event.wholeEventPassPricing?.memberAdult || 850}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Pass Inventory Allocated:</span>
                    <strong className="text-slate-900">{event.wholeEventPassCapacity || 200} passes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Passes Sold:</span>
                    <strong className="text-indigo-700">{event.wholeEventPassSold || 165} sold</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Whole-Event Pool:</span>
                    <strong className="text-emerald-700">{(event.wholeEventPassCapacity || 200) - (event.wholeEventPassSold || 165)} available</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">Coverage: </span>
                  Grants entry to all {event.sessions?.length || 0} sessions. Inventory is dynamically decremented from every session's pool simultaneously.
                </div>
              </div>

              {/* Single session pass */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-slate-600" /> Individual Session Inventory
                  </span>
                  <span className="text-xs font-extrabold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">
                    Per-Session Tickets
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Independent Session Passes Sold:</span>
                    <strong className="text-slate-900">
                      {(event.totalSessionRegistrationsCount || 0) - ((event.wholeEventPassSold || 165) * 5)} tickets
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Overselling Guard:</span>
                    <strong className="text-emerald-600">Active (Real-time quota lock)</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">Calculation: </span>
                  Available Session Tickets = Session Sellable Capacity - Whole Event Passes Sold - Session Individual Tickets Sold.
                </div>
              </div>
            </div>
          </div>

          {/* Session by Session Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Session Inventory & Quota Breakdown</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Session</th>
                    <th className="py-2.5 px-3">Attendance Mode</th>
                    <th className="py-2.5 px-3">Gross Limit</th>
                    <th className="py-2.5 px-3">Holds</th>
                    <th className="py-2.5 px-3">Sellable</th>
                    <th className="py-2.5 px-3">Whole Pass Hold</th>
                    <th className="py-2.5 px-3">Session Tickets</th>
                    <th className="py-2.5 px-3">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(event.sessions || []).map(sess => {
                    const totalHolds = sess.holds.accessible + sess.holds.staff + sess.holds.sponsor + sess.holds.safetyBuffer;
                    const wholePassHold = event.wholeEventPassSold || 0;
                    const sessionOnlySold = Math.max(0, sess.registrationsCount - wholePassHold);
                    const remaining = Math.max(0, sess.sellableCapacity - sess.registrationsCount);

                    return (
                      <tr key={sess.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{sess.name}</td>
                        <td className="py-3 px-3">
                          <span className="capitalize text-slate-700 font-medium">
                            {sess.attendanceMode.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{sess.allocatedCapacity}</td>
                        <td className="py-3 px-3 text-rose-600 font-medium">{totalHolds}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{sess.sellableCapacity}</td>
                        <td className="py-3 px-3 text-indigo-700 font-semibold">{wholePassHold}</td>
                        <td className="py-3 px-3 text-slate-700">{sessionOnlySold}</td>
                        <td className="py-3 px-3">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            remaining > 20 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {remaining} slots
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Attendees & Check-in */}
      {activeTab === 'attendees' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee, email, ticket code..."
                value={attendeeSearchQuery}
                onChange={e => setAttendeeSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={attendeeSessionFilter}
                onChange={e => setAttendeeSessionFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Sessions</option>
                {(event.sessions || []).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={attendeePassFilter}
                onChange={e => setAttendeePassFilter(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Pass Types</option>
                <option value="whole_event">Whole-Event Pass</option>
                <option value="session">Session Pass</option>
              </select>
            </div>
          </div>

          {/* Attendees List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-3">Pass Type</th>
                    <th className="py-3 px-3">Sessions & Seats</th>
                    <th className="py-3 px-3">Guests / Food</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No attendees match current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendees.map(reg => {
                      const isCheckedIn = reg.checkInStatus === 'checked_in';
                      return (
                        <tr key={reg.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{reg.registeredByName}</div>
                            <div className="text-[11px] text-slate-500">{reg.contactEmail} • {reg.contactPhone}</div>
                            {reg.memberId && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold mt-0.5">
                                {reg.memberId}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              reg.passType === 'whole_event'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {reg.passType === 'whole_event' ? 'Whole Event Pass' : 'Session Pass'}
                            </span>
                          </td>

                          <td className="py-3 px-3 space-y-1">
                            <div className="text-slate-800 font-medium">
                              {reg.sessionIds?.length || 1} session(s)
                            </div>
                            {reg.assignedSeat && (
                              <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {reg.assignedSeat}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <div>{reg.adultsCount} Adults, {reg.childrenCount} Children</div>
                            {reg.foodOpted && (
                              <div className="text-[10px] text-emerald-700 font-semibold">
                                Food: {reg.dietaryPreference} ({reg.adultMeals + reg.childMeals} meals)
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleToggleCheckIn(reg.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                isCheckedIn
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isCheckedIn ? `Checked In (${reg.checkInTime || 'Done'})` : 'Check In'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedAttendeeTicket({ registration: reg })}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3 h-3 text-slate-500" />
                              <span>QR Ticket</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Activity Log & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Immutable Audit Log & Change History</h2>
              <p className="text-xs text-slate-500">
                Track scheduling modifications, venue changes, capacity overrides, and attendee notification dispatches.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {((event.auditLog || []).length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No session modifications recorded yet.
              </div>
            ) : (
              (event.auditLog || []).map(entry => (
                <div key={entry.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-600" />
                      {entry.action}
                    </span>
                    <span>{entry.timestamp} • By {entry.author}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {entry.changesSummary}
                  </p>
                  {entry.notifyAttendees && (
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
                      <Send className="w-3 h-3 text-emerald-600" />
                      <span>Attendee notification broadcast dispatched ({entry.attendeesNotifiedCount || 0} notified)</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Edit / Add Session Drawer / Modal */}
      {(editingSession || isAddSessionOpen) && (
        <SessionEditModal
          session={editingSession}
          isNew={isAddSessionOpen}
          existingSessions={event.sessions || []}
          onClose={() => {
            setEditingSession(null);
            setIsAddSessionOpen(false);
          }}
          onSave={handleSaveSession}
        />
      )}

      {/* MODAL 2: Attendee Notification Impact Dialog */}
      {changeImpactSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BadgeAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Schedule Change & Notify Attendees
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                This session has <strong>{changeImpactSession.original.registrationsCount} active registrations</strong>. Changing schedule, venue, or attendance mode requires notifying attendees to prevent confusion.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs border border-slate-200">
              <div className="text-slate-500 font-semibold uppercase text-[10px]">Change Summary</div>
              <div className="text-slate-800">
                <strong>From: </strong>{changeImpactSession.original.date} • {changeImpactSession.original.startTime} at {changeImpactSession.original.venueName}
              </div>
              <div className="text-indigo-700 font-bold">
                <strong>To: </strong>{changeImpactSession.updated.date} • {changeImpactSession.updated.startTime} at {changeImpactSession.updated.venueName}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800">Reason for Administrative Change:</label>
              <textarea
                value={changeImpactSession.reason}
                onChange={e => setChangeImpactSession({ ...changeImpactSession, reason: e.target.value })}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g. Venue sound system enhancement or timing alignment..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setChangeImpactSession(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChangeImpact}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Notifications</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Digital QR Ticket Viewer */}
      {selectedAttendeeTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {event.name}
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {selectedAttendeeTicket.registration.registeredByName}
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
              <QrCode className="w-36 h-36 mx-auto text-slate-900" />
              <div className="font-mono text-xs font-bold text-slate-600 mt-2">
                {selectedAttendeeTicket.registration.ticketCode}
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Pass: </strong>{selectedAttendeeTicket.registration.passType === 'whole_event' ? 'Whole Event Pass' : 'Session Pass'}</div>
              <div><strong>Seat: </strong>{selectedAttendeeTicket.registration.assignedSeat || 'General Admission'}</div>
              <div><strong>Food: </strong>{selectedAttendeeTicket.registration.foodOpted ? `${selectedAttendeeTicket.registration.dietaryPreference} (${selectedAttendeeTicket.registration.adultMeals + selectedAttendeeTicket.registration.childMeals} meals)` : 'None'}</div>
            </div>

            <button
              onClick={() => setSelectedAttendeeTicket(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for Adding or Editing a Session
interface SessionEditModalProps {
  session: EventSession | null;
  isNew: boolean;
  existingSessions: EventSession[];
  onClose: () => void;
  onSave: (session: EventSession) => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({
  session,
  isNew,
  existingSessions,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<Partial<EventSession>>(() => {
    if (session) return { ...session };
    return {
      id: `sess-${Date.now()}`,
      eventId: 'ev-1',
      name: '',
      description: '',
      date: '2026-09-28',
      startTime: '06:00 PM',
      endTime: '08:00 PM',
      timezone: 'IST (UTC+5:30)',
      venueId: 'fac-aud-1',
      venueName: 'Main Civic Auditorium',
      spaceName: 'Main Stage & Stalls',
      setupBufferMinutes: 45,
      teardownBufferMinutes: 30,
      attendanceMode: 'reserved_seating',
      venueOperatingLimit: 850,
      allocatedCapacity: 500,
      holds: { accessible: 12, staff: 16, sponsor: 20, safetyBuffer: 12 },
      sellableCapacity: 440,
      registrationsCount: 0,
      audienceEligibility: 'member_and_non_member',
      isFree: false,
      pricing: { memberAdult: 300, memberChild: 150, nonMemberAdult: 600, nonMemberChild: 300, isFreeForMembers: false },
      status: 'published'
    };
  });

  // Calculate sellable capacity whenever allocatedCapacity or holds change
  const totalHolds = (form.holds?.accessible || 0) + (form.holds?.staff || 0) + (form.holds?.sponsor || 0) + (form.holds?.safetyBuffer || 0);
  const calculatedSellable = Math.max(0, (form.allocatedCapacity || 0) - totalHolds);

  // Check venue selection
  const handleVenueChange = (venueId: string) => {
    const v = INITIAL_AUDITORIUMS.find(aud => aud.id === venueId);
    if (v) {
      setForm(prev => ({
        ...prev,
        venueId: v.id,
        venueName: v.name,
        venueOperatingLimit: v.operatingSafetyLimit || v.capacity,
        setupBufferMinutes: v.setupBufferMinutesDefault || 45,
        teardownBufferMinutes: v.teardownBufferMinutesDefault || 30
      }));
    }
  };

  const handleSave = () => {
    if (!form.name?.trim()) {
      alert('Please enter session title');
      return;
    }

    const completeSession: EventSession = {
      id: form.id || `sess-${Date.now()}`,
      eventId: form.eventId || 'ev-1',
      name: form.name,
      description: form.description || '',
      date: form.date || '2026-09-28',
      startTime: form.startTime || '06:00 PM',
      endTime: form.endTime || '08:00 PM',
      timezone: form.timezone || 'IST (UTC+5:30)',
      venueId: form.venueId || 'fac-aud-1',
      venueName: form.venueName || 'Main Civic Auditorium',
      spaceName: form.spaceName || 'Main Space',
      setupBufferMinutes: form.setupBufferMinutes ?? 45,
      teardownBufferMinutes: form.teardownBufferMinutes ?? 30,
      attendanceMode: form.attendanceMode || 'reserved_seating',
      venueOperatingLimit: form.venueOperatingLimit || 850,
      allocatedCapacity: form.allocatedCapacity || 500,
      holds: form.holds || { accessible: 10, staff: 10, sponsor: 10, safetyBuffer: 10 },
      sellableCapacity: calculatedSellable,
      registrationsCount: form.registrationsCount || 0,
      audienceEligibility: form.audienceEligibility || 'member_and_non_member',
      isFree: form.isFree || false,
      pricing: form.pricing,
      status: form.status || 'published'
    };

    onSave(completeSession);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isNew ? 'Add New Session' : 'Configure Session & Attendance'}
            </h2>
            <p className="text-xs text-slate-500">
              Configure schedule, space allocation, buffers, attendance model, and capacity holds.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Session Name *</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sitar Maestro Recital or Classical Cinema Screening"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Session Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Short description of this session's program, artists, or activity..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Schedule Date & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Date</label>
              <input
                type="text"
                value={form.date || ''}
                onChange={e => setForm({ ...form, date: e.target.value })}
                placeholder="28 Sep 2026"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Start Time</label>
              <input
                type="text"
                value={form.startTime || ''}
                onChange={e => setForm({ ...form, startTime: e.target.value })}
                placeholder="06:00 PM"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">End Time</label>
              <input
                type="text"
                value={form.endTime || ''}
                onChange={e => setForm({ ...form, endTime: e.target.value })}
                placeholder="08:00 PM"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Venue Space & Buffer Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Venue Location</label>
              <select
                value={form.venueId}
                onChange={e => handleVenueChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {INITIAL_AUDITORIUMS.map(aud => (
                  <option key={aud.id} value={aud.id}>
                    {aud.name} (Limit: {aud.operatingSafetyLimit || aud.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Setup Buffer (Mins)</label>
              <input
                type="number"
                value={form.setupBufferMinutes ?? 45}
                onChange={e => setForm({ ...form, setupBufferMinutes: parseInt(e.target.value) || 0 })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Teardown Buffer (Mins)</label>
              <input
                type="number"
                value={form.teardownBufferMinutes ?? 30}
                onChange={e => setForm({ ...form, teardownBufferMinutes: parseInt(e.target.value) || 0 })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* ATTENDANCE MODE SELECTOR (Required per session!) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-900 block">
              Session Attendance Mode *
            </label>
            <p className="text-[11px] text-slate-500">
              The attendance mode belongs to the session, not the venue. The same venue can host reserved seating for one session and general admission for another.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  mode: 'reserved_seating' as AttendanceMode,
                  title: 'Reserved Seating',
                  desc: 'Attendee selects or is assigned specific seats from auditorium seat map'
                },
                {
                  mode: 'general_admission' as AttendanceMode,
                  title: 'General Admission',
                  desc: 'Capacity pool; no seat numbers; seat selection hidden even in auditorium'
                },
                {
                  mode: 'mixed_seating' as AttendanceMode,
                  title: 'Mixed Seating',
                  desc: 'Selected seat blocks reserved, balance sold as general admission'
                },
                {
                  mode: 'open_space' as AttendanceMode,
                  title: 'Open Space',
                  desc: 'Outdoor/open zone entry capacity pool without auditorium seat map'
                },
                {
                  mode: 'registration_only' as AttendanceMode,
                  title: 'Registration Only',
                  desc: 'Free/paid registration against capacity limit; seat selection optional'
                }
              ].map(opt => {
                const isSelected = form.attendanceMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setForm({ ...form, attendanceMode: opt.mode })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{opt.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity and Holds */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Capacity & Holds Breakdown</label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Sellable Capacity: {calculatedSellable}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block">Allocated Gross</label>
                <input
                  type="number"
                  value={form.allocatedCapacity || 500}
                  onChange={e => setForm({ ...form, allocatedCapacity: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block">Accessible Holds</label>
                <input
                  type="number"
                  value={form.holds?.accessible ?? 12}
                  onChange={e => setForm({
                    ...form,
                    holds: { ...(form.holds as any), accessible: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block">Staff Holds</label>
                <input
                  type="number"
                  value={form.holds?.staff ?? 16}
                  onChange={e => setForm({
                    ...form,
                    holds: { ...(form.holds as any), staff: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block">Safety Holds</label>
                <input
                  type="number"
                  value={form.holds?.safetyBuffer ?? 12}
                  onChange={e => setForm({
                    ...form,
                    holds: { ...(form.holds as any), safetyBuffer: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Save Session Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  ShieldAlert, 
  Crown, 
  Building2, 
  CalendarDays, 
  Dumbbell, 
  HeartHandshake, 
  CreditCard, 
  Megaphone,
  CheckCircle2,
  Lock,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Role, NavItemKey } from '../types';

export interface RoleConfig {
  role: Role;
  personaName: string;
  avatarInitials: string;
  title: string;
  department: string;
  summary: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  bannerTheme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    iconColor: string;
  };
  // Modules with full operational read/write access
  fullAccessModules: NavItemKey[];
  // Modules accessible for viewing only (edits/deletions blocked)
  readOnlyModules: NavItemKey[];
  // Modules completely blocked / access denied
  restrictedModules: NavItemKey[];
  // Allowed quick create actions
  allowedQuickActions: string[];
  // Granular capability flags
  canApproveBookings: boolean;
  canPublishEvents: boolean;
  canManageSeatMap: boolean;
  canProcessRefunds: boolean;
  canIssueInvoices: boolean;
  canManageMembers: boolean;
  canManageVolunteers: boolean;
  canPublishAnnouncements: boolean;
  canEditSettings: boolean;
  canViewAuditLogs: boolean;
  canEditRBAC: boolean;
  // Bullet points for simulation banner
  highlights: string[];
  restrictions: string[];
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  'Super Admin': {
    role: 'Super Admin',
    personaName: 'Rajesh Sharma',
    avatarInitials: 'RS',
    title: 'Super Administrator & Society President',
    department: 'Executive Board',
    summary: 'Unrestricted master governance across all 23 modules, financial payouts, RBAC policies and system logs.',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    badgeText: 'text-indigo-400',
    borderAccent: 'border-indigo-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-900/60',
      border: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-500/20',
      badgeText: 'text-indigo-300 border border-indigo-500/40',
      iconColor: 'text-indigo-400'
    },
    fullAccessModules: [
      'dashboard', 'members', 'families', 'events', 'polls', 'volunteers', 
      'activities', 'sports-areas', 'auditoriums', 'facility-bookings', 
      'food-programs', 'donations', 'payments', 'refunds', 'invoices', 
      'announcements', 'notifications', 'media-gallery', 'reports', 'analytics', 
      'roles-permissions', 'settings', 'audit-logs', 'seat-management'
    ],
    readOnlyModules: [],
    restrictedModules: [],
    allowedQuickActions: [
      'add-member', 'add-family', 'create-event', 'create-booking', 
      'create-volunteer', 'create-food-program', 'create-poll', 'post-announcement', 'send-push'
    ],
    canApproveBookings: true,
    canPublishEvents: true,
    canManageSeatMap: true,
    canProcessRefunds: true,
    canIssueInvoices: true,
    canManageMembers: true,
    canManageVolunteers: true,
    canPublishAnnouncements: true,
    canEditSettings: true,
    canViewAuditLogs: true,
    canEditRBAC: true,
    highlights: ['All 23 platform modules active', 'Approve refunds, bookings & member applications', 'System-wide configuration & audit security'],
    restrictions: ['No operational restrictions applied']
  },

  'Community Admin': {
    role: 'Community Admin',
    personaName: 'Kavita Nair',
    avatarInitials: 'KN',
    title: 'Community Operations Director',
    department: 'Management Committee',
    summary: 'Oversees day-to-day resident community operations, member onboarding, events, facilities and governance polls.',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    badgeText: 'text-blue-400',
    borderAccent: 'border-blue-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-900/50',
      border: 'border-blue-500/30',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300 border border-blue-500/40',
      iconColor: 'text-blue-400'
    },
    fullAccessModules: [
      'dashboard', 'members', 'families', 'events', 'polls', 'volunteers', 
      'activities', 'sports-areas', 'auditoriums', 'facility-bookings', 
      'food-programs', 'donations', 'announcements', 'notifications', 
      'media-gallery', 'reports', 'analytics', 'seat-management'
    ],
    readOnlyModules: ['payments', 'refunds', 'invoices'],
    restrictedModules: ['roles-permissions', 'audit-logs', 'settings'],
    allowedQuickActions: [
      'add-member', 'add-family', 'create-event', 'create-booking', 
      'create-volunteer', 'create-food-program', 'create-poll', 'post-announcement', 'send-push'
    ],
    canApproveBookings: true,
    canPublishEvents: true,
    canManageSeatMap: true,
    canProcessRefunds: false,
    canIssueInvoices: false,
    canManageMembers: true,
    canManageVolunteers: true,
    canPublishAnnouncements: true,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Full member & event administration', 'Facility slot management & resolution balloting', 'Read-only financial ledgers'],
    restrictions: ['Cannot alter RBAC roles or access raw Security Audit Logs', 'Cannot authorize financial refunds or direct billing gateways']
  },

  'Event Manager': {
    role: 'Event Manager',
    personaName: 'Vikram Malhotra',
    avatarInitials: 'VM',
    title: 'Cultural & Event Lead',
    department: 'Events & Entertainment Committee',
    summary: 'Manages community galas, cultural festivals, auditorium seating allocation, activities and event photo galleries.',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'text-amber-400',
    borderAccent: 'border-amber-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/50',
      border: 'border-amber-500/30',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300 border border-amber-500/40',
      iconColor: 'text-amber-400'
    },
    fullAccessModules: [
      'dashboard', 'events', 'auditoriums', 'seat-management', 
      'activities', 'polls', 'media-gallery', 'announcements'
    ],
    readOnlyModules: ['members', 'facility-bookings', 'volunteers', 'donations', 'reports'],
    restrictedModules: ['payments', 'refunds', 'invoices', 'roles-permissions', 'settings', 'audit-logs', 'food-programs', 'sports-areas'],
    allowedQuickActions: ['create-event', 'post-announcement', 'send-push'],
    canApproveBookings: false,
    canPublishEvents: true,
    canManageSeatMap: true,
    canProcessRefunds: false,
    canIssueInvoices: false,
    canManageMembers: false,
    canManageVolunteers: false,
    canPublishAnnouncements: true,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Full Event Publishing & Ticket Tiers', 'Auditorium Seating Matrix & Tier Customization', 'Media Gallery & Event Circulars'],
    restrictions: ['Finance, Payments, Invoices & Refunds are restricted', 'System Settings, RBAC & Security Audit Logs locked', 'Sports & Member profile editing disabled']
  },

  'Facility Manager': {
    role: 'Facility Manager',
    personaName: 'Ananya Rao',
    avatarInitials: 'AR',
    title: 'Amenities & Infrastructure Superintendent',
    department: 'Facilities & Estate Management',
    summary: 'Supervises sports complexes, swimming pools, tennis courts, auditorium technical readiness, and court reservations.',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    borderAccent: 'border-emerald-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/50',
      border: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300 border border-emerald-500/40',
      iconColor: 'text-emerald-400'
    },
    fullAccessModules: [
      'dashboard', 'sports-areas', 'auditoriums', 'facility-bookings', 
      'seat-management', 'announcements'
    ],
    readOnlyModules: ['members', 'events', 'activities', 'reports'],
    restrictedModules: ['payments', 'refunds', 'invoices', 'donations', 'polls', 'food-programs', 'volunteers', 'roles-permissions', 'settings', 'audit-logs'],
    allowedQuickActions: ['create-booking', 'post-announcement'],
    canApproveBookings: true,
    canPublishEvents: false,
    canManageSeatMap: true,
    canProcessRefunds: false,
    canIssueInvoices: false,
    canManageMembers: false,
    canManageVolunteers: false,
    canPublishAnnouncements: false,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Approve / Reject Court & Slot Bookings', 'Auditorium Technical Setup & Seating Maps', 'Sports Complex Schedule & Maintenance'],
    restrictions: ['Finance & Accounting modules locked', 'Member registration & Voting Poll administration restricted', 'System configurations inaccessible']
  },

  'Finance Manager': {
    role: 'Finance Manager',
    personaName: 'Sunita Verma',
    avatarInitials: 'SV',
    title: 'Treasurer & Chief Financial Officer',
    department: 'Finance & Accounts Division',
    summary: 'Authorizes collections, processes cancellation refunds, audits tax invoices, welfare donations and financial balance sheets.',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeText: 'text-rose-400',
    borderAccent: 'border-rose-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-purple-950/50',
      border: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/20',
      badgeText: 'text-rose-300 border border-rose-500/40',
      iconColor: 'text-rose-400'
    },
    fullAccessModules: [
      'dashboard', 'payments', 'refunds', 'invoices', 'donations', 
      'reports', 'analytics'
    ],
    readOnlyModules: ['members', 'facility-bookings', 'events'],
    restrictedModules: ['sports-areas', 'auditoriums', 'seat-management', 'activities', 'polls', 'volunteers', 'food-programs', 'announcements', 'notifications', 'media-gallery', 'roles-permissions', 'settings', 'audit-logs'],
    allowedQuickActions: ['add-member'],
    canApproveBookings: false,
    canPublishEvents: false,
    canManageSeatMap: false,
    canProcessRefunds: true,
    canIssueInvoices: true,
    canManageMembers: false,
    canManageVolunteers: false,
    canPublishAnnouncements: false,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Process Razorpay/Stripe Refunds & Reversals', 'GST Invoice Generation & Overdue Dues Tracking', 'Financial Audits, Philanthropy Ledgers & Analytics'],
    restrictions: ['Facility booking approval is restricted', 'Event publishing & seating design locked', 'RBAC and System Settings locked']
  },

  'Volunteer Lead': {
    role: 'Volunteer Lead',
    personaName: 'Devendra Singh',
    avatarInitials: 'DS',
    title: 'Volunteer Stewardship Coordinator',
    department: 'Community Engagement & Outreach',
    summary: 'Mobilizes volunteer squads, tracks service hours, manages food distributions and community donation campaigns.',
    badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    badgeText: 'text-violet-400',
    borderAccent: 'border-violet-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/50',
      border: 'border-violet-500/30',
      badgeBg: 'bg-violet-500/20',
      badgeText: 'text-violet-300 border border-violet-500/40',
      iconColor: 'text-violet-400'
    },
    fullAccessModules: [
      'dashboard', 'volunteers', 'activities', 'food-programs', 
      'donations', 'announcements'
    ],
    readOnlyModules: ['members', 'events', 'reports'],
    restrictedModules: ['sports-areas', 'auditoriums', 'seat-management', 'facility-bookings', 'payments', 'refunds', 'invoices', 'polls', 'roles-permissions', 'settings', 'audit-logs'],
    allowedQuickActions: ['create-volunteer', 'create-food-program', 'post-announcement'],
    canApproveBookings: false,
    canPublishEvents: false,
    canManageSeatMap: false,
    canProcessRefunds: false,
    canIssueInvoices: false,
    canManageMembers: false,
    canManageVolunteers: true,
    canPublishAnnouncements: true,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Create Volunteer Opportunities & Assign Shifts', 'Community Meal Programs & Token Verification', 'Philanthropy Drives & Steward Recognition'],
    restrictions: ['Financial modules completely restricted', 'Facility bookings and audits locked', 'System configuration disabled']
  },

  'Content Manager': {
    role: 'Content Manager',
    personaName: 'Priya Iyer',
    avatarInitials: 'PI',
    title: 'Communications & Media Officer',
    department: 'Digital Media & Public Relations',
    summary: 'Curates official announcements, broadcasts urgent notifications, manages photo galleries, and runs sentiment polls.',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    badgeText: 'text-sky-400',
    borderAccent: 'border-sky-500',
    bannerTheme: {
      bg: 'bg-gradient-to-r from-sky-950/70 via-slate-900 to-blue-950/50',
      border: 'border-sky-500/30',
      badgeBg: 'bg-sky-500/20',
      badgeText: 'text-sky-300 border border-sky-500/40',
      iconColor: 'text-sky-400'
    },
    fullAccessModules: [
      'dashboard', 'announcements', 'notifications', 'media-gallery', 
      'polls', 'events'
    ],
    readOnlyModules: ['members', 'activities'],
    restrictedModules: ['sports-areas', 'auditoriums', 'seat-management', 'facility-bookings', 'payments', 'refunds', 'invoices', 'volunteers', 'food-programs', 'donations', 'roles-permissions', 'settings', 'audit-logs', 'reports', 'analytics'],
    allowedQuickActions: ['post-announcement', 'send-push', 'create-poll'],
    canApproveBookings: false,
    canPublishEvents: true,
    canManageSeatMap: false,
    canProcessRefunds: false,
    canIssueInvoices: false,
    canManageMembers: false,
    canManageVolunteers: false,
    canPublishAnnouncements: true,
    canEditSettings: false,
    canViewAuditLogs: false,
    canEditRBAC: false,
    highlights: ['Draft Official Circulars & Emergency Broadcasts', 'Manage High-Res Media Albums & Photo Assets', 'Launch Democratic Voting Polls & Surveys'],
    restrictions: ['Accounting & Payment Gateways inaccessible', 'Facility and court management locked', 'Security Logs and RBAC management locked']
  }
};

export const ALL_ROLES: Role[] = [
  'Super Admin',
  'Community Admin',
  'Event Manager',
  'Facility Manager',
  'Finance Manager',
  'Volunteer Lead',
  'Content Manager'
];

/**
 * Checks if a role has access to a specific NavItemKey
 */
const MODULE_ALIASES: Partial<Record<NavItemKey, NavItemKey>> = {
  // Micro-app screens that inherit the permissions of a monolith module
  'my-tickets': 'events'
};

export function getRoleAccessLevel(role: Role, requestedKey: NavItemKey): 'full' | 'read-only' | 'restricted' {
  const moduleKey = MODULE_ALIASES[requestedKey] ?? requestedKey;
  const cfg = ROLE_CONFIGS[role];
  if (!cfg) return 'restricted';
  if (cfg.fullAccessModules.includes(moduleKey)) return 'full';
  if (cfg.readOnlyModules.includes(moduleKey)) return 'read-only';
  return 'restricted';
}

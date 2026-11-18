import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Users2, 
  CalendarDays, 
  Vote, 
  HeartHandshake, 
  Sparkles, 
  Dumbbell, 
  Theater, 
  BookmarkCheck, 
  UtensilsCrossed, 
  HandHeart, 
  CreditCard, 
  Receipt, 
  FileSpreadsheet, 
  Megaphone, 
  BellRing, 
  Image as ImageIcon, 
  BarChart3, 
  TrendingUp, 
  FileText,
  ShieldCheck, 
  Settings as SettingsIcon, 
  History, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  HelpCircle, 
  ChevronDown, 
  Menu, 
  X,
  Building,
  Check,
  LogOut,
  Bell,
  ExternalLink,
  Shield,
  Layers,
  UserPlus,
  PlusCircle,
  Briefcase,
  GraduationCap,
  Home,
  Award,
  Palette,
  Trophy,
  Lock,
  Eye
} from 'lucide-react';
import { NavItemKey, Role, UserProfile } from '../types';
import { OrganizationConfig, CommunitySector } from '../types/onboarding';
import { SECTOR_DEFINITIONS, INITIAL_SECTOR_ORGS } from '../data/sectorPresets';
import { RoleSimulationBar } from '../ui/RoleSimulationBar';
import { ROLE_CONFIGS, getRoleAccessLevel, ALL_ROLES } from '../data/rolePermissions';

export interface ShellProps {
  currentView: NavItemKey;
  onNavigate: (view: NavItemKey) => void;
  userProfile: UserProfile;
  onChangeRole: (role: Role) => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
  onOpenQuickCreate?: () => void;
  /** Micro-app specific sidebar. Defaults to the full monolith navigation. */
  navGroups?: NavGroup[];
  /** Label shown under the organisation name (e.g. the micro-app name). */
  appName?: string;
  /** View key the breadcrumb root links to. */
  homeView?: NavItemKey;
  children: React.ReactNode;
  breadcrumbs: { label: string; view?: NavItemKey }[];
  pageTitle: string;
  pageSubtitle?: string;
  primaryAction?: { label: string; icon?: React.ElementType; onClick: () => void };
  secondaryActions?: { label: string; icon?: React.ElementType; onClick: () => void; variant?: 'outline' | 'ghost' }[];
  notificationsCount?: number;
  organization?: OrganizationConfig;
  onSwitchOrganization?: (org: OrganizationConfig) => void;
  onOpenOnboarding?: () => void;
  onOpenMemberRegistration?: () => void;
}

export interface NavSectionItem {
  key: NavItemKey;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export type NavGroup = { section: string; items: NavSectionItem[] };

export const DEFAULT_NAV_GROUPS: NavGroup[] = [
  {
    section: 'COMMUNITY',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { key: 'members', label: 'Members', icon: Users, badge: '2.5k' },
      { key: 'families', label: 'Families', icon: Users2, badge: '640' }
    ]
  },
  {
    section: 'ENGAGEMENT',
    items: [
      { key: 'events', label: 'Events', icon: CalendarDays, badge: '18' },
      { key: 'polls', label: 'Polls', icon: Vote, badge: '1 live' },
      { key: 'volunteers', label: 'Volunteers', icon: HeartHandshake },
      { key: 'activities', label: 'Activities', icon: Sparkles, badge: '6' }
    ]
  },
  {
    section: 'FACILITIES',
    items: [
      { key: 'sports-areas', label: 'Sports Areas', icon: Dumbbell },
      { key: 'auditoriums', label: 'Venues & Theatres', icon: Theater, badge: '5' },
      { key: 'facility-bookings', label: 'Facility Bookings', icon: BookmarkCheck, badge: '8 pend' }
    ]
  },
  {
    section: 'PROGRAMS',
    items: [
      { key: 'food-programs', label: 'Food Programs', icon: UtensilsCrossed },
      { key: 'donations', label: 'Donations', icon: HandHeart, badge: '4' }
    ]
  },
  {
    section: 'FINANCE',
    items: [
      { key: 'payments', label: 'Payments', icon: CreditCard },
      { key: 'refunds', label: 'Refunds', icon: Receipt, badge: '1 pend' },
      { key: 'invoices', label: 'Invoices', icon: FileSpreadsheet, badge: '1 ovd' }
    ]
  },
  {
    section: 'COMMUNICATION',
    items: [
      { key: 'announcements', label: 'Announcements', icon: Megaphone, badge: '4' },
      { key: 'notifications', label: 'Notifications', icon: BellRing, badge: '5' },
      { key: 'media-gallery', label: 'Media Gallery', icon: ImageIcon, badge: '3' }
    ]
  },
  {
    section: 'INSIGHTS',
    items: [
      { key: 'reports', label: 'Reports', icon: FileText, badge: 'Audit' },
      { key: 'analytics', label: 'Analytics', icon: TrendingUp, badge: 'Live' }
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { key: 'roles-permissions', label: 'Roles & Permissions', icon: ShieldCheck },
      { key: 'settings', label: 'Settings', icon: SettingsIcon },
      { key: 'audit-logs', label: 'Audit Logs', icon: History }
    ]
  }
];

export const Shell: React.FC<ShellProps> = ({
  currentView,
  onNavigate,
  userProfile,
  onChangeRole,
  onLogout,
  onOpenSearch,
  onOpenQuickCreate,
  navGroups = DEFAULT_NAV_GROUPS,
  appName,
  homeView = 'dashboard',
  children,
  breadcrumbs,
  pageTitle,
  pageSubtitle,
  primaryAction,
  secondaryActions,
  notificationsCount = 5,
  organization,
  onSwitchOrganization,
  onOpenOnboarding,
  onOpenMemberRegistration
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [filterToRoleOnly, setFilterToRoleOnly] = useState(false);

  const activeRoleCfg = ROLE_CONFIGS[userProfile.role] || ROLE_CONFIGS['Super Admin'];

  const activeOrg = organization || INITIAL_SECTOR_ORGS['residential-local'];
  const sectorDef = SECTOR_DEFINITIONS[activeOrg.sector] || SECTOR_DEFINITIONS['residential-local'];

  const allPresetOrgs = Object.values(INITIAL_SECTOR_ORGS);

  const rolesList: Role[] = [
    'Super Admin',
    'Community Admin',
    'Event Manager',
    'Facility Manager',
    'Volunteer Lead',
    'Finance Manager',
    'Content Manager'
  ];

  const handleNavClick = (key: NavItemKey) => {
    onNavigate(key);
    setMobileDrawerOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none w-full overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            {activeOrg.name.charAt(0) || 'C'}
          </div>
          {!sidebarCollapsed && (
            <div className="truncate min-w-0">
              <span className="font-bold text-sm tracking-tight text-white block truncate">{activeOrg.name}</span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block truncate">
                {appName || sectorDef.name}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-1"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
        {navGroups.map((group) => {
          // Filter items if role-only filter is on
          const visibleItems = group.items.filter(item => {
            if (!filterToRoleOnly) return true;
            const access = getRoleAccessLevel(userProfile.role, item.key);
            return access !== 'restricted';
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.section} className="space-y-1">
              {!sidebarCollapsed ? (
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-300 uppercase py-1 flex items-center justify-between">
                  <span>{group.section}</span>
                </div>
              ) : (
                <div className="w-full h-px bg-slate-800 my-2" />
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.key;
                const access = getRoleAccessLevel(userProfile.role, item.key);
                const isRestricted = access === 'restricted';
                const isReadOnly = access === 'read-only';

                // Sector-adaptive label
                let displayLabel = item.label;
                if (item.key === 'members' && activeOrg.memberTermPlural) {
                  displayLabel = activeOrg.memberTermPlural;
                } else if (item.key === 'families') {
                  if (activeOrg.sector === 'professional-business') displayLabel = 'Teams & Companies';
                  else if (activeOrg.sector === 'education-learning') displayLabel = 'Batches & Cohorts';
                  else if (activeOrg.sector === 'sports-fitness') displayLabel = 'Leagues & Squads';
                  else if (activeOrg.sector === 'non-profit-orgs') displayLabel = 'Charity Chapters';
                } else if (item.key === 'auditoriums') {
                  displayLabel = 'Auditoriums & Seating';
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    title={
                      sidebarCollapsed 
                        ? `${displayLabel} ${isRestricted ? '(Restricted for ' + userProfile.role + ')' : ''}` 
                        : undefined
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group relative ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : isRestricted
                          ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {isRestricted ? (
                      <Lock className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-400 transition" />
                    ) : (
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isReadOnly ? 'text-amber-400/90' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    )}
                    
                    {!sidebarCollapsed && (
                      <span className={`truncate flex-1 text-left min-w-0 ${isRestricted ? 'text-slate-400' : ''}`}>
                        {displayLabel}
                      </span>
                    )}

                    {!sidebarCollapsed && isRestricted && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        Locked
                      </span>
                    )}

                    {!sidebarCollapsed && !isRestricted && isReadOnly && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        View
                      </span>
                    )}

                    {!sidebarCollapsed && !isRestricted && !isReadOnly && item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {sidebarCollapsed && isRestricted && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500/80" />
                    )}

                    {sidebarCollapsed && !isRestricted && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer / Current Admin Role Badge */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
              <div className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{userProfile.role}</span>
              </div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5">
                {activeRoleCfg.personaName} ({activeRoleCfg.title})
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-800/80 bg-slate-900 transition-all duration-200 z-30 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-slate-900 shadow-2xl z-10 flex flex-col">
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Global Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Multi-Sector Organization Switcher */}
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {activeOrg.name.charAt(0)}
                </div>
                <div className="max-w-[140px] sm:max-w-[220px] truncate">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {activeOrg.name}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold block truncate">
                    {sectorDef.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>

              {orgDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOrgDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs">
                    <div className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 tracking-wider flex items-center justify-between">
                      <span>Switch Sector Organization</span>
                      <span className="text-indigo-600 font-semibold">8 Sectors</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {allPresetOrgs.map((org) => {
                        const secInfo = SECTOR_DEFINITIONS[org.sector];
                        const isCurrent = activeOrg.id === org.id || activeOrg.sector === org.sector;
                        return (
                          <button
                            key={org.id}
                            onClick={() => {
                              onSwitchOrganization?.(org);
                              setOrgDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-left flex items-start justify-between transition ${
                              isCurrent ? 'bg-indigo-50/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-slate-900 truncate">{org.name}</div>
                              <div className="text-[11px] text-indigo-600 font-medium">
                                {secInfo.name} · <span className="text-slate-500">{org.city}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Terms: {org.memberTermPlural} · {org.spaceTermPlural}
                              </div>
                            </div>
                            {isCurrent && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-2 px-3 space-y-1.5">
                      <button
                        onClick={() => {
                          setOrgDropdownOpen(false);
                          onOpenOnboarding?.();
                        }}
                        className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Onboard New Organization (Wizard)</span>
                      </button>

                      <button
                        onClick={() => {
                          setOrgDropdownOpen(false);
                          onOpenMemberRegistration?.();
                        }}
                        className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                        <span>+ Self-Register as {activeOrg.memberTermSingular}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Member Self-Registration Trigger */}
            {onOpenMemberRegistration && <button
              onClick={onOpenMemberRegistration}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              title={`Self-register as a ${activeOrg.memberTermSingular}`}
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Join as {activeOrg.memberTermSingular}</span>
            </button>}

            {/* Direct Onboard Org Trigger */}
            {onOpenOnboarding && <button
              onClick={onOpenOnboarding}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
              title="Launch Onboarding Wizard for new community"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Onboard Org</span>
            </button>}

            {/* Global Search Bar (Cmd+K trigger) */}
            {onOpenSearch && <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 text-xs transition"
              title="Search (Cmd + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Search anything...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>}

            {/* Quick Create Button */}
            {onOpenQuickCreate && <button
              onClick={onOpenQuickCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Notifications ({notificationsCount})</span>
                      <button 
                        onClick={() => onNavigate('notifications')}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto text-xs">
                      <div className="p-3 hover:bg-slate-50 transition cursor-pointer" onClick={() => { onNavigate('members'); setNotifDropdownOpen(false); }}>
                        <p className="font-bold text-slate-800">New Member Registration</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Sunita Patel (Tower C-1104) submitted membership application for approval.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
                      </div>
                      <div className="p-3 hover:bg-slate-50 transition cursor-pointer" onClick={() => { onNavigate('facility-bookings'); setNotifDropdownOpen(false); }}>
                        <p className="font-bold text-slate-800">Facility Booking Request</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Arvind Rao requested Main Auditorium for 4 hours tomorrow.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">42 mins ago</span>
                      </div>
                      <div className="p-3 hover:bg-slate-50 transition cursor-pointer" onClick={() => { onNavigate('payments'); setNotifDropdownOpen(false); }}>
                        <p className="font-bold text-rose-600">Failed Renewal Payment</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Payment gateway reported card failure for Kavita Chawla (₹12,000).</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition hidden sm:inline-flex"
              aria-label="Platform Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Profile Avatar & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {userProfile.name.charAt(0)}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{userProfile.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{userProfile.email}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {userProfile.role}
                      </span>
                    </div>

                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-indigo-500" /> Switch Admin Role Demo
                        </span>
                        <span className="text-indigo-600 font-bold">7 Personas</span>
                      </div>
                      <div className="space-y-0.5 max-h-56 overflow-y-auto mt-1">
                        {ALL_ROLES.map(r => {
                          const rCfg = ROLE_CONFIGS[r];
                          const isCurrent = userProfile.role === r;
                          return (
                            <button
                              key={r}
                              onClick={() => {
                                onChangeRole(r);
                                setProfileDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                                isCurrent ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-xs">{r}</span>
                                  {isCurrent && (
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {rCfg.personaName} · {rCfg.department}
                                </div>
                              </div>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          onNavigate('settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        Organization Settings
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Interactive Role Simulation & RBAC Control Bar */}
        <RoleSimulationBar
          currentRole={userProfile.role}
          onChangeRole={onChangeRole}
          filterToRoleOnly={filterToRoleOnly}
          onToggleFilterToRoleOnly={setFilterToRoleOnly}
        />

        {/* Breadcrumbs & Page Header */}
        <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            <span className="hover:text-slate-700 cursor-pointer font-medium" onClick={() => onNavigate(homeView)}>
              Admin Portal
            </span>
            <span>/</span>
            <span className="font-medium text-slate-500 truncate max-w-[160px] sm:max-w-none">
              {activeOrg.name}
            </span>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                {bc.view ? (
                  <span 
                    onClick={() => onNavigate(bc.view!)}
                    className="hover:text-slate-700 cursor-pointer font-medium"
                  >
                    {bc.label}
                  </span>
                ) : (
                  <span className="font-semibold text-slate-800">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Title and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{pageTitle}</h1>
                {(() => {
                  const viewAccess = getRoleAccessLevel(userProfile.role, currentView);
                  if (viewAccess === 'restricted') {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                        <Lock className="w-3 h-3" /> Locked for {userProfile.role}
                      </span>
                    );
                  }
                  if (viewAccess === 'read-only') {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                        <Eye className="w-3 h-3" /> Read-Only Mode ({userProfile.role})
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              {pageSubtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{pageSubtitle}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {secondaryActions?.map((sec, i) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={i}
                    onClick={sec.onClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 shadow-xs transition"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{sec.label}</span>
                  </button>
                );
              })}

              {primaryAction && (() => {
                const viewAccess = getRoleAccessLevel(userProfile.role, currentView);
                const isRestricted = viewAccess === 'restricted';
                if (isRestricted) return null;

                return (
                  <button
                    onClick={primaryAction.onClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                  >
                    {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5" />}
                    <span>{primaryAction.label}</span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Content View Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setHelpModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-10">
            <h3 className="text-base font-bold text-slate-900 mb-2">CommUnity SaaS Admin Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              This operations platform provides full multi-tenant management for communities, associations and HOAs. You can manage members, bookings, events, food distributions, voting polls, payments, notifications and comprehensive audit trails.
            </p>
            <div className="space-y-2 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>• <strong>Quick Search:</strong> Press <kbd className="px-1 py-0.5 bg-white border rounded">⌘K</kbd> to search members, records or bookings.</div>
              <div>• <strong>Role Switcher:</strong> Click your avatar in the top right to switch between roles (Super Admin, Facility Manager, etc.).</div>
              <div>• <strong>Action Center:</strong> View pending approvals directly on the main dashboard.</div>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

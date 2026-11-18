import React, { useState } from 'react';
import { 
  Shield, 
  Crown, 
  Building2, 
  CalendarDays, 
  Dumbbell, 
  CreditCard, 
  HeartHandshake, 
  Megaphone,
  Check, 
  ChevronDown, 
  Info, 
  SlidersHorizontal,
  X,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Role } from '../types';
import { ROLE_CONFIGS, ALL_ROLES } from '../data/rolePermissions';

interface RoleSimulationBarProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  filterToRoleOnly: boolean;
  onToggleFilterToRoleOnly: (enabled: boolean) => void;
}

export const RoleSimulationBar: React.FC<RoleSimulationBarProps> = ({
  currentRole,
  onChangeRole,
  filterToRoleOnly,
  onToggleFilterToRoleOnly
}) => {
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const activeCfg = ROLE_CONFIGS[currentRole];

  const rolePillIcons: Record<Role, React.ElementType> = {
    'Super Admin': Crown,
    'Community Admin': Building2,
    'Event Manager': CalendarDays,
    'Facility Manager': Dumbbell,
    'Finance Manager': CreditCard,
    'Volunteer Lead': HeartHandshake,
    'Content Manager': Megaphone
  };

  const rolePillShort: Record<Role, string> = {
    'Super Admin': 'Super Admin',
    'Community Admin': 'Community Admin',
    'Event Manager': 'Event Mgr',
    'Facility Manager': 'Facility Mgr',
    'Finance Manager': 'Finance Mgr',
    'Volunteer Lead': 'Volunteer Lead',
    'Content Manager': 'Content Mgr'
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 sm:px-6 py-2.5 shadow-inner">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          {/* Left: Role identity and active status */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin Role Demo:
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold shadow-xs">
              {React.createElement(rolePillIcons[currentRole], { className: 'w-3.5 h-3.5 text-indigo-400' })}
              <span>{currentRole}</span>
              <span className="text-[10px] text-indigo-400 font-normal">({activeCfg.personaName})</span>
            </div>

            <button
              onClick={() => setShowPermissionsModal(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition"
              title="Inspect role permissions & restrictions"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Permissions Matrix</span>
            </button>

            {/* Filter mode pill */}
            <button
              onClick={() => onToggleFilterToRoleOnly(!filterToRoleOnly)}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
                filterToRoleOnly 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle sidebar to only display modules assigned to this role"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{filterToRoleOnly ? 'Sidebar: Role Modules Only' : 'Sidebar: Show All (with Lock 🔒)'}</span>
            </button>
          </div>

          {/* Right: Quick Role Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 hidden sm:inline mr-1">
              Test Switch:
            </span>
            {ALL_ROLES.map(role => {
              const Icon = rolePillIcons[role];
              const isCurrent = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onChangeRole(role)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-white/20'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                  }`}
                  title={`Switch to ${role} (${ROLE_CONFIGS[role].personaName})`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                  <span>{rolePillShort[role]}</span>
                  {isCurrent && <Check className="w-3 h-3 text-indigo-200 ml-0.5" />}
                </button>
              );
            })}

            {currentRole !== 'Super Admin' && (
              <button
                onClick={() => onChangeRole('Super Admin')}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg shrink-0 transition ml-1"
                title="Reset to Super Admin with full access"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Permissions Breakdown Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowPermissionsModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  {React.createElement(rolePillIcons[currentRole], { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {currentRole} Access Profile
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                      {activeCfg.personaName}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{activeCfg.department} • {activeCfg.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Role Summary</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {activeCfg.summary}
                </p>
              </div>

              {/* Modules breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Authorized Access ({activeCfg.fullAccessModules.length + activeCfg.readOnlyModules.length} Modules)
                  </div>
                  <div className="space-y-1 text-slate-700">
                    {activeCfg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5 uppercase text-[11px]">
                    <Lock className="w-4 h-4 text-rose-600" />
                    Restricted Operational Areas
                  </div>
                  <div className="space-y-1 text-slate-700">
                    {activeCfg.restrictions.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Operational Capabilities Table */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Operational Permissions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Facility Approvals', granted: activeCfg.canApproveBookings },
                    { label: 'Publish Events', granted: activeCfg.canPublishEvents },
                    { label: 'Auditorium Seat Map', granted: activeCfg.canManageSeatMap },
                    { label: 'Process Refunds', granted: activeCfg.canProcessRefunds },
                    { label: 'Tax Invoices', granted: activeCfg.canIssueInvoices },
                    { label: 'Member Status', granted: activeCfg.canManageMembers },
                    { label: 'Volunteer Squads', granted: activeCfg.canManageVolunteers },
                    { label: 'Announcements', granted: activeCfg.canPublishAnnouncements },
                    { label: 'System Settings', granted: activeCfg.canEditSettings },
                    { label: 'RBAC Policy Matrix', granted: activeCfg.canEditRBAC },
                    { label: 'Security Audit Logs', granted: activeCfg.canViewAuditLogs }
                  ].map((perm, i) => (
                    <div 
                      key={i} 
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        perm.granted 
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{perm.label}</span>
                      {perm.granted ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast switch within modal */}
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Switch Active Role Demo:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setShowPermissionsModal(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        currentRole === r 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

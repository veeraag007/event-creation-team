import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { Role, NavItemKey } from '../types';
import { ROLE_CONFIGS, ALL_ROLES } from '../data/rolePermissions';

interface RestrictedViewGuardProps {
  currentRole: Role;
  moduleKey: NavItemKey;
  moduleName: string;
  onNavigate: (view: NavItemKey) => void;
  onSwitchRole: (role: Role) => void;
}

export const RestrictedViewGuard: React.FC<RestrictedViewGuardProps> = ({
  currentRole,
  moduleKey,
  moduleName,
  onNavigate,
  onSwitchRole
}) => {
  const currentRoleCfg = ROLE_CONFIGS[currentRole];

  // Find which roles HAVE access to this module
  const authorizedRoles = ALL_ROLES.filter(r => 
    ROLE_CONFIGS[r].fullAccessModules.includes(moduleKey) || 
    ROLE_CONFIGS[r].readOnlyModules.includes(moduleKey)
  );

  const primaryRole = authorizedRoles.find(r => r !== 'Super Admin') || 'Super Admin';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Role Access Restricted
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {moduleName} Module Locked
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Your current simulated persona <strong className="text-white font-semibold">"{currentRoleCfg.personaName}"</strong> ({currentRole}) does not hold security clearance for this section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Explanation */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Role Boundaries */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Active Persona Scope ({currentRole})
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentRoleCfg.summary}
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                <div className="font-semibold text-slate-700">Designated Focus Areas:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentRoleCfg.fullAccessModules.slice(0, 6).map(m => (
                    <span key={m} className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[10px] font-medium">
                      {m}
                    </span>
                  ))}
                  {currentRoleCfg.fullAccessModules.length > 6 && (
                    <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[10px] font-medium">
                      +{currentRoleCfg.fullAccessModules.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Required Security Clearance */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                Authorized Roles for {moduleName}
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                To test and view operations in <span className="font-semibold">{moduleName}</span>, switch to one of the authorized administrative roles:
              </p>
              <div className="space-y-1.5 pt-1">
                {authorizedRoles.map(role => {
                  const cfg = ROLE_CONFIGS[role];
                  return (
                    <button
                      key={role}
                      onClick={() => onSwitchRole(role)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition text-left flex items-center justify-between text-xs group"
                    >
                      <span className="font-semibold text-slate-800 group-hover:text-indigo-600 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        {role} ({cfg.personaName})
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5">
                        Switch <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {primaryRole && (
                <button
                  onClick={() => onSwitchRole(primaryRole)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Switch to {primaryRole}</span>
                </button>
              )}
              {currentRole !== 'Super Admin' && (
                <button
                  onClick={() => onSwitchRole('Super Admin')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition"
                >
                  <span>Super Admin (Full Access)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
